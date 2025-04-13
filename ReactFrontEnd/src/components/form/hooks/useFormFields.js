import { useCallback, useEffect } from 'react';
import { useFormContext } from '../context/FormContext';
import { generateCityOptions } from '../utils/countryUtils';

export const useFormFields = () => {
  const {
    formMethods: { setValue, watch, getValues },
    cityOptions,
    setCityOptions,
    TableName,
  } = useFormContext();

  const currentCountry = watch('PAYS_1');

  useEffect(() => {
    if (['etudiants', 'professeurs'].includes(TableName) && currentCountry) {
      (async () => {
        const options = await generateCityOptions(currentCountry);
        setCityOptions(options);
      })();
    }
  }, [TableName, currentCountry, setCityOptions]);

  useEffect(() => {
    if (cityOptions.length > 0) {
      const currentVille = getValues('VILLE_1');
      const isValid = cityOptions.some(option => option.value === currentVille);
      if (!isValid) {
        setValue('VILLE_1', cityOptions[0].value, { shouldValidate: true });
      }
    }
  }, [cityOptions, getValues, setValue]);

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
    [setValue, setCityOptions]
  );

  return {
    handleChange,
    cityOptions,
  };
};
