import { useCallback } from 'react';
import { message } from 'antd';
import axios from 'axios';
import { useFormContext } from '../context/FormContext';
import { usePostData, useUpdateData } from '../../../api/queryHooks';
import { useFormValidation } from './useFormValidation';

export const useFormSubmission = (steps) => {
  const { 
    TableName, 
    matricule,
    formMethods: { getValues },
    activeStep,
  } = useFormContext();

  const { validateStep } = useFormValidation();
  const handlePostData = usePostData(TableName);
  const handleUpdateData = useUpdateData(TableName);

  const transformData = useCallback((data) => {
    const mapping = {
      etudiants: ['Et', 'Tr'],
      professeurs: ['Pr'],
    };

    return Object.entries(data).reduce((acc, [key, value]) => {
      const match = key.match(/_(\d+)$/);
      const index = match ? parseInt(match[1], 10) - 1 : 0;
      const cleanKey = key.replace(/(_\d+)$/, '');
      const suffix = mapping[TableName][index];
      acc[`${cleanKey}${suffix}`] = String(value);
      return acc;
    }, {});
  }, [TableName]);

  const handleSubmit = useCallback(async () => {
    const currentStep = steps[activeStep];
    const isValid = await validateStep(currentStep.Fields);
    if (!isValid) return;

    try {
      await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', { withCredentials: true });
      const formData = getValues();
      const transformedData = transformData(formData);
      console.log(matricule)
      if (!matricule) {
        await handlePostData.mutate(transformedData);
      } else {
        await handleUpdateData.mutate({ matricule, data: transformedData });
      }
      message.success('Data submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Failed to submit data. Please try again.');
    }
  }, [activeStep, steps, validateStep, getValues, transformData, matricule, handlePostData, handleUpdateData]);

  return {
    handleSubmit,
  };
};
