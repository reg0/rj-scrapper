import { expect } from 'chai';
import { ScrapeBuilder } from "../src/rjztm/ztm-scraper";
import { LineType, SELECTORS } from "../src/rjztm/constants";
import { ScrapeContext, RidesOutput } from "../src/rjztm/interfaces";
import { time2ISO } from "../src/utils/time";

let ctx: ScrapeContext<RidesOutput>;

beforeEach(async () => {
  ctx = await ScrapeBuilder.initScrapeContext();
});

afterEach(async () => {
  await ctx.browser.close();
});

describe('ScrapeBuilder', function() {
  this.timeout(30000);

  it('001. goToZtm() goes to Rozklady home page and finds section titles', async () => {
    // given
    const {page} = await (await ScrapeBuilder.init(ctx))
      .goToZtm()
      .execute();

    // when
    const sectionTitles = await page.$$eval(SELECTORS.HomePage.TypeTitleWithinSection, titles => titles.map((el: Element) => el.textContent))

    // then
    expect(sectionTitles).to.contain(LineType.TRAM);
    expect(sectionTitles).to.contain(LineType.TROLLEYBUS);
    expect(sectionTitles).to.contain(LineType.BUS);
    expect(sectionTitles).to.contain(LineType.AIRPORT_SHUTTLE);
    expect(sectionTitles).to.contain(LineType.OVERNIGHT);
    expect(sectionTitles).to.contain(LineType.SUBSTITUTE);
  });

  it('002. goToLine() goes to line\'s home page and finds number and two directions', async () => {
    // given
    const {page} = await (await ScrapeBuilder.init(ctx))
      .goToZtm()
      .goToLine(LineType.TRAM, '21')
      .execute();

    // when
    const lineNo = await page.$eval(SELECTORS.LinePage.LineNumber, (el: Element) => el.textContent.trim())

    // then
    expect(lineNo).to.equal('21');

    // when
    const directions = await page.$$eval(SELECTORS.LinePage.Direction, (els: Element[]) => els.map(el => el.textContent.trim()));

    // then
    expect(directions.length).to.equal(2);
    expect(directions.filter(it => it.startsWith('Kierunek: ')).length).to.equal(2);
  });

  it('003. goToRoute() goes to origin stop and finds today\'s rides', async () => {
    // given
    const {page} = await (await ScrapeBuilder.init(ctx))
      .goToZtm()
      .goToLine(LineType.TRAM, '21')
      .goToRoute('Pogoń Rybna', 'Gołonóg Centrum')
      .execute();

    // when
    const direction = await page.$eval(SELECTORS.TimetablePage.Direction, el => (el as HTMLElement).innerText.trim());

    // then
    expect(direction.indexOf('Kierunek: Tworze')).to.not.be.below(0);

    // when
    const todaysRidesHeader = await page.$eval(SELECTORS.TimetablePage.TodaysRidesHeader, el => (el as HTMLElement).innerText.trim());

    // then
    expect(todaysRidesHeader.indexOf('Wszystkie kursy dnia')).to.not.be.below(0);
  });

  it('004. getRides() returns list of rides', async () => {
    // given / when
    const {output, error} = await (await ScrapeBuilder.init(ctx))
      .goToZtm()
      .goToLine(LineType.TRAM, '21')
      .goToRoute('Pogoń Rybna', 'Gołonóg Centrum')
      .getRides(7, 0, 9, 0)
      .execute();

    // then
    expect(error).to.be.undefined;
    expect(output.rides.length).to.be.above(0);
    output.rides.forEach(ride => {
      expect(ride.from).to.equal('Pogoń Rybna')
      expect(ride.to).to.equal('Gołonóg Centrum')
      expect(time2ISO(ride.departure)).to.match(/[7-9]:[0-5][0-9]/)
      expect(time2ISO(ride.arrival)).to.match(/[7-9]:[0-5][0-9]/)
      expect(ride.lineNo).to.equal('21')
      expect(ride.to.localeCompare(ride.from)).to.be.below(0)
    });
  });
});