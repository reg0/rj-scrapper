//Numery Ksiag Wieczystych
//Tomasz Lubinski
//www.algorytm.org

/**
* Sprawdza czy podany numer księgi wieczystej jest prawidłowy
* @param {string} kw - numer księgi wieczystej do walidacji (numer musi byc w formie xxxx/xxxxxxxx/x)
* @return {boolean} - zwraca true jeżeli podany numer jest prawidłowy, false w przeciwnym wypadku
*/
function validateKW(kw) {
  //Check length
  if (kw == null)
    return false;
  if (kw.length != 15)
    return false;

  kw = kw.toUpperCase();
  let letterValues = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'X',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U',
    'W', 'Y', 'Z'];
  function getLetterValue(letter) {
    for (let j = 0; j < letterValues.length; j++)
      if (letter == letterValues[j])
        return j;
    return -1;
  }

  //Check slashes
  if (kw[4] != '/' || kw[13] != '/')
    return false;

  //Check court id
  for (let i = 0; i < 2; i++)
    if (getLetterValue(kw[i]) < 10)
      return false;

  if (getLetterValue(kw[2]) < 0 || getLetterValue(kw[2]) > 9)
    return false;

  if (getLetterValue(kw[3]) < 10)
    return false;

  //Check numbers
  for (let i = 5; i < 13; i++)
    if (getLetterValue(kw[i]) < 0 || getLetterValue(kw[i]) > 9)
      return false;

  //Check checkdigit
  let sum = 1 * getLetterValue(kw[0]) +
    3 * getLetterValue(kw[1]) +
    7 * getLetterValue(kw[2]) +
    1 * getLetterValue(kw[3]) +
    3 * getLetterValue(kw[5]) +
    7 * getLetterValue(kw[6]) +
    1 * getLetterValue(kw[7]) +
    3 * getLetterValue(kw[8]) +
    7 * getLetterValue(kw[9]) +
    1 * getLetterValue(kw[10]) +
    3 * getLetterValue(kw[11]) +
    7 * getLetterValue(kw[12]);
  sum %= 10;

  if (kw[14] != sum)
    return false;

  return true;
}

/**
* Sprawdza czy podany numer księgi wieczystej jest prawidłowy
* @param {string} court - idetyfikator sadu
* @param {string} id - numer ksiegi
* @param {string} checkDigit - cyfra kontrolna
* @return {boolean} - zwraca true jeżeli podany numer jest prawidłowy, false w przeciwnym wypadku
*/
function validateKWDivided(court, id, checkDigit) {
  return validateKW(court + '/' + id + '/' + checkDigit);
}

const courtId = ["WL1A", "SU1A", "OL1Y", "PT1B", "KA1B", "LU1B", "RA2G", "KO1B", "BI1B", "BB1B", "BI1P", "ZA1B", "OL1B", "TR1O", "JG1B",
  "EL1B", "TO1B", "OP1B", "TR1B", "LD1B", "KS1B", "KI1B", "BY1B", "KA1Y", "SL1B", "LU1C", "TO1C", "PO1H", "SL1C", "KA1C", "SZ1C", "KR1C", "PL1C", "BB1C",
  "PO2T", "KR1K", "CZ1C", "SL1Z", "KA1D", "TR1D", "RZ1D", "KR2Y", "KO1D", "EL1D", "SW1D", "EL1E", "OL1E", "SI1G", "GD1G", "GD1Y", "OL1G", "GL1G", "LE1G",
  "OP1G", "PO1G", "SZ1O", "TO1G", "NS1G", "GW1G", "PL1G", "PO1Y", "LM1G", "WA1G", "PO1S", "RA1G", "TO1U", "SZ1G", "SZ1Y", "ZG2K", "BI2P", "ZA1H", "EL1I",
  "BY1I", "ZA1J", "KZ1J", "PR1J", "KS1J", "GL1J", "LE1J", "KA1J", "JG1J", "KI1J", "KZ1A", "JG1K", "SZ1K", "GD1R", "KA1K", "KI1I", "OP1K", "KZ1E", "OL1K",
  "KR2E", "KI1L", "OP1U", "CZ2C", "SW1K", "TB1K", "KO1L", "KN1K", "KN1N", "KI1K", "KO1K", "PO1K", "GD1E", "RA1K", "KR1P", "ZA1K", "LU1K", "KS1K", "ZG1K",
  "KZ1R", "KR2K", "LD1K", "GD1I", "WA1L", "LE1L", "KS1E", "PO1L", "RZ1E", "SL1L", "OL1L", "NS1L", "WL1L", "RA1L", "PR1L", "JG1L", "LU1A", "LE1U", "CZ1L",
  "LU1I", "JG1S", "RZ1A", "SR1L", "LD1Y", "SZ1L", "LM1L", "SI2S", "LD1O", "LD1M", "LU1U", "GD1M", "SL1M", "KR1M", "TB1M", "PO2A", "GW1M", "KA1M", "WR1M",
  "SI1M", "PL1M", "BY1M", "EL2O", "OL1M", "NS2L", "NS1M", "KA1L", "CZ1M", "KR1Y", "SZ1M", "BY1N", "OL1N", "KR2I", "TB1N", "SW2K", "ZG1N", "EL1N", "GD2M",
  "WA1N", "NS1S", "NS1T", "PO1N", "OP1N", "PO1O", "OL1C", "OP1L", "WR1E", "KR1O", "OL1O", "WR1O", "KI1T", "PT1O", "LU1O", "OP1O", "OS1O", "KI1O", "EL1O",
  "OS1M", "KZ1W", "KZ1O", "KR1E", "WA1O", "LD1P", "SR2W", "WA1I", "PO1I", "KI1P", "RA2Z", "PT1P", "OL1P", "KZ1P", "PL1P", "PL1L", "SR2L", "SZ2S", "PO1P",
  "PO2P", "KR1H", "OP1P", "WA1P", "OS1P", "PR1P", "PR1R", "RA1P", "KA1P", "GD2W", "LU1P", "OS1U", "SZ2T", "GL1R", "RA1R", "PT1R", "WL1R", "LU1R", "LD1R",
  "PO1R", "RZ1R", "GL1S", "GL1Y", "LU1Y", "WL1Y", "RZ1Z", "KI1S", "KS1S", "SU1N", "BY2T", "SI1S", "KA1I", "BI3P", "PR2R", "SR1S", "PL1E", "KR2P", "KI1R",
  "KR3I", "LD1H", "KO1E", "KR1S", "GW1S", "KN1S", "SL1S", "PL1O", "SI1P", "BI1S", "GD1S", "KA1S", "TB1S", "KI1H", "SZ1T", "GD1A", "KI1A", "GW1K", "OP1S",
  "WR1T", "RZ1S", "KR1B", "ZG2S", "GW1U", "SU1S", "PO1A", "KO1I", "SZ1S", "OL1S", "GD2I", "BY1U", "RA1S", "PO1M", "WR1S", "PO1D", "SW1S", "KO2B", "ZG1S",
  "BY1S", "SZ1W", "TB1T", "GL1T", "TR1T", "GD1T", "ZA1T", "PT1T", "TO1T", "PO1T", "WR1W", "BY1T", "TR2T", "KN1T", "KA1T", "RZ2Z", "KS2E", "KR1W", "SW1W",
  "KO1W", "WA3M", "WA1M", "WA2M", "WA4M", "WA5M", "WA6M", "TO1W", "PO1B", "GD1W", "OL2G", "SI1W", "KR1I", "SR1W", "WL1W", "LU1W", "KI1W", "GL1W", "PO1E",
  "WA1W", "WR1L", "WR1K", "PO1F", "ZG1W", "PO2H", "LM1W", "OS1W", "GL1Z", "NS1Z", "LM1Z", "ZA1Z", "CZ1Z", "SW1Z", "SR1Z", "LD1G", "JG1Z", "ZG1E", "LE1Z",
  "PO1Z", "RA1Z", "ZG1G", "ZG1R", "BY1Z", "GL1X", "PL2M", "PL1Z", "BB1Z"];

const courtName = ["Aleksandrów Kujawski", "Augustów", "Bartoszyce", "Bełchatów", "Będzin", "Biała podlaska", "Białobrzegi", "Białogard",
  "Białystok", "Bielsko-Biała", "Bielsk Podlaski", "Biłgoraj", "Biskupiec", "BochniaR1O", "Bolesławiec", "Braniewo", "Brodnica", "Brzeg", "Brzesko", "Brzeziny",
  "Brzozów", "Busko Zdrój", "Bydgoszcz", "Bytom", "Bytów", "Chełm", "Chełmno", "Chodzież", "Chojnice", "Chorzów", "Choszczno", "Chrzanów", "Ciechanów", "Cieszyn",
  "Czarnków", "Czernichów", "Częstochowa", "Człuchów", "Dąbrowa Górnicza", "Dąbrowa Tarnowska", "Dębica", "Dobczyce", "Drawsko Pomorskie", "Działdowo", "Dzierżoniów",
  "Elbląg", "Ełk", "Garwolin", "Gdańsk", "Gdynia", "Giżycko", "Gliwice", "Głogów", "Głubczyce", "Gniezno", "Goleniów", "Golub-Dobrzyń", "Gorlice", "Gorzów Wielkopolski",
  "Gostynin", "Gostyń", "Grajewo", "Grodzisk Mazowiecki", "Grodzisk Wlkp.", "Grójec", "Grudziądz", "Gryfice", "Gryfino", "Gubin", "Hajnówka", "Hrubieszów", "Iława",
  "Inowrocław", "Janów Lubelski", "Jarocin", "Jarosław", "Jasło", "Jastrzębie-Zdrój", "Jawor", "Jaworzno", "Jelenia Góra", "Jędrzejów", "Kalisz", "Kamienna Góra",
  "Kamień Pomorski", "Kartuzy", "Katowice", "Kazimierza wielka", "Kędzierzyn-koźle", "Kępno", "Kętrzyn", "Kęty", "Kielce", "Kluczbork", "Kłobuck", "Kłodzko", "Kolbuszowa",
  "Kołobrzeg", "Koło", "Konin", "Końskie", "Koszalin", "Kościan", "Kościerzyna", "Kozienice", "Kraków", "Krasnystaw", "Kraśnik", "Krosno", "Krosno Odrzańskie", "Krotoszyn",
  "Krzeszowice", "Kutno", "Kwidzyn", "Legionowo", "Legnica", "Lesko", "Leszno", "Leżajsk", "Lębork", "Lidzbark Warmiński", "Limanowa", "Lipno", "Lipsko", "Lubaczów", "Lubań",
  "Lubartów", "Lubin", "Lubliniec", "Lublin", "Lwówek Śląski", "Łańcut", "Łask", "Łęczyca", "Łobez", "Łomża", "Łosice", "Łowicz", "Łódź", "Łuków", "Malbork", "Miastko",
  "Miechów", "Mielec", "Międzychód", "Międzyrzecz", "Mikołów", "Milicz", "Mińsk Mazowiecki", "Mława", "Mogilno", "Morąg", "Mrągowo", "Mszana Dolna", "Muszyna", "Mysłowice",
  "Myszków", "Myślenice", "Myślibórz", "Nakło nad Notecią", "Nidzica", "Niepołomice", "Nisko", "Nowa Ruda", "Nowa Sól", "Nowe Miasto Lubawskie", "Nowy Dwór Gdański",
  "Nowy Dwór Mazowiecki", "Nowy Sącz", "Nowy Targ", "Nowy Tomyśl", "Nysa", "Oborniki", "Olecko", "Olesno", "Oleśnica", "Olkusz", "Olsztyn", "Oława", "Opatów", "Opoczno",
  "Opole Lubelskie", "Opole", "Ostrołęka", "Ostrowiec Świętokrzyski", "Ostróda", "Ostrów Mazowiecka", "Ostrów Wielkopolski", "Ostrzeszów", "Oświęcim", "Otwock", "Pabianice",
  "Pajęczno", "Piaseczno", "Piła", "Pińczów", "Pionki", "Piotrków Trybunalski", "Pisz", "Pleszew", "Płock", "Płońsk", "Poddębice", "Police", "Poznań (V)", "Poznań (VI)",
  "Proszowice", "Prudnik", "Pruszków", "Przasnysz", "Przemyśl", "Przeworsk", "Przysucha", "Pszczyna", "Puck", "Puławy", "Pułtusk", "Pyrzyce", "Racibórz", "Radom", "Radomsko",
  "Radziejów", "Radzyń Podlaski", "Rawa Mazowiecka", "Rawicz", "Ropczyce", "Ruda Śląska", "Rybnik", "Ryki", "Rypin", "Rzeszów", "Sandomierz", "Sanok", "Sejny", "Sępólno Krajeńskie",
  "Siedlce", "Siemianowice Śląskie", "Siemiatycze", "Sieniawa", "Sieradz", "Sierpc", "Skała", "Skarżysko-Kamienna", "Skawina", "Skierniewice", "Sławno", "Słomniki", "Słubice",
  "Słupca", "Słupsk", "Sochaczew", "Sokołów Podlaski", "Sokółka", "Sopot", "Sosnowiec", "Stalowa Wola", "Starachowice", "Stargard Szczeciński", "Starogard Gdański", "Staszów",
  "Strzelce Krajeńskie", "Strzelce Opolskie", "Strzelin", "Strzyżów", "Sucha Beskidzka", "Sulechów", "Sulęcin", "Suwałki", "Szamotuły", "Szczecinek", "Szczecin", "Szczytno",
  "Sztum", "Szubin", "Szydłowiec", "Śrem", "Środa Śląska", "Środa Wlkp.", "Świdnica", "Świdwin", "Świebodzin", "Świecie", "Świnoujście", "Tarnobrzeg", "Tarnowskie Góry",
  "Tarnów", "Tczew", "Tomaszów Lubelski", "Tomaszów Mazowiecki", "Toruń", "Trzcianka", "Trzebnica", "Tuchola", "Tuchów", "Turek", "Tychy", "Tyczyn", "Ustrzyki Dolne",
  "Wadowice", "Wałbrzych", "Wałcz", "Warszawa (IX)", "Warszawa (VI)", "Warszawa (VII)", "Warszawa (X)", "Warszawa (XIII)", "Warszawa (XV)", "Wąbrzeźno", "Wągrowiec", "Wejherowo",
  "Węgorzewo", "Węgrów", "Wieliczka", "Wieluń", "Włocławek", "Włodawa", "Włoszczowa", "Wodzisław Śląski", "Wolsztyn", "Wołomin", "Wołów", "Wrocław", "Września", "Wschowa",
  "Wyrzysk", "Wysokie Mazowieckie", "Wyszków", "Zabrze", "Zakopane", "Zambrów", "Zamość", "Zawiercie", "Ząbkowice Śląskie", "Zduńska Wola", "Zgierz", "Zgorzelec",
  "Zielona Góra", "Złotoryja", "Złotów", "Zwoleń", "Żagań", "Żary", "Żnin", "Żory", "Żuromin", "Żyrardów", "Żywiec"];

/**
* Zwraca nazwę sądu dla podanego numeru ksiegi wieczystej
* @param {string} kw - numer księgi wieczystej
* @return {string} - zwraca nazwę sądu powiązanego z podanym numerem
*/
function getCourt(kw) {
  kw = kw.substring(0, 4);
  for (let i = 0; i < courtId.length; i++)
    if (courtId[i] == kw)
      return courtName[i];
  return "nieznany";
}

export function normalizedKwNumber(kwNumber) {
  return "0".repeat(8 - ('' + kwNumber).length) + kwNumber;
}

export function findCheckDigit(courtId, kwNumber): number {
  for (let i = 0; i < 10; i++) {
    if (validateKWDivided(courtId, normalizedKwNumber(kwNumber), i)) {
      return i;
    }
  }
  throw "fatal error " + courtId + "/" + normalizedKwNumber(kwNumber);
}