import { TextField } from '@mui/material';

export default function TEXT ({ register, fieldItem, handleChange, errors }) {
    return (
        <TextField
          {...register(fieldItem.label, fieldItem.validation)}
          onChange={(e) => handleChange(e, fieldItem.label)}
          label={fieldItem.props.label}
          placeholder={fieldItem.props.placeholder}
          fullWidth
          error={Boolean(errors[fieldItem.label])}
          value={fieldItem.value ?? ''} // Ensure value is never undefined
        />
    );
}