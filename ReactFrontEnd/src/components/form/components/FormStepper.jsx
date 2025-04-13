import React from 'react';
import { Stepper, Step, StepLabel, Table } from '@mui/material';
import { useFormContext } from '../context/FormContext';

export default function FormStepper({ steps = [] }) {
  const { activeStep, isDarkMode, TableName } = useFormContext();
  
  return (
    <Stepper 
      activeStep={activeStep} 
      alternativeLabel
      sx={{
        mb: 4,
        '& .MuiStepLabel-label': {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          '&.Mui-active': {
            color: isDarkMode ? '#fff' : 'primary.main',
          },
          '&.Mui-completed': {
            color: isDarkMode ? '#fff' : 'primary.main',
          },
        },
        '& .MuiStepIcon-root': {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
          '&.Mui-active': {
            color: isDarkMode ? '#fff' : 'primary.main',
          },
          '&.Mui-completed': {
            color: isDarkMode ? '#fff' : 'primary.main',
          },
        },
      }}
    >
      {steps.map((step, index) => (
        <Step key={index}>
          <StepLabel>{step.title}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
