import { Fragment, useMemo, useState, useEffect } from 'react';
import { 
    Select, 
    MenuItem, 
    InputLabel, 
    Chip, 
    Box, 
    FormControl, 
    TextField, 
    InputAdornment, 
    IconButton, 
    Tooltip, 
    Paper, 
    RadioGroup, 
    FormControlLabel, 
    Radio, 
    ListSubheader,
    Checkbox,
    ListItemText,
    Collapse,
    Button,
    Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
    faSearch, 
    faTimes, 
    faFilter, 
    faChevronDown, 
    faChevronRight,
    faColumns,
    faStar
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function MultiSelectField({ register, fieldItem, handleChange, errors, isFilter = false }) {
    const theme = useTheme();
    const [currentValue,SetCurrentValue] = useState(
        Array.isArray(fieldItem.props.value) 
            ? fieldItem.props.value 
            : []
    )
    const options = useMemo(() => fieldItem.props.options, [fieldItem.props.options]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const [filterMode, setFilterMode] = useState('all');
    const [expandedObjects, setExpandedObjects] = useState({});

    const filterOptions = [
        { value: 'all', label: 'All Columns' },
        { value: 'optional', label: 'Optional Fields' }
    ];

    const handleSearchQueryChange = (e) => {
        e.stopPropagation();
        setSearchQuery(e.target.value);
    };

    const clearSearchQuery = () => {
        setSearchQuery('');
    };

    const handleFilterModeChange = (mode) => {
        setFilterMode(mode);
    };

    const toggleObjectExpanded = (key) => {
        setExpandedObjects(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const getFilteredOptions = () => {
        let filtered = options;
        
        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(option => 
                option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                option.value.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply filter mode
        switch (filterMode) {
            case 'optional':
                filtered = filtered.filter(option => !option.required);
                break;
            default:
                break;
        }

        return filtered;
    };

    const handleSelectAllToggle = () => {
        const filteredOptions = getFilteredOptions();
        const allSelected = filteredOptions.every(option => currentValue.includes(option.value));
        
        if (allSelected) {
            // Unselect all filtered options
            const newValue = currentValue.filter(value => 
                !filteredOptions.some(option => option.value === value)
            );
            SetCurrentValue(newValue);
            handleChange({ target: { value: newValue } }, fieldItem.label);
        } else {
            // Select all filtered options
            const newValue = [
                ...currentValue,
                ...filteredOptions
                    .filter(option => !currentValue.includes(option.value))
                    .map(option => option.value)
            ];
            SetCurrentValue(newValue);
            handleChange({ target: { value: newValue } }, fieldItem.label);
        }
    };
useEffect(() => {
    // Synchronize when external value changes
    if (Array.isArray(fieldItem.props.value)) {
        SetCurrentValue(fieldItem.props.value);
    }
}, [fieldItem.props.value]);
    const renderValue = (selected) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => {
                const option = options.find(opt => opt.value === value);
                return (
                    <Chip 
                        key={value} 
                        label={option ? (fieldItem.props.isComponent ? option.label() : option.label) : value}
                        color="primary"
                        variant={theme.palette.mode === 'dark' ? "filled" : "outlined"}
                        onDelete={() => {
                            const newValue = currentValue.filter(v => v !== value);
                            handleChange({ target: { value: newValue } }, fieldItem.label);
                        }}
                    />
                );
            })}
        </Box>
    );

    const renderSelectContent = () => (
        <>
            {/* Search and filter bar */}
            <Box sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1, p: 1, borderBottom: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search columns..."
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                        size="small"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FontAwesomeIcon icon={faSearch} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    {searchQuery && (
                                        <IconButton 
                                            size="small" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                clearSearchQuery();
                                            }}
                                            edge="end"
                                        >
                                            <FontAwesomeIcon icon={faTimes} />
                                        </IconButton>
                                    )}
                                    <Tooltip title="Filter options">
                                        <IconButton 
                                            size="small" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowFilterOptions(!showFilterOptions);
                                            }}
                                            edge="end"
                                            color={showFilterOptions ? "primary" : "default"}
                                        >
                                            <FontAwesomeIcon icon={faFilter} />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            )
                        }}
                    />
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSelectAllToggle();
                        }}
                    >
                        {getFilteredOptions().every(option => currentValue.includes(option.value)) 
                            ? 'Unselect All' 
                            : 'Select All'}
                    </Button>
                </Box>
                
                {/* Filter options dropdown */}
                {showFilterOptions && (
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            position: 'absolute', 
                            top: '100%', 
                            right: 0, 
                            zIndex: 1000,
                            width: '250px',
                            mt: 1,
                            p: 1
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                            Filter Mode
                        </Typography>
                        <RadioGroup value={filterMode}>
                            {filterOptions.map(option => (
                                <FormControlLabel
                                    key={option.value}
                                    value={option.value}
                                    control={<Radio size="small" />}
                                    label={option.label}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleFilterModeChange(option.value);
                                    }}
                                    sx={{ my: 0.5 }}
                                />
                            ))}
                        </RadioGroup>
                    </Paper>
                )}
            </Box>

            {/* Options list */}
            {getFilteredOptions().map((option, index) => {
                const isSelected = currentValue.includes(option.value);
                return (
                    <MenuItem 
                        key={`${option.value}-${index}`} 
                        value={option.value}
                        sx={{
                            fontWeight: isSelected ? 'bold' : 'normal',
                            backgroundColor: isSelected ? 
                                (theme.palette.mode === 'dark' ? 'rgba(66, 153, 225, 0.08)' : 'rgba(42, 33, 133, 0.04)') : 
                                'transparent',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                            <Checkbox 
                                checked={isSelected}
                                color="primary"
                                disableRipple
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const newValue = isSelected
                                        ? currentValue.filter(v => v !== option.value)
                                        : [...currentValue, option.value];
                                    SetCurrentValue(newValue); // <-- مهم لتحديث الواجهة
                                    handleChange({ target: { value: newValue } }, fieldItem.label);
                                }}
                            />
                            <ListItemText 
                                primary={option.label}
                                secondary={option.value}
                                primaryTypographyProps={{
                                    style: { fontWeight: isSelected ? 'bold' : 'normal' }
                                }}
                                secondaryTypographyProps={{
                                    variant: 'caption'
                                }}
                            />
                        </Box>
                    </MenuItem>
                );
            })}
        </>
    );

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
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 400
                        }
                    }
                }}
            >
                {renderSelectContent()}
            </Select>
        </FormControl>
    );
}