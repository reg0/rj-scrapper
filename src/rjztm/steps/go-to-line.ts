import { SELECTORS, LineType } from "../constants";
import { asyncFind, asyncFilter } from "../../utils/async";
import { Page, ElementHandle } from "puppeteer";

export const goToLine = (type: LineType, lineNo: string) => async (page: Page): Promise<void> => {
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
  await (lineLinks[0] as ElementHandle<Element>).click();
  try {
    await page.waitForSelector(SELECTORS.LinePage.LineNumber, { timeout: 3000 });
  } catch (e) {
    const [targetElement] = await page.$x('//strong[contains(., "Aktualny rozkład jazdy dla linii")]/..');
    await targetElement.click();
    await page.waitForSelector(SELECTORS.LinePage.LineNumber, { timeout: 3000 });
  }
}