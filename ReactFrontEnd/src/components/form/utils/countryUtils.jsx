
import { countries } from 'countries-list';
import axios from 'axios';

export const generateCountryOptions = () => {
  return Object.entries(countries).map(([code, country]) => ({
    label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img
          src={`/country-flag-icons-3x2/${code}.svg`}
          alt={country.name}
          style={{ width: '20px', height: '15px', borderRadius: '2px' }}
        />
        {country.name}
      </div>
    ),
    value: code,
    searchText: country.name,
  }));
};

export const generateCityOptions = async (countryCode) => {
  if (!countryCode || countryCode.length !== 2) return [];

  try {
    const response = await axios.get(
      `http://localhost:3000/ville/${countryCode}`,
      {
        timeout: 5000,
        validateStatus: (status) => status >= 200 && status < 500,
      }
    );

    if (typeof response.data !== 'object') {
      throw new Error('Format de réponse invalide');
    }

    if (!response.data.success) {
      return [];
    }

    return response.data.cities.map((city) => ({
      label: city,
      value: city,
    }));
  } catch (error) {
    console.error(`Erreur lors de la récupération des villes pour ${countryCode}:`, error);
    return [];
  }
};

export const postalCodeValidators = {
  AD: { regex: /^AD\d{3}$/, message: "Postal code must be in the format AD123 for Andorra." },
  AT: { regex: /^\d{4}$/, message: "Postal code must be exactly 4 digits for Austria." },
  AU: { regex: /^\d{4}$/, message: "Postal code must be exactly 4 digits for Australia." },
  BE: { regex: /^\d{4}$/, message: "Postal code must be exactly 4 digits for Belgium." },
  BR: { regex: /^\d{5}-\d{3}$/, message: "Postal code must be in the format 12345-678 for Brazil." },
  CA: { regex: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, message: "Postal code must be in the format A1A 1A1 for Canada." },
  CH: { regex: /^\d{4}$/, message: "Postal code must be exactly 4 digits for Switzerland." },
  CN: { regex: /^\d{6}$/, message: "Postal code must be exactly 6 digits for China." },
  CZ: { regex: /^\d{3}\s?\d{2}$/, message: "Postal code must be in the format 123 45 for Czech Republic." },
  DE: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Germany." },
  DK: { regex: /^\d{4}$/, message: "Postal code must be exactly 4 digits for Denmark." },
  ES: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Spain." },
  FI: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Finland." },
  FR: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for France." },
  GB: { regex: /^(GIR ?0AA|[A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2})$/i, message: "Postal code must be a valid UK format." },
  GR: { regex: /^\d{3}\s?\d{2}$/, message: "Postal code must be in the format 123 45 for Greece." },
  HU: { regex: /^\d{4}$/, message: "Postal code must be exactly 4 digits for Hungary." },
  IE: { regex: /^[A-Za-z0-9]{3}\s?[A-Za-z0-9]{4}$/, message: "Postal code must be a valid Irish Eircode format." },
  IN: { regex: /^\d{6}$/, message: "Postal code must be exactly 6 digits for India." },
  IT: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Italy." },
  JP: { regex: /^\d{3}-\d{4}$/, message: "Postal code must be in the format 123-4567 for Japan." },
  KR: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for South Korea." },
  MX: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Mexico." },
  NL: { regex: /^\d{4}\s?[A-Z]{2}$/, message: "Postal code must be in the format 1234 AB for Netherlands." },
  NO: { regex: /^\d{4}$/, message: "Postal code must be exactly 4 digits for Norway." },
  NZ: { regex: /^\d{4}$/, message: "Postal code must be exactly 4 digits for New Zealand." },
  PL: { regex: /^\d{2}-\d{3}$/, message: "Postal code must be in the format 12-345 for Poland." },
  PT: { regex: /^\d{4}-\d{3}$/, message: "Postal code must be in the format 1234-567 for Portugal." },
  RO: { regex: /^\d{6}$/, message: "Postal code must be exactly 6 digits for Romania." },
  RU: { regex: /^\d{6}$/, message: "Postal code must be exactly 6 digits for Russia." },
  SE: { regex: /^\d{3}\s?\d{2}$/, message: "Postal code must be in the format 123 45 for Sweden." },
  SG: { regex: /^\d{6}$/, message: "Postal code must be exactly 6 digits for Singapore." },
  TH: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Thailand." },
  TR: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Turkey." },
  US: { regex: /^\d{5}(-\d{4})?$/, message: "Postal code must be 5 digits or ZIP+4 for USA." },
  ZA: { regex: /^\d{4}$/, message: "Postal code must be exactly 4 digits for South Africa." },
  AF: { regex: /^\d{4}$/, message: "Postal code must be exactly 4 digits for Afghanistan." },
  AL: { regex: /^\d{4}$/, message: "Postal code must be exactly 4 digits for Albania." },
  AR: { regex: /^\d{4}$/, message: "Postal code must be exactly 4 digits for Argentina." },
  AZ: { regex: /^AZ\d{4}$/i, message: "Postal code must be in the format AZ1234 for Azerbaijan." },
  BD: { regex: /^\d{4}$/, message: "Postal code must be exactly 4 digits for Bangladesh." },
  BG: { regex: /^\d{4}$/, message: "Postal code must be exactly 4 digits for Bulgaria." },
  BY: { regex: /^\d{6}$/, message: "Postal code must be exactly 6 digits for Belarus." },
  BN: { regex: /^[A-Z]{2}\d{4}$/, message: "Postal code must be in the format BN1234 for Brunei." },
  CL: { regex: /^\d{7}$/, message: "Postal code must be exactly 7 digits for Chile." },
  CO: { regex: /^\d{6}$/, message: "Postal code must be exactly 6 digits for Colombia." },
  CR: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Costa Rica." },
  CY: { regex: /^\d{4}$/, message: "Postal code must be exactly 4 digits for Cyprus." },
  DO: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Dominican Republic." },
  DZ: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Algeria." },
  EC: { regex: /^\d{6}$/, message: "Postal code must be exactly 6 digits for Ecuador." },
  EE: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Estonia." },
  EG: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Egypt." },
  GE: { regex: /^\d{4}$/, message: "Postal code must be exactly 4 digits for Georgia." },
  GT: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Guatemala." },
  HR: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Croatia." },
  ID: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Indonesia." },
  IL: { regex: /^\d{7}$/, message: "Postal code must be exactly 7 digits for Israel." },
  IQ: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Iraq." },
  JO: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Jordan." },
  KZ: { regex: /^\d{6}$/, message: "Postal code must be exactly 6 digits for Kazakhstan." },
  KE: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Kenya." },
  KW: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Kuwait." },
  LV: { regex: /^(LV-?)?\d{4}$/i, message: "Postal code must be 4 digits (optional LV prefix) for Latvia." },
  LT: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Lithuania." },
  LU: { regex: /^\d{4}$/, message: "Postal code must be exactly 4 digits for Luxembourg." },
  LY: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Libya." },
  MA: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Morocco." },
  MD: { regex: /^\d{4}$/, message: "Postal code must be exactly 4 digits for Moldova." },
  MT: { regex: /^[A-Z]{3}\s?\d{4}$/, message: "Postal code must be in format ABC 1234 for Malta." },
  MN: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Mongolia." },
  MY: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Malaysia." },
  NG: { regex: /^\d{6}$/, message: "Postal code must be exactly 6 digits for Nigeria." },
  NP: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Nepal." },
  OM: { regex: /^\d{3}$/, message: "Postal code must be exactly 3 digits for Oman." },
  PE: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Peru." },
  PH: { regex: /^\d{4}$/, message: "Postal code must be exactly 4 digits for Philippines." },
  PK: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Pakistan." },
  PR: { regex: /^\d{5}(-\d{4})?$/, message: "Postal code follows US format (5 digits or ZIP+4)." },
  PY: { regex: /^\d{4}$/, message: "Postal code must be exactly 4 digits for Paraguay." },
  RS: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Serbia." },
  SA: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Saudi Arabia." },
  SD: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Sudan." },
  SI: { regex: /^\d{4}$/, message: "Postal code must be exactly 4 digits for Slovenia." },
  SK: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Slovakia." },
  SN: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Senegal." },
  TN: { regex: /^\d{4}$/, message: "Postal code must be exactly 4 digits for Tunisia." },
  TW: { regex: /^\d{3}(\d{2})?$/, message: "Postal code must be 3-5 digits for Taiwan." },
  UA: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Ukraine." },
  UY: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Uruguay." },
  UZ: { regex: /^\d{6}$/, message: "Postal code must be exactly 6 digits for Uzbekistan." },
  VE: { regex: /^\d{4}$/, message: "Postal code must be exactly 4 digits for Venezuela." },
  VN: { regex: /^\d{6}$/, message: "Postal code must be exactly 6 digits for Vietnam." },
  ZM: { regex: /^\d{5}$/, message: "Postal code must be exactly 5 digits for Zambia." },
  AE: { regex: /.*/, message: "No postal code required for UAE." },
  QA: { regex: /.*/, message: "No postal code required for Qatar." },
  IE: { regex: /.*/, message: "No postal code required for Ireland (Eircode is optional)." },
};

export const countryPhonePrefixes = Object.entries({
  dz: "+213", ao: "+244", bj: "+229", bw: "+267", bf: "+226", bi: "+257", cv: "+238", cm: "+237",
  cf: "+236", td: "+235", km: "+269", cd: "+243", cg: "+242", ci: "+225", dj: "+253", eg: "+20",
  gq: "+240", er: "+291", et: "+251", ga: "+241", gm: "+220", gh: "+233", gn: "+224", gw: "+245",
  ke: "+254", ls: "+266", lr: "+231", ly: "+218", mg: "+261", mw: "+265", ml: "+223", mr: "+222",
  mu: "+230", yt: "+262", ma: "+212", mz: "+258", na: "+264", ne: "+227", ng: "+234", rw: "+250",
  st: "+239", sn: "+221", sc: "+248", sl: "+232", so: "+252", za: "+27", ss: "+211", sd: "+249",
  tz: "+255", tg: "+228", tn: "+216", ug: "+256", us: "+1", ca: "+1", as: "+1-684", ai: "+1-264",
  ag: "+1-268", bs: "+1-242", bb: "+1-246", bm: "+1-441", vg: "+1-284", ky: "+1-345", dm: "+1-767",
  do: "+1-809", gd: "+1-473", jm: "+1-876", ms: "+1-664", kn: "+1-869", lc: "+1-758", vc: "+1-784",
  sx: "+1-721", tc: "+1-649", vi: "+1-340", mx: "+52", gn: "+502", hn: "+504", ni: "+505",
  cr: "+506", pa: "+507", py: "+595", ar: "+54", bo: "+591", br: "+55", cl: "+56", co: "+57",
  ec: "+593", uy: "+598", ve: "+58", al: "+355", ad: "+376", am: "+374", at: "+43", az: "+994",
  by: "+375", be: "+32", ba: "+387", bg: "+359", hr: "+385", cy: "+357", cz: "+420", dk: "+45",
  ee: "+372", fo: "+298", fi: "+358", fr: "+33", gf: "+594", pf: "+689", ge: "+995", de: "+49",
  gi: "+350", gr: "+30", gl: "+299", hu: "+36", is: "+354", ie: "+353", im: "+44", it: "+39",
  je: "+44", kz: "+7", xk: "+383", kw: "+965", lv: "+371", li: "+423", lt: "+370", lu: "+352",
  mk: "+389", mt: "+356", md: "+373", mc: "+377", me: "+382", nl: "+31", no: "+47", pl: "+48",
  pt: "+351", ro: "+40", ru: "+7", sm: "+378", rs: "+381", sk: "+421", si: "+386", es: "+34",
  sj: "+47", se: "+46", ch: "+41", tr: "+90", ua: "+380", gb: "+44", af: "+93", bd: "+880",
  bt: "+975", bn: "+673", kh: "+855", cn: "+86", cx: "+61", cc: "+61", io: "+246", in: "+91",
  id: "+62", ir: "+98", iq: "+964", il: "+972", jp: "+81", jo: "+962", kp: "+850", kr: "+82",
  lb: "+961", my: "+60", mv: "+960", mn: "+976", mm: "+95", np: "+977", om: "+968", pk: "+92",
  ps: "+970", ph: "+63", qa: "+974", sa: "+966", sg: "+65", sy: "+963", tw: "+886", th: "+66",
  tl: "+670", tm: "+993", uz: "+998", vn: "+84", vu: "+678", ws: "+685", nz: "+64", nf: "+672",
  ck: "+682", ni: "+683", tk: "+690",
}).map(([country, prefix]) => [prefix, country]);