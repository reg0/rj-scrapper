import { Page } from "puppeteer";
import { ScrapeContext } from "../../common/interfaces";
import { SELECTORS } from "../constants";
import { KwOutput } from "../interfaces";
import { normalizedKwNumber } from "../../utils/kwNumberValidator";
import { withLogsAsync } from "../../utils/logging";

export const findKw = (kwCtx: Partial<KwOutput>, scrapeCtx: ScrapeContext<KwOutput>) => async (page: Page): Promise<void> => {
  await withLogsAsync('steps/findKw()', async (log) => {
      
    await page.type(SELECTORS.HomePage.Input1, kwCtx.courtId);
    await page.type(SELECTORS.HomePage.Input2, normalizedKwNumber(kwCtx.kwNumber));
    let checkDigitEl = await page.$(SELECTORS.HomePage.Input3);
    await checkDigitEl.type(kwCtx.checkDigit);
    log.debug('input given');
    let waitForNavi = page.waitForNavigation();
    log.debug('hit enter');
    await checkDigitEl.press('Enter');
    await waitForNavi;
    // await page.type(SELECTORS.HomePage.Input3, kwCtx.checkDigit);
    
    log.debug('after reload');
    const error = await page.$eval(SELECTORS.HomePage.ErrorBox, (element: HTMLElement) => element.innerText);
    if (error) {
      scrapeCtx.error = new Error(error);
    } else {
      await page.waitFor(500);
      let captchaError;
      let retryCount = 0;
      do {
        retryCount++;  
        waitForNavi = page.waitForNavigation();
        checkDigitEl = await page.$(SELECTORS.HomePage.Input3);
        if (checkDigitEl) {
          await checkDigitEl.press('Enter');
          await waitForNavi;
        }
      //   // await page.click(SELECTORS.HomePage.SearchButton);
      //   await checkDigitEl.press('Enter');
      //   await page.waitFor(retryCount*500);
      //   await waitForNavi;

        captchaError = await page.$(SELECTORS.HomePage.CaptchaError);
      
      } while (captchaError && retryCount < 5)
    //  {
    //     waitForNavi = page.waitForNavigation();
    //     await page.click(SELECTORS.HomePage.SearchButton);
    //     await page.waitFor(1000);
    //     await waitForNavi;
    //     captchaError = await page.$(SELECTORS.HomePage.CaptchaError);
    //   }

      try {
        await page.waitForSelector(SELECTORS.ResultPage.Warning);
      } catch (e) {
        
        // await page.screenshot({ path: 'example.png' });
      }
      log.finish();
    }
  });
}
