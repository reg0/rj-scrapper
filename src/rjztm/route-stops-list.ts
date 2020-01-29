import { RouteStopLink } from "./interfaces";
import { ElementHandle } from "puppeteer";
import { SELECTORS } from "./constants";
import { asyncMap } from "../utils/async";

export class RouteStopsListFactory {
  static async init(el: ElementHandle<Element>) {
    const getTrimmedName = async (link: ElementHandle<Element>) => {
      const fullText = await link.evaluate(l => l.textContent.trim());
      return fullText.substring(0, fullText.lastIndexOf(await link.$eval('small', platform => platform.textContent.trim())) - 1);
    };
    const links = await el.$$(SELECTORS.LinePage.StopItemWithinList);
    const stops = await asyncMap(links, async link => ({name: await getTrimmedName(link), el: link}));

    return new RouteStopsList(stops);
  }
}


export class RouteStopsList {
  constructor(private stops: RouteStopLink[]) {}

  getStop(name: string): RouteStopLink {
    return this.stops.find(it => it.name === name);
  }

  matchesRoute(origin: string, destination: string): boolean {
    const originIndex = this.stops.findIndex(stop => stop.name === origin);
    const destinationIndex = this.stops.findIndex(stop => stop.name === destination);

    return originIndex >= 0 && destinationIndex > originIndex
  }
}