import { Fragment, useMemo, useState, useEffect } from 'react';
import { Select, MenuItem, InputLabel, TextField, Box, FormControl } from '@mui/material'
import { useTheme } from '@mui/material/styles';

export default function SELECT ({ register, fieldItem, handleChange, errors, isFilter = false }) {
    const theme = useTheme();
    const [showOther, setShowOther] = useState(false);
    const [otherValue, setOtherValue] = useState('');
    const options = useMemo(() => {
        const baseOptions = fieldItem.props.options || [];
        if (fieldItem.props.allowOther) {
            return [...baseOptions, { value: 'autre', label: 'Autre' }];
        }
        return baseOptions;
    }, [fieldItem.props.options, fieldItem.props.allowOther]);
    const isValidValue = options.some(option => option.value === fieldItem.value);
    const currentValue = isValidValue ? fieldItem.value : '';
    
    useEffect(() => {
        setShowOther(currentValue === 'autre');
        if (currentValue !== 'autre') {
            setOtherValue('');
        }
    }, [currentValue]);

    const handleSelectChange = (e, fieldName) => {
        const value = e.target.value;
        if (value === 'autre') {
            setShowOther(true);
            handleChange({ target: { value: otherValue || '' } }, fieldName);
        } else {
            setShowOther(false);
            handleChange(e, fieldName);
        }
    };

    const handleOtherChange = (e, fieldName) => {
        const value = e.target.value;
        setOtherValue(value);
        handleChange({ target: { value } }, fieldName);
    };

    if (isFilter) {
        return (
            <Fragment>
                <FormControl fullWidth>
                    <InputLabel htmlFor={`filter-${fieldItem.label}`}>{fieldItem.props.label}</InputLabel>
                    <Select
                        id={`filter-${fieldItem.label}`}
                        onChange={(e) => handleSelectChange(e)}
                        label={fieldItem.props.label}
                        fullWidth
                        value={showOther ? 'autre' : currentValue}
                        sx={{
                            color: theme.palette.mode === 'dark' ? '#fff' : 'inherit',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.87)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.mode === 'dark' ? '#fff' : theme.palette.primary.main,
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
                {showOther && (
                    <Box mt={1}>
                        <FormControl fullWidth>
                            <TextField
                                value={otherValue}
                                onChange={(e) => handleOtherChange(e)}
                                placeholder="Spécifier autre..."
                                fullWidth
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: theme.palette.mode === 'dark' ? '#fff' : 'inherit',
                                        '& fieldset': {
                                            borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.87)',
                                        },
                                    }
                                }}
                            />
                        </FormControl>
                    </Box>
                )}
            </Fragment>
        );
    }
    
    return (
        <Fragment>
            <FormControl fullWidth error={!!errors[fieldItem.label]}>
                <InputLabel id={`${fieldItem.label}-label`}>{fieldItem.props.label}</InputLabel>
                <Select
                    {...register(fieldItem.label, fieldItem.validation)}
                    labelId={`${fieldItem.label}-label`}
                    id={fieldItem.label}
                    onChange={(e) => handleSelectChange(e, fieldItem.label)}
                    label={fieldItem.props.label}
                    fullWidth
                    value={currentValue}
                >
                    {options.map((option, index) => (
                        <MenuItem key={`${option.value}-${index}`} value={option.value}>
                            {fieldItem.props.isComponent ? option.label() : option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {showOther && (
                <TextField
                    {...register(`${fieldItem.label}_other`, fieldItem.validation)}
                    value={otherValue}
                    onChange={(e) => handleOtherChange(e, fieldItem.label)}
                    placeholder="Spécifier autre..."
                    fullWidth
                    error={!!errors[`${fieldItem.label}_other`]}
                    sx={{
                        mt: 1,
                        '& .MuiOutlinedInput-root': {
                            color: theme.palette.mode === 'dark' ? '#fff' : 'inherit',
                            '& fieldset': {
                                borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                            },
                            '&:hover fieldset': {
                                borderColor: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.87)',
                            },
                        }
                    }}
                />
            )}
        </Fragment>
    );
}