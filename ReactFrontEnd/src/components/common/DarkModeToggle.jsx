import React from 'react';
import { Box, Paper, Switch } from "@mui/material";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { ThemeConfig } from './ThemeConfig';

/**
 * A reusable animated dark mode toggle component
 * @param {Object} props - Component props
 * @param {boolean} props.isDarkMode - Current dark mode state
 * @param {function} props.toggleDarkMode - Function to toggle dark mode
 * @param {Object} props.sx - Additional MUI styling for the Paper component
 * @returns {JSX.Element} Dark mode toggle component
 */
const DarkModeToggle = ({ isDarkMode, toggleDarkMode, sx = {} }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        bgcolor: isDarkMode ? ThemeConfig.colors.primary.dark : 'white',
        color: isDarkMode ? 'white' : ThemeConfig.colors.primary.dark,
        '&:hover': { 
          boxShadow: 4,
          transform: 'translateY(-2px)'
        },
        minWidth: 100,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        ...sx
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          px: 2, 
          py: 1,
          width: '100%',
          justifyContent: 'space-between'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            width: 24,
            height: 24,
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              transform: isDarkMode ? 'translateY(0)' : 'translateY(-100%)',
              opacity: isDarkMode ? 1 : 0,
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <DarkModeIcon 
              fontSize="small" 
              sx={{ 
                transform: isDarkMode ? 'rotate(0deg)' : 'rotate(45deg)',
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }} 
            />
          </Box>
          <Box
            sx={{
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              transform: isDarkMode ? 'translateY(100%)' : 'translateY(0)',
              opacity: isDarkMode ? 0 : 1,
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <LightModeIcon 
              fontSize="small" 
              sx={{ 
                transform: isDarkMode ? 'rotate(-45deg)' : 'rotate(0deg)',
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }} 
            />
          </Box>
        </Box>
        
        <Switch
          checked={isDarkMode}
          onChange={toggleDarkMode}
          size="small"
          sx={{
            width: 42,
            height: 26,
            padding: 0,
            '& .MuiSwitch-switchBase': {
              padding: 0,
              margin: '3px',
              transitionDuration: '300ms',
              '&.Mui-checked': {
                transform: 'translateX(16px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                  backgroundColor: isDarkMode ? ThemeConfig.colors.primary.dark : ThemeConfig.colors.primary.main,
                  opacity: 1,
                  border: 0,
                },
                '&.Mui-disabled + .MuiSwitch-track': {
                  opacity: 0.5,
                },
              },
              '&.Mui-focusVisible .MuiSwitch-thumb': {
                color: ThemeConfig.colors.primary.dark,
                border: '6px solid #fff',
              },
              '&.Mui-disabled .MuiSwitch-thumb': {
                color: isDarkMode ? 'grey.600' : 'grey.400',
              },
              '&.Mui-disabled + .MuiSwitch-track': {
                opacity: isDarkMode ? 0.3 : 0.1,
              },
            },
            '& .MuiSwitch-thumb': {
              boxSizing: 'border-box',
              width: 20,
              height: 20,
              boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
            },
            '& .MuiSwitch-track': {
              borderRadius: 26 / 2,
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.25)',
              opacity: 1,
              transition: 'background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default DarkModeToggle; 