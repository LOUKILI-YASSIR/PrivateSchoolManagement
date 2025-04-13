import { Fragment, useMemo } from 'react';
import { Select, MenuItem, InputLabel, Chip, Box, FormControl } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function MultiSelectField({ register, fieldItem, handleChange, errors, isFilter = false }) {
    const theme = useTheme();
    const options = useMemo(() => fieldItem.props.options, [fieldItem.props.options]);
    const currentValue = Array.isArray(fieldItem.value) ? fieldItem.value : [];

    const renderValue = (selected) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => {
                const option = options.find(opt => opt.value === value);
                return (
                    <Chip 
                        key={value} 
                        label={option ? (fieldItem.props.isComponent ? option.label() : option.label) : value}
                        sx={{
                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                            color: theme.palette.mode === 'dark' ? '#fff' : 'inherit'
                        }}
                    />
                );
            })}
        </Box>
    );

    if (isFilter) {
        return (
            <FormControl fullWidth>
                <InputLabel>{fieldItem.props.label}</InputLabel>
                <Select
                    multiple
                    onChange={(e) => handleChange(e)}
                    label={fieldItem.props.label}
                    fullWidth
                    value={currentValue}
                    renderValue={renderValue}
                    sx={{
                        '& .MuiSelect-select': {
                            minHeight: '32px'
                        }
                    }}
                >
                    {options.map((option, index) => (
                        <MenuItem key={`${option.value}-${index}`} value={option.value}>
                            {fieldItem.props.isComponent ? option.label() : option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }

    return (
        <FormControl fullWidth error={!!errors[fieldItem.label]}>
            <InputLabel>{fieldItem.props.label}</InputLabel>
            <Select
                {...register(fieldItem.label, fieldItem.validation)}
                multiple
                onChange={(e) => handleChange(e, fieldItem.label)}
                label={fieldItem.props.label}
                fullWidth
                value={currentValue}
                renderValue={renderValue}
                sx={{
                    '& .MuiSelect-select': {
                        minHeight: '32px'
                    }
                }}
            >
                {options.map((option, index) => (
                    <MenuItem key={`${option.value}-${index}`} value={option.value}>
                        {fieldItem.props.isComponent ? option.label() : option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
