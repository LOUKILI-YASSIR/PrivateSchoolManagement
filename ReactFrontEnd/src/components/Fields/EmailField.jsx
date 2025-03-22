import { TextField } from '@mui/material';

export default function EMAIL ({ register, fieldItem, handleChange, errors }) {
    return (    
        <TextField
          {...register(fieldItem.label, fieldItem.validation)}
          onChange={(e) => handleChange(e, fieldItem.label)}
          label={fieldItem.props.label}
          placeholder={fieldItem.props.placeholder}
          type="email"
          value={fieldItem.value ?? ''} // Fix default value
          fullWidth
          error={!!errors[fieldItem.label]}
        />
    )
}