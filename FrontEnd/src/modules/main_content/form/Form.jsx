import { useContext, useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { FormControl, Stepper, Step, StepLabel } from '@mui/material';
import { message } from 'antd';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { getFormStepsEt } from './options/StudentFormOption';
import { getFormStepsPr } from './options/teacherFormOption';
import { FieldComponents } from './options/FieldComponentsOption';
import { MainContext } from '../contexts/MainContext';
import { generateCityOptions, getDefaultState } from './options/FormOption';
import { usePostData, useUpdateData } from '../../../api/queryHooks';

const MultiStepForm = ({ matricule = null, row = null, setButtons }) => {
  const { TableName } = useContext(MainContext);
  const ImgPathUploads = `/uploads/${TableName}`;
  const { t: Traduction } = useTranslation();

  const steps =
    TableName === 'etudiants'
      ? getFormStepsEt(Traduction)
      : getFormStepsPr(Traduction);

  const [activeStep, setActiveStep] = useState(0);
  const defaultState = getDefaultState()[TableName.toUpperCase()];
  const stateInit = {
    ...defaultState,
    ...(row
      ? Object.entries(row).reduce((acc, [key, value]) => {
          const newKey = key
            .replace(/(ET|PR)$/i, '_1')
            .replace(/(TR)$/i, '_2');
          if (newKey in defaultState) {
            acc[newKey] = (value === "null" || !value) ? '' : value;
          }
          return acc;
        }, {})
      : {}),
  };

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    register,
    getValues,
    setError,
    watch,
  } = useForm({
    mode: 'all',
    defaultValues: stateInit || {},
    delayError: true,
  });
  const [cityOptions, setCityOptions] = useState([]);
  const currentCountry = watch('PAYS_1');

  useEffect(() => {
    if (['etudiants', 'professeurs'].includes(TableName) && currentCountry) {
      (async () => {
        const options = await generateCityOptions(currentCountry);
        setCityOptions(options);
      })();
    }
  }, [TableName, currentCountry]);

  useEffect(() => {
    if (cityOptions.length > 0) {
      const currentVille = getValues('VILLE_1');
      const isValid = cityOptions.some(option => option.value === currentVille);
      if (!isValid) {
        setValue('VILLE_1', cityOptions[0].value, { shouldValidate: true });
      }
    }
  }, [cityOptions, getValues, setValue]);

  const isFieldValid = (fieldConfig, value) => {
    if (!fieldConfig?.validation) return true;
    const { required, minLength, maxLength, pattern, validate } = fieldConfig.validation;
    const label = fieldConfig.props.label.replace(':', ' ');
    if (required && !value) {
      setError(`${fieldConfig.label}_${activeStep + 1}`, { message: `${label} is required` });
      return false;
    }
    if (minLength && value?.length < minLength.value) {
      setError(`${fieldConfig.label}_${activeStep + 1}`, {
        message: `${label} must be at least ${minLength.value} characters`,
      });
      return false;
    }
    if (maxLength && value?.length > maxLength.value) {
      setError(`${fieldConfig.label}_${activeStep + 1}`, {
        message: `${label} must be at most ${maxLength.value} characters`,
      });
      return false;
    }
    if (pattern && !pattern.value.test(value)) {
      setError(`${fieldConfig.label}_${activeStep + 1}`, {
        message: `${label} is not in the correct format`,
      });
      return false;
    }
    if (validate && !validate(value, getValues())) {
      setError(`${fieldConfig.label}_${activeStep + 1}`, { message: `${label} is not valid` });
      return false;
    }
    return true;
  };

  const onNext = useCallback(async () => {
    const currentStep = steps[activeStep];
    const currentFields = currentStep.Fields;
    const fieldLabels = currentFields.map(field => `${field.label}_${activeStep + 1}`);
    const triggeredValid = await trigger(fieldLabels);
    const hasFieldErrors = fieldLabels.some(label => errors[label]);
    const allFieldsValid = currentFields.map(field => {
      const value = getValues(`${field.label}_${activeStep + 1}`);
      return isFieldValid(field, value);
    });

    if (triggeredValid && !hasFieldErrors && allFieldsValid.every(isValid => isValid)) {
      setActiveStep(prev => prev + 1);
    } else {
      message.error('Validation failed. Please correct the errors before proceeding.');
    }
  }, [activeStep, steps, trigger, errors, getValues]);

  const onPrev = useCallback(() => {
    setActiveStep(prev => prev - 1);
  }, []);

  const handleChange = useCallback(
    async (event, label) => {
      let value;
      if (event.target) {
        value = event.target.value;
      } else if (event instanceof Date || event?.toISOString) {
        value = event.toISOString();
      } else {
        value = event;
      }
      if (label === 'PAYS_1') {
        const options = await generateCityOptions(value);
        setCityOptions(options);
        if (options && options.length > 0) {
          setValue('VILLE_1', options[0].value, { shouldValidate: true });
        }
      }
      setValue(label, value, { shouldValidate: true });
    },
    [setValue]
  );

  const handlePostData = usePostData(TableName);
  const handleUpdateData = useUpdateData(TableName);

  const onSubmit = async data => {
    const currentStep = steps[activeStep];
    const currentFields = currentStep.Fields;
    const fieldLabels = currentFields.map(field => `${field.label}_${activeStep + 1}`);
    const triggeredValid = await trigger(fieldLabels);
    const hasFieldErrors = fieldLabels.some(label => errors[label]);
    const allFieldsValid = currentFields.map(field => {
      const value = getValues(`${field.label}_${activeStep + 1}`);
      return isFieldValid(field, value);
    });
    if (!triggeredValid || hasFieldErrors || !allFieldsValid.every(isValid => isValid)) {
      return;
    }

    try {
      await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', { withCredentials: true });
      const mapping = {
        etudiants: ['Et', 'Tr'],
        professeurs: ['Pr'],
      };
      const processedData = { ...data };
      steps.forEach((step) => {
        step.Fields.forEach((field) => {
          if (field.type === 'TEXT_SELECT') {
            const otherKey = `${field.label}_other`;
            if (processedData[otherKey]) {
              // Replace field.label with the custom value from field.label_other
              processedData[field.label] = processedData[otherKey];
              delete processedData[otherKey]; // Remove the _other key
            }
          }
        });
      });
      const newData = Object.entries(processedData).reduce((acc, [key, value]) => {
        const match = key.match(/_(\d+)$/);
        const index = match ? parseInt(match[1], 10) - 1 : 0;
        const cleanKey = key.replace(/(_\d+)$/, '');
        const suffix = mapping[TableName][index];
        acc[`${cleanKey}${suffix}`] = String(value);
        return acc;
      }, {});

      if (!matricule) {
        await handlePostData.mutate(newData);
      } else {
        await handleUpdateData.mutate({ id: matricule, data: newData });
      }
      message.success('Data submitted successfully!');
    } catch (error) {
      message.error('Submission failed: ' + error.message);
    }
  };

  useEffect(() => {
    if (setButtons) {
      setButtons({
        currentStep: activeStep,
        totalSteps: steps.length,
        nextStep: onNext,
        prevStep: onPrev,
        submitForm: handleSubmit(onSubmit),
      });
    }
  }, [activeStep, steps.length, onNext, onPrev, handleSubmit, onSubmit, setButtons]);

  return (
    <form className="p-4">
      <Stepper activeStep={activeStep} alternativeLabel style={{ marginBottom: '20px' }}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>{step.title}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div className="flex flex-wrap gap-4">
        {steps[activeStep].Fields.map((fieldItem, index) => {
          const FieldComponent = FieldComponents[fieldItem.type];
          const fieldName = `${fieldItem.label}_${activeStep + 1}`;
          return (
            <FormControl
              key={index}
              className="mb-4"
              style={{ width: fieldItem.type !== 'TEXTAREA' ? '430px' : '100%' }}
            >
              <FieldComponent
                fieldItem={{
                  ...fieldItem,
                  label: fieldName,
                  value: getValues(fieldName) ?? '',
                  props: {
                    ...fieldItem.props,
                    options:
                      fieldItem.label === 'VILLE'
                        ? cityOptions
                        : fieldItem.props.options,
                  },
                }}
                register={register}
                handleChange={handleChange}
                errors={errors}
                ImgPathUploads={ImgPathUploads}
                tableName={TableName}
                matricule={matricule}
                setValue={setValue}
              />
              {errors[fieldName] && (
                <p className="text-red-600 text-[13px] pl-3">
                  {errors[fieldName]?.message}
                </p>
              )}
            </FormControl>
          );
        })}
      </div>
    </form>
  );
};

export default MultiStepForm;