import React, { useMemo, useState } from 'react';
import { TextField, Typography, Pagination, Box, Autocomplete, List } from '@mui/material';

export default function AUTO_COMPLETE_SELECT ({
    register,
    fieldItem,
    handleChange,
    errors,
    pageSize = 50,
  }) {
    // Get options (e.g. using generateCountryOptions) from fieldItem.props.options
    const options = useMemo(
      () => fieldItem.props.options || [],
      [fieldItem.props.options]
    );
    const [inputValue, setInputValue] = useState('');
    const [page, setPage] = useState(1);
  
    // Filter options based on inputValue
    // If the option has a flag (i.e. a searchText value), we filter by that.
    const filteredOptions = useMemo(() => {
      const searchTerm = inputValue.toLowerCase();
      return options.filter((option) => {
        // Use searchText if available, otherwise (if label is a string) fallback to label.
        const searchable = option.searchText
          ? String(option.searchText).toLowerCase()
          : (typeof option.label === 'string' ? option.label.toLowerCase() : '');
        return searchable.includes(searchTerm);
      });
    }, [options, inputValue]);
  
    // Pagination for filtered options
    const paginatedOptions = useMemo(() => {
      const startIndex = (page - 1) * pageSize;
      return filteredOptions.slice(startIndex, startIndex + pageSize);
    }, [filteredOptions, page, pageSize]);
  
    // getOptionLabel is used by Autocomplete to know what to display in the input
    // Here, we return the searchText (if available) or fallback to a string.
    const getOptionLabel = (option) => {
      if (!option) return '';
      return option.searchText || (typeof option.label === 'string' ? option.label : '');
    };
  
    // Custom listbox to include pagination if there are many options.
    const CustomListboxComponent = React.forwardRef((props, ref) => (
      <div ref={ref}>
        <List {...props} />
        {filteredOptions.length > pageSize && (
          <Pagination
            count={Math.ceil(filteredOptions.length / pageSize)}
            page={page}
            onChange={(_, p) => setPage(p)}
            size="small"
            sx={{ px: 2, py: 1 }}
          />
        )}
      </div>
    ));
  
    return (
      <Box sx={{ width: '100%', position: 'relative' }}>
        <Autocomplete
          options={paginatedOptions}
          inputValue={inputValue}
          onInputChange={(_, newValue) => {
            setInputValue(newValue);
            setPage(1); // Reset pagination when search changes.
          }}
          onChange={(_, newValue) =>
            handleChange(
              { target: { value: newValue?.value || '' } },
              fieldItem.label
            )
          }
          // Set current value based on fieldItem.value
          value={options.find((opt) => opt.value === fieldItem.value) || null}
          getOptionLabel={getOptionLabel}
          isOptionEqualToValue={(option, value) => option.value === value?.value}
          renderInput={(params) => {
            // Determine the selected option
            const selectedOption = options.find(
              (opt) => opt.value === fieldItem.value
            );
            return (
              <TextField
                {...params}
                label={fieldItem.props.label}
                error={!!errors[fieldItem.label]}
                InputProps={{
                  ...params.InputProps,
                  // When an option is selected, show its flag and country name.
                  startAdornment: selectedOption ? (
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      {selectedOption.searchText && (
                        <img
                          src={`/country-flag-icons-3x2/${selectedOption.value}.svg`}
                          alt={selectedOption.searchText}
                          style={{
                            width: '20px',
                            height: '15px',
                            borderRadius: '2px',
                            marginRight: '8px',
                          }}
                        />
                      )}
                    </span>
                  ) : null,
                  endAdornment: (
                    <>
                      {params.InputProps.endAdornment}
                      <Typography variant="caption" sx={{ mr: 2 }}>
                        {`${Math.min(page * pageSize, filteredOptions.length)}/${filteredOptions.length}`}
                      </Typography>
                    </>
                  ),
                }}
              />
            );
          }}
          renderOption={(props, option, index) => (
            <li {...props} key={`${option.value}-${index}`}>
              {option.label}
            </li>
          )}
  
          ListboxComponent={CustomListboxComponent}
          fullWidth
          disablePortal
          blurOnSelect
          clearOnBlur={false}
        />
  
        {/* Hidden input field for form registration */}
        <input
          type="hidden"
          {...register(fieldItem.label, fieldItem.validation)}
          value={fieldItem.value || ''}
        />
      </Box>
    );
  }