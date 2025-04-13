import { 
    Select, Box, InputLabel, OutlinedInput, FormControl,
    Typography, MenuItem, Chip, Divider, RadioGroup,
    FormControlLabel, Radio, Paper, Stack, Card, CardContent, Snackbar, Alert
} from "@mui/material";
import { SetExportInfo, UseExport } from "./hooks/useExport";
import { ExportOptions } from "./options/ExportOption";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faFilePdf, 
    faFileExcel, 
    faFileAlt,
    faFileWord
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import './Export.module.css';

export default function Export() {
    const { tableData, IndexExportType, fileExtension, SelectFileExtention, SelectIndexExportType } = SetExportInfo();
    const { showSuccess, setShowSuccess } = UseExport();
    const { ExportSelectText, AllFilesExtantions, ExportTypeText, OptionsExportFile } = ExportOptions();
    const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);
    const [selectedFormat, setSelectedFormat] = useState(fileExtension);
    const [selectedType, setSelectedType] = useState(IndexExportType);
    
    // Apply selected values when component mounts
    useEffect(() => {
        setSelectedFormat(fileExtension);
        setSelectedType(IndexExportType);
    }, [fileExtension, IndexExportType]);
    
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
    
    // Get file format icon
    const getFormatIcon = (format) => {
        switch(format.toLowerCase()) {
            case 'pdf':
                return <FontAwesomeIcon icon={faFilePdf} style={{ color: '#f44336', fontSize: '2rem' }} />;
            case 'excel':
                return <FontAwesomeIcon icon={faFileExcel} style={{ color: '#4caf50', fontSize: '2rem' }} />;
            case 'word':
                return <FontAwesomeIcon 
                    icon={faFileWord} 
                    className="export-icon format-word"
                    style={{ color: '#2b579a', fontSize: '2rem' }} 
                />;
            default:
                return <FontAwesomeIcon icon={faFileAlt} style={{ color: '#2196f3', fontSize: '2rem' }} />;
        }
    };
    
    return (
        <Box 
            sx={{ 
                width: '100%',
                backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'inherit',
                color: isDarkMode ? '#e0e0e0' : 'inherit',
                transition: 'all 0.3s ease',
                p: 1
            }}
            className={isDarkMode ? 'dark-mode' : ''}
        >
            {/* Success notification */}
            <Snackbar
                open={showSuccess}
                autoHideDuration={3000}
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setShowSuccess(false)} 
                    severity="success" 
                    variant="filled"
                    sx={{ 
                        width: '100%',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    }}
                >
                    {`Successfully exported as ${fileExtension} file`}
                </Alert>
            </Snackbar>

            {/* File Type Selection */}
            <Typography 
                variant="subtitle1" 
                gutterBottom
                sx={{ 
                    fontWeight: 600, 
                    mb: 2,
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'inherit'
                }}
            >
                {ExportSelectText}
            </Typography>
            
            <Stack 
                direction="row" 
                spacing={2} 
                sx={{ 
                    mb: 3, 
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    '& > *': { m: 1 }
                }}
            >
                {AllFilesExtantions.map((format, index) => (
                    <Card 
                        key={index}
                        className={`file-type-selector ${selectedFormat === format ? 'selected' : ''}`}
                        sx={{
                            cursor: 'pointer',
                            width: 100,
                            height: 110,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isDarkMode 
                                ? (selectedFormat === format ? 'rgba(106, 95, 201, 0.2)' : 'rgba(30, 41, 59, 0.8)') 
                                : (selectedFormat === format ? 'rgba(106, 95, 201, 0.1)' : 'white'),
                            border: `1px solid ${selectedFormat === format 
                                ? (isDarkMode ? 'rgba(106, 95, 201, 0.6)' : 'rgba(106, 95, 201, 0.5)') 
                                : (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)')}`,
                            boxShadow: selectedFormat === format 
                                ? (isDarkMode ? '0 4px 12px rgba(106, 95, 201, 0.3)' : '0 4px 12px rgba(106, 95, 201, 0.2)') 
                                : 'none',
                        }}
                        onClick={() => handleFormatChange(format)}
                    >
                        <CardContent sx={{ p: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {getFormatIcon(format)}
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    mt: 1, 
                                    fontWeight: selectedFormat === format ? 'bold' : 'normal',
                                    color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'inherit'
                                }}
                            >
                                {format}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
            
            <Divider 
                sx={{ 
                    my: 2,
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                }}
            />
            
            {/* Export Type Selection */}
            <Typography 
                variant="subtitle1" 
                gutterBottom
              sx={{
                    fontWeight: 600, 
                    mb: 2,
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'inherit' 
                }}
            >
                {ExportTypeText}
            </Typography>
            
            <RadioGroup 
                value={selectedType.toString()} 
                onChange={(e) => handleTypeChange(parseInt(e.target.value))}
                className="export-option-list"
            >
                {OptionsExportFile.map((exportType, index) => (
                    (!exportType.disabled || !exportType.disabled(tableData)) && (
                        <Paper
                            key={index}
                            elevation={0}
                            className={`export-option-item ${selectedType === index ? 'selected' : ''}`}
                            sx={{
                                backgroundColor: isDarkMode 
                                    ? (selectedType === index ? 'rgba(255, 255, 255, 0.05)' : 'transparent')
                                    : (selectedType === index ? 'rgba(106, 95, 201, 0.05)' : 'transparent'),
                                opacity: exportType.disabled && exportType.disabled(tableData) ? 0.5 : 1,
                                pointerEvents: exportType.disabled && exportType.disabled(tableData) ? 'none' : 'auto',
                            }}
                        >
                            <FormControlLabel
                                value={index.toString()}
                                control={
                                    <Radio 
                                        disabled={exportType.disabled && exportType.disabled(tableData)}
                                        sx={{
                                            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'inherit',
                                            '&.Mui-checked': {
                                                color: isDarkMode ? 'rgba(106, 95, 201, 0.9)' : 'rgba(106, 95, 201, 1)',
                                            },
                                            '&.Mui-disabled': {
                                                color: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)',
                                                opacity: 0.6,
                                            }
                                        }}
                                    />
                                }
                                label={
                                    <Typography 
                                        variant="body2"
                                        sx={{ 
                                            color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'inherit',
                                            fontWeight: selectedType === index ? 600 : 400,
                                            ...(exportType.disabled && exportType.disabled(tableData) ? {
                                                opacity: 0.5,
                                                textDecoration: 'line-through',
                                                color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)',
                                                fontStyle: 'italic'
                                            } : {})
                                        }}
                                    >
                                        {exportType.text}
                                        {exportType.disabled && exportType.disabled(tableData) && (
                                            <Typography
                                                component="span"
                                                variant="caption"
                                                sx={{
                                                    ml: 1,
                                                    opacity: 0.8,
                                                    fontStyle: 'italic',
                                                    fontSize: '0.75rem',
                                                    color: theme => theme.palette.error.light,
                                                    bgcolor: theme => theme.palette.error.main + '10',
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    transition: 'all 0.2s ease-in-out'
                                                }}
                                            >
                                                (unavailable)
                                            </Typography>
                                        )}
                                    </Typography>
                                }
                                sx={theme => ({
                                    width: '100%',
                                    opacity: exportType.disabled && exportType.disabled(tableData) ? 0.65 : 1,
                                    transition: 'all 0.2s ease-in-out',
                                    filter: exportType.disabled && exportType.disabled(tableData) ? 'grayscale(0.8)' : 'none',
                                    position: 'relative',
                                    cursor: exportType.disabled && exportType.disabled(tableData) ? 'not-allowed' : 'pointer',
                                    '&:hover': {
                                        opacity: exportType.disabled && exportType.disabled(tableData) ? 0.7 : 1,
                                        bgcolor: exportType.disabled && exportType.disabled(tableData) 
                                            ? theme.palette.action.disabledBackground
                                            : theme.palette.action.hover,
                                        '& .MuiTypography-caption': {
                                            opacity: 1,
                                            transform: 'translateY(0)'
                                        }
                                    },
                                    '& .MuiRadio-root': {
                                        color: exportType.disabled && exportType.disabled(tableData) 
                                            ? theme.palette.action.disabled
                                            : theme.palette.primary.main
                                    },
                                    '&::after': exportType.disabled && exportType.disabled(tableData) ? {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: theme.palette.background.paper,
                                        opacity: 0.1,
                                        pointerEvents: 'none'
                                    } : {}
                                })}
                            />
                        </Paper>
                    )
                ))}
            </RadioGroup>
        </Box> 
    );
}