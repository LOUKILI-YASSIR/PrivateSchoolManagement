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
      setError(`${fieldConfig.label}`, { message: `${label} est requis` });
      return false;
    }
    if (minLength && value?.length < minLength.value) {
      setError(`${fieldConfig.label}`, {
        message: `${label} doit contenir au moins ${minLength.value} caractères`,
      });
      return false;
    }
    if (maxLength && value?.length > maxLength.value) {
      setError(`${fieldConfig.label}`, {
        message: `${label} ne doit pas dépasser ${maxLength.value} caractères`,
      });
      return false;
    }
    if (pattern && !pattern.value.test(value)) {
      setError(`${fieldConfig.label}`, {
        message: `${label} n'est pas dans le bon format`,
      });
      return false;
    }
    if (validate && !validate(value, getValues())) {
      setError(`${fieldConfig.label}`, { message: `${label} n'est pas valide` });
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
      message.error({
        content: 'Veuillez corriger les erreurs avant de continuer.',
        duration: 3,
        style: {
          marginTop: '20vh',
        },
      });
      return false;
    }
    return true;
  }, [activeStep, getValues, isFieldValid, trigger]);

  return {
    isFieldValid,
    validateStep,
  };
};
