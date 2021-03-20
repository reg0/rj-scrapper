export const HOME_PAGE = 'https://przegladarka-ekw.ms.gov.pl/eukw_prz/KsiegiWieczyste/wyszukiwanieKW';

export const SELECTORS = {
  HomePage: {
    Form: 'form#kryteriaWKW',
    SearchButton: 'button#wyszukaj',
    Input1: 'input#kodWydzialuInput',
    Input2: 'input#numerKsiegiWieczystej',
    Input3: 'input#cyfraKontrolna',
    ErrorBox: '#kryteriaWKW .error-content',
    CaptchaError: '#recaptchaResponseErrors',
  },
  ResultPage: {
    Warning: 'p.h7'
  }
}

// export const NO_RIDES_TODAY_WARNING = 'brak kursów';
