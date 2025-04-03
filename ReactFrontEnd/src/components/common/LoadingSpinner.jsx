import React from 'react';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';

const LoadingSpinner = ({ message = 'Chargement...' }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Primary brand color
  const brandColor = 'rgba(42, 33, 133, 1)';
  const brandColorLight = 'rgba(42, 33, 133, 0.8)';

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backdropFilter: 'blur(8px)',
        backgroundColor: isDarkMode 
          ? 'rgba(0, 0, 0, 0.7)' 
          : 'rgba(255, 255, 255, 0.7)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isDarkMode 
            ? 'rgba(42, 33, 133, 0.2)' 
            : 'rgba(42, 33, 133, 0.1)',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: isDarkMode 
            ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
            : '0 8px 32px rgba(42, 33, 133, 0.2)',
        }}
      >
        <CircularProgress 
          size={60} 
          thickness={4}
          sx={{
            color: isDarkMode ? brandColorLight : brandColor,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        <Typography 
          variant="h6" 
          sx={{
            color: isDarkMode ? brandColorLight : brandColor,
            fontWeight: 500,
            marginTop: 2,
            textShadow: isDarkMode 
              ? '0 2px 4px rgba(0, 0, 0, 0.5)' 
              : '0 1px 2px rgba(255, 255, 255, 0.5)',
          }}
        >
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingSpinner; 