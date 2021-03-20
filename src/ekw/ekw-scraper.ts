import puppeteer, { Page } from 'puppeteer';
import { asyncForEach } from "../utils/async";
import { findCheckDigit } from "../utils/kwNumberValidator"
// import { LineType } from "./constants";
import { goToEkw } from './steps/go-to-ekw';
import { findKw } from './steps/find-kw';
import { ScrapeContext } from '../common/interfaces';
import { KwOutput } from './interfaces';
import { getOutput } from './steps/get-output';

export class EkwScrapeBuilder {
  private steps: Function[] = [];
  private scrapeCtx: ScrapeContext<KwOutput>;
  private kwCtx: Partial<KwOutput> = {};

  static async initScrapeContext(): Promise<ScrapeContext<KwOutput>> {
    const browser = await puppeteer.launch();
    const page: Page = await browser.newPage();
    page.setViewport({
      width: 1024,
      height: 800,
      deviceScaleFactor: 1,
    });

    return { page, browser, output: undefined } as ScrapeContext<KwOutput>;
  }

  static async init(ctx?: ScrapeContext<KwOutput>): Promise<EkwScrapeBuilder> {
    if (ctx) {
      return new EkwScrapeBuilder(ctx);
    } else {
      return new EkwScrapeBuilder(await EkwScrapeBuilder.initScrapeContext());
    }
  }

  private constructor(ctx?: ScrapeContext<KwOutput>) {
    this.scrapeCtx = ctx;
  }

  goToEkw(): this {
    this.steps.push(goToEkw);

    return this;
  }

  goToKw(courtId: string, kwNumber: number): this {
    this.kwCtx.courtId = courtId;
    this.kwCtx.kwNumber = '' + kwNumber;
    this.kwCtx.checkDigit = '' + findCheckDigit(courtId, kwNumber);
    this.scrapeCtx.output = this.kwCtx as KwOutput;
    this.steps.push(findKw(this.kwCtx, this.scrapeCtx));

    return this;
  }

  getOutput(): this {
    this.steps.push(
      getOutput(this.kwCtx, this.scrapeCtx as unknown as ScrapeContext<KwOutput>)
    );
    return this;
  }

  async execute(): Promise<ScrapeContext<KwOutput>> {
    // console.debug('EkwScraper::execute()');
    let stepsCount = 0;
    await asyncForEach(this.steps, async step => {
      try {
        // console.debug('EkwScraper::execute() step #' + ++stepsCount);
        return await step(this.scrapeCtx.page)
      } catch (e) {
        console.log(e);
        this.scrapeCtx.page.screenshot({path: 'error.png'});
        throw e;
      }
    });
    // console.debug('EkwScraper::execute() steps done')
    return this.scrapeCtx;
  }
}