// import { ZtmScraper, Query, RouteWithTimes, RouteChecker, Route } from "./interfaces";
import puppeteer, { Page } from 'puppeteer';
import { asyncFind, asyncFilter, asyncMap, asyncForEach } from "../utils/async";
import { LineType, SELECTORS, HOME_PAGE } from "./constants";
import { RouteStopsListFactory } from './route-stops-list';
import { ScrapeContext, RidesOutput, Route } from './interfaces';
import { RidesListFactory } from './rides-list';


export class ScrapeBuilder<T> {
  private steps: Function[] = [];
  private scrapeCtx: ScrapeContext<T>;
  private rideCtx: Partial<Route> = {};

  static async initScrapeContext() {
    const browser = await puppeteer.launch();
    const page: Page = await browser.newPage();

    return { page, browser, output: undefined };
  }

  static async init<T>(ctx?: ScrapeContext<T>): Promise<ScrapeBuilder<T>> {
    if (ctx) {
      return new ScrapeBuilder(ctx);
    } else {
      return new ScrapeBuilder(await ScrapeBuilder.initScrapeContext());
    }
  }

  private constructor(ctx?: ScrapeContext<T>) {
    this.scrapeCtx = ctx;
  }

  goToZtm() {
    this.steps.push(
      async (page: Page) => {
        await page.goto(HOME_PAGE);
        await page.waitForSelector(SELECTORS.HomePage.TypeSection);
      }
    );

    return this;
  }

  goToLine(type: LineType, lineNo: string) {
    this.rideCtx.lineNo = lineNo;
    this.steps.push(
      async (page: Page) => {
        const sections = await page.$$(SELECTORS.HomePage.TypeSection);
        const section = await asyncFind(sections, async sectionEl => {
          return type === await sectionEl.$eval(SELECTORS.HomePage.TypeTitleWithinSection, (title: HTMLElement) => title.innerText);
        });
        const lineLinks = await asyncFilter(await section.$$(SELECTORS.HomePage.LineLinkWithinSection), async el => {
          return lineNo === await el.evaluate(e => e.textContent)
        });
        if (lineLinks.length !== 1) {
          throw new Error(`${lineLinks.length} links found matching ${lineNo} within ${type}`);
        }
        await (lineLinks[0] as HTMLElement).click();
        try {
          await page.waitForSelector(SELECTORS.LinePage.LineNumber, { timeout: 3000 });
        } catch (e) {
          const [targetElement] = await page.$x('//strong[contains(., "Aktualny rozkład jazdy dla linii")]/..');
          await targetElement.click();
          await page.waitForSelector(SELECTORS.LinePage.LineNumber, { timeout: 3000 });
        }
      }
    );

    return this;
  }

  goToRoute(origin: string, destination: string) {
    this.rideCtx.from = origin;
    this.rideCtx.to = destination;
    this.steps.push(
      async (page: Page) => {
        const stopsLists = await asyncMap(await page.$$(SELECTORS.LinePage.StopsList), RouteStopsListFactory.init);
        const stopsList = stopsLists.find(sl => sl.matchesRoute(origin, destination));
        let waitForNavi = page.waitForNavigation();
        await (stopsList.getStop(origin).el).click();
        await waitForNavi;
        await page.waitForSelector(SELECTORS.TimetablePage.TodaysRidesHeader);
      }
    );

    return this;
  }

  getRides(hrsFrom: number, minsFrom: number, hrsTo: number, minsTo: number) {
    const _this = this as unknown as ScrapeBuilder<RidesOutput>;
    _this.steps.push(
      async (page: Page) => {
        const hoursList = await RidesListFactory.init(
          await page.$$(SELECTORS.TimetablePage.TodaysRidesHours),
          await page.$(SELECTORS.TimetablePage.NoRidesTodayWarning),
          hrsFrom, minsFrom, hrsTo, minsTo
        );

        await hoursList.getRides(_this.scrapeCtx, this.rideCtx as Route).toPromise().then(results => {
          _this.scrapeCtx.error = results.some(it => it.error) ? results.find(it => it.error).error : undefined;
          _this.scrapeCtx.output = {
            rides: results.map(it => it.result)
          };
        })
        
      }
    );
    return _this;
  }

  async execute(): Promise<ScrapeContext<T>> {
    await asyncForEach(this.steps, async step => await step(this.scrapeCtx.page));

    return this.scrapeCtx;
  }
}