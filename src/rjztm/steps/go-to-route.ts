import { SELECTORS } from "../constants";
import { asyncMap } from "../../utils/async";
import { Page } from "puppeteer";
import { RouteStopsListFactory } from "../route-stops-list";

export const goToRoute = (origin: string, destination: string) => async (page: Page) => {
  const stopsLists = await asyncMap(await page.$$(SELECTORS.LinePage.StopsList), RouteStopsListFactory.init);
  const stopsList = stopsLists.find(sl => sl.matchesRoute(origin, destination));
  let waitForNavi = page.waitForNavigation();
  await (stopsList.getStop(origin).el).click();
  await waitForNavi;
  await page.waitForSelector(SELECTORS.TimetablePage.TodaysRidesHeader);
}