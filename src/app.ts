import { Query } from "./rjztm/interfaces";
import { LineType } from "./rjztm/constants";
import { ZtmScraperImpl } from "./rjztm/ztm-scraper";

class App {
  public async start(): Promise<void> {
    console.log("Start");
    const q: Query = {
      routes: [
        { from: 'Rudna Hallera', to: 'Katowice Strefa Kultury NOSPR', lineNo: '807', type: LineType.BUS },
        { from: 'Rudna Hallera', to: 'Katowice Strefa Kultury NOSPR', lineNo: '40', type: LineType.BUS },
        { from: 'Piaski Osiedle Dziekana', to: 'Katowice Strefa Kultury NOSPR', lineNo: '814', type: LineType.BUS },
      ]
    }

    try {
      console.log(JSON.stringify(await (new ZtmScraperImpl().find(q)), undefined, 2));
    } catch (e) {
      console.log(e);
    }
  }
}

new App().start();