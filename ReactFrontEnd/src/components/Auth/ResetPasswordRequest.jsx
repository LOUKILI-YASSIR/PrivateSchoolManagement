import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import apiServices from '../../api/apiServices';
import LoadingSpinner from '../common/LoadingSpinner';
import DarkModeToggle from '../common/DarkModeToggle';
import MenuCart from '../menu/CartMenu';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Paper, 
  Alert, 
  InputAdornment,
  Tabs,
  Tab,
  IconButton,
  FormControlLabel,
  Tooltip,
  Checkbox,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import SchoolIcon from '@mui/icons-material/School';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../../Store/Slices/ThemeSlice';
import PHONE from '../Fields/PhoneField';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../utils/contexts/AuthContext';

const ResetPasswordRequest = ({ isFromLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [ValidationCode, setValidationCode] = useState('');
  const [ShowValidationCode, setShowValidationCode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const { t } = useTranslation();
  const nav = useNavigate();
  const location = useLocation();
  const { state } = location;
  const user = state?.user;
  const verificationFlow = state?.verificationFlow;
  const { login } = useAuth();
  
  // Check for verification flow data
  const isLastMethod = verificationFlow?.isLastMethod;
  const allMethods = verificationFlow?.allMethods || [];
  const currentIndex = verificationFlow?.currentIndex || 0;
  
  // Get the next method if available
  const getNextMethod = () => {
    if (!verificationFlow || !allMethods || currentIndex >= allMethods.length - 1) {
      return null;
    }
    return allMethods[currentIndex + 1];
  };

  // Dark mode from Redux
  const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);
  const dispatch = useDispatch();

  const getThemeColor = (alpha = 1) => 
    isDarkMode ? `rgba(106, 95, 201, ${alpha})` : `rgba(42, 33, 133, ${alpha})`;

  const languages = [
    { code: 'fr', flag: '/Locales/fr.png' },
    { code: 'en', flag: '/Locales/en.png' },
    { code: 'es', flag: '/Locales/es.png' },
    { code: 'de', flag: '/Locales/de.png' },
  ];

    const handleTogglePasswordVisibility = () => {
      setShowValidationCode(!ShowValidationCode);
    };
    const validateInput = () => {

    if (!ValidationCode) {
      setError('login.error.passwordRequired');
      return false;
    }

    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateInput()) {
      return;
    }

    try {
      setIsLoading(true);
  
      const loginData = {
        identifier: user?.UserNameUT || user?.EmailUT || user?.PhoneUT,
        CodeVerificationUT: ValidationCode
      };
      const response = await apiServices.postData('/forgot-password-code-verivication', loginData);

      if (response.status === 'success') {
        if (isFromLogin) {
          // Handle login verification flow
          if (isLastMethod) {
            // If this is the last verification method, complete the authentication process
            try {
              console.log('Last verification method passed, completing authentication');
              
              // Call a completion endpoint to get a token
              const completionResponse = await apiServices.postData('/complete-2fa', {
                identifier: user.EmailUT || user.UserNameUT || user.PhoneUT,
                verification_status: true,
                password: user.PasswordUT || ''
              });
              
              if (completionResponse.status === 'success' && completionResponse.data?.access_token) {
                // Store token in session storage
                sessionStorage.setItem('token', completionResponse.data.access_token);
                sessionStorage.setItem('userRole', completionResponse.data.role);
                 sessionStorage.setItem('userID', completionResponse.data.MatriculeUT);
                // Navigate to dashboard
                nav('/YLSchool/DashBoard');
              } else {
                console.error('Failed to complete authentication after 2FA verification');
                nav('/YLSchool/Login');
              }
              return;
            } catch (error) {
              console.error("Error during 2FA completion:", error);
              
              // Fallback to direct navigation if the completion endpoint fails
              console.log('Falling back to direct dashboard navigation');
              nav('/YLSchool/DashBoard');
              return;
            }
          } else {
            // Move to the next verification method
            const nextMethod = getNextMethod();
            if (!nextMethod) {
              nav('/YLSchool/DashBoard');
              return;
            }
            
            // Update verification flow for the next method
            const updatedFlow = {
              ...verificationFlow,
              currentIndex: currentIndex + 1,
              isLastMethod: currentIndex + 1 >= allMethods.length - 1
            };
            
            // Navigate to the appropriate next verification method
            switch (nextMethod.id) {
              case 'google':
                nav('/YLSchool/reset-password-request-totp', { 
                  state: { 
                    user: { ...user, previousVerification: ValidationCode },
                    verificationFlow: updatedFlow 
                  }
                });
                break;
                
              case 'email':
              case 'sms':
                nav('/YLSchool/reset-password-request-' + nextMethod.id, { 
                  state: { 
                    user: { ...user, previousVerification: ValidationCode },
                    verificationFlow: updatedFlow,
                    type: nextMethod.id
                  }
                });
                break;
                
              case 'db':
                nav('/YLSchool/reset-password-request', { 
                  state: { 
                    user: { ...user, previousVerification: ValidationCode },
                    verificationFlow: updatedFlow
                  }
                });
                break;
                
              default:
                nav('/YLSchool/DashBoard');
            }
          }
        } else {
          // Handle password reset flow
          nav('/YLSchool/reset-password', { 
            state: { user: {...response.data, CodeVerificationUT: ValidationCode} } 
          });
        }
      } else {
        setError('resetPassword.error.general');
      }
    } catch (error) {
      setError('resetPassword.error.general');
    } finally {
      setIsLoading(false);
    }
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
                  <img src={languages.find(lang => lang.code === t('language'))?.flag || languages[0].flag} alt="Lang Flag" style={{ width: '100%', borderRadius: '50%' }} />
                </Box>
                <Typography>{t('login.selectLanguage')}</Typography>
              </Box>
            }
          />
          <DarkModeToggle 
            isDarkMode={isDarkMode} 
            toggleDarkMode={() => dispatch(toggleDarkMode())}
          />
        </Box>
        {/* Back Button */}
        <IconButton
          onClick={() => state?.fromLogin ? nav('/YLSchool/Login') : nav('/YLSchool/select-reset-password', { state: { user } })}

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
            maxWidth: 500, 
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
          <SchoolIcon sx={{ fontSize: 60, color: getThemeColor(), mb: 2 }} />
          <Typography
            variant="h4"
            component="h1"
            gutterBottom 
            align="center"
            sx={{
              color: getThemeColor(),
              fontWeight: 'bold',
              mb: 1,
              width: '100vw',
              fontSize: { xs: '1.75rem', sm: '2.125rem' },
              minHeight: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textShadow: isDarkMode ? '0 0 8px rgba(106, 95, 201, 0.5)' : 'none'
            }}
          >
            {t('resetPassword.requestTitle')}
          </Typography>
          <Typography
            variant="subtitle1" 
            align="center" 
            sx={{
              color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary',
              mb: 2,
              minHeight: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {t('resetPassword.requestSubtitle')}
          </Typography>
            
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {t(error)}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              {t(success)}
            </Alert>
          )}

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
              fullWidth
              label={t('resetPassword.validationCode')}
              type={ShowValidationCode ? 'text' : 'password'}
              margin="normal"
              variant="outlined"
              value={ValidationCode}
              onChange={(e) => setValidationCode(e.target.value)}
              disabled={isLoading}
              onFocus={() => setFocusedField('ValidationCode')}
              onBlur={() => setFocusedField(null)}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: getThemeColor(),
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: getThemeColor(),
                  },
                },
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.87)',
                },
                '& .MuiOutlinedInput-input': {
                  color: isDarkMode ? 'white' : 'inherit',
                },
                '& .MuiInputAdornment-root': {
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ 
                      transform: focusedField === 'ValidationCode' ? 'scale(1.2)' : 'scale(1)',
                      color: focusedField === 'ValidationCode' ? getThemeColor() : 'inherit',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}>
                      <AdminPanelSettingsIcon />
                    </Box>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      disabled={isLoading}
                      sx={{ 
                        color: focusedField === 'ValidationCode' 
                          ? getThemeColor() 
                          : isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit',
                        transform: focusedField === 'ValidationCode' ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      {ShowValidationCode ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Link 
                to="/YLSchool/select-reset-password"
                className='login-link'
                style={{
                  textAlign: "right",
                  width: "100%",
                  marginBlock: "0.5rem",
                  textDecoration: 'none',
                  fontWeight: isDarkMode ? 'bold' : 'normal',
                  color: getThemeColor(), 
                  pointerEvents: isLoading ? 'none' : 'auto',
                  opacity: isLoading ? 0.7 : 1
                }} 
              >
                {t('resetPassword.returnToLogin')}
              </Link>
            </Box>
            <Button
              fullWidth
              variant="contained"
              type="submit"
              size="large"
              disabled={isLoading}
              sx={{
                py: 1.5,
                textTransform: 'none',
                fontSize: '1.1rem',
                borderRadius: 2,
                boxShadow: isDarkMode ? '0 0 15px rgba(106, 95, 201, 0.5)' : 3,
                bgcolor: getThemeColor(),
                '&:hover': {
                  bgcolor: isDarkMode ? '#8579da' : 'rgba(106, 95, 201, 0.7)',
                  boxShadow: isDarkMode ? '0 0 20px rgba(106, 95, 201, 0.7)' : 5,
                },
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              {isLoading ? t('resetPassword.sending') : t('resetPassword.sendLink')}
            </Button>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default ResetPasswordRequest;