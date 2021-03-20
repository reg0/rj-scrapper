import { expect } from 'chai';
import { EkwScrapeBuilder } from '../src/ekw/ekw-scraper';
import { KwOutput } from '../src/ekw/interfaces';
import { ScrapeContext } from '../src/common/interfaces';

let ctx: ScrapeContext<KwOutput>;

beforeEach(async () => {
  ctx = await EkwScrapeBuilder.initScrapeContext();
});

afterEach(async () => {
  await ctx.browser.close();
});

describe('EkwScrapeBuilder', function() {
  this.timeout(5000);

  it('001. getOutput() returns owner name', async () => {
    // given / when
    const {output, error} = await (await EkwScrapeBuilder.init(ctx))
      .goToEkw()
      .goToKw('PT1R', 45049)
      .getOutput()
      .execute();

    // then
    expect(error).to.be.undefined;
    expect(output.owner).to.equal("ŁOŚ  DARIUSZ JANUSZ");
    expect(output.dateUpdated).to.equal("2007-06-08");
  });
});