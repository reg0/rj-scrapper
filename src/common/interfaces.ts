import { Page, Browser } from "puppeteer";

export interface ScrapeContext<T> {
  page: Page;
  browser: Browser;
  output: T;
  error?: Error;
}