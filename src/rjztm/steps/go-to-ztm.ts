import { Page } from "puppeteer";
import { HOME_PAGE, SELECTORS } from "../constants";

export const goToZtm = async (page: Page): Promise<void> => {
  await page.goto(HOME_PAGE);
  await page.waitForSelector(SELECTORS.HomePage.TypeSection);
}