import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/en';
import 'dayjs/locale/fr';
import 'dayjs/locale/de';
import 'dayjs/locale/es';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTranslation } from 'react-i18next';

dayjs.extend(localizedFormat);

export default function DATE({ register, fieldItem, handleChange, errors, isFilter = false }) {
  const { i18n } = useTranslation();

  // Set Day.js locale dynamically based on i18n language
  dayjs.locale(i18n.language);

  const handleDateChange = (date) => {
    if (!date || !date.isValid()) {
      handleChange({ target: { value: null } }, fieldItem.label);
      return;
    }

    try {
      const formattedDate = date.format('YYYY-MM-DD');
      handleChange({ target: { value: formattedDate } }, fieldItem.label);
    } catch (error) {
      console.error('Invalid date:', error);
      handleChange({ target: { value: null } }, fieldItem.label);
    }
  };

  // Convert fieldItem.value (string) to a Day.js object if it exists
  const parsedValue = fieldItem.value ? dayjs(fieldItem.value) : null;

  if (isFilter) {
    return (
      <DatePicker
        onChange={handleDateChange}
        label={fieldItem.props.label}
        format="DD/MM/YYYY"
        slotProps={{
          textField: {
            fullWidth: true,
          },
        }}
      />
    );
  }

  const { ref, ...rest } = register(fieldItem.label, fieldItem.validation);

  return (
    <DatePicker
      {...rest}
      value={parsedValue} // Use the parsed Day.js object
      inputRef={ref}
      onChange={handleDateChange}
      label={fieldItem.props.label}
      format="DD/MM/YYYY"
      slotProps={{
        textField: {
          fullWidth: true,
        },
      }}
    />
  );
}