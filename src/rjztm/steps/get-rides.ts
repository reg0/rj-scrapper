import { RidesListFactory } from "../rides-list";
import { SELECTORS } from "../constants";
import { Page } from "puppeteer";
import { Route, ScrapeContext, RidesOutput } from "../interfaces";

export const getRides = (scrapeCtx: ScrapeContext<RidesOutput>, rideCtx: Route, hrsFrom: number, minsFrom: number, hrsTo: number, minsTo: number) => async (page: Page) => {
  const hoursList = await RidesListFactory.init(
    await page.$$(SELECTORS.TimetablePage.TodaysRidesHours),
    await page.$(SELECTORS.TimetablePage.NoRidesTodayWarning),
    hrsFrom, minsFrom, hrsTo, minsTo
  );

  await hoursList.getRides<RidesOutput>(scrapeCtx, rideCtx as Route).toPromise().then(results => {
    scrapeCtx.error = results.some(it => it.error) ? results.find(it => it.error).error : undefined;
    scrapeCtx.output = {
      rides: results.map(it => it.result)
    };
  })
  
};
