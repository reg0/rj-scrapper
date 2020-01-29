import { ElementHandle } from "puppeteer";
import { RideLink } from "./interfaces";

export class RidesList {
  private constructor(private rides: RideLink[]) {}

  static async init(el: ElementHandle<Element>) {

  }
}