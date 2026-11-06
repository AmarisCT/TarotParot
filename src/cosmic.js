/* ===== Cosmic profile: birth chart math (Astronomy Engine) + meanings + tarot pairings ===== */
const ZODIAC = [
  // name, glyph, element, modality, ruler, core self, emotional need, how you come across, card (Major Arcana)
  ["Aries","♈","Fire","Cardinal","Mars","a bold starter who meets life head-on","action, independence and a fresh challenge","direct, energetic and ready to go",4],
  ["Taurus","♉","Earth","Fixed","Venus","steady, sensual and loyal, building things that last","comfort, security and time to savor","calm, grounded and quietly stylish",5],
  ["Gemini","♊","Air","Mutable","Mercury","curious and quick, always connecting ideas and people","conversation, variety and room to explore","bright, chatty and easy to talk to",6],
  ["Cancer","♋","Water","Cardinal","the Moon","caring and intuitive, with a fierce protective heart","a safe home base and people who feel like family","warm, gentle and a little guarded at first",7],
  ["Leo","♌","Fire","Fixed","the Sun","generous and expressive, born to shine and to lift others","appreciation, play and a creative outlet","confident, warm and hard to miss",8],
  ["Virgo","♍","Earth","Mutable","Mercury","thoughtful and skilled, finding meaning in doing things well","order, usefulness and quiet care","composed, observant and helpful",9],
  ["Libra","♎","Air","Cardinal","Venus","fair-minded and graceful, seeking harmony and beauty","partnership, balance and beautiful surroundings","charming, diplomatic and easy to like",11],
  ["Scorpio","♏","Water","Fixed","Pluto and Mars","intense and perceptive, drawn to what lies beneath","depth, trust and emotional honesty","magnetic, private and quietly powerful",13],
  ["Sagittarius","♐","Fire","Mutable","Jupiter","adventurous and honest, always chasing meaning","freedom, adventure and something to believe in","upbeat, open and full of stories",14],
  ["Capricorn","♑","Earth","Cardinal","Saturn","ambitious and patient, climbing toward lasting goals","respect, structure and real progress","capable, composed and older than your years",15],
  ["Aquarius","♒","Air","Fixed","Uranus and Saturn","original and forward-thinking, true to your own vision","space to be yourself and a cause to care about","friendly, unconventional and a little hard to read",17],
  ["Pisces","♓","Water","Mutable","Neptune and Jupiter","dreamy and compassionate, deeply in tune with others","creativity, quiet and gentle understanding","soft, imaginative and easy to open up to",18]
];
const SIGN = ZODIAC.map(z => ({ name: z[0], glyph: z[1] + "︎", element: z[2], mode: z[3], ruler: z[4], core: z[5], need: z[6], mask: z[7], card: z[8] }));
const PLANETS = [
  // key, label, glyph, tarot card, what it rules
  ["Sun","Sun","☉",19,"your core self and life force"],
  ["Moon","Moon","☽",2,"your feelings, needs and instincts"],
  ["Mercury","Mercury","☿",1,"how you think and communicate"],
  ["Venus","Venus","♀",3,"how you love and what you find beautiful"],
  ["Mars","Mars","♂",16,"your drive, courage and desire"],
  ["Jupiter","Jupiter","♃",10,"where you grow and find luck"],
  ["Saturn","Saturn","♄",21,"your lessons, limits and lasting work"],
  ["Uranus","Uranus","♅",0,"where you break the mold"],
  ["Neptune","Neptune","♆",12,"your dreams, faith and imagination"],
  ["Pluto","Pluto","♇",20,"where you transform and find power"]
].map(p => ({ key: p[0], label: p[1], glyph: p[2] + "︎", card: p[3], rules: p[4] }));
const HOUSES = ["self and first impressions","money and what you value","communication and your neighborhood","home and family","creativity, play and romance","daily work and health","partnerships","intimacy and shared resources","travel, study and beliefs","career and reputation","friends and future hopes","rest, endings and the hidden"];
const ORDINAL = ["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th"];
const ELEMENT_SUIT = { Fire: "wands", Earth: "pentacles", Air: "swords", Water: "cups" };
const MODE_BASE = { Cardinal: 2, Fixed: 5, Mutable: 8 };
// Golden Dawn decans: each 10° slice of a sign maps to a numbered minor card (2–10)
function decanCard(lon) {
  const s = SIGN[Math.floor(lon / 30)], d = Math.floor((lon % 30) / 10);
  const rank = MODE_BASE[s.mode] + d, suit = ELEMENT_SUIT[s.element];
  return DECK.find(k => k.suit === suit && k.rank === rank);
}

/* places: name, region, latitude, longitude, time zone */
const CITIES = `Tacoma|Washington, USA|47.25|-122.44|America/Los_Angeles
Lakewood|Washington, USA|47.17|-122.52|America/Los_Angeles
Seattle|Washington, USA|47.61|-122.33|America/Los_Angeles
Spokane|Washington, USA|47.66|-117.43|America/Los_Angeles
Olympia|Washington, USA|47.04|-122.90|America/Los_Angeles
Everett|Washington, USA|47.98|-122.20|America/Los_Angeles
Bellevue|Washington, USA|47.61|-122.20|America/Los_Angeles
Vancouver|Washington, USA|45.64|-122.66|America/Los_Angeles
Yakima|Washington, USA|46.60|-120.51|America/Los_Angeles
Bellingham|Washington, USA|48.75|-122.48|America/Los_Angeles
Puyallup|Washington, USA|47.19|-122.29|America/Los_Angeles
Kent|Washington, USA|47.38|-122.23|America/Los_Angeles
Federal Way|Washington, USA|47.32|-122.31|America/Los_Angeles
Portland|Oregon, USA|45.52|-122.68|America/Los_Angeles
Eugene|Oregon, USA|44.05|-123.09|America/Los_Angeles
Salem|Oregon, USA|44.94|-123.04|America/Los_Angeles
Boise|Idaho, USA|43.62|-116.21|America/Boise
Anchorage|Alaska, USA|61.22|-149.90|America/Anchorage
Honolulu|Hawaii, USA|21.31|-157.86|Pacific/Honolulu
San Francisco|California, USA|37.77|-122.42|America/Los_Angeles
Oakland|California, USA|37.80|-122.27|America/Los_Angeles
San Jose|California, USA|37.34|-121.89|America/Los_Angeles
Sacramento|California, USA|38.58|-121.49|America/Los_Angeles
Fresno|California, USA|36.74|-119.79|America/Los_Angeles
Los Angeles|California, USA|34.05|-118.24|America/Los_Angeles
Long Beach|California, USA|33.77|-118.19|America/Los_Angeles
Anaheim|California, USA|33.84|-117.91|America/Los_Angeles
Riverside|California, USA|33.95|-117.40|America/Los_Angeles
San Diego|California, USA|32.72|-117.16|America/Los_Angeles
Bakersfield|California, USA|35.37|-119.02|America/Los_Angeles
Las Vegas|Nevada, USA|36.17|-115.14|America/Los_Angeles
Reno|Nevada, USA|39.53|-119.81|America/Los_Angeles
Phoenix|Arizona, USA|33.45|-112.07|America/Phoenix
Tucson|Arizona, USA|32.22|-110.97|America/Phoenix
Salt Lake City|Utah, USA|40.76|-111.89|America/Denver
Denver|Colorado, USA|39.74|-104.99|America/Denver
Colorado Springs|Colorado, USA|38.83|-104.82|America/Denver
Albuquerque|New Mexico, USA|35.08|-106.65|America/Denver
El Paso|Texas, USA|31.76|-106.49|America/Denver
Billings|Montana, USA|45.78|-108.50|America/Denver
Cheyenne|Wyoming, USA|41.14|-104.82|America/Denver
Dallas|Texas, USA|32.78|-96.80|America/Chicago
Fort Worth|Texas, USA|32.76|-97.33|America/Chicago
Houston|Texas, USA|29.76|-95.37|America/Chicago
Austin|Texas, USA|30.27|-97.74|America/Chicago
San Antonio|Texas, USA|29.42|-98.49|America/Chicago
Oklahoma City|Oklahoma, USA|35.47|-97.52|America/Chicago
Tulsa|Oklahoma, USA|36.15|-95.99|America/Chicago
Kansas City|Missouri, USA|39.10|-94.58|America/Chicago
St. Louis|Missouri, USA|38.63|-90.20|America/Chicago
Wichita|Kansas, USA|37.69|-97.34|America/Chicago
Omaha|Nebraska, USA|41.26|-95.93|America/Chicago
Minneapolis|Minnesota, USA|44.98|-93.27|America/Chicago
Saint Paul|Minnesota, USA|44.95|-93.09|America/Chicago
Des Moines|Iowa, USA|41.59|-93.62|America/Chicago
Chicago|Illinois, USA|41.88|-87.63|America/Chicago
Milwaukee|Wisconsin, USA|43.04|-87.91|America/Chicago
Madison|Wisconsin, USA|43.07|-89.40|America/Chicago
Memphis|Tennessee, USA|35.15|-90.05|America/Chicago
Nashville|Tennessee, USA|36.16|-86.78|America/Chicago
New Orleans|Louisiana, USA|29.95|-90.07|America/Chicago
Baton Rouge|Louisiana, USA|30.45|-91.19|America/Chicago
Birmingham|Alabama, USA|33.52|-86.80|America/Chicago
Jackson|Mississippi, USA|32.30|-90.18|America/Chicago
Little Rock|Arkansas, USA|34.75|-92.29|America/Chicago
Sioux Falls|South Dakota, USA|43.54|-96.73|America/Chicago
Fargo|North Dakota, USA|46.88|-96.79|America/Chicago
Detroit|Michigan, USA|42.33|-83.05|America/Detroit
Grand Rapids|Michigan, USA|42.96|-85.67|America/Detroit
Indianapolis|Indiana, USA|39.77|-86.16|America/Indiana/Indianapolis
Louisville|Kentucky, USA|38.25|-85.76|America/Kentucky/Louisville
Columbus|Ohio, USA|39.96|-83.00|America/New_York
Cleveland|Ohio, USA|41.50|-81.69|America/New_York
Cincinnati|Ohio, USA|39.10|-84.51|America/New_York
Pittsburgh|Pennsylvania, USA|40.44|-79.99|America/New_York
Philadelphia|Pennsylvania, USA|39.95|-75.17|America/New_York
Reading|Pennsylvania, USA|40.34|-75.93|America/New_York
New York|New York, USA|40.71|-74.01|America/New_York
Brooklyn|New York, USA|40.68|-73.94|America/New_York
Buffalo|New York, USA|42.89|-78.88|America/New_York
Rochester|New York, USA|43.16|-77.61|America/New_York
Albany|New York, USA|42.65|-73.76|America/New_York
Newark|New Jersey, USA|40.74|-74.17|America/New_York
Jersey City|New Jersey, USA|40.73|-74.08|America/New_York
Boston|Massachusetts, USA|42.36|-71.06|America/New_York
Providence|Rhode Island, USA|41.82|-71.41|America/New_York
Hartford|Connecticut, USA|41.76|-72.67|America/New_York
Portland|Maine, USA|43.66|-70.26|America/New_York
Burlington|Vermont, USA|44.48|-73.21|America/New_York
Baltimore|Maryland, USA|39.29|-76.61|America/New_York
Washington|District of Columbia, USA|38.91|-77.04|America/New_York
Richmond|Virginia, USA|37.54|-77.44|America/New_York
Virginia Beach|Virginia, USA|36.85|-75.98|America/New_York
Charlotte|North Carolina, USA|35.23|-80.84|America/New_York
Raleigh|North Carolina, USA|35.78|-78.64|America/New_York
Fayetteville|North Carolina, USA|35.05|-78.88|America/New_York
Charleston|South Carolina, USA|32.78|-79.93|America/New_York
Columbia|South Carolina, USA|34.00|-81.03|America/New_York
Atlanta|Georgia, USA|33.75|-84.39|America/New_York
Savannah|Georgia, USA|32.08|-81.09|America/New_York
Jacksonville|Florida, USA|30.33|-81.66|America/New_York
Orlando|Florida, USA|28.54|-81.38|America/New_York
Tampa|Florida, USA|27.95|-82.46|America/New_York
Miami|Florida, USA|25.76|-80.19|America/New_York
Tallahassee|Florida, USA|30.44|-84.28|America/New_York
El Paso|Texas, USA|31.76|-106.49|America/Denver
San Juan|Puerto Rico|18.47|-66.11|America/Puerto_Rico
Toronto|Ontario, Canada|43.65|-79.38|America/Toronto
Ottawa|Ontario, Canada|45.42|-75.70|America/Toronto
Montreal|Quebec, Canada|45.50|-73.57|America/Toronto
Quebec City|Quebec, Canada|46.81|-71.21|America/Toronto
Halifax|Nova Scotia, Canada|44.65|-63.58|America/Halifax
Winnipeg|Manitoba, Canada|49.90|-97.14|America/Winnipeg
Calgary|Alberta, Canada|51.05|-114.07|America/Edmonton
Edmonton|Alberta, Canada|53.55|-113.49|America/Edmonton
Vancouver|British Columbia, Canada|49.28|-123.12|America/Vancouver
Victoria|British Columbia, Canada|48.43|-123.37|America/Vancouver
Mexico City|Mexico|19.43|-99.13|America/Mexico_City
Guadalajara|Mexico|20.67|-103.35|America/Mexico_City
Monterrey|Mexico|25.69|-100.32|America/Monterrey
Tijuana|Mexico|32.51|-117.04|America/Tijuana
Cancún|Mexico|21.16|-86.85|America/Cancun
Guatemala City|Guatemala|14.63|-90.51|America/Guatemala
San Salvador|El Salvador|13.69|-89.22|America/El_Salvador
Havana|Cuba|23.11|-82.37|America/Havana
Santo Domingo|Dominican Republic|18.49|-69.93|America/Santo_Domingo
Kingston|Jamaica|17.97|-76.79|America/Jamaica
Panama City|Panama|8.98|-79.52|America/Panama
Bogotá|Colombia|4.71|-74.07|America/Bogota
Medellín|Colombia|6.25|-75.56|America/Bogota
Caracas|Venezuela|10.48|-66.90|America/Caracas
Lima|Peru|-12.05|-77.04|America/Lima
Quito|Ecuador|-0.18|-78.47|America/Guayaquil
Santiago|Chile|-33.45|-70.67|America/Santiago
Buenos Aires|Argentina|-34.60|-58.38|America/Argentina/Buenos_Aires
São Paulo|Brazil|-23.55|-46.63|America/Sao_Paulo
Rio de Janeiro|Brazil|-22.91|-43.17|America/Sao_Paulo
Brasília|Brazil|-15.79|-47.88|America/Sao_Paulo
Montevideo|Uruguay|-34.90|-56.16|America/Montevideo
London|England, UK|51.51|-0.13|Europe/London
Manchester|England, UK|53.48|-2.24|Europe/London
Birmingham|England, UK|52.49|-1.89|Europe/London
Liverpool|England, UK|53.41|-2.98|Europe/London
Edinburgh|Scotland, UK|55.95|-3.19|Europe/London
Glasgow|Scotland, UK|55.86|-4.25|Europe/London
Cardiff|Wales, UK|51.48|-3.18|Europe/London
Belfast|Northern Ireland, UK|54.60|-5.93|Europe/London
Dublin|Ireland|53.35|-6.26|Europe/Dublin
Paris|France|48.86|2.35|Europe/Paris
Lyon|France|45.76|4.84|Europe/Paris
Marseille|France|43.30|5.37|Europe/Paris
Brussels|Belgium|50.85|4.35|Europe/Brussels
Amsterdam|Netherlands|52.37|4.90|Europe/Amsterdam
Berlin|Germany|52.52|13.40|Europe/Berlin
Hamburg|Germany|53.55|9.99|Europe/Berlin
Munich|Germany|48.14|11.58|Europe/Berlin
Frankfurt|Germany|50.11|8.68|Europe/Berlin
Cologne|Germany|50.94|6.96|Europe/Berlin
Zurich|Switzerland|47.38|8.54|Europe/Zurich
Geneva|Switzerland|46.20|6.14|Europe/Zurich
Vienna|Austria|48.21|16.37|Europe/Vienna
Prague|Czech Republic|50.08|14.44|Europe/Prague
Warsaw|Poland|52.23|21.01|Europe/Warsaw
Kraków|Poland|50.06|19.94|Europe/Warsaw
Budapest|Hungary|47.50|19.04|Europe/Budapest
Bucharest|Romania|44.43|26.10|Europe/Bucharest
Sofia|Bulgaria|42.70|23.32|Europe/Sofia
Belgrade|Serbia|44.79|20.45|Europe/Belgrade
Zagreb|Croatia|45.81|15.98|Europe/Zagreb
Athens|Greece|37.98|23.73|Europe/Athens
Rome|Italy|41.90|12.50|Europe/Rome
Milan|Italy|45.46|9.19|Europe/Rome
Naples|Italy|40.85|14.27|Europe/Rome
Madrid|Spain|40.42|-3.70|Europe/Madrid
Barcelona|Spain|41.39|2.17|Europe/Madrid
Seville|Spain|37.39|-5.98|Europe/Madrid
Lisbon|Portugal|38.72|-9.14|Europe/Lisbon
Porto|Portugal|41.15|-8.61|Europe/Lisbon
Copenhagen|Denmark|55.68|12.57|Europe/Copenhagen
Stockholm|Sweden|59.33|18.07|Europe/Stockholm
Oslo|Norway|59.91|10.75|Europe/Oslo
Helsinki|Finland|60.17|24.94|Europe/Helsinki
Reykjavík|Iceland|64.15|-21.94|Atlantic/Reykjavik
Kyiv|Ukraine|50.45|30.52|Europe/Kyiv
Moscow|Russia|55.76|37.62|Europe/Moscow
Saint Petersburg|Russia|59.93|30.36|Europe/Moscow
Istanbul|Turkey|41.01|28.98|Europe/Istanbul
Ankara|Turkey|39.93|32.86|Europe/Istanbul
Cairo|Egypt|30.04|31.24|Africa/Cairo
Casablanca|Morocco|33.57|-7.59|Africa/Casablanca
Lagos|Nigeria|6.52|3.38|Africa/Lagos
Abuja|Nigeria|9.08|7.40|Africa/Lagos
Accra|Ghana|5.60|-0.19|Africa/Accra
Nairobi|Kenya|-1.29|36.82|Africa/Nairobi
Addis Ababa|Ethiopia|9.03|38.74|Africa/Addis_Ababa
Kampala|Uganda|0.35|32.58|Africa/Kampala
Dar es Salaam|Tanzania|-6.79|39.21|Africa/Dar_es_Salaam
Johannesburg|South Africa|-26.20|28.05|Africa/Johannesburg
Cape Town|South Africa|-33.92|18.42|Africa/Johannesburg
Durban|South Africa|-29.86|31.02|Africa/Johannesburg
Dakar|Senegal|14.72|-17.47|Africa/Dakar
Tel Aviv|Israel|32.09|34.78|Asia/Jerusalem
Jerusalem|Israel|31.77|35.21|Asia/Jerusalem
Amman|Jordan|31.95|35.93|Asia/Amman
Beirut|Lebanon|33.89|35.50|Asia/Beirut
Baghdad|Iraq|33.31|44.37|Asia/Baghdad
Riyadh|Saudi Arabia|24.71|46.68|Asia/Riyadh
Jeddah|Saudi Arabia|21.49|39.19|Asia/Riyadh
Dubai|United Arab Emirates|25.20|55.27|Asia/Dubai
Abu Dhabi|United Arab Emirates|24.45|54.38|Asia/Dubai
Doha|Qatar|25.29|51.53|Asia/Qatar
Kuwait City|Kuwait|29.38|47.99|Asia/Kuwait
Tehran|Iran|35.69|51.39|Asia/Tehran
Kabul|Afghanistan|34.56|69.21|Asia/Kabul
Karachi|Pakistan|24.86|67.01|Asia/Karachi
Lahore|Pakistan|31.55|74.34|Asia/Karachi
Islamabad|Pakistan|33.68|73.05|Asia/Karachi
Delhi|India|28.61|77.21|Asia/Kolkata
Amritsar|Punjab, India|31.63|74.87|Asia/Kolkata
Ludhiana|Punjab, India|30.90|75.86|Asia/Kolkata
Jalandhar|Punjab, India|31.33|75.58|Asia/Kolkata
Patiala|Punjab, India|30.34|76.39|Asia/Kolkata
Chandigarh|India|30.73|76.78|Asia/Kolkata
Jaipur|India|26.91|75.79|Asia/Kolkata
Lucknow|India|26.85|80.95|Asia/Kolkata
Mumbai|India|19.08|72.88|Asia/Kolkata
Pune|India|18.52|73.86|Asia/Kolkata
Ahmedabad|India|23.02|72.57|Asia/Kolkata
Kolkata|India|22.57|88.36|Asia/Kolkata
Chennai|India|13.08|80.27|Asia/Kolkata
Bengaluru|India|12.97|77.59|Asia/Kolkata
Hyderabad|India|17.39|78.49|Asia/Kolkata
Kochi|India|9.93|76.27|Asia/Kolkata
Kathmandu|Nepal|27.72|85.32|Asia/Kathmandu
Dhaka|Bangladesh|23.81|90.41|Asia/Dhaka
Colombo|Sri Lanka|6.93|79.86|Asia/Colombo
Yangon|Myanmar|16.84|96.17|Asia/Yangon
Bangkok|Thailand|13.76|100.50|Asia/Bangkok
Hanoi|Vietnam|21.03|105.85|Asia/Ho_Chi_Minh
Ho Chi Minh City|Vietnam|10.82|106.63|Asia/Ho_Chi_Minh
Phnom Penh|Cambodia|11.56|104.92|Asia/Phnom_Penh
Kuala Lumpur|Malaysia|3.14|101.69|Asia/Kuala_Lumpur
Singapore|Singapore|1.35|103.82|Asia/Singapore
Jakarta|Indonesia|-6.21|106.85|Asia/Jakarta
Bali (Denpasar)|Indonesia|-8.65|115.22|Asia/Makassar
Manila|Philippines|14.60|120.98|Asia/Manila
Cebu|Philippines|10.32|123.89|Asia/Manila
Hong Kong|China|22.32|114.17|Asia/Hong_Kong
Shanghai|China|31.23|121.47|Asia/Shanghai
Beijing|China|39.90|116.41|Asia/Shanghai
Guangzhou|China|23.13|113.26|Asia/Shanghai
Shenzhen|China|22.54|114.06|Asia/Shanghai
Chengdu|China|30.57|104.07|Asia/Shanghai
Taipei|Taiwan|25.03|121.57|Asia/Taipei
Seoul|South Korea|37.57|126.98|Asia/Seoul
Busan|South Korea|35.18|129.08|Asia/Seoul
Tokyo|Japan|35.68|139.69|Asia/Tokyo
Osaka|Japan|34.69|135.50|Asia/Tokyo
Kyoto|Japan|35.01|135.77|Asia/Tokyo
Sapporo|Japan|43.06|141.35|Asia/Tokyo
Ulaanbaatar|Mongolia|47.89|106.91|Asia/Ulaanbaatar
Almaty|Kazakhstan|43.24|76.89|Asia/Almaty
Tashkent|Uzbekistan|41.30|69.24|Asia/Tashkent
Sydney|New South Wales, Australia|-33.87|151.21|Australia/Sydney
Melbourne|Victoria, Australia|-37.81|144.96|Australia/Melbourne
Brisbane|Queensland, Australia|-27.47|153.03|Australia/Brisbane
Perth|Western Australia, Australia|-31.95|115.86|Australia/Perth
Adelaide|South Australia, Australia|-34.93|138.60|Australia/Adelaide
Auckland|New Zealand|-36.85|174.76|Pacific/Auckland
Wellington|New Zealand|-41.29|174.78|Pacific/Auckland
Suva|Fiji|-18.14|178.44|Pacific/Fiji
Guam (Hagåtña)|Guam|13.48|144.75|Pacific/Guam`.split("\n").map(l => { const [n, r, la, lo, tz] = l.split("|"); return { name: n, region: r, lat: +la, lon: +lo, tz, label: `${n}, ${r}` }; })
  .filter((c, i, a) => a.findIndex(x => x.label === c.label) === i);

/* local birth time in a time zone → exact UTC instant (handles historical daylight saving via the browser's time-zone data) */
function tzOffsetMin(ms, tz) {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }).formatToParts(new Date(ms)).filter(x => x.type !== "literal").map(x => [x.type, +x.value]));
  return (Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute, p.second) - ms) / 60000;
}
function localToUTC(dateISO, timeHM, tz) {
  const [y, m, d] = dateISO.split("-").map(Number), [hh, mm] = (timeHM || "12:00").split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  let utc = guess - tzOffsetMin(guess, tz) * 60000;
  utc = guess - tzOffsetMin(utc, tz) * 60000;
  return new Date(utc);
}

/* the chart */
const norm = x => ((x % 360) + 360) % 360;
function bodyLon(key, t) {
  if (key === "Sun") return Astronomy.SunPosition(t).elon;
  if (key === "Moon") return Astronomy.EclipticGeoMoon(t).lon;
  return Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body[key], t, true)).elon;
}
function computeChart(p) {
  const utc = localToUTC(p.date, p.unknownTime ? "12:00" : p.time, p.place.tz);
  const t = Astronomy.MakeTime(utc), t2 = Astronomy.MakeTime(new Date(utc.getTime() + 864e5));
  const placements = PLANETS.map(pl => {
    const lon = norm(bodyLon(pl.key, t)), next = norm(bodyLon(pl.key, t2));
    const retro = pl.key !== "Sun" && pl.key !== "Moon" && ((next - lon + 540) % 360 - 180) < 0;
    return { ...pl, lon, sign: Math.floor(lon / 30), deg: lon % 30, retro };
  });
  let asc = null, mc = null;
  if (!p.unknownTime) {
    const T = t.tt / 36525, eps = (23.4392911 - 0.0130042 * T) * Math.PI / 180;
    const ramc = norm(Astronomy.SiderealTime(t) * 15 + p.place.lon) * Math.PI / 180, phi = p.place.lat * Math.PI / 180;
    asc = norm(Math.atan2(Math.cos(ramc), -(Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps))) * 180 / Math.PI);
    mc = norm(Math.atan2(Math.sin(ramc), Math.cos(ramc) * Math.cos(eps)) * 180 / Math.PI);
    const ascSign = Math.floor(asc / 30);
    placements.forEach(pl => { pl.house = (pl.sign - ascSign + 12) % 12; });
  }
  // the Moon moves ~13° a day, so with no birth time its sign may be uncertain
  const moon = placements[1];
  if (p.unknownTime) {
    const a = Math.floor(norm(bodyLon("Moon", Astronomy.MakeTime(localToUTC(p.date, "00:00", p.place.tz)))) / 30);
    const b = Math.floor(norm(bodyLon("Moon", Astronomy.MakeTime(localToUTC(p.date, "23:59", p.place.tz)))) / 30);
    moon.uncertain = a !== b ? [a, b] : null;
  }
  const count = (f) => { const c = {}; placements.slice(0, 7).forEach(pl => { const k = f(SIGN[pl.sign]); c[k] = (c[k] || 0) + 1; }); return c; };
  return { utc, placements, asc, mc, ascSign: asc == null ? null : Math.floor(asc / 30), elements: count(s => s.element), modes: count(s => s.mode) };
}
const fmtDeg = d => `${Math.floor(d)}°${String(Math.floor((d % 1) * 60)).padStart(2, "0")}′`;
