// import { ZtmScraper, Query, RouteWithTimes, RouteChecker, Route } from "./interfaces";
import puppeteer, { Page } from 'puppeteer';
import { asyncFind, asyncFilter, asyncMap, asyncForEach } from "../utils/async";
import { LineType, SELECTORS, HOME_PAGE } from "./constants";
import { RouteStopsListFactory } from './route-stops-list';
import { ScrapeContext } from './interfaces';
// class ZtmScraperImpl implements ZtmScraper {

//   constructor(private rc: RouteChecker) { }

//   async find(q: Query): Promise<RouteWithTimes[]> {
//     return (await Promise.all(
//       q.routes.map(
//         this.rc.findRides
//       )
//     )).reduce((res, cur) => res.concat(...cur), []);
//   }
// }

// class RouteCheckerImpl implements RouteChecker {
//   constructor(private se: ScrapingEngine) { }

//   findRides(r: Route): Promise<RouteWithTimes[]> {
//     const scrape = this.se.init();
//     scrape
//       .goToZtm(r.lineNo)
//       .goToStart(r.from)
//       .fetchDepartures()
//       .findUpcoming(new Date())
//       .fetchResults(r.to);


//     Promise.resolve(this.se.init(r))
//       .then(ctx => ctx.goToZtm())
//       .then(ctx => ctx.goToStart())
//       .then(ctx => ctx.fetchDepartures())
//       .then(ctx => ctx.findUpcoming())
//   }
// }

// interface ScrapingEngine {
//   init(r: Route): ScrapingContext;
// }

// interface ScrapingContext {
//   goToZtm(lineNo: string): Promise<ScrapingContext>;
//   goToStart(from: string): Promise<ScrapingContext>;
//   fetchDepartures(): Promise<ScrapingContext>;
//   findUpcoming(startAt: Date): Promise<ScrapingContext>;
//   fetchResults(to: string): Promise<RouteWithTimes[]>;
// }

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



  async execute(): Promise<ScrapeContext<T>> {
    await asyncForEach(this.steps, async step => await step(this.scrapeCtx.page));

    return this.scrapeCtx;
  }
}