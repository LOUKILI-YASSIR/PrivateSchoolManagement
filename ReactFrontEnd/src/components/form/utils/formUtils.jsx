// utils/formUtils.js

import { DEFAULT } from './formConstants';

export function CalcDefaultDate(ageStart) {
  const today = new Date();
  return new Date(
    today.getFullYear() - ageStart,
    today.getMonth() - 1,
    today.getDate() + 1
  ).toISOString().slice(0, 10);
}

export const getDefaultState = () => {
  const {
    COUNTRY_CODE: defaultCountry,
    CITY_NAME: defaultCity,
    POSTAL_CODE: defaultPostalCode,
  } = DEFAULT;

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
  type,
  label,
  classes = "",
  value = "",
  enablePlaceholder = false,
  enableShrink = false,
  options = [],
  isComponent = false,
  extraProps = {},
  validation,
}) => ({
  type,
  label: label
    .replace(/[^\w]de|d'| N°/, "")
    .toUpperCase()
    .replace(" ", "_")
    .replace(/É|È|Ê/g, "E"),
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
  validation,
});

export const formatLabel = (fieldName) =>
  fieldName
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const commonValidations = {
  required: (fieldLabel) => ({
    required: `${fieldLabel} is required`,
  }),
  minLength: (fieldLabel, length) => ({
    minLength: {
      value: length,
      message: `${fieldLabel} must be at least ${length} characters`,
    },
  }),
  maxLength: (fieldLabel, length) => ({
    maxLength: {
      value: length,
      message: `${fieldLabel} must be at most ${length} characters`,
    },
  }),
  pattern: (fieldLabel, regex, errorMessage) => ({
    pattern: {
      value: regex,
      message: errorMessage || `${fieldLabel} is not in the correct format`,
    },
  }),
  inArray: (fieldLabel, allowedOptions, errorMessage) => ({
    validate: (value) =>
      allowedOptions.includes(value) ||
      errorMessage ||
      `${fieldLabel} must be one of the allowed options`,
  }),
  combine: (...rules) => Object.assign({}, ...rules),
};