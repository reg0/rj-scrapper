import { ScrapeBuilder } from "../src/rjztm/ztm-scraper";
import { LineType, SELECTORS } from "../src/rjztm/constants";
import { ScrapeContext } from "../src/rjztm/interfaces";

let ctx: ScrapeContext;

beforeAll(async () => {
  ctx = await ScrapeBuilder.initScrapeContext();
});

afterAll(async () => {
  await ctx.browser.close();
});

describe('ScrapeBuilder', () => {

  test('001. goToZtm() goes to Rozklady home page and finds section titles', async () => {
    // given
    const {page} = await (await ScrapeBuilder.init(ctx))
      .goToZtm()
      .execute();

    // when
    const sectionTitles = await page.$$eval(SELECTORS.HomePage.TypeTitleWithinSection, titles => titles.map((el: Element) => el.textContent))

    // then
    expect(sectionTitles).toContain(LineType.TRAM);
    expect(sectionTitles).toContain(LineType.TROLLEYBUS);
    expect(sectionTitles).toContain(LineType.BUS);
    expect(sectionTitles).toContain(LineType.AIRPORT_SHUTTLE);
    expect(sectionTitles).toContain(LineType.OVERNIGHT);
    expect(sectionTitles).toContain(LineType.SUBSTITUTE);
  });

  test('002. goToLine() goes to line\'s home page and finds number and two directions', async () => {
    // given
    const {page} = await (await ScrapeBuilder.init(ctx))
      .goToZtm()
      .goToLine(LineType.TRAM, '21')
      .execute();

    // when
    const lineNo = await page.$eval(SELECTORS.LinePage.LineNumber, (el: Element) => el.textContent.trim())

    // then
    expect(lineNo).toBe('21');

    // when
    const directions = await page.$$eval(SELECTORS.LinePage.Direction, (els: Element[]) => els.map(el => el.textContent.trim()));

    // then
    expect(directions.length).toBe(2);
    expect(directions.filter(it => it.startsWith('Kierunek: ')).length).toBe(2);
  });

  test('003. goToRoute() goes to origin stop and finds today\'s rides', async () => {
    // given
    const {page} = await (await ScrapeBuilder.init(ctx))
      .goToZtm()
      .goToLine(LineType.TRAM, '21')
      .goToRoute('Pogoń Rybna', 'Gołonóg Centrum')
      .execute();

    // when
    const direction = await page.$eval(SELECTORS.TimetablePage.Direction, el => (el as HTMLElement).innerText.trim());

    // then
    expect(direction.indexOf('Kierunek: Gołonóg Podstacja Pętla')).toBeGreaterThanOrEqual(0);

    // when
    const todaysRidesHeader = await page.$eval(SELECTORS.TimetablePage.TodaysRidesHeader, el => (el as HTMLElement).innerText.trim());

    // then
    expect(todaysRidesHeader.indexOf('Wszystkie kursy dnia')).toBeGreaterThanOrEqual(0);
  });
});