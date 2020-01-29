
export enum LineType {
  TRAM = 'Tramwaj - Normalna',
  TROLLEYBUS = 'Trolejbus - Normalna',
  BUS = 'Autobus - Normalna',
  AIRPORT_SHUTTLE = 'Autobus - Ekspresowa na lotnisko',
  OVERNIGHT = 'Autobus - Nocna',
  SUBSTITUTE = 'Autobus - Autobusowa komunikacja zastępcza' 
}

export const HOME_PAGE = 'https://rj.metropoliaztm.pl/rozklady/';

const contentPane = '.lineList';

export const SELECTORS = {
  HomePage: {
    TypeSection: contentPane + ' .panel',
    TypeTitleWithinSection: 'h2.panel-title',
    LineLinkWithinSection: 'a',
  },
  LinePage: {
    LineNumber: contentPane + ' .line-btn-group a.btn-danger',
    Direction: contentPane + ' .list-group-item-warning',
    StopsList: contentPane + ' .list-group',
    StopItemWithinList: 'a.direction-list-group-item',
  },
  TimetablePage: {
    Direction: '.lead strong',
    TodaysRidesHeader: '.panel-info h2.panel-title',
  }
}