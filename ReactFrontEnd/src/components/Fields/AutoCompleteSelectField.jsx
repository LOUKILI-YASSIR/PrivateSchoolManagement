import React, { useMemo, useState } from 'react';
import Select from 'react-select';
import { FixedSizeList as List } from 'react-window';
import { TextField, Typography, Box, Autocomplete } from '@mui/material';

// توليد 15,000 خيار تجريبي
const options = Array.from({ length: 15000 }, (_, i) => ({
  value: i,
  label: `Option ${i + 1}`,
}));

// كومبوننت لتحسين الأداء باستخدام Virtualized List
const MenuList = (props) => {
  const { options, children, maxHeight } = props;
  const height = 35; // ارتفاع كل عنصر

  return (
    <List height={maxHeight} itemCount={options.length} itemSize={height} width="100%">
      {({ index, style }) => (
        <div style={style} key={options[index].value}>
          {children[index]}
        </div>
      )}
    </List>
  );
};

export default function AUTO_COMPLETE_SELECT({
  register,
  fieldItem,
  handleChange,
  errors,
  isFilter = false,
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [inputValue, setInputValue] = useState('');

  // فلترة الخيارات بناءً على البحث
  const filteredOptions = useMemo(() => {
    const searchTerm = inputValue.toLowerCase();
    return options.filter((option) => option.label.toLowerCase().includes(searchTerm));
  }, [inputValue]);

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <Autocomplete
        options={filteredOptions}
        inputValue={inputValue}
        onInputChange={(_, newValue) => setInputValue(newValue)}
        onChange={(_, newValue) => handleChange({ target: { value: newValue?.value || '' } })}
        value={selectedOption}
        renderInput={(params) => (
          <TextField
            {...params}
            label={fieldItem.props.label}
            error={!isFilter && !!errors[fieldItem.label]}
          />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.value}>
            {option.label}
          </li>
        )}
        components={{ MenuList }}
        fullWidth
        disablePortal
        blurOnSelect
        clearOnBlur={false}
      />
      <input type="hidden" {...register(fieldItem.label, fieldItem.validation)} value={selectedOption?.value || ''} />
    </Box>
  );
}