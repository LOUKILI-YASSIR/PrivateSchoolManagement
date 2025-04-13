import React from 'react';
import { useSelector } from 'react-redux';
import { Box, IconButton, Menu, MenuItem, Paper } from '@mui/material';
import { ThemeConfig } from './ThemeConfig';
import LanguageIcon from '@mui/icons-material/Language';
import MenuCart from '../menu/CartMenu';

const LanguageSelector = ({ currentLanguage, onLanguageChange, languages = ['fr', 'en', 'es', 'de'], isFormHeader = false }) => {
  const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);

  return (
    <>
      <MenuCart
        menuItems={languages}
        isFormHeader={isFormHeader}
        menuContent={
          <img 
            src={`/Locales/${currentLanguage}.png`} 
            alt={currentLanguage} 
            className="w-10 my-1 transition-transform duration-200 hover:scale-110"
          />
        }
        menuPositionActive={{ x: 230, y: -5 }}
        menuPositionNotActive={{ x: 450, y: 0 }}
        menuType="language"
      />
      <span className="absolute inset-0 bg-blue-500 rounded-full scale-0 transition-transform duration-300 ease-in-out opacity-0 hover:opacity-10 hover:scale-100"></span>
    </>    
  );
};

export default LanguageSelector;
