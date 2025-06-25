// TEXT.jsx
import { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function TEXT({ register, fieldItem, handleChange, errors, isFilter = false }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = fieldItem.props?.propsType === 'password';

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

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
      type={isPassword && !showPassword ? 'password' : 'text'}
      onChange={(e) => handleChange(e, fieldItem.label)}
      label={fieldItem.props.label}
      placeholder={fieldItem.props.placeholder}
      fullWidth
      error={Boolean(errors[fieldItem.label])}
      InputProps={
        isPassword
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }
          : undefined
      }
    />
  );
}
