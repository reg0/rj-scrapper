import { ScrapeBuilder } from "../src/rjztm/ztm-scraper";
import { LineType, SELECTORS } from "../src/rjztm/constants";
import { ScrapeContext, RidesOutput } from "../src/rjztm/interfaces";
import { time2ISO } from "../src/utils/time";

let ctx: ScrapeContext<RidesOutput>;
jest.setTimeout(30000);

beforeAll(async () => {
  ctx = await ScrapeBuilder.initScrapeContext();
});

afterAll(async () => {
  await ctx.browser.close();
});

describe('ScrapeBuilder', () => {

  test('001. goToZtm() goes to Rozklady home page and finds section titles', async () => {
    // given
    const {page} = await (await ScrapeBuilder.init<RidesOutput>(ctx))
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
    const {page} = await (await ScrapeBuilder.init<RidesOutput>(ctx))
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
    const {page} = await (await ScrapeBuilder.init<RidesOutput>(ctx))
      .goToZtm()
      .goToLine(LineType.TRAM, '21')
      .goToRoute('Pogoń Rybna', 'Gołonóg Centrum')
      .execute();

    // when
    const direction = await page.$eval(SELECTORS.TimetablePage.Direction, el => (el as HTMLElement).innerText.trim());

    // then
    expect(direction.indexOf('Kierunek: Tworze')).toBeGreaterThanOrEqual(0);

    // when
    const todaysRidesHeader = await page.$eval(SELECTORS.TimetablePage.TodaysRidesHeader, el => (el as HTMLElement).innerText.trim());

    // then
    expect(todaysRidesHeader.indexOf('Wszystkie kursy dnia')).toBeGreaterThanOrEqual(0);
  });

  test('004. getRides() returns list of rides', async () => {
    // given / when
    const {output, error} = await (await ScrapeBuilder.init<RidesOutput>(ctx))
      .goToZtm()
      .goToLine(LineType.TRAM, '21')
      .goToRoute('Pogoń Rybna', 'Gołonóg Centrum')
      .getRides(7, 0, 9, 0)
      .execute();

    // then
    expect(error).toBeUndefined();
    expect(output.rides.length).toBeGreaterThan(0);
    output.rides.forEach(ride => {
      expect(ride.from).toBe('Pogoń Rybna')
      expect(ride.to).toBe('Gołonóg Centrum')
      expect(time2ISO(ride.departure)).toMatch(/[7-9]:[0-5][0-9]/)
      expect(time2ISO(ride.arrival)).toMatch(/[7-9]:[0-5][0-9]/)
      expect(ride.lineNo).toBe('21')
      expect(ride.to.localeCompare(ride.from)).toBeLessThan(0)
    });
  });
});