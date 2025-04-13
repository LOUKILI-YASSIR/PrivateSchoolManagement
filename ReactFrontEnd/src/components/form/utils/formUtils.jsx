// utils/formUtils.js
import {
  ETUDIANTS,
  DAYWEEK,
  GROUPS,
  MATIERES,
  NIVEAU,
  PROFESSEUR,
  REGULARTIMETABLE,
  SALLE,
  TIMESLOT,
  EVALUATION,
} from "../Steps/DefaultStates";

export function CalcDefaultDate(ageStart) {
  const today = new Date();
  return new Date(
    today.getFullYear() - ageStart,
    today.getMonth() - 1,
    today.getDate() + 1
  ).toISOString().slice(0, 10);
}

export const getDefaultState = () => ({
  ETUDIANTS,
  DAYWEEK,
  GROUPS,
  MATIERES,
  NIVEAU,
  PROFESSEUR,
  REGULARTIMETABLE,
  SALLE,
  TIMESLOT,
  EVALUATION,
});


export const generateField = ({
  type,
  label,
  propsLabel,
  classes = "",
  propsType,
  value = "",
  enablePlaceholder = false,
  enableShrink = false,
  options = [],
  isComponent = false,
  extraProps = {},
  validation,
}) => ({
  type,
  label: label,
  props: {
    label: `${propsLabel} :`,
    classes,
    InputLabelProps: { shrink: enableShrink },
    placeholder: enablePlaceholder ? `Enter ${propsLabel} ...` : "",
    options,
    isComponent,
    value,
    propsType,
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