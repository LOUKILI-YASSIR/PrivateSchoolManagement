import { useCallback } from 'react';
import { message } from 'antd';
import { useFormContext } from '../context/FormContext';

export const useFormValidation = () => {
  const { formMethods: { setError, getValues, trigger }, activeStep } = useFormContext();

  const isFieldValid = useCallback((fieldConfig, value) => {
    if (!fieldConfig?.validation) return true;
    const { required, minLength, maxLength, pattern, validate } = fieldConfig.validation;
    const label = fieldConfig.props.label.replace(':', ' ');
    
    if (required && !value) {
      setError(`${fieldConfig.label}`, { message: `${label} is required` });
      return false;
    }
    if (minLength && value?.length < minLength.value) {
      setError(`${fieldConfig.label}`, {
        message: `${label} must be at least ${minLength.value} characters`,
      });
      return false;
    }
    if (maxLength && value?.length > maxLength.value) {
      setError(`${fieldConfig.label}`, {
        message: `${label} must be at most ${maxLength.value} characters`,
      });
      return false;
    }
    if (pattern && !pattern.value.test(value)) {
      setError(`${fieldConfig.label}`, {
        message: `${label} is not in the correct format`,
      });
      return false;
    }
    if (validate && !validate(value, getValues())) {
      setError(`${fieldConfig.label}`, { message: `${label} is not valid` });
      return false;
    }
    return true;
  }, [activeStep, getValues, setError]);

  const validateStep = useCallback(async (currentFields) => {
    const fieldLabels = currentFields.map(field =>field.label);
    const triggeredValid = await trigger(fieldLabels);
    
    const allFieldsValid = currentFields.map(field => {
      const value = getValues(field.label);
      return isFieldValid(field, value);
    });

    if (!triggeredValid || !allFieldsValid.every(isValid => isValid)) {
      message.error('Validation failed. Please correct the errors before proceeding.');
      return false;
    }
    return true;
  }, [activeStep, getValues, isFieldValid, trigger]);

  return {
    isFieldValid,
    validateStep,
  };
};
