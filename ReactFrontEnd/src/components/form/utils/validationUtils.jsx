export const validateField = (field, value, label) => {
  const errors = [];
  const { required, minLength, maxLength, pattern, validate } = field.validation || {};

  if (required && !value) {
    errors.push(`${label} est requis`);
  }

  if (minLength && value?.length < minLength.value) {
    errors.push(`${label} doit contenir au moins ${minLength.value} caractères`);
  }

  if (maxLength && value?.length > maxLength.value) {
    errors.push(`${label} ne doit pas dépasser ${maxLength.value} caractères`);
  }

  if (pattern && !pattern.value.test(value)) {
    errors.push(`${label} n'est pas dans le bon format`);
  }

  if (validate && typeof validate === 'function') {
    const customError = validate(value);
    if (customError) {
      errors.push(customError);
    }
  }

  return errors;
};

export const validateStep = (fields, getValues, activeStep) => {
  const errors = {};
  let isValid = true;

  fields.forEach(field => {
    const value = getValues(field.label);
    const fieldErrors = validateField(field, value, field.props.label);

    if (fieldErrors.length > 0) {
      errors[field.label] = fieldErrors;
      isValid = false;
    }
  });

  return { isValid, errors };
};

export const validateForm = (steps, getValues) => {
  let isValid = true;
  const errors = {};

  steps.forEach((step, index) => {
    const stepValidation = validateStep(step.Fields, getValues, index);
    if (!stepValidation.isValid) {
      isValid = false;
      Object.assign(errors, stepValidation.errors);
    }
  });

  return { isValid, errors };
};
