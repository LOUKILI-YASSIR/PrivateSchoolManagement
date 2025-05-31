import React from 'react';
import { Grid, FormHelperText } from '@mui/material';
import { useFormContext } from '../context/FormContext';
import { FieldComponents } from '../options/FieldComponentsOption';
import { useCallback, useEffect } from 'react';
import { generateCityOptions } from '../utils/countryUtils';

export default function FormFields({ steps, row }) {
  const { activeStep, TableName, isDarkMode, matricule } = useFormContext();
  const fields = steps?.[activeStep]?.Fields || [];
  const { 
    formMethods: { register, formState: { errors }, setValue, getValues, watch },
    cityOptions,
    setCityOptions,
  } = useFormContext();
  const currentCountry = watch('PaysPL');

  useEffect(() => {
    if (currentCountry) {
      (async () => {
        const options = await generateCityOptions(currentCountry);
        setCityOptions(options);
      })();
    }
  }, [currentCountry, setCityOptions]);

  const handleChange = useCallback(async (event, label) => {
    let value;
    if (event?.target) {
      value = event.target.value;
    } else if (event?.toISOString) {
      value = event.toISOString();
    } else {
      value = event; // Fallback for raw values (e.g., PHONE)
    }
  
    if (label === 'PaysPL') {
      const options = await generateCityOptions(value);
      setCityOptions(options);
      if (options && options.length > 0) {
        setValue('VillePL', options[0].value, { shouldValidate: true });
      }
    }
    setValue(label, value, { shouldValidate: true });
  }, [setValue, setCityOptions]);
  useEffect(() => {
  if (row && typeof row === 'object') {
    Object.entries(row).forEach(([key, value]) => {
      // Ensure value is valid (e.g., convert date strings if needed)
      console.log(key,value)
      setValue(key, value, { shouldValidate: true });
    });
  }
}, [row, setValue]);

  const renderField = (field, index, DoMargin) => {
    const Component = FieldComponents[field.type];
    const fieldName = field.label;
    const ImgPathUploads = `/uploads/${TableName}`;
    const fieldError = errors[fieldName];
    
    if (!Component) return null;

    return (
      <Grid item xs={12} style={{marginBottom: DoMargin ? 0 : 40}} sm={field.type === 'TEXTAREA' ? 12 : 6} key={`${field.label}-${index}`}>
        <Component
          fieldItem={{
            ...field,
            label: fieldName,
            value: getValues(fieldName) ?? '',
            props: {
              ...field.props,
              options:
                field.label === 'VillePL'
                  ? cityOptions
                  : field.props.options,
              onError: (error) => {
                console.error(`Error in ${fieldName}:`, error);
                setValue(fieldName, '', { shouldValidate: true });
              },
              error: !!fieldError,
              helperText: fieldError?.message || '',
            },
          }}
          register={register}
          handleChange={handleChange}
          errors={errors}
          ImgPathUploads={ImgPathUploads}
          tableName={TableName}
          matricule={matricule}
          setValue={setValue}
          isDarkMode={isDarkMode}
        />
        {fieldError && (
          <FormHelperText 
            error 
            sx={{ 
              marginLeft: 2,
              marginTop: 0.5,
              fontSize: '0.75rem',
              color: isDarkMode ? 'error.light' : 'error.main'
            }}
          >
            {fieldError.message}
          </FormHelperText>
        )}
      </Grid>
    );
  };

  // Group fields into pairs, except for TEXTAREAs
  const groupedFields = fields.reduce((acc, field, index) => {
    if (field.type === 'TEXTAREA') {
      // Add TEXTAREA as a full-width row
      acc.push([field]);
    } else if (acc.length > 0 && acc[acc.length - 1].length === 1 && acc[acc.length - 1][0].type !== 'TEXTAREA') {
      // Add to previous row if it has only one non-TEXTAREA field
      acc[acc.length - 1].push(field);
    } else {
      // Start a new row
      acc.push([field]);
    }
    return acc;
  }, []);

  return (
    <Grid container spacing={2}>
      {groupedFields.map((rowFields, rowIndex) => (
        <Grid container item spacing={2} key={rowIndex}>
          {rowFields.map((field, colIndex) => renderField(field, `${rowIndex}-${colIndex}`, groupedFields.length-1==rowIndex))}
        </Grid>
      ))}
    </Grid>
  );
}
