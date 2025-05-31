import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';

/**
 * ContentBlock component for consistent content styling across the application
 * @param {Object} props - Component props
 * @param {ReactNode} props.options - Content to be displayed inside the block
 * @param {ReactNode} props.title - Title to be displayed in the header
 * @param {ReactNode} props.rightElement - Element to be displayed on the right side of the header
 * @param {string} props.className - Additional class names
 * @param {Object} props.style - Additional inline styles
 */
const ContentBlock = ({ 
  children, 
  title, 
  rightElement,
  className = '', 
  style = {} 
}) => {
  const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);
  
  return (
    <div 
      className={`content-block p-6 rounded-lg shadow-lg ${
        isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
      } transition-all duration-300 ease-in-out ${className}`}
      style={style}
    >
      {(title || rightElement) && (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2,
            pb: 2,
            borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          }}
        >
          {title && (
            <Typography variant="h6" fontWeight="bold">
              {title}
            </Typography>
          )}
          {rightElement && (
            <Box>
              {rightElement}
            </Box>
          )}
        </Box>
      )}
      {children}
    </div>
  );
};

export default ContentBlock; 