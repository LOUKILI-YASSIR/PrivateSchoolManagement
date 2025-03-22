import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export default function DATE ({ register, fieldItem, handleChange, errors }) {
    const { ref, ...rest } = register(fieldItem.label, fieldItem.validation);

    return (
        <DatePicker
          {...rest}
          inputRef={ref}
          value={fieldItem.value ? dayjs(fieldItem.value) : null} // Ensuring value is valid
          onChange={(date) => {
            const event = { target: { value: date?.toISOString() || null } };
            handleChange(event, fieldItem.label);
          }}
          label={fieldItem.props.label}
          inputFormat="MM/dd/yyyy"
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!errors[fieldItem.label],
            },
          }}
        />
    );
  }