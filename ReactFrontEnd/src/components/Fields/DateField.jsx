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
    console.log(fieldItem.props.value);
    if (isFilter) {
      return (
        <DatePicker 
          onChange={(date) => {
            const event = { target: { value: date?.toISOString() || null } };
            handleChange(event);
          }}
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
        inputRef={ref}
        onChange={(date) => {
          const event = { target: { value: date?.toISOString() || null } };
          handleChange(event, fieldItem.label);
        }}
        label={fieldItem.props.label}
        format="DD/MM/YYYY"
        slotProps={{
          textField: {
            fullWidth: true,
            error: !!errors[fieldItem.label],
            helperText: errors[fieldItem.label]?.message,
          },
        }}
      />
    );
  }
  