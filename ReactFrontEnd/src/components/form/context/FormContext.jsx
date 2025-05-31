import React, { createContext, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getDefaultState } from '../utils/formUtils';
import { MainContext } from '../../../utils/contexts/MainContext';

const FormContext = createContext();

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

export const FormProvider = ({ children, matricule = null, row = null, setUserInfo }) => {
  const { TableName } = useContext(MainContext);
  const { t: Traduction } = useTranslation();
  const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);
  const [activeStep, setActiveStep] = useState(0);
  const [cityOptions, setCityOptions] = useState([]);
  const [formData, setFormData] = useState(row || {});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const defaultState = getDefaultState()[TableName.toUpperCase().replace(/\-\_\s/g,"")];
  const stateInit = {
    ...defaultState,
    ...row,
  };
  console.log("stateInit",stateInit)
  const formMethods = useForm({
    mode: 'all',
    defaultValues: stateInit || {},
    delayError: true,
  });

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const value = {
    matricule,
    TableName,
    Traduction,
    isDarkMode,
    activeStep,
    setActiveStep,
    cityOptions,
    setCityOptions,
    formMethods,
    formData,
    setFormData,
    errors,
    setErrors,
    isSubmitting,
    setIsSubmitting,
    setUserInfo,
    notification,
    handleCloseNotification,
    showNotification
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};
