
export enum LineType {
  TRAM = 'Tramwaj - Normalna',
  TROLLEYBUS = 'Trolejbus - Normalna',
  BUS = 'Autobus - Normalna',
  AIRPORT_SHUTTLE = 'Autobus - Ekspresowa na lotnisko',
  OVERNIGHT = 'Autobus - Nocna',
  SUBSTITUTE = 'Autobus - Autobusowa komunikacja zastępcza' 
}

export const BASE_URL = 'https://rj.metropoliaztm.pl';
export const HOME_PAGE = `${BASE_URL}/rozklady/`;

const contentPane = '.lineList';
const todaysRidesSection = '.panel-info';

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
    TodaysRidesHeader: todaysRidesSection + ' h2.panel-title',
    TodaysRidesHours: todaysRidesSection + ' .panel-body:not(.rundaycalendar) .arrival-time',
    NoRidesTodayWarning: todaysRidesSection + ' .panel-body:not(.rundaycalendar) .alert-warning',
    RidesDeparturesMinutesWithinHour: 'sup a',
  },
  RidePage: {
    StopsRows: 'tr.run-row',
    StopName: 'td:first-child a.dropdown-toggle',
    StopDepartureTime: 'td:nth-child(2)'
  }
}

export const NO_RIDES_TODAY_WARNING = 'brak kursów';
