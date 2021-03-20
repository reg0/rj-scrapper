import { Page } from "puppeteer";
import { KwOutput } from "../interfaces";
import { ScrapeContext } from "../../common/interfaces";

export const getOutput = (kwCtx: Partial<KwOutput>, scrapeCtx: ScrapeContext<KwOutput>) => async (page: Page): Promise<void> => {
  // console.debug('steps/getOutput()')
  if (scrapeCtx.error) {
    return ;
  }
  try {
    const dateLabelElement = await page.$x('//label[contains(., "Data zapisania")]');
    if (!dateLabelElement?.length) {
      const message = await page.$x('//p[contains(., "nie została odnaleziona")]');
      if (message) {
        scrapeCtx.error = new Error(await message[0].evaluate(e => e.textContent.trim()));
        scrapeCtx.output = kwCtx as KwOutput;
      } else {
        throw new Error();
      }
    }
    const dateFormRow = (await dateLabelElement[0].$x('../..'))[0];
    const date = (await dateFormRow.$eval('.left', (el) => el.textContent)).trim();
  
    const ownerLabelElement = await page.$x('//label[contains(., "Właściciel")]');
    const ownerFormRow = (await ownerLabelElement[0].$x('../..'))[0];
    const owner = (await ownerFormRow.$$eval('.left p', (rows) => rows.map((el) => el.textContent.trim()).join('; ')));
  
    scrapeCtx.output = {...kwCtx, owner, dateUpdated: date} as KwOutput;
  } catch (e) {
    // await page.screenshot({ path: `${kwCtx.kwNumber}.png` });
  }
  // console.debug('steps/getOutput() done')
};
