// TEXT.jsx
import { TextField } from '@mui/material';

export default function TEXT({ register, fieldItem, handleChange, errors, isFilter = false }) {
  if (isFilter) {
    return (
      <TextField
        onChange={(e) => handleChange(e)}
        type={fieldItem.props?.type || 'text'}
        label={fieldItem.props.label}
        placeholder={fieldItem.props.placeholder}
        fullWidth
      />
    );
  }

  return (
    <TextField
      {...register(fieldItem.label, fieldItem.validation)}
      type={fieldItem.props?.propsType || 'text'}
      onChange={(e) => handleChange(e, fieldItem.label)}
      label={fieldItem.props.label}
      placeholder={fieldItem.props.placeholder}
      fullWidth
      error={Boolean(errors[fieldItem.label])}
    />
  );
}