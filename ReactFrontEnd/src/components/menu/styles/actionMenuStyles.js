/**
 * Shared styling for action menus to maintain consistency throughout the application
 */

/**
 * Get button styles for an action button based on type and dark mode
 * @param {string} type - Type of button (primary, delete, secondary, etc.)
 * @param {boolean} isDarkMode - Whether dark mode is enabled
 * @returns {Object} Styles for the button
 */
export const getActionButtonStyle = (type, isDarkMode) => {
  const baseStyle = {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontWeight: 500,
    textTransform: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
  };

  switch (type) {
    case 'primary':
      return {
        ...baseStyle,
        backgroundColor: isDarkMode ? 'rgba(106, 95, 201, 0.8)' : '#3f51b5',
        color: 'white',
        '&:hover': {
          backgroundColor: isDarkMode ? 'rgba(106, 95, 201, 0.9)' : '#303f9f',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
        },
      };
    case 'delete':
      return {
        ...baseStyle,
        backgroundColor: isDarkMode ? 'rgba(220, 38, 38, 0.8)' : '#ef5350',
        color: 'white',
        '&:hover': {
          backgroundColor: isDarkMode ? 'rgba(220, 38, 38, 0.9)' : '#d32f2f',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
        },
      };
    case 'success':
      return {
        ...baseStyle,
        backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.8)' : '#4caf50',
        color: 'white',
        '&:hover': {
          backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.9)' : '#388e3c',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
        },
      };
    case 'info':
      return {
        ...baseStyle,
        backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.8)' : '#2196f3',
        color: 'white',
        '&:hover': {
          backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.9)' : '#1976d2',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
        },
      };
    default:
      return {
        ...baseStyle,
        color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.6)',
        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
        '&:hover': {
          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          transform: 'translateY(-2px)',
        },
      };
  }
};

/**
 * Get styles for icon buttons based on type and disabled state
 * @param {string} type - Type of icon button (delete, add, edit, etc.)
 * @param {boolean} isDarkMode - Whether dark mode is enabled
 * @param {boolean} isDisabled - Whether the button is disabled
 * @returns {Object} Styles for the icon button
 */
export const getIconButtonStyle = (type, isDarkMode, isDisabled = false) => {
  const baseStyle = {
    borderRadius: "8px",
    padding: "8px 12px",
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: isDisabled ? 0.6 : 1,
    '&:hover': {
      transform: isDisabled ? undefined : 'translateY(-2px)',
      boxShadow: isDisabled ? undefined : '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
  };

  switch (type) {
    case 'delete':
      return {
        ...baseStyle,
        color: isDisabled 
          ? (isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.26)") 
          : (isDarkMode ? "#ff5c5c" : "#d32f2f"),
        backgroundColor: isDarkMode 
          ? (isDisabled ? 'rgba(255, 255, 255, 0.05)' : 'rgba(220, 38, 38, 0.1)')
          : (isDisabled ? 'rgba(0, 0, 0, 0.04)' : 'rgba(220, 38, 38, 0.05)'),
        border: `1px solid ${isDarkMode 
          ? (isDisabled ? 'rgba(255, 255, 255, 0.05)' : 'rgba(220, 38, 38, 0.2)') 
          : (isDisabled ? 'rgba(0, 0, 0, 0.05)' : 'rgba(220, 38, 38, 0.15)')}`,
        '&:hover': {
          backgroundColor: isDisabled ? undefined : (isDarkMode ? 'rgba(220, 38, 38, 0.2)' : 'rgba(220, 38, 38, 0.1)'),
          ...baseStyle['&:hover'],
        },
      };
    case 'add':
      return {
        ...baseStyle,
        color: isDisabled 
          ? (isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.26)") 
          : (isDarkMode ? "#3b82f6" : "#2563eb"),
        backgroundColor: isDarkMode 
          ? (isDisabled ? 'rgba(255, 255, 255, 0.05)' : 'rgba(59, 130, 246, 0.1)')
          : (isDisabled ? 'rgba(0, 0, 0, 0.04)' : 'rgba(59, 130, 246, 0.05)'),
        border: `1px solid ${isDarkMode 
          ? (isDisabled ? 'rgba(255, 255, 255, 0.05)' : 'rgba(59, 130, 246, 0.2)') 
          : (isDisabled ? 'rgba(0, 0, 0, 0.05)' : 'rgba(59, 130, 246, 0.15)')}`,
        '&:hover': {
          backgroundColor: isDisabled ? undefined : (isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'),
          ...baseStyle['&:hover'],
        },
      };
    case 'edit':
      return {
        ...baseStyle,
        color: isDisabled 
          ? (isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.26)") 
          : (isDarkMode ? "#10b981" : "#059669"),
        backgroundColor: isDarkMode 
          ? (isDisabled ? 'rgba(255, 255, 255, 0.05)' : 'rgba(16, 185, 129, 0.1)')
          : (isDisabled ? 'rgba(0, 0, 0, 0.04)' : 'rgba(16, 185, 129, 0.05)'),
        border: `1px solid ${isDarkMode 
          ? (isDisabled ? 'rgba(255, 255, 255, 0.05)' : 'rgba(16, 185, 129, 0.2)') 
          : (isDisabled ? 'rgba(0, 0, 0, 0.05)' : 'rgba(16, 185, 129, 0.15)')}`,
        '&:hover': {
          backgroundColor: isDisabled ? undefined : (isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)'),
          ...baseStyle['&:hover'],
        },
      };
    default:
      return {
        ...baseStyle,
        color: isDisabled 
          ? (isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.26)") 
          : (isDarkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.7)"),
        backgroundColor: isDarkMode 
          ? (isDisabled ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.08)')
          : (isDisabled ? 'rgba(0, 0, 0, 0.04)' : 'rgba(0, 0, 0, 0.04)'),
        border: `1px solid ${isDarkMode 
          ? 'rgba(255, 255, 255, 0.1)' 
          : 'rgba(0, 0, 0, 0.1)'}`,
        '&:hover': {
          backgroundColor: isDisabled ? undefined : (isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.06)'),
          ...baseStyle['&:hover'],
        },
      };
  }
};
