import puppeteer, { Page } from 'puppeteer';
import { asyncForEach } from "../utils/async";
import { LineType } from "./constants";
import { ScrapeContext, RidesOutput, Route } from './interfaces';
import { goToZtm } from './steps/go-to-ztm';
import { goToLine } from './steps/go-to-line';
import { goToRoute } from './steps/go-to-route';
import { getRides } from './steps/get-rides';

export class ScrapeBuilder {
  private steps: Function[] = [];
  private scrapeCtx: ScrapeContext<RidesOutput>;
  private rideCtx: Partial<Route> = {};

  static async initScrapeContext(): Promise<ScrapeContext<RidesOutput>> {
    const browser = await puppeteer.launch();
    const page: Page = await browser.newPage();

    return { page, browser, output: undefined } as ScrapeContext<RidesOutput>;
  }

  static async init(ctx?: ScrapeContext<RidesOutput>): Promise<ScrapeBuilder> {
    if (ctx) {
      return new ScrapeBuilder(ctx);
    } else {
      return new ScrapeBuilder(await ScrapeBuilder.initScrapeContext());
    }
  }

  private constructor(ctx?: ScrapeContext<RidesOutput>) {
    this.scrapeCtx = ctx;
  }

  goToZtm(): this {
    this.steps.push(goToZtm);

    return this;
  }

  goToLine(type: LineType, lineNo: string): this {
    this.rideCtx.lineNo = lineNo;
    this.steps.push(goToLine(type, lineNo));

    return this;
  }

  goToRoute(origin: string, destination: string): this {
    this.rideCtx.from = origin;
    this.rideCtx.to = destination;
    this.steps.push(goToRoute(origin, destination));

    return this;
  }

  getRides(hrsFrom: number, minsFrom: number, hrsTo: number, minsTo: number): this {
    this.steps.push(
      getRides(this.scrapeCtx as unknown as ScrapeContext<RidesOutput>, this.rideCtx as Route, hrsFrom, minsFrom, hrsTo, minsTo)
    );
    return this;
  }

  async execute(): Promise<ScrapeContext<RidesOutput>> {
    await asyncForEach(this.steps, async step => await step(this.scrapeCtx.page));

    return this.scrapeCtx;
  }
}