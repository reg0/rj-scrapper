import { ElementHandle } from "puppeteer";
import { RideLink, RouteWithTimes, Route } from "./interfaces";
import { asyncMap, asyncReduce } from "../utils/async";
import { timeISO } from "../utils/time";
import { ParallelTasks, TaskResult, Task } from "../utils/parallel";
import { Observable } from "rxjs";
import { SingleRideProcessor } from "./single-ride";
import { SELECTORS, NO_RIDES_TODAY_WARNING } from "./constants";
import { ScrapeContext } from "../common/interfaces";

const getHours =  async (hoursEl: ElementHandle<Element>): Promise<number> => await hoursEl.evaluate(el => {
  return Number(
    Array.from(el.childNodes.values())
      .filter(ch => ch.nodeType === Node.TEXT_NODE)
      .map(ch => ch.textContent.trim())
      .filter(ch => !!ch)
      .join('')
  );
});

const hasNoRidesToday = async (warningEl: ElementHandle<Element>): Promise<boolean> => {
  return warningEl && await warningEl.evaluate(el => el.textContent.toLocaleLowerCase().indexOf(NO_RIDES_TODAY_WARNING) >= 0);
}

const addRidesLinksFromHour = async (links: RideLink[], hoursEl: ElementHandle<Element>): Promise<RideLink[]> => {
  const hours = await getHours(hoursEl);
  const minutesEls = await hoursEl.$$(SELECTORS.TimetablePage.RidesDeparturesMinutesWithinHour);
  links.push(... await asyncMap(minutesEls, async minutesEl => {
    return {
      time: {hrs: hours, mins: Number(await minutesEl.evaluate(m => m.textContent.trim().replace(/[^0-9]/, '')))},
      el: minutesEl,
    }
  }));
  return links;
}

const filterByHours = (fromTimeIso: string, toTimeIso: string) => {
  return (ride: RideLink): boolean => {
    const rideTimeIso = timeISO(ride.time.hrs, ride.time.mins);
    return rideTimeIso.localeCompare(fromTimeIso) === 1 && rideTimeIso.localeCompare(toTimeIso) < 0;
  }
}

class RidesList {
  rides: RideLink[];
  constructor(allRrides: RideLink[], hrsFrom = 0, minsFrom = 0, hrsTo = 23, minsTo = 59) {
    const from = timeISO(hrsFrom, minsFrom);
    const to = timeISO(hrsTo, minsTo);
    this.rides = allRrides.filter(filterByHours(from, to));
  }

  getRides<T>(ctx: ScrapeContext<T>, route: Route): Observable<TaskResult<RideLink, RouteWithTimes>[]> {

    const singleRideProcessor = new SingleRideProcessor<T>(ctx, route);

    const rideToTask: (rl: RideLink) => Task<RideLink, RouteWithTimes> = (it: RideLink) => ({
      input: it,
      getTask: singleRideProcessor.getTask.bind(singleRideProcessor)
    }) as Task<RideLink, RouteWithTimes>

    const tasks = this.rides.map(rideToTask);

    return new ParallelTasks(tasks).doIt(5);
  }
}

export class RidesListFactory {
  static async init(
      hourEls: ElementHandle<Element>[], warningEl: ElementHandle<Element> | null,
      hrsFrom: number, minsFrom: number, hrsTo: number, minsTo: number
  ): Promise<RidesList> {
    if (await hasNoRidesToday(warningEl)) {
      return new RidesList([]);
    }
    const links = await asyncReduce(hourEls, addRidesLinksFromHour, []);
    return new RidesList(links, hrsFrom, minsFrom, hrsTo, minsTo);
  }
}
