import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Alert,
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';
import KeyIcon from '@mui/icons-material/Key';
import GoogleIcon from '@mui/icons-material/Google';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DarkModeToggle from '../common/DarkModeToggle';
import MenuCart from '../menu/CartMenu';
import LoadingSpinner from '../common/LoadingSpinner';

const SelectResetPasswordType = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();

  const user = state?.user || null; // Get user from state or set to null

    const [isOnline, setIsOnline] = useState(navigator.onLine);
    useEffect(() => {
      if(!user){
        navigate('/YLSchool/check-user-reset-password');
      }
      const checkInternetAccess = async () => {
        try {
          // Use a reliable and fast URL like Google's favicon
          const response = await fetch('https://www.gstatic.com/generate_204', { mode: 'no-cors' });
          setIsOnline(true);
        } catch (error) {
          setIsOnline(false);
        }
      };
    
      const handleOnline = () => {
        checkInternetAccess();
      };
    
      const handleOffline = () => {
        setIsOnline(false);
      };
    
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    
      // Initial check
      checkInternetAccess();
    
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }, []);
    
  // Dark mode from Redux
  const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);
  
  // Get theme color based on dark mode
  const getThemeColor = (alpha = 1) => 
    isDarkMode ? `rgba(106, 95, 201, ${alpha})` : `rgba(42, 33, 133, ${alpha})`;

  const languages = [
    { code: 'fr', flag: '/Locales/fr.png' },
    { code: 'en', flag: '/Locales/en.png' },
    { code: 'es', flag: '/Locales/es.png' },
    { code: 'de', flag: '/Locales/de.png' },
  ];

  const getCurrentLanguageFlag = () => {
    const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];
    return currentLang.flag;
  };

  const resetOptions = [
    {
      disabled: false, // or any condition to check if TOTP is set up
      title: 'resetPassword.authApp.title',
      description: 'resetPassword.authApp.description',
      icon: <GoogleIcon sx={{ fontSize: 40 }} />,
      path: '/YLSchool/reset-password-request-totp',
      color: '#9C27B0'
    },    
    {
      disabled: false,
      title: 'resetPassword.dbCode.title',
      description: 'resetPassword.dbCode.description',
      icon: <KeyIcon sx={{ fontSize: 40 }} />,
      path: '/YLSchool/reset-password-request',
      color: '#4CAF50'
    },
    {
      disabled: !isOnline || !user?.EmailUT,
      title: 'resetPassword.email.title',
      description: 'resetPassword.email.description',
      icon: <EmailIcon sx={{ fontSize: 40 }} />,
      path: '/YLSchool/reset-password-request-email',
      color: '#2196F3'
    },
    {
      disabled: !isOnline || !user?.PhoneUT,
      title: 'resetPassword.sms.title',
      description: 'resetPassword.sms.description',
      icon: <SmsIcon sx={{ fontSize: 40 }} />,
      path: '/YLSchool/reset-password-request-sms',
      color: '#FF9800'
    }
  ];
  console.log(isOnline,user,resetOptions)
  const handleOptionClick = (path) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      // If this is a reset type selection from a login verification flow, 
      // preserve the verification flow
      if (state?.verificationFlow) {
        navigate(path, { 
          state: { 
            user, 
            verificationFlow: state.verificationFlow,
            type: path.includes("email") ? "email" : path.includes("sms") ? "sms" : undefined
          } 
        });
      } else {
        // Regular password reset flow
        navigate(path, { state: { user } });
      }
    }, 300);
  };

  return (
    <>
      {isLoading && <LoadingSpinner message={t('resetPassword.loading')} />}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: isDarkMode ? '#121212' : '#f5f5f5',
          p: 2,
          transition: 'background-color 0.3s ease',
          filter: isLoading ? 'blur(3px)' : 'none',
          pointerEvents: isLoading ? 'none' : 'all'
        }}
      >
        {/* Language and Dark Mode Controls */}
        <Box
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            display: 'flex',
            gap: 2,
            zIndex: 1
          }}
        >
          {/* Language Selector */}
          <MenuCart
            margin="5px 50px"
            menuType="language"
            menuItems={languages.map((lang) => lang.code)}
            menuContent={
              <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 28,
                    height: 28,
                    position: 'relative',
                    mr: 1,
                  }}
                >
                  <img src={getCurrentLanguageFlag()} alt="Lang Flag" style={{ width: '100%', borderRadius: '50%' }} />
                </Box>
                <Typography>{t('resetPassword.selectLanguage')}</Typography>
              </Box>
            }
          />

          {/* Dark Mode Toggle */}
          <DarkModeToggle isDarkMode={isDarkMode} />
        </Box>

        {/* Back Button */}
        <IconButton
          component={Link}
          to={state?.fromLogin ? '/YLSchool/Login' :  "/YLSchool/select-reset-password"}
          sx={{
            position: 'absolute',
            top: 20,
            left: 20,
            color: getThemeColor(),
            '&:hover': {
              bgcolor: isDarkMode ? 'rgba(106, 95, 201, 0.1)' : 'rgba(42, 33, 133, 0.1)',
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Paper
          elevation={3}
          sx={{
            maxWidth: 1100,
            width: '100%',
            p: { xs: 3, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: isDarkMode ? '#1e1e1e' : 'white',
            color: isDarkMode ? 'white' : 'inherit',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            boxShadow: isDarkMode ? '0 0 15px rgba(106, 95, 201, 0.3)' : '0 3px 5px rgba(0,0,0,0.2)'
          }}
        >
          <LockResetIcon sx={{ fontSize: 60, color: getThemeColor(), mb: 2 }} />
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{
              color: getThemeColor(),
              fontWeight: 'bold',
              mb: 3,
              fontSize: { xs: '1.75rem', sm: '2.125rem' },
              textShadow: isDarkMode ? '0 0 8px rgba(106, 95, 201, 0.5)' : 'none'
            }}
          >
            {t('resetPassword.selectMethod')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {t(error)}
            </Alert>
          )}

          <Box
            sx={{
              width: '1000px',
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            }}
          >
            {resetOptions.map((option, index) =>
              !option.disabled && (
                <Button
                  key={index}
                  onClick={() => handleOptionClick(option.path)}
                  disabled={isLoading}
                  sx={{
                    display: 'flex',
                    flexDirection: "column",
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    p: 3,
                    borderRadius: 2,
                    bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                    '&:hover': {
                      bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 12px ${option.color}33`,
                    }
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '50%',
                      bgcolor: `${option.color}22`,
                      color: option.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {option.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: isDarkMode ? option.color : option.color,
                        mb: 0.5
                      }}
                    >
                      {t(option.title)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                        textAlign: 'center'
                      }}
                    >
                      {t(option.description)}
                    </Typography>
                  </Box>
                </Button>
              )
            )}
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default SelectResetPasswordType;