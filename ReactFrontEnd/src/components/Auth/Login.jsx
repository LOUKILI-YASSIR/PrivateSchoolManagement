import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import apiServices from '../../api/apiServices';
import LoadingSpinner from '../common/LoadingSpinner';
import { useActionMenu } from '../menu/hooks/useActionMenu';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  FormControlLabel, 
  Checkbox,
  Alert,
  Paper,
  Tabs,
  Tab,
  InputAdornment, 
  IconButton,
  Tooltip,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../../Store/Slices/ThemeSlice';
import DarkModeToggle from '../common/DarkModeToggle';
import MenuCart from '../menu/CartMenu';
import PHONE from '../Fields/PhoneField';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState(0); // 0: username, 1: email, 2: phone
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { login } = useAuth();
  const { t, i18n } = useTranslation();
  const langMenuAction = useActionMenu();
  const nav = useNavigate();
  
  // Dark mode from Redux
  const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);
  const dispatch = useDispatch();
  
  // Get theme color based on dark mode rgba(42, 33, 133, 1)
  const getThemeColor = (alpha = 1) => 
    isDarkMode ? `rgba(106, 95, 201, ${alpha})` : `rgba(42, 33, 133, ${alpha})`;
  
  const languages = [
    { code: 'fr', flag: '/Locales/fr.png' },
    { code: 'en', flag: '/Locales/en.png' },
    { code: 'es', flag: '/Locales/es.png' },
    { code: 'de', flag: '/Locales/de.png' },
  ];

  const handleLanguageMenuOpen = (event) => {
    setLanguageMenuAnchor(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchor(null);
  };

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    handleLanguageMenuClose();
  };
  
  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };
  
  const handleTabChange = (event, newValue) => {
    setLoginMethod(newValue);
    setLoginValue('');
    setPassword('');
    setError('');
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

// Persist only identifier if rememberMe; never store password
const storeIdentifier = id => localStorage.setItem('identifier', id);
const clearIdentifier = () => localStorage.removeItem('identifier');

useEffect(() => {
  const storedId = localStorage.getItem('identifier');
  if (storedId) {
    setRememberMe(true);
    setLoginValue(storedId);
    if (storedId.includes('@')) setLoginMethod(1);
    else if (/^\+?[0-9]{10,15}$/.test(storedId)) setLoginMethod(2);
  }
}, []);

const validateInput = () => {
  if (!loginValue.trim()) {
    setError([
      'login.error.usernameRequired',
      'login.error.emailRequired',
      'login.error.phoneRequired'
    ][loginMethod]);
    return false;
  }
  if (!password) {
    setError('login.error.passwordRequired');
    return false;
  }
  if (loginMethod === 0 && !/^[A-Za-z0-9_]{3,}$/.test(loginValue)) {
    setError('login.error.invalidUserName');
    return false;
  }
  if (loginMethod === 1 && !/\S+@\S+\.\S+/.test(loginValue)) {
    setError('login.error.invalidEmail');
    return false;
  }
  if (loginMethod === 2 && !/^\+?[0-9]{10,15}$/.test(loginValue)) {
    setError('login.error.invalidPhone');
    return false;
  }
  return true;
};

const handleSubmit = async e => {
  e.preventDefault();
  setError('');
  if (!validateInput()) return;

  setIsLoading(true);
  try {
    const payload = { identifier: loginValue, PasswordUT: password };
    const response = await apiServices.postData('/login', payload);
    const data = response;
    console.log(data);

    // Save identifier if remember me is checked
    if (rememberMe) {
      storeIdentifier(loginValue);
    } else {
      clearIdentifier();
    }

    // Handle successful login with token
    if (data.status === 'success' && data?.data?.access_token) {
      const token = data.data.access_token;
      const role = data.data.role;
      login(data.data.MatriculeUT, token, role );
    }
    // Handle password change requirement
    else if (data.status === 'user' && data.message === 'must_change_password') {
      nav('/YLSchool/reset-password', { 
        state: { 
          user: {
            ...data.data.user,
            MatriculeUT: data.data.MatriculeUT,
            requires_password_change: true,
            TypeUT: 'db'
          } 
        }
      });
    }
    // Handle 2FA requirement
    else if (data.status === 'error' && data.message === '2fa_required') {
      handleTwoFactorAuthRedirect(data);
    }
    // Handle other errors
    else if (data.status === 'error') {
      setError('login.error.invalidCredentials');
    } else {
      setError('login.error.general');
    }
  } catch (err) {
    console.error(err);
    const errorResponse = err?.response?.data;
    const statusCode = err?.response?.status;
    
    console.log(errorResponse);
    
    // Handle error responses with status code 403
    if (statusCode === 403) {
      // Handle password change requirement
      if (errorResponse?.status === 'user' && errorResponse?.message === 'must_change_password') {
        nav('/YLSchool/reset-password', { 
          state: { 
            user: {
              ...errorResponse.data.user,
              MatriculeUT: errorResponse.data.MatriculeUT,
              requires_password_change: true,
              TypeUT: 'db'
            } 
          }
        });
        return;
      }
      
      // Handle 2FA requirement case
      if (errorResponse?.message === '2fa_required') {
        handleTwoFactorAuthRedirect(errorResponse);
        return;
      }
    }
    
    // Handle other status codes
    if (statusCode === 422) {
      const msgs = errorResponse?.errors || {};
      setError(Object.values(msgs).flat()[0] || 'login.error.invalidInput');
    } else if (statusCode === 429) {
      setError('login.error.tooManyAttempts');
    } else if (statusCode === 401) {
      setError([
        'login.error.invalidUsernamePassword',
        'login.error.invalidEmailPassword',
        'login.error.invalidPhonePassword'
      ][loginMethod]);
    } else {
      setError('login.error.general');
    }
  } finally {
    setIsLoading(false);
  }
};

// Helper function to handle 2FA authentication routing
const handleTwoFactorAuthRedirect = (data) => {
  console.log('Handling 2FA redirect with data:', data);
  const methods = data.data?.methods || [];
  
  // Sort methods by security level (highest to lowest)
  const sortedMethods = methods.sort((a, b) => {
    const securityLevels = {
      'google': 4,
      'email': 3,
      'sms': 2,
      'db': 1
    };
    return securityLevels[b.id] - securityLevels[a.id];
  });

  if (sortedMethods && sortedMethods.length > 0) {
    const firstMethod = sortedMethods[0];
    
    // Create verification flow data to track the sequence
    const verificationFlow = {
      allMethods: sortedMethods,
      currentIndex: 0,
      isLastMethod: sortedMethods.length === 1
    };
    
    switch (firstMethod.id) {
      case 'google':
        // For Google authenticator, go to the Google auth page
        nav('/YLSchool/reset-password-request-totp', { 
          state: { 
            user: {
              ...data.data.user,
              TypeUT: 'google'  
            },
            verificationFlow
          }
        });
        break;
        
      case 'email':
      case 'sms':
        // For SMS or email verification, go to the email/SMS verification page
        nav('/YLSchool/email-sms-reset-password', { 
          state: { 
            user: {
              ...data.data.user,
              TypeUT: firstMethod.id
            },
            verificationFlow,
            type: firstMethod.id
          }
        });
        break;
        
      case 'db':
        // For db method, go to reset password request page
        nav('/YLSchool/reset-password-request', { 
          state: { 
            user: {
              ...data.data.user,
              TypeUT: 'db'
            },
            verificationFlow
          }
        });
        break;
        
      default:
        // If multiple methods are available, let user choose
        nav('/YLSchool/select-reset-password', { 
          state: { 
            user: data.data.user,
            methods: sortedMethods,
            verificationFlow
          }
        });
    }
  } else {
    // If no methods available, show error
    setError('login.error.no2FAMethods');
  }
};

  const getLoginLabel = () => 
    t([
      'login.username',
      'login.email',
      'login.phone'][loginMethod]
    );

  const getLoginIcon = () => [
    <PersonIcon />,
    <EmailIcon />,
    <PhoneIcon />][loginMethod];

  const getCurrentLanguageFlag = () => {
    const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];
    return currentLang.flag;
  };

  return (
    <>
      {isLoading && <LoadingSpinner message={t('login.loggingIn')} />}
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
                <Typography>{t('login.selectLanguage') || 'Select Language'}</Typography>
              </Box>
            }
          />

          {/* Dark Mode Toggle */}
          <DarkModeToggle 
            isDarkMode={isDarkMode} 
            toggleDarkMode={handleToggleDarkMode}
          />
        </Box>

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
            {t('login.title')}
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
            {t('login.subtitle')}
          </Typography>
            
          <Tabs
            value={loginMethod}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              mb: 3,
              width: '100%',
              '& .MuiTabs-indicator': {
                backgroundColor: getThemeColor(),
                height: '3px',
                borderRadius: '3px'
              },
              '& .Mui-selected': {
                color: `${getThemeColor()} !important`,
                fontWeight: 'bold'
              },
              '& .MuiTab-root': {
                minWidth: '33.33%',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'
              }
            }}
          >
            <Tab icon={<PersonIcon sx={{ color: isDarkMode && loginMethod !== 0 ? 'rgba(255,255,255,0.7)' : 'inherit' }} />} label={t('login.tabUsername')} />
            <Tab icon={<EmailIcon sx={{ color: isDarkMode && loginMethod !== 1 ? 'rgba(255,255,255,0.7)' : 'inherit' }} />} label={t('login.tabEmail')} />
            <Tab icon={<PhoneIcon sx={{ color: isDarkMode && loginMethod !== 2 ? 'rgba(255,255,255,0.7)' : 'inherit' }} />} label={t('login.tabPhone')} />
          </Tabs>
            
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {t(error)}
            </Alert>
          )}

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            {
              loginMethod !== 2 ? (
                <TextField
                  fullWidth
                  label={getLoginLabel()}
                  margin="normal"
                  value={loginValue}
                  variant="outlined"
                  onChange={(e) => setLoginValue(e.target.value)}
                  disabled={isLoading}
                  onFocus={() => setFocusedField('identifier')}
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
                          transform: focusedField === 'identifier' ? 'scale(1.2)' : 'scale(1)',
                          color: focusedField === 'identifier' ? getThemeColor() : 'inherit',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}>
                          {getLoginIcon()}
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                  type={'text'}
                />
              ) : (
                <PHONE
                  value={loginValue}
                  onChange={(value) => setLoginValue(value)}
                  isDarkMode={isDarkMode}
                  disabled={isLoading}
                  isLogin={true}
                  label={t('login.phone')}
                  placeholder={t('login.phonePlaceholder')}
                  variant="outlined"
                />
              )
            }

            <TextField
              fullWidth
              label={t('login.password')}
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              onFocus={() => setFocusedField('password')}
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
                      transform: focusedField === 'password' ? 'scale(1.2)' : 'scale(1)',
                      color: focusedField === 'password' ? getThemeColor() : 'inherit',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}>
                      <LockIcon />
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
                        color: focusedField === 'password' 
                          ? getThemeColor() 
                          : isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit',
                        transform: focusedField === 'password' ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <FormControlLabel
                control={
                  <Tooltip 
                    title={t('login.rememberMeTooltip') || "Saves your login information securely. You will stay logged in on this device."}
                    placement="bottom-start"
                    arrow
                  >
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isLoading}
                      sx={{
                        color: isDarkMode ? 'rgba(255,255,255,0.5)' : getThemeColor(0.7),
                        '&.Mui-checked': {
                          color: getThemeColor(),
                        },
                      }}
                    />
                  </Tooltip>
                }
                label={
                  <Tooltip 
                    title={t('login.rememberMeTooltip') || "Saves your login information securely. You will stay logged in on this device."}
                    placement="bottom"
                    arrow
                  >
                    <Typography 
                      sx={{ 
                        color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit',
                        cursor: 'help'
                      }}
                    >
                      {t('login.rememberMe')}
                    </Typography>
                  </Tooltip>
                }
              />
              <Link 
                to="/YLSchool/check-user-reset-password"
                className='login-link'
                style={{
                  textDecoration: 'none',
                  fontWeight: isDarkMode ? 'bold' : 'normal',
                  color: getThemeColor(), 
                  pointerEvents: isLoading ? 'none' : 'auto',
                  opacity: isLoading ? 0.7 : 1
                }} 
              >
                {t('login.forgotPassword')}
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
              {t('login.submit')}
            </Button>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default Login;