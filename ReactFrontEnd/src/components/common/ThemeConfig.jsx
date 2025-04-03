import React from 'react';

/**
 * Centralized theme configuration containing colors and theme variables
 */
export const ThemeConfig = {
  // Primary colors based on rgba(42, 33, 133, X)
  colors: {
    primary: {
      light: 'rgba(42, 33, 133, 0.2)',
      main: 'rgba(42, 33, 133, 0.8)',
      dark: 'rgba(42, 33, 133, 1)',
      hover: 'rgba(42, 33, 133, 0.25)',
      transparent: 'rgba(42, 33, 133, 0.05)',
    },
    // Dark mode colors
    dark: {
      background: '#1e1e1e',
      surface: '#2d2d2d',
      text: {
        primary: '#e0e0e0',
        secondary: 'rgba(255, 255, 255, 0.7)',
      },
      accent: 'rgba(42, 33, 133, 0.6)',
      border: '#444',
      hover: '#3d3d3d',
    },
    // Light mode colors
    light: {
      background: '#f5f5f5',
      surface: '#ffffff',
      text: {
        primary: '#222222',
        secondary: '#666666',
      },
      accent: 'rgba(42, 33, 133, 0.8)',
      border: '#e0e0e0',
      hover: '#eaeaea',
    },
    // Tailwind class mapping for theme colors
    tailwind: {
      // Primary theme color classes
      primary200: 'theme-primary-200',
      primary300: 'theme-primary-300',
      primary400: 'theme-primary-400',
      primary500: 'theme-primary-500',
      primary600: 'theme-primary-600'
    }
  },
  
  /**
   * Get theme color with opacity
   * @param {number} opacity - Opacity value between 0 and 1
   * @returns {string} - RGBA color string
   */
  getThemeColor: (opacity = 1) => {
    return `rgba(42, 33, 133, ${opacity})`;
  },
  
  /**
   * Get tailwind class names for text color based on dark mode
   * @param {boolean} isDarkMode - Whether dark mode is active
   * @returns {string} - Tailwind class names for text color
   */
  getTextColorClass: (isDarkMode) => {
    return isDarkMode ? 'text-gray-100' : 'text-gray-800';
  },
  
  /**
   * Get tailwind class names for primary color based on dark mode
   * @param {boolean} isDarkMode - Whether dark mode is active
   * @returns {string} - Tailwind class names for primary color
   */
  getPrimaryColorClass: (isDarkMode) => {
    return isDarkMode ? 'theme-primary-300' : 'theme-primary-600';
  },
  
  /**
   * Get tailwind class names for primary hover color based on dark mode
   * @param {boolean} isDarkMode - Whether dark mode is active
   * @returns {string} - Tailwind class names for primary hover color
   */
  getPrimaryHoverColorClass: (isDarkMode) => {
    return isDarkMode ? 'theme-primary-200' : 'theme-primary-500';
  },
  
  /**
   * Get tailwind class names for primary accent color based on dark mode
   * @param {boolean} isDarkMode - Whether dark mode is active
   * @returns {string} - Tailwind class names for primary accent color
   */
  getPrimaryAccentColorClass: (isDarkMode) => {
    return isDarkMode ? 'theme-primary-400' : 'theme-primary-600';
  },
  
  /**
   * Get tailwind class names for background color based on dark mode
   * @param {boolean} isDarkMode - Whether dark mode is active
   * @returns {string} - Tailwind class names for background color
   */
  getBackgroundColorClass: (isDarkMode) => {
    return isDarkMode ? 'bg-gray-800' : 'bg-gray-200';
  },
  
  /**
   * Get tailwind class names for card background color based on dark mode
   * @param {boolean} isDarkMode - Whether dark mode is active
   * @returns {string} - Tailwind class names for card background color
   */
  getCardBgColorClass: (isDarkMode) => {
    return isDarkMode ? 'bg-gray-900' : 'bg-white';
  },
  
  /**
   * Get tailwind class for primary background color
   * @param {boolean} isDarkMode - Whether dark mode is active
   * @param {string} opacity - Optional opacity value (10, 20, etc.)
   * @returns {string} - Tailwind class for primary background 
   */
  getPrimaryBgClass: (isDarkMode, opacity = '') => {
    const opacitySuffix = opacity ? `-opacity-${opacity}` : '';
    return isDarkMode ? `bg-theme-primary-700${opacitySuffix}` : `bg-theme-primary-500${opacitySuffix}`;
  }
};

export default ThemeConfig; 