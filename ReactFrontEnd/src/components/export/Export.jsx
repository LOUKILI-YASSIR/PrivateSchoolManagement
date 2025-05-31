import React from "react";
import { 
    Select, Box, InputLabel, OutlinedInput, FormControl,
    Typography, MenuItem, Chip, Divider, RadioGroup,
    FormControlLabel, Radio, Paper, Stack, Card, CardContent, Snackbar, Alert,
    Grid, Checkbox, FormGroup, FormHelperText, TextField, Tabs, Tab, Button, ListSubheader, ListItemText,
    InputAdornment, IconButton, Tooltip, Collapse
} from "@mui/material";
import { SetExportInfo, UseExport } from "./hooks/useExport";
import { ExportOptions } from "./options/ExportOption";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faFilePdf, 
    faFileExcel, 
    faFileAlt,
    faCheckCircle,
    faColumns,
    faNoteSticky,
    faFileExport,
    faStar,
    faSearch,
    faFilter,
    faTimes,
    faChevronDown,
    faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useContext } from "react";
import { MainContext } from "../../utils/contexts/MainContext";
import { UpdateSelectedColumns, UpdateExportNotes, UpdateSelectedSubProperties } from "../../store/slices/ExportSlice";
import { useTranslation } from "react-i18next";
import './Export.module.css';
import { useColumns } from '../table/hooks/useColumn';
import { etudiantsColumns, etudiantsSelectedColumns } from '../table/hooks/columns/etudiantsColumns';
import { professeursColumns, professeursSelectedColumns } from '../table/hooks/columns/professeursColumns';
import { groupColumns, groupSelectedColumns } from '../table/hooks/columns/groupColumns';
import { AcademicYearsColumns, academicYearsSelectedColumns } from '../table/hooks/columns/AcademicYearsColumns';
import { sallesColumns, sallesSelectedColumns } from '../table/hooks/columns/sallesColumns';
import { matiereColumns, matiereSelectedColumns } from '../table/hooks/columns/matiereColumns';
import { evaluationsColumns, evaluationsSelectedColumns } from '../table/hooks/columns/evaluationsColumns';
import { niveauxColumns, niveauxSelectedColumns } from '../table/hooks/columns/niveauxColumns';

// Categorize columns by their type
const categorizeColumns = (columns) => {
    const categories = {
        student: [],
        parent: [],
        group: [],
        attendance: [],
        grades: [],
        status: [],
        info: []
    };

    columns.forEach(column => {
        const key = column.key || column;
        
        // Student/Professor columns (user.* and basic fields)
        if (key.startsWith('user.') || 
            ['MatriculeET', 'EmailET', 'PhoneET', 'Phone1PR', 'Phone2PR', 'EmailPR'].includes(key)) {
            categories.student.push(column);
        }
        // Parent/Tutor columns
        else if (key.includes('TR') || key.includes('Tuteur')) {
            categories.parent.push(column);
        }
        // Group & Niveau columns
        else if (key.includes('GP') || key.includes('NV') || 
                key === 'groupName' || key === 'niveauName' || 
                key === 'niveauMatricule') {
            categories.group.push(column);
        }
        // Attendance columns
        else if (key.includes('AT') || key.includes('attendance') || 
                key === 'attendanceStats') {
            categories.attendance.push(column);
        }
        // Grade columns
        else if (key.includes('NT') || key.includes('NF') || 
                key.includes('grade') || key.includes('Grade') || 
                key === 'gradeStats.average' || key.includes('ranking') || 
                key.includes('notes') || key.includes('evaluation')) {
            categories.grades.push(column);
        }
        // Status columns
        else if (key.includes('Statut') || key === 'created_at' || key === 'updated_at') {
            categories.status.push(column);
        }
        // Default to info category if no match
        else {
            categories.info.push(column);
        }
    });

    // Remove empty categories
    Object.keys(categories).forEach(key => {
        if (categories[key].length === 0) {
            delete categories[key];
        }
    });

    return categories;
};

// Check if a value is an object with properties (not null, not array, not Date)
const isComplexObject = (value) => {
    return value !== null && 
           typeof value === 'object' && 
           !Array.isArray(value) && 
           !(value instanceof Date);
};

// Extract sub-properties from an object value
const extractObjectProperties = (obj) => {
    if (!isComplexObject(obj)) return [];
    
    return Object.keys(obj).map(key => ({
        key: key,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: obj[key]
    }));
};

const formatPreviewOptions = {
    pdf: {
        icon: faFilePdf,
        color: '#e74c3c',
        previewImage: '/previews/pdf_preview.png'
    },
    excel: {
        icon: faFileExcel,
        color: '#27ae60',
        previewImage: '/previews/excel_preview.png'
    },
    csv: {
        icon: faFileAlt,
        color: '#3498db',
        previewImage: '/previews/csv_preview.png'
    }
};

export default function Export() {
    const { tableData, IndexExportType, fileExtension, SelectFileExtention, SelectIndexExportType } = SetExportInfo();
    const { showSuccess, setShowSuccess, ClickToExport } = UseExport();
    const { ExportSelectText, AllFilesExtantions, ExportTypeText, OptionsExportFile } = ExportOptions();
    const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);
    const dispatch = useDispatch();
    const { data, TableName } = useContext(MainContext);
    const { t } = useTranslation();
    const { columns } = useColumns();
    
    const [selectedFormat, setSelectedFormat] = useState(fileExtension);
    const [selectedType, setSelectedType] = useState(IndexExportType);
    const [availableColumns, setAvailableColumns] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [columnSelectError, setColumnSelectError] = useState("");
    const [exportNotes, setExportNotes] = useState("");
    const [selectedTab, setSelectedTab] = useState(0);
    const [columnsByCategory, setColumnsByCategory] = useState({
        student: [],
        parent: [],
        group: [],
        attendance: [],
        grades: []
    });
    
    // Object column tracking
    const [objectColumns, setObjectColumns] = useState({});
    const [expandedObjects, setExpandedObjects] = useState({});
    const reduxSelectedSubProperties = useSelector(state => state.Export.selectedSubProperties);
    const [selectedSubProperties, setSelectedSubProperties] = useState(reduxSelectedSubProperties || {});
    
    // Search and filter state
    const [searchQuery, setSearchQuery] = useState("");
    const [filterMode, setFilterMode] = useState("contains");
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    
    // Filter options
    const filterOptions = [
        { value: "contains", label: t('filter.contains', "Contains") },
        { value: "startsWith", label: t('filter.startsWith', "Starts with") },
        { value: "endsWith", label: t('filter.endsWith', "Ends with") },
        { value: "equals", label: t('filter.equals', "Equals") },
        { value: "notContains", label: t('filter.notContains', "Not contains") },
        { value: "notStartsWith", label: t('filter.notStartsWith', "Not starts with") },
        { value: "notEndsWith", label: t('filter.notEndsWith', "Not ends with") },
        { value: "notEquals", label: t('filter.notEquals', "Not equals") }
    ];
    
    // Filter columns based on search query and filter mode
    const filterColumns = (columns, query, mode) => {
        if (!query) return columns;
        
        return columns.filter(column => {
            const columnName = column.name || getTranslatedColumnName(column.key);
            const columnKey = column.key;
            const searchText = columnName.toLowerCase() + ' ' + columnKey.toLowerCase();
            const searchQueryLower = query.toLowerCase();
            
            switch (mode) {
                case "startsWith":
                    return searchText.startsWith(searchQueryLower);
                case "endsWith":
                    return searchText.endsWith(searchQueryLower);
                case "equals":
                    return searchText === searchQueryLower;
                case "notContains":
                    return !searchText.includes(searchQueryLower);
                case "notStartsWith":
                    return !searchText.startsWith(searchQueryLower);
                case "notEndsWith":
                    return !searchText.endsWith(searchQueryLower);
                case "notEquals":
                    return searchText !== searchQueryLower;
                case "contains":
                default:
                    return searchText.includes(searchQueryLower);
            }
        });
    };
    
    // Get filtered columns by category
    const getFilteredColumnsByCategory = () => {
        const result = {};
        
        Object.entries(columnsByCategory).forEach(([category, columns]) => {
            const filteredColumns = filterColumns(columns, searchQuery, filterMode);
            if (filteredColumns.length > 0) {
                result[category] = filteredColumns;
            }
        });
        
        return result;
    };
    
    // Handle search query change
    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value);
    };
    
    // Handle filter mode change
    const handleFilterModeChange = (mode) => {
        setFilterMode(mode);
        setShowFilterOptions(false);
    };
    
    // Clear search query
    const clearSearchQuery = () => {
        setSearchQuery("");
    };
    
    // Show preview state
    const [showPreview, setShowPreview] = useState(true);
    
    // Add attendance and grade specific types before the useEffect section
    const [attendanceOptions, setAttendanceOptions] = useState({
        present: true,
        absent: true,
        late: true,
        excused: true
    });

    // Simplified gradeOptions - only finalGrade
    const [gradeOptions, setGradeOptions] = useState({
        finalGrade: true
    });
    
    // Apply selected values when component mounts
    useEffect(() => {
        setSelectedFormat(fileExtension);
        setSelectedType(IndexExportType);
    }, [fileExtension, IndexExportType]);
    
    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    // Initialize available columns and default selection when data changes
    useEffect(() => {
        if (data && data.length > 0) {
            let columns = [];
            const FilterModeOptions = {
                equality: ["equals", "notEquals"],
                text: ["contains", "notContains", "startsWith", "endsWith"],
                comparison: ["greaterThan", "lessThan", "greaterThanOrEqualTo", "lessThanOrEqualTo"],
                range: ["betweenInclusive", "betweenExclusive"],
            };

            // Get the appropriate column configuration based on TableName
            let columnConfig;
            let selectedColumnsConfig;
            
            switch (TableName) {
                case 'etudiants':
                    columnConfig = etudiantsColumns(t, FilterModeOptions);
                    selectedColumnsConfig = etudiantsSelectedColumns;
                    break;
                case 'professeurs':
                    columnConfig = professeursColumns(t, FilterModeOptions);
                    selectedColumnsConfig = professeursSelectedColumns;
                    break;
                case 'groups':
                    columnConfig = groupColumns(t, FilterModeOptions);
                    selectedColumnsConfig = groupSelectedColumns;
                    break;
                case 'academic-years':
                    columnConfig = AcademicYearsColumns(t, FilterModeOptions);
                    selectedColumnsConfig = academicYearsSelectedColumns;
                    break;
                case 'salles':
                    columnConfig = sallesColumns(t, FilterModeOptions);
                    selectedColumnsConfig = sallesSelectedColumns;
                    break;
                case 'matieres':
                    columnConfig = matiereColumns(t, FilterModeOptions);
                    selectedColumnsConfig = matiereSelectedColumns;
                    break;
                case 'evaluations':
                    columnConfig = evaluationsColumns(t, FilterModeOptions);
                    selectedColumnsConfig = evaluationsSelectedColumns;
                    break;
                case 'niveaux':
                    columnConfig = niveauxColumns(t, FilterModeOptions);
                    selectedColumnsConfig = niveauxSelectedColumns;
                    break;
                default:
                    useDefaultColumns();
                    return;
            }

            // Extract accessorKeys from the column configuration
            columns = columnConfig
                .filter(col => col.accessorKey)
                .map(col => ({
                    key: col.accessorKey,
                    name: typeof col.header === 'function' ? col.header(t) : col.header,
                }));

            setAvailableColumns(columns);

            // Categorize columns by their type
            const categorized = categorizeColumns(columns);
            setColumnsByCategory(categorized);

            // Detect object columns in the first row of data
            const objectColumnsFound = {};
            if (data.length > 0) {
                const firstRow = data[0];
                columns.forEach(column => {
                    const key = column.key;
                    let value;
                    
                    // Handle nested properties
                    if (key.includes('.')) {
                        const parts = key.split('.');
                        let currentObj = firstRow;
                        
                        for (const part of parts) {
                            if (currentObj && typeof currentObj === 'object') {
                                currentObj = currentObj[part];
                            } else {
                                currentObj = undefined;
                                break;
                            }
                        }
                        value = currentObj;
                    } else {
                        value = firstRow[key];
                    }
                    
                    if (isComplexObject(value)) {
                        const properties = extractObjectProperties(value);
                        if (properties.length > 0) {
                            objectColumnsFound[key] = {
                                properties: properties,
                                column: column
                            };
                        }
                    }
                });
            }
            
            setObjectColumns(objectColumnsFound);

            // Find enabled categories and their columns
            const enabledCategories = Object.entries(selectedColumnsConfig)
                .filter(([_, config]) => config.enable)
                .map(([category, config]) => ({
                    category,
                    columns: Object.entries(config.columns)
                        .filter(([_, enabled]) => enabled)
                        .map(([key]) => key)
                }));

            // Default: select first 3 columns from enabled categories
            let defaultSelection = [];
            if (enabledCategories.length > 0) {
                // Collect all enabled columns
                const allEnabledColumns = enabledCategories.flatMap(cat => cat.columns);
                
                // Find matching columns in our available columns
                const matchingColumns = columns
                    .filter(col => allEnabledColumns.includes(col.key))
                    .slice(0, 3)
                    .map(col => col.key);
                
                defaultSelection = matchingColumns.length > 0 ? matchingColumns : columns.slice(0, 3).map(col => col.key);
            } else {
                // If no enabled categories, use first 3 columns
                defaultSelection = columns.slice(0, 3).map(col => col.key);
            }

            setSelectedColumns(defaultSelection);
            dispatch(UpdateSelectedColumns(defaultSelection));
        }
    }, [data, TableName, dispatch, t]);
    
    // Get translated column name - updated to support column objects
    const getTranslatedColumnName = (column) => {
        // Handle column object format
        if (typeof column === 'object' && column !== null) {
            return column.name || column.key;
        }
        
        // Handle string column name
        const columnName = column || ''; // Add null/undefined check
        
        // First check if this is a direct Data section key
        const dataKey = `Data.${columnName}`;
        const dataTranslation = t(dataKey);
        
        // If we got a direct translation (not the key itself), return it
        if (dataTranslation !== dataKey) {
            return dataTranslation;
        }
        
        // Try to get a translation from the table-specific column
        const tableSpecificKey = `${TableName}.columns.${columnName}`;
        const genericKey = `columns.${columnName}`;
        
        // Otherwise try table-specific translation, then generic, then formatted column name
        return t(tableSpecificKey, { 
            defaultValue: t(genericKey, { 
                defaultValue: columnName ? columnName.toUpperCase().replace(/_/g, " ") : ''
            }) 
        });
    };
    
    // Handle format change
    const handleFormatChange = (format) => {
        setSelectedFormat(format);
        SelectFileExtention({ target: { value: format }});
    };
    
    // Handle export type change
    const handleTypeChange = (index) => {
        setSelectedType(index);
        SelectIndexExportType({ target: { value: index }});
    };
    
    // Handle column selection change - updated for column objects
    const handleColumnChange = (event) => {
        const newSelection = event.target.value;

        // Only show error if user tries to select too few or too many columns
        if (newSelection.length < 3) {
            setColumnSelectError(t('export.minColumns', 'Please select at least 3 columns'));
            return;
        }
        if (newSelection.length > 6) {
            setColumnSelectError(t('export.maxColumns', 'Please select no more than 6 columns'));
            return;
        }

        // Clear any previous error if selection is valid
        setColumnSelectError('');
        setSelectedColumns(newSelection);
        dispatch(UpdateSelectedColumns(newSelection));
    };
    
    // Handle individual column toggle
    const handleColumnToggle = (columnKey) => {
        const currentIndex = selectedColumns.indexOf(columnKey);
        let newSelected = [...selectedColumns];
        
        if (currentIndex === -1) {
            // Add column if not already selected
            // Check if adding would exceed maximum
            if (selectedColumns.length >= 6) {
                setColumnSelectError(t('export.maxColumns', 'Please select no more than 6 columns'));
                return;
            }
            newSelected.push(columnKey);
        } else {
            // Remove column if already selected
            // Check if removing would go below minimum
            if (selectedColumns.length <= 3) {
                setColumnSelectError(t('export.minColumns', 'Please select at least 3 columns'));
                return;
            }
            newSelected.splice(currentIndex, 1);
        }
        
        // Clear any previous error if selection is valid
        setColumnSelectError('');
        setSelectedColumns(newSelected);
        dispatch(UpdateSelectedColumns(newSelected));
    };
    
    // Clear column selection but keep minimum required
    const clearColumnSelection = () => {
        // Select only required minimum columns (first 3)
        const minimumColumns = availableColumns.slice(0, 3).map(col => 
            typeof col === 'object' ? col.key : col
        );
        
        setSelectedColumns(minimumColumns);
        setColumnSelectError("");
        dispatch(UpdateSelectedColumns(minimumColumns));
    };
    
    // Select important columns from each category (up to 6 total)
    const selectImportantColumns = () => {
        // Define priority columns for each category
        const priorityColumns = {
            student: ['user.NomPL', 'user.PrenomPL', 'user.EmailUT'],
            parent: ['EmailTR', 'Phone1TR'],
            group: ['groupName', 'niveauName'],
            attendance: ['attendanceStats'],
            grades: ['gradeStats.average'],
            status: ['user.StatutUT'],
            info: []
        };
        
        // Get available categories from columnsByCategory
        const availableCategories = Object.keys(columnsByCategory);
        
        // Initialize selection array
        let smartSelection = [];
        
        // First pass: Try to get one important column from each category
        availableCategories.forEach(category => {
            if (smartSelection.length < 6) {
                const categoryColumns = columnsByCategory[category] || [];
                const priorityForCategory = priorityColumns[category] || [];
                
                // Find the first priority column that exists in this category
                const priorityColumn = categoryColumns.find(col => 
                    priorityForCategory.includes(col.key)
                );
                
                if (priorityColumn && !smartSelection.includes(priorityColumn.key)) {
                    smartSelection.push(priorityColumn.key);
                } else if (categoryColumns.length > 0 && !smartSelection.includes(categoryColumns[0].key)) {
                    // If no priority column found, take the first column from this category
                    smartSelection.push(categoryColumns[0].key);
                }
            }
        });
        
        // Second pass: Fill remaining slots with more priority columns
        if (smartSelection.length < 6) {
            // Flatten all priority columns across categories
            const allPriorityColumns = Object.values(priorityColumns).flat();
            
            // Get all available columns as objects
            const allAvailableColumns = Object.values(columnsByCategory).flat();
            
            // Sort available columns by priority
            const sortedByPriority = allAvailableColumns.sort((a, b) => {
                const aPriority = allPriorityColumns.indexOf(a.key);
                const bPriority = allPriorityColumns.indexOf(b.key);
                
                // If both are in priority list, sort by priority index
                if (aPriority !== -1 && bPriority !== -1) {
                    return aPriority - bPriority;
                }
                
                // If only one is in priority list, it comes first
                if (aPriority !== -1) return -1;
                if (bPriority !== -1) return 1;
                
                // Otherwise, keep original order
                return 0;
            });
            
            // Add remaining columns until we have 6 or run out
            for (const column of sortedByPriority) {
                if (!smartSelection.includes(column.key) && smartSelection.length < 6) {
                    smartSelection.push(column.key);
                }
                
                if (smartSelection.length >= 6) break;
            }
        }
        
        // Ensure we have at least 3 columns
        if (smartSelection.length < 3 && availableColumns.length >= 3) {
            // Add columns from availableColumns until we have at least 3
            for (const column of availableColumns) {
                if (!smartSelection.includes(column.key)) {
                    smartSelection.push(column.key);
                }
                if (smartSelection.length >= 3) break;
            }
        }
        
        // Update selection
        setSelectedColumns(smartSelection);
        setColumnSelectError("");
        dispatch(UpdateSelectedColumns(smartSelection));
    };
    
    // Get format icon and color
    const getFormatIcon = (format) => {
        const formatInfo = formatPreviewOptions[format.toLowerCase()] || {
            icon: faFileAlt,
            color: '#7f8c8d'
        };
        
        return (
            <FontAwesomeIcon 
                icon={formatInfo.icon} 
                style={{ 
                    color: formatInfo.color,
                    fontSize: '1.5rem',
                    marginRight: '8px',
                    filter: isDarkMode ? 'brightness(1.2)' : 'none'
                }} 
            />
        );
    };
    
    // Get format display name
    const getFormatDisplayName = (format) => {
        switch(format.toLowerCase()) {
            case 'pdf':
                return 'PDF Document';
            case 'excel':
                return 'Excel Spreadsheet';
            case 'csv':
                return 'CSV File';
            default:
                return format;
        }
    };

    // Get format preview
    const getFormatPreview = () => {
        if (!showPreview) return null;
        
        const formatInfo = formatPreviewOptions[selectedFormat.toLowerCase()] || {
            previewImage: '/previews/default_preview.png',
            color: '#7f8c8d'
        };
        
            return (
            <Paper 
                elevation={3}
                    sx={{
                    padding: '16px',
                    marginTop: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: isDarkMode ? '#1e293b' : '#f8f9fa',
                    border: `1px solid ${isDarkMode ? '#2d3748' : '#e9ecef'}`,
                        borderRadius: '8px',
                    position: 'relative'
                    }}
                >
                <Typography 
                    variant="subtitle1" 
                        sx={{
                        fontWeight: 'bold',
                        color: isDarkMode ? '#e2e8f0' : '#495057',
                        marginBottom: '8px'
                    }}
                >
                    {t('export.preview')} - {getFormatDisplayName(selectedFormat)}
                </Typography>
                
                <Box sx={{ 
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <img 
                        src={formatInfo.previewImage} 
                        alt={`${selectedFormat} preview`}
                        style={{
                            maxWidth: '100%',
                            height: 'auto',
                            maxHeight: '200px',
                            objectFit: 'contain',
                            borderRadius: '4px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            opacity: isDarkMode ? 0.9 : 1
                        }}
                        onError={(e) => {
                            // If image fails to load, show icon instead
                            setShowPreview(false);
                        }}
                    />
                    
                    {/* Overlay details */}
                    <Box sx={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '8px',
                        backgroundColor: isDarkMode ? 'rgba(26, 32, 44, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                            {getFormatIcon(selectedFormat)}
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                            .{selectedFormat.toLowerCase()}
                            </Typography>
                        </Box>
                    </Box>
                
                {/* Preview info */}
                <Typography 
                    variant="caption" 
                            sx={{ 
                        marginTop: '8px',
                        fontStyle: 'italic',
                        color: isDarkMode ? '#a0aec0' : '#6c757d' 
                    }}
                >
                    {t('export.previewDescription')}
                </Typography>
                
                <Checkbox
                    size="small"
                    checked={showPreview}
                    onChange={(e) => setShowPreview(e.target.checked)}
                    sx={{ position: 'absolute', top: '8px', right: '8px' }}
                />
            </Paper>
        );
    };
    
    // Render export format selection
    const renderFormatSelection = () => (
        <Paper 
            elevation={2} 
            sx={{ 
                padding: '16px', 
                marginBottom: '16px',
                backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                borderRadius: '8px',
                border: `1px solid ${isDarkMode ? '#2d3748' : '#e9ecef'}`
            }}
        >
            <Typography 
                variant="h6" 
                    sx={{ 
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    color: isDarkMode ? '#e2e8f0' : '#495057',
                    fontWeight: 500
                }}
            >
                <FontAwesomeIcon 
                    icon={faFileExport}
                    style={{ 
                        marginRight: '8px',
                        color: isDarkMode ? '#4299e1' : '#2a2185',
                    }}
                />
                {ExportSelectText}
            </Typography>
            
            <Grid container spacing={2}>
                {AllFilesExtantions.map((format) => {
                    const isSelected = selectedFormat.toLowerCase() === format.toLowerCase();
                    const formatInfo = formatPreviewOptions[format.toLowerCase()] || {
                        icon: faFileAlt,
                        color: '#7f8c8d'
                    };
                    
                    return (
                        <Grid item xs={4} key={format}>
                            <Card 
                                sx={{ 
                                    cursor: 'pointer',
                                    backgroundColor: isSelected 
                                        ? (isDarkMode ? '#2d3748' : '#e9ecef') 
                                        : (isDarkMode ? '#1a202c' : '#ffffff'),
                                    border: isSelected 
                                        ? `2px solid ${isDarkMode ? '#4299e1' : '#2a2185'}`
                                        : `1px solid ${isDarkMode ? '#2d3748' : '#dee2e6'}`,
                                    transition: 'all 0.2s ease',
                                    borderRadius: '8px',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                        backgroundColor: isDarkMode ? '#2d3748' : '#f8f9fa'
                                    }
                                }}
                                onClick={() => handleFormatChange(format.toLowerCase())}
                            >   
                                <CardContent sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    padding: '16px !important'
                                }}>
                                    <FontAwesomeIcon 
                                        icon={formatInfo.icon}
                                        style={{ 
                                            fontSize: '2rem',
                                            color: formatInfo.color,
                                            marginBottom: '8px',
                                            filter: isDarkMode ? 'brightness(1.2)' : 'none'
                                        }}
                                    />
            <Typography 
                variant="subtitle1" 
                sx={{ 
                                            fontWeight: isSelected ? 'bold' : 'normal',
                                            color: isDarkMode ? '#e2e8f0' : '#495057'
                }}
            >
                                        {format.toUpperCase()}
            </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Paper>
    );
    
    // Render export type selection
    const renderExportTypeSelection = () => (
        <Paper 
            elevation={2} 
                sx={{ 
                padding: '16px',
                marginBottom: '16px',
                backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                borderRadius: '8px',
                border: `1px solid ${isDarkMode ? '#2d3748' : '#e9ecef'}`
            }}
        >
            <Typography 
                variant="h6" 
                        sx={{
                    marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                    color: isDarkMode ? '#e2e8f0' : '#495057',
                    fontWeight: 500
                }}
            >
                <FontAwesomeIcon 
                    icon={faColumns}
                    style={{ 
                        marginRight: '8px',
                        color: isDarkMode ? '#4299e1' : '#2a2185',
                    }}
                />
                {ExportTypeText}
                            </Typography>
            
            <RadioGroup 
                value={selectedType}
                onChange={(e) => handleTypeChange(parseInt(e.target.value))}
            >
                {OptionsExportFile.map((option, index) => (
                    <FormControlLabel
                        key={index}
                        value={index}
                        control={<Radio sx={{
                            color: isDarkMode ? '#a0aec0' : '#6c757d',
                            '&.Mui-checked': {
                                color: isDarkMode ? '#4299e1' : '#2a2185',
                            }
                        }}/>}
                        label={option.text}
                        disabled={option.disabled(tableData)}
                sx={{ 
                            margin: '4px 0',
                            color: isDarkMode ? '#e2e8f0' : '#495057',
                            opacity: option.disabled(tableData) ? 0.5 : 1
                        }}
                    />
                ))}
            </RadioGroup>
        </Paper>
    );
    
    // Toggle expanded state for object columns
    const toggleObjectExpanded = (columnKey) => {
        setExpandedObjects(prev => ({
            ...prev,
            [columnKey]: !prev[columnKey]
        }));
    };
    
    // Handle sub-property selection
    const handleSubPropertyToggle = (columnKey, propertyKey) => {
        const updatedSubProperties = { ...selectedSubProperties };
        const currentSelection = updatedSubProperties[columnKey] || [];
        const propertyIndex = currentSelection.indexOf(propertyKey);
        
        if (propertyIndex === -1) {
            // Add property
            updatedSubProperties[columnKey] = [...currentSelection, propertyKey];
        } else {
            // Remove property
            updatedSubProperties[columnKey] = currentSelection.filter(key => key !== propertyKey);
        }
        
        setSelectedSubProperties(updatedSubProperties);
        dispatch(UpdateSelectedSubProperties(updatedSubProperties));
    };
    
    // Format object values for display in exports
    const formatObjectValue = (columnKey, value) => {
        if (!isComplexObject(value)) return String(value);
        
        const subProps = selectedSubProperties[columnKey] || [];
        if (subProps.length === 0) {
            // If no specific properties selected, return all as JSON
            return JSON.stringify(value);
        }
        
        // Format selected properties
        return subProps.map(prop => `${prop}: ${value[prop]}`).join(' | ');
    };
    
    // Render column selection tabs
    const renderColumnSelection = () => (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                <FontAwesomeIcon icon={faColumns} style={{ marginRight: '8px' }} />
                {t('export.selectColumns')}
            </Typography>
            
            <FormControl fullWidth error={!!columnSelectError} sx={{ mb: 2 }}>
                <InputLabel>{t('export.availableColumns')}</InputLabel>
                <Select
                    multiple
                    value={selectedColumns}
                    onChange={handleColumnChange}
                    input={<OutlinedInput label={t('export.availableColumns')} />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value, index) => {
                                // Find the column object by key
                                const column = availableColumns.find(col => col.key === value);
                                const displayName = column ? column.name : getTranslatedColumnName(value);
                                
                                return (
                                    <Chip 
                                        key={`${value}-${index}`}
                                        label={displayName}
                                        color="primary"
                                        variant={isDarkMode ? "filled" : "outlined"}
                                    />
                                );
                            })}
                        </Box>
                    )}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 400
                            }
                        }
                    }}
                >
                    {/* Search and filter bar inside the Select dropdown */}
                    <Box sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1, p: 1, borderBottom: 1, borderColor: 'divider' }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder={t('export.searchColumns', "Search columns...")}
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
                                        <Tooltip title={t('export.filterOptions', "Filter options")}>
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
                                    {t('export.filterMode', "Filter Mode")}
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
                    
                    {Object.entries(getFilteredColumnsByCategory()).map(([category, columns]) => (
                        <div key={category}>
                            <ListSubheader>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                        {t(`export.categories.${category}`, category)}
                                    </Typography>
                                </Box>
                            </ListSubheader>
                            {columns.map((column) => {
                                const isSelected = selectedColumns.includes(column.key);
                                const isObjectColumn = objectColumns[column.key];
                                const isExpanded = expandedObjects[column.key];
                                
                                return (
                                    <React.Fragment key={column.key}>
                                        <MenuItem 
                                            value={column.key}
                                            onClick={(e) => {
                                                // If it's an object column, toggle expansion instead of selection
                                                if (isObjectColumn && !isSelected) {
                                                    e.stopPropagation();
                                                    toggleObjectExpanded(column.key);
                                                } else {
                                                    // Handle selection toggle
                                                    handleColumnToggle(column.key);
                                                }
                                            }}
                                            sx={{
                                                fontWeight: isSelected ? 'bold' : 'normal',
                                                backgroundColor: isSelected ? (isDarkMode ? 'rgba(66, 153, 225, 0.08)' : 'rgba(42, 33, 133, 0.04)') : 'transparent',
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
                                                        // Prevent the MenuItem onClick from firing twice
                                                        e.stopPropagation();
                                                        handleColumnToggle(column.key);
                                                    }}
                                                />
                                                <ListItemText 
                                                    primary={column.name || getTranslatedColumnName(column.key)} 
                                                    secondary={column.key}
                                                    primaryTypographyProps={{
                                                        style: { fontWeight: isSelected ? 'bold' : 'normal' }
                                                    }}
                                                />
                                                
                                                {isObjectColumn && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleObjectExpanded(column.key);
                                                        }}
                                                    >
                                                        <FontAwesomeIcon 
                                                            icon={isExpanded ? faChevronDown : faChevronRight} 
                                                            size="xs" 
                                                        />
                                                    </IconButton>
                                                )}
                                            </Box>
                                            {isSelected && (
                                                <IconButton 
                                                    size="small" 
                                                    sx={{ 
                                                        ml: 1,
                                                        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.54)',
                                                        '&:hover': {
                                                            color: isDarkMode ? '#e53e3e' : '#f44336',
                                                            backgroundColor: isDarkMode ? 'rgba(229, 62, 62, 0.08)' : 'rgba(244, 67, 54, 0.08)'
                                                        }
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Check if removing would go below minimum
                                                        if (selectedColumns.length <= 3) {
                                                            setColumnSelectError(t('export.minColumns', 'Please select at least 3 columns'));
                                                            return;
                                                        }
                                                        
                                                        // Remove this column from selection
                                                        const newSelected = selectedColumns.filter(key => key !== column.key);
                                                        setColumnSelectError('');
                                                        setSelectedColumns(newSelected);
                                                        dispatch(UpdateSelectedColumns(newSelected));
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </IconButton>
                                            )}
                                        </MenuItem>
                                        
                                        {/* Sub-properties for object columns */}
                                        {isObjectColumn && isExpanded && (
                                            <Collapse in={isExpanded}>
                                                <Box sx={{ pl: 4, pr: 2, py: 1, bgcolor: isDarkMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.03)' }}>
                                                    <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                                                        {t('export.selectSubProperties', 'Select properties to include:')}
                                                    </Typography>
                                                    
                                                    {isObjectColumn.properties.map(prop => {
                                                        const subProps = selectedSubProperties[column.key] || [];
                                                        const isSubSelected = subProps.includes(prop.key);
                                                        
                                                        return (
                                                            <MenuItem
                                                                key={`${column.key}-${prop.key}`}
                                                                dense
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleSubPropertyToggle(column.key, prop.key);
                                                                }}
                                                                sx={{
                                                                    pl: 1,
                                                                    borderRadius: '4px',
                                                                    mb: 0.5,
                                                                    bgcolor: isSubSelected ? 
                                                                        (isDarkMode ? 'rgba(66, 153, 225, 0.15)' : 'rgba(42, 33, 133, 0.08)') : 
                                                                        'transparent'
                                                                }}
                                                            >
                                                                <Checkbox
                                                                    checked={isSubSelected}
                                                                    size="small"
                                                                    color="primary"
                                                                    disableRipple
                                                                />
                                                                <ListItemText
                                                                    primary={prop.name}
                                                                    secondary={`${prop.key}: ${prop.value}`}
                                                                    primaryTypographyProps={{
                                                                        variant: 'body2',
                                                                        style: { fontWeight: isSubSelected ? 'bold' : 'normal' }
                                                                    }}
                                                                    secondaryTypographyProps={{
                                                                        variant: 'caption'
                                                                    }}
                                                                />
                                                            </MenuItem>
                                                        );
                                                    })}
                                                    
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                                        <Button
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                // Select all properties
                                                                selectAllSubProperties(column.key, isObjectColumn.properties);
                                                            }}
                                                            sx={{ fontSize: '0.75rem' }}
                                                        >
                                                            {t('export.selectAll', 'Select All')}
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                // Clear all properties
                                                                clearAllSubProperties(column.key);
                                                            }}
                                                            sx={{ fontSize: '0.75rem' }}
                                                        >
                                                            {t('export.clearAll', 'Clear All')}
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </Collapse>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    ))}
                </Select>
                {columnSelectError && <FormHelperText error>{columnSelectError}</FormHelperText>}
            </FormControl>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button
                    variant="outlined"
                    onClick={clearColumnSelection}
                    startIcon={<FontAwesomeIcon icon={faColumns} />}
                >
                    {t('export.clearSelection')}
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={selectImportantColumns}
                    startIcon={<FontAwesomeIcon icon={faStar || faColumns} />}
                    sx={{
                        borderColor: isDarkMode ? '#4299e1' : '#2a2185',
                        color: isDarkMode ? '#4299e1' : '#2a2185',
                        '&:hover': {
                            backgroundColor: isDarkMode ? 'rgba(66, 153, 225, 0.08)' : 'rgba(42, 33, 133, 0.08)',
                        }
                    }}
                >
                    {t('export.smartSelect', 'Smart Selection')}
                </Button>
            </Box>
        </Box>
    );

    // Handle export button click
    const handleExport = () => {
        // Check if we have required columns
        if (selectedColumns.length < 3) {
            setColumnSelectError(t('export.minColumns', 'Please select at least 3 columns'));
            return;
        }
        
        // Prepare export options
        const options = {
            attendance: attendanceOptions,
            grades: gradeOptions,
            subProperties: selectedSubProperties
        };
        
        // Trigger export
        ClickToExport(options);
    };

    // Select all sub-properties for a column
    const selectAllSubProperties = (columnKey, properties) => {
        const updatedSubProperties = { 
            ...selectedSubProperties,
            [columnKey]: properties.map(p => p.key)
        };
        
        setSelectedSubProperties(updatedSubProperties);
        dispatch(UpdateSelectedSubProperties(updatedSubProperties));
    };
    
    // Clear all sub-properties for a column
    const clearAllSubProperties = (columnKey) => {
        const updatedSubProperties = { 
            ...selectedSubProperties,
            [columnKey]: []
        };
        
        setSelectedSubProperties(updatedSubProperties);
        dispatch(UpdateSelectedSubProperties(updatedSubProperties));
    };

    return (
        <Box sx={{ padding: '16px' }}>
                                            <Typography
                variant="h5" 
                                                sx={{
                    marginBottom: '16px',
                    color: isDarkMode ? '#e2e8f0' : '#343a40',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <FontAwesomeIcon 
                    icon={faFileExport}
                    style={{ 
                        marginRight: '10px',
                        color: isDarkMode ? '#4299e1' : '#2a2185',
                    }}
                />
                {t('export.title')}
                                            </Typography>
            
            <Divider sx={{ marginBottom: '24px', borderColor: isDarkMode ? '#2d3748' : '#dee2e6' }} />
            
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    {renderFormatSelection()}
                    {renderExportTypeSelection()}
                </Grid>
                
                <Grid item xs={12} md={6}>
                    {getFormatPreview()}
                    {renderColumnSelection()}
                </Grid>
            </Grid>
            
            {/* Export Button */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    disabled={!data || data.length === 0}
                    onClick={handleExport}
                    startIcon={<FontAwesomeIcon icon={faFileExport} />}
                    sx={{
                        backgroundColor: isDarkMode ? '#4299e1' : '#2a2185',
                        color: '#fff',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        fontWeight: 'bold',
                                    '&:hover': {
                            backgroundColor: isDarkMode ? '#63b3ed' : '#3730a3',
                        },
                        '&:disabled': {
                            backgroundColor: isDarkMode ? 'rgba(66, 153, 225, 0.5)' : 'rgba(42, 33, 133, 0.5)',
                            color: 'rgba(255, 255, 255, 0.5)'
                        }
                    }}
                >
                    {t('export.exportButton', 'Export Now')}
                </Button>
            </Box>
            
            {/* Success notification */}
            <Snackbar
                open={showSuccess}
                autoHideDuration={3000}
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setShowSuccess(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                    icon={<FontAwesomeIcon icon={faCheckCircle} />}
                >
                    {t('export.successMessage')}
                </Alert>
            </Snackbar>
        </Box> 
    );
}