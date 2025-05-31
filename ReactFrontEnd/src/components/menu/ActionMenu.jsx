import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Fade, useTheme, Box } from "@mui/material";
import { useActionMenu } from "./hooks/useActionMenu";
import { Fragment, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from 'prop-types';
import DarkModeToggle from "../common/DarkModeToggle";
import LanguageSelector from "../common/LanguageSelector";
import { useTranslation } from "react-i18next";
import { toggleDarkMode } from "../../Store/Slices/ThemeSlice.jsx";

/**
 * Enhanced ActionMenu component that displays a modal dialog with customizable content and actions
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.DialogContentComponent - Content to display in the dialog body
 * @param {Object} props.contentOptions - Configuration options for the dialog
 * @param {string} props.contentOptions.Title - Dialog title text
 * @param {Array} props.contentOptions.Btns - Array of button configurations
 * @param {React.ElementType} props.contentOptions.MainBtn - Component that triggers the dialog
 * @param {boolean} props.fullWidth - Whether the dialog should take full width (up to maxWidth)
 * @param {string} props.maxWidth - Maximum width of the dialog (xs, sm, md, lg, xl)
 * @param {boolean} props.disableBackdropClick - Whether to prevent closing when clicking backdrop
 * @param {boolean} props.disableEscapeKey - Whether to prevent closing when pressing escape key
 * @param {boolean} props.fullScreen - Whether the dialog should be full screen
 * @param {string} props.className - Additional CSS class for the dialog
 * @param {Object} props.style - Additional inline styles for the dialog
 */
export default function ActionMenu({ 
  DialogContentComponent, 
  contentOptions,
  fullWidth = false,
  maxWidth = 'md',
  disableBackdropClick = true,
  disableEscapeKey = true,
  fullScreen = false,
  className = '',
  style = {},
  showOptions = false
}) {
    const { ClickToClose, open, ClickToOpen, forceClose } = useActionMenu();
    const { Title, Btns, MainBtn } = contentOptions;
    const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);
    const dispatch = useDispatch();
    const { i18n } = useTranslation();

    const handleToggleDarkMode = () => {
      dispatch(toggleDarkMode());
    };

    const handleLanguageChange = (lang) => {
      i18n.changeLanguage(lang);
    };

    // Memoize styles to prevent unnecessary re-renders
    const styles = useMemo(() => {
        // Theme colors
        const colors = {
            dark: {
                background: 'rgba(30, 41, 59, 0.98)',
                surface: 'rgba(30, 41, 59, 0.8)',
                border: 'rgba(255, 255, 255, 0.1)',
                text: '#e0e0e0',
                textSecondary: 'rgba(224, 224, 224, 0.7)',
                buttonHover: 'rgba(55, 65, 81, 0.9)',
            },
            light: {
                background: '#ffffff',
                surface: '#f8f9fa',
                border: 'rgba(0, 0, 0, 0.1)',
                text: '#333333',
                textSecondary: 'rgba(0, 0, 0, 0.6)',
                buttonHover: '#e9ecef',
            }
        };

        const theme = isDarkMode ? colors.dark : colors.light;

        return {
            dialog: {
                paper: {
                    backgroundColor: theme.background,
                    color: theme.text,
                    borderRadius: '12px',
                    border: `1px solid ${theme.border}`,
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden',
                    ...style
                }
            },
            title: {
                color: theme.text,
                borderBottom: `1px solid ${theme.border}`,
                padding: '16px 24px',
                fontSize: '1.25rem',
                fontWeight: 600,
                margin: 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            },
            content: {
                color: theme.text,
                padding: '24px',
                backgroundColor: theme.background
            },
            actions: {
                borderTop: `1px solid ${theme.border}`,
                padding: '16px 24px',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                backgroundColor: theme.background
            },
            defaultButton: {
                padding: '8px 16px',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                backgroundColor: theme.surface,
                color: theme.text,
                '&:hover': {
                    backgroundColor: theme.buttonHover,
                }
            }
        };
    }, [isDarkMode, style]);

    /**
     * Handles dialog closing and button actions
     * @param {Object} btn - Button configuration 
     */
    const handleButtonClick = (btn) => {
        if (btn.handleClose) {
            forceClose();
        }
        if (btn.handleClick) {
            btn.handleClick();
        }
        if (btn.handleCloseBefforClick) {
            forceClose();
        }
    };

    /**
     * Calculate final button styles based on button config and defaults
     * @param {Object} btn - Button configuration object
     * @returns {Object} Final button styles
     */
    const getButtonStyles = (btn) => {
        // For buttons with custom styling via className, don't apply default background/color
        if (btn.className && (btn.className.includes('bg-') || btn.className.includes('text-'))) {
            const { backgroundColor, color, ...restStyles } = styles.defaultButton;
            return {
                ...restStyles,
                ...(btn.style || {})
            };
        }
        
        // For buttons with custom styles, merge with defaults
        return {
            ...styles.defaultButton,
            ...(btn.style || {})
        };
    };

    // Get correct className for a button
    const getButtonClassName = (btn) => btn.className || "";

    const handleClose = (event, reason) => {
        if (disableBackdropClick && reason === 'backdropClick') {
            return;
        }
        ClickToClose(event, reason);
    };
    
    return (
        <Fragment>
            <MainBtn {...{ClickToOpen}} />
            <Dialog 
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                disableEscapeKeyDown={disableEscapeKey}
                open={open} 
                onClose={handleClose}
                PaperProps={{ 
                    style: styles.dialog.paper,
                    className: className
                }}
                aria-labelledby="dialog-title"
                TransitionComponent={Fade}
                transitionDuration={{ enter: 300, exit: 200 }}
                fullScreen={fullScreen}
            >
                <DialogTitle sx={styles.title}>
                    {Title}
                    {showOptions && (
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <DarkModeToggle 
                            isDarkMode={isDarkMode} 
                            toggleDarkMode={handleToggleDarkMode}
                        />
                        <LanguageSelector 
                            isFormHeader={true}
                            currentLanguage={i18n.language} 
                            onLanguageChange={handleLanguageChange}
                        />
                    </Box>)}
                </DialogTitle>
                
                {DialogContentComponent && (
                    <DialogContent style={styles.content}>
                        {DialogContentComponent}
                    </DialogContent>
                )}
                
                <DialogActions style={styles.actions}>
                    {Btns.map((btn, index) => (
                        <Button
                            key={`${btn.value || 'btn'}_${index}`}
                            onClick={() => handleButtonClick(btn)}
                            className={getButtonClassName(btn)}
                            disabled={!!btn.disabled}
                            style={getButtonStyles(btn)}
                            variant={btn.className?.includes('bg-') ? 'contained' : 'text'}
                            size="medium"
                            color={btn.color || 'primary'}
                            startIcon={btn.startIcon}
                            endIcon={btn.endIcon}
                        >
                            {btn.value}
                        </Button>
                    ))}
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

// PropTypes for better documentation and development-time error checking
ActionMenu.propTypes = {
    DialogContentComponent: PropTypes.node,
    contentOptions: PropTypes.shape({
        Title: PropTypes.node.isRequired,
        Btns: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.node,
            handleClick: PropTypes.func,
            handleClose: PropTypes.bool,
            disabled: PropTypes.bool,
            className: PropTypes.string,
            style: PropTypes.object,
            color: PropTypes.string,
            startIcon: PropTypes.node,
            endIcon: PropTypes.node
        })).isRequired,
        MainBtn: PropTypes.elementType.isRequired
    }).isRequired,
    fullWidth: PropTypes.bool,
    maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    disableBackdropClick: PropTypes.bool,
    disableEscapeKey: PropTypes.bool,
    fullScreen: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object
};