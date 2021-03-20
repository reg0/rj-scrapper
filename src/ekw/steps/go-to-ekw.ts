import { Page } from "puppeteer";
import { HOME_PAGE, SELECTORS } from "../constants";

export const goToEkw = async (page: Page): Promise<void> => {
  // console.debug('steps/goToEkw()')
  await page.goto(HOME_PAGE);
  await page.waitForSelector(SELECTORS.HomePage.SearchButton);
  // console.debug('steps/goToEkw() done')
}