import { ElementHandle, Page, Browser } from "puppeteer";
import { LineType } from "./constants";

export interface Time {
  hrs: number;
  mins: number;
}

export interface Route {
  lineNo: string;
  type: LineType;
  from: string;
  to: string;
}

export interface RouteWithTimes extends Route {
  departure: Time;
  arrival: Time;
}

export interface Query {
  routes: Route[];
}

export interface ZtmScraper {
  find(q: Query): Promise<RouteWithTimes[]>;
}

export interface RouteChecker {
  findRides(r: Route): Promise<RouteWithTimes[]>;
}

export interface RouteStopLink {
  name: string;
  el: ElementHandle<Element>;
}

export interface RideLink {
  time: Time;
  el: ElementHandle<Element>;
}

export interface RidesOutput {
  rides: RouteWithTimes[];
}
