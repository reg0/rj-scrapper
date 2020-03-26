import { BASE_URL, SELECTORS } from "./constants";
import { asyncFind } from "../utils/async";
import { RouteWithTimes, RideLink, ScrapeContext, Route } from "./interfaces";
import { flatMap } from "rxjs/operators";
import { of, Observable } from "rxjs";
import { ElementHandle } from "puppeteer";

export class SingleRideProcessor<T> {
  constructor(private ctx: ScrapeContext<T>, private route: Route) { }
  
  getTask(ride: RideLink): Observable<RouteWithTimes> {
    return of(ride).pipe(
      flatMap(this.rideToResult.bind(this))
  )}

  private async rideToResult(ride: RideLink): Promise<RouteWithTimes> {
    const tab = await this.ctx.browser.newPage();
    const rideUrl = BASE_URL + await ride.el.evaluate(a => a.getAttribute('href'));
    await tab.goto(rideUrl);
  
    const arrivalRow = await asyncFind(await tab.$$(SELECTORS.RidePage.StopsRows), async (row: ElementHandle<Element>) => {
      return await row.$eval(SELECTORS.RidePage.StopName, (title: HTMLElement, arrivalStopName: string) => {
        return title.innerText.trim() === arrivalStopName;
      }, this.route.to);
    });
    
    const [arrivalHrs, arrivalMins] = await arrivalRow.$eval(SELECTORS.RidePage.StopDepartureTime, (time: HTMLElement) => {
      return time.innerText.split(':')
    });
    
    await tab.close();
    
    return {...this.route, departure: ride.time, arrival: {hrs: Number(arrivalHrs), mins: Number(arrivalMins)}} as RouteWithTimes;
  }
}
