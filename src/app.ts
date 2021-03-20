import { ScrapeContext } from "./common/interfaces";
import { EkwScrapeBuilder } from "./ekw/ekw-scraper";
import { KwOutput } from "./ekw/interfaces";
import { asyncIterate } from "./utils/async";
import { normalizedKwNumber } from "./utils/kwNumberValidator"

class App {

  private formatOutput(i: number, ctx: ScrapeContext<KwOutput>) {
    return `${
      i
    }\t${
      ctx.error ? 'E' : ' '
    }\t${
      ctx.output?.dateUpdated
    }\t${
      ctx.output?.courtId
    }/${
      ctx.output?.kwNumber ? normalizedKwNumber(ctx.output?.kwNumber) : ''
    }/${
      ctx.output?.checkDigit
    }\t${
      ctx.error ? ctx.error.message : ctx.output.owner
    }\t`;
  }

  public async start(): Promise<void> {
    return asyncIterate(45048, 55000, async (i: number) => {
      const ctx = await EkwScrapeBuilder.initScrapeContext();
      await (await EkwScrapeBuilder.init(ctx))
        .goToEkw()
        .goToKw('PT1R', i)
        .getOutput()
        .execute()
        .then(result => {
          console.log(this.formatOutput(i, result));
        });
    });
  }
}



(async () => {
  try {
      await new App().start();
  } catch (e) {
      console.error(e);
  }
  process.exit(0);
})();