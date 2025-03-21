import { useTranslation } from "react-i18next";
import { countries } from 'countries-list';
import axios from "axios";

export const getFormOption = () => {
  const { t: Traduction } = useTranslation();
  return {
    TYPE: {
      SELECT: "SELECT",
      TEXT: "TEXT",
      EMAIL: "EMAIL",
      TEXTAREA: "TEXTAREA",
      PHONE: "PHONE",
      DATE: "DATE",
      IMAGE: "IMAGE",
      AUTO_COMPLETE_SELECT: "AUTO_COMPLETE_SELECT", 
      NUMBER: "NUMBER",
    },
    DEFAULT: {
      COUNTRY_CODE: "MA",
      CITY_NAME: "",
      POSTAL_CODE: "50000",
    },
    Traduction,
  };
};

export const getDefaultState = () => {
  const {
    DEFAULT: {
      COUNTRY_CODE: defaultCountry,
      CITY_NAME: defaultCity,
      POSTAL_CODE: defaultPostalCode,
    },
  } = getFormOption();

  return {
    ETUDIANTS: {
      GENRE_1: "H",
      PROFILE_PICTURE_1: "/uploads/default.jpg",
      NOM_1: "",
      PRENOM_1: "",
      LIEU_NAISSANCE_1: defaultCity,
      DATE_NAISSANCE_1: CalcDefaultDate(6),
      NATIONALITE_1: defaultCountry,
      PAYS_1: defaultCountry,
      VILLE_1: defaultCity,
      CODE_POSTAL_1: defaultPostalCode,
      EMAIL_1: "",
      ADRESSE_1: "",
      OBSERVATION_1: "",

      NOM_2: "",
      PRENOM_2: "",
      TELEPHONE1_2: "+212",
      TELEPHONE2_2: "+212",
      EMAIL_2: "",
      OBSERVATION_2: "",
      PROFESSION_2: "",
      LIEN_PARENTE_2: "Père",
    },
    PROFESSEURS: {
      CIVILITE_1: "",
      NOM_1: "",
      PRENOM_1: "",
      NATIONALITE_1: defaultCountry,
      TELEPHONE1_2: "+212",
      TELEPHONE2_2: "+212",
      EMAIL_1: "",
      CIN_1: "",
      DATE_EMBAUCHE_1: CalcDefaultDate(0),
      NOM_BANQUE_1: "",
      RIB_1: "",
      ADRESSE_1: "",
      OBSERVATION_1: "",
    },
  };
};

export const generateField = ({
  type, label, classes = "", value = "",
  enablePlaceholder = false, enableShrink = false, options = [],
  isComponent = false, extraProps = {}, validation
}) => ({
  type,
  label: label.replace(/[^\w]de|d'| N°/, "").toUpperCase().replace(" ", "_").replace(/É|È|Ê/g, "E"),
  props: {
    label: `${label} :`,
    classes,
    InputLabelProps: { shrink: enableShrink },
    placeholder: enablePlaceholder ? `Enter ${label} ...` : "",
    options,
    isComponent,
    value,
    ...extraProps,
  },
  validation
});

export const formatLabel = (fieldName) =>
  fieldName.toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
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
        searchText: country.name // Ajout d'un champ texte pour la recherche
      }));
    };
    export const generateCityOptions = async (countryCode) => {
      if (!countryCode || countryCode.length !== 2) return [];
      
      try {
        const response = await axios.get(
          `http://localhost:3000/ville/${countryCode}`, 
          {
            timeout: 5000,
            validateStatus: (status) => status >= 200 && status < 500
          }
        );
    
        // Gérer les réponses non-JSON
        if (typeof response.data !== 'object') {
          throw new Error('Format de réponse invalide');
        }
    
        if (!response.data.success) {
          return []; // Retourner tableau vide si pas de villes
        }
    
        return response.data.cities.map(city => ({
          label: city,
          value: city
        }));
        
      } catch (error) {
        console.error(`Erreur lors de la récupération des villes pour ${countryCode}:`, error);
        return [];
      }
    };      
function CalcDefaultDate(ageStart) {
  const today = new Date();
  return new Date(
    today.getFullYear() - ageStart,
    today.getMonth()-1,
    today.getDate()+1
  ).toISOString().slice(0, 10);
}

export const postalCodeValidators = {   
  // Existing entries from your original list
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

  // Newly added countries
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

  // Countries without postal codes (example handling)
  AE: { regex: /.*/, message: "No postal code required for UAE." },
  QA: { regex: /.*/, message: "No postal code required for Qatar." },
  IE: { regex: /.*/, message: "No postal code required for Ireland (Eircode is optional)." } // Note: Eircode was added earlier
};


// Common validation functions for reusability across your forms.
export const commonValidations = {
  /**
   * Generates a "required" validation rule.
   * @param {string} fieldLabel - The label of the field.
   * @returns {object} A validation rule for react-hook-form.
   */
  required: (fieldLabel) => ({
    required: `${fieldLabel} is required`
  }),

  /**
   * Generates a "minLength" validation rule.
   * @param {string} fieldLabel - The label of the field.
   * @param {number} length - The minimum number of characters allowed.
   * @returns {object} A validation rule for react-hook-form.
   */
  minLength: (fieldLabel, length) => ({
    minLength: {
      value: length,
      message: `${fieldLabel} must be at least ${length} characters`
    }
  }),

  /**
   * Generates a "maxLength" validation rule.
   * @param {string} fieldLabel - The label of the field.
   * @param {number} length - The maximum number of characters allowed.
   * @returns {object} A validation rule for react-hook-form.
   */
  maxLength: (fieldLabel, length) => ({
    maxLength: {
      value: length,
      message: `${fieldLabel} must be at most ${length} characters`
    }
  }),

  /**
   * Generates a "pattern" validation rule.
   * @param {string} fieldLabel - The label of the field.
   * @param {RegExp} regex - The regex pattern the field value must match.
   * @param {string} [errorMessage] - Custom error message if validation fails.
   * @returns {object} A validation rule for react-hook-form.
   */
  pattern: (fieldLabel, regex, errorMessage) => ({
    pattern: {
      value: regex,
      message: errorMessage || `${fieldLabel} is not in the correct format`
    }
  }),
  
    /**
   * Generates a validation rule to ensure that the field's value is included in a given array.
   * Useful for fields like a city selector.
   * @param {string} fieldLabel - The label of the field.
   * @param {Array} allowedOptions - An array of allowed values.
   * @param {string} [errorMessage] - Optional custom error message.
   * @returns {object} A validation rule for react-hook-form.
   */
    inArray: (fieldLabel, allowedOptions, errorMessage) => ({
      validate: (value) =>
        allowedOptions.includes(value) ||
        errorMessage ||
        `${fieldLabel} must be one of the allowed options`
    }),
    
  /**
   * Combines multiple validation rules into one object.
   * You can pass any number of rule objects, and they will be merged.
   * @param  {...object} rules - The individual validation rule objects.
   * @returns {object} The combined validation rules.
   */
  combine: (...rules) => Object.assign({}, ...rules)
};
export const countryPhonePrefixes =  Object.entries({
 // Africa
 dz: "+213",   // Algeria
 ao: "+244",   // Angola
 bj: "+229",   // Benin
 bw: "+267",   // Botswana
 bf: "+226",   // Burkina Faso
 bi: "+257",   // Burundi
 cv: "+238",   // Cape Verde
 cm: "+237",   // Cameroon
 cf: "+236",   // Central African Republic
 td: "+235",   // Chad
 km: "+269",   // Comoros
 cd: "+243",   // Congo (DRC)
 cg: "+242",   // Congo (Republic)
 ci: "+225",   // Côte d'Ivoire
 dj: "+253",   // Djibouti
 eg: "+20",    // Egypt
 gq: "+240",   // Equatorial Guinea
 er: "+291",   // Eritrea
 et: "+251",   // Ethiopia
 ga: "+241",   // Gabon
 gm: "+220",   // Gambia
 gh: "+233",   // Ghana
 gn: "+224",   // Guinea
 gw: "+245",   // Guinea-Bissau
 ke: "+254",   // Kenya
 ls: "+266",   // Lesotho
 lr: "+231",   // Liberia
 ly: "+218",   // Libya
 mg: "+261",   // Madagascar
 mw: "+265",   // Malawi
 ml: "+223",   // Mali
 mr: "+222",   // Mauritania
 mu: "+230",   // Mauritius
 yt: "+262",   // Mayotte
 ma: "+212",   // Morocco
 mz: "+258",   // Mozambique
 na: "+264",   // Namibia
 ne: "+227",   // Niger
 ng: "+234",   // Nigeria
 rw: "+250",   // Rwanda
 st: "+239",   // São Tomé and Príncipe
 sn: "+221",   // Senegal
 sc: "+248",   // Seychelles
 sl: "+232",   // Sierra Leone
 so: "+252",   // Somalia
 za: "+27",    // South Africa
 ss: "+211",   // South Sudan
 sd: "+249",   // Sudan
 tz: "+255",   // Tanzania
 tg: "+228",   // Togo
 tn: "+216",   // Tunisia
 ug: "+256",   // Uganda
 
 // Americas
 // North America, Central America and Caribbean (NANP countries)
 us: "+1",         // United States
 ca: "+1",         // Canada
 as: "+1-684",     // American Samoa
 ai: "+1-264",     // Anguilla
 ag: "+1-268",     // Antigua and Barbuda
 bs: "+1-242",     // Bahamas
 bb: "+1-246",     // Barbados
 bm: "+1-441",     // Bermuda
 vg: "+1-284",     // British Virgin Islands
 ky: "+1-345",     // Cayman Islands
 dm: "+1-767",     // Dominica
 do: "+1-809",     // Dominican Republic (also +1-829, +1-849)
 gd: "+1-473",     // Grenada
 jm: "+1-876",     // Jamaica
 ms: "+1-664",     // Montserrat
 kn: "+1-869",     // Saint Kitts and Nevis
 lc: "+1-758",     // Saint Lucia
 vc: "+1-784",     // Saint Vincent and the Grenadines
 sx: "+1-721",     // Sint Maarten
 tc: "+1-649",     // Turks and Caicos Islands
 vi: "+1-340",     // U.S. Virgin Islands
 
 // Other American countries
 mx: "+52",        // Mexico
 gn: "+502",       // Guatemala
 hn: "+504",       // Honduras
 ni: "+505",       // Nicaragua
 cr: "+506",       // Costa Rica
 pa: "+507",       // Panama
 py: "+595",       // Paraguay
 ar: "+54",        // Argentina
 bo: "+591",       // Bolivia
 br: "+55",        // Brazil
 cl: "+56",        // Chile
 co: "+57",        // Colombia
 ec: "+593",       // Ecuador
 uy: "+598",       // Uruguay
 ve: "+58",        // Venezuela
 
 // Europe
 al: "+355",   // Albania
 ad: "+376",   // Andorra
 am: "+374",   // Armenia
 at: "+43",    // Austria
 az: "+994",   // Azerbaijan
 by: "+375",   // Belarus
 be: "+32",    // Belgium
 ba: "+387",   // Bosnia and Herzegovina
 bg: "+359",   // Bulgaria
 hr: "+385",   // Croatia
 cy: "+357",   // Cyprus
 cz: "+420",   // Czechia
 dk: "+45",    // Denmark
 ee: "+372",   // Estonia
 fo: "+298",   // Faroe Islands
 fi: "+358",   // Finland
 fr: "+33",    // France
 gf: "+594",   // French Guiana (overseas territory)
 pf: "+689",   // French Polynesia (overseas territory)
 ge: "+995",   // Georgia
 de: "+49",    // Germany
 gi: "+350",   // Gibraltar
 gr: "+30",    // Greece
 gl: "+299",   // Greenland
 hu: "+36",    // Hungary
 is: "+354",   // Iceland
 ie: "+353",   // Ireland
 im: "+44",    // Isle of Man
 it: "+39",    // Italy
 je: "+44",    // Jersey
 kz: "+7",     // Kazakhstan
 xk: "+383",   // Kosovo
 kw: "+965",   // Kuwait (also in Asia)
 lv: "+371",   // Latvia
 li: "+423",   // Liechtenstein
 lt: "+370",   // Lithuania
 lu: "+352",   // Luxembourg
 mk: "+389",   // North Macedonia
 mt: "+356",   // Malta
 md: "+373",   // Moldova
 mc: "+377",   // Monaco
 me: "+382",   // Montenegro
 nl: "+31",    // Netherlands
 no: "+47",    // Norway
 pl: "+48",    // Poland
 pt: "+351",   // Portugal
 ro: "+40",    // Romania
 ru: "+7",     // Russia
 sm: "+378",   // San Marino
 rs: "+381",   // Serbia
 sk: "+421",   // Slovakia
 si: "+386",   // Slovenia
 es: "+34",    // Spain
 sj: "+47",    // Svalbard and Jan Mayen
 se: "+46",    // Sweden
 ch: "+41",    // Switzerland
 tr: "+90",    // Turkey
 ua: "+380",   // Ukraine
 gb: "+44",    // United Kingdom
 
 // Asia & Oceania
 af: "+93",    // Afghanistan
 bd: "+880",   // Bangladesh
 bt: "+975",   // Bhutan
 bn: "+673",   // Brunei
 kh: "+855",   // Cambodia
 cn: "+86",    // China
 cx: "+61",    // Christmas Island (uses Australia's code)
 cc: "+61",    // Cocos (Keeling) Islands (uses Australia's code)
 io: "+246",   // British Indian Ocean Territory
 in: "+91",    // India
 id: "+62",    // Indonesia
 ir: "+98",    // Iran
 iq: "+964",   // Iraq
 il: "+972",   // Israel
 jp: "+81",    // Japan
 jo: "+962",   // Jordan
 kp: "+850",   // North Korea
 kr: "+82",    // South Korea
 lb: "+961",   // Lebanon
 my: "+60",    // Malaysia
 mv: "+960",   // Maldives
 mn: "+976",   // Mongolia
 mm: "+95",    // Myanmar
 np: "+977",   // Nepal
 om: "+968",   // Oman
 pk: "+92",    // Pakistan
 ps: "+970",   // Palestine
 ph: "+63",    // Philippines
 qa: "+974",   // Qatar
 sa: "+966",   // Saudi Arabia
 sg: "+65",    // Singapore
 sy: "+963",   // Syria
 tw: "+886",   // Taiwan
 th: "+66",    // Thailand
 tl: "+670",   // Timor-Leste
 tm: "+993",   // Turkmenistan
 uz: "+998",   // Uzbekistan
 vn: "+84",    // Vietnam
 vu: "+678",   // Vanuatu
 ws: "+685",   // Samoa
 nz: "+64",    // New Zealand
 nf: "+672",   // Norfolk Island
 ck: "+682",   // Cook Islands
 ni: "+683",   // Niue
 tk: "+690",   // Tokelau
}).map(([country, prefix]) => [prefix, country]);