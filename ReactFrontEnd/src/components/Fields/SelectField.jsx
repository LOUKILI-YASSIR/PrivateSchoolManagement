import { Fragment, useMemo } from 'react';
import { Select, MenuItem, InputLabel } from '@mui/material'

export default function SELECT ({ register, fieldItem, handleChange, errors }) {
    const options = useMemo(() => fieldItem.props.options, [fieldItem.props.options]);
    const isValidValue = options.some(option => option.value === fieldItem.value);
    const currentValue = isValidValue ? fieldItem.value : '';
    
    return (
      <Fragment>
        <InputLabel>{fieldItem.props.label}</InputLabel>
        <Select
          {...register(fieldItem.label, fieldItem.validation)}
          onChange={(e) => handleChange(e, fieldItem.label)}
          label={fieldItem.props.label}
          fullWidth
          error={!!errors[fieldItem.label]}
          value={currentValue}
        >
          {options.map((option, index) => (
            <MenuItem key={`${option.value}-${index}`} value={option.value}>
              {fieldItem.props.isComponent ? option.label() : option.label}
            </MenuItem>
          ))}
        </Select>
      </Fragment>
    );
}