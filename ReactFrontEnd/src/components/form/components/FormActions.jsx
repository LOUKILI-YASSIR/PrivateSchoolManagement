import React, { useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { useFormContext } from '../context/FormContext';
import { useFormSubmission } from '../hooks/useFormSubmission';
import { useFormValidation } from '../hooks/useFormValidation';

export default function FormActions({ steps, setButtons, StepOpt, matricule, TypeOpt, setUserInfo }) {
  const { activeStep, setActiveStep, Traduction } = useFormContext();
  const { validateStep } = useFormValidation();
  
const { handleSubmit } = useFormSubmission({StepOpt, TypeOpt, matricule});

const handleNext = async () => {
    const currentStep = steps[activeStep];
    const isValid = await validateStep(currentStep.Fields);
    if (isValid) {
      setActiveStep(prev => prev + 1);
    }
    setUserInfo(null)
  };

  const handlePrev = () => {
    setUserInfo(null)
    setActiveStep(prev => prev - 1);
  };

  // Update parent buttons
  const updateButtons = () => {
    const Btns = [];
    if (activeStep > 0) {
      Btns.push({
        value: Traduction('form.previous'),
        handleClick: handlePrev,
      });
    }

    if (activeStep < steps.length - 1) {
      Btns.push({
        value: Traduction('form.next'),
        handleClick: handleNext,
      });
    } else {
      Btns.push({
        value: Traduction('form.submit'),
        handleClick: handleSubmit,
        color: 'primary',
      });
    }

    Btns.push({
      value: Traduction('actions.cancel'),
      handleClick: ()=>setUserInfo(null),
      handleCloseBefforClick : true,
    });
    setButtons(Btns);
  };

  // Update buttons when step changes
  useEffect(() => {
    updateButtons();
  }, [activeStep, steps, handleNext, handlePrev, handleSubmit, setButtons, Traduction]);

  return null;
}
