import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import apiServices from '../../api/apiServices';
import LoadingSpinner from '../common/LoadingSpinner';
import { useActionMenu } from '../Menu/hooks/useActionMenu';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  FormControlLabel, 
  Checkbox,
  Link,
  Alert,
  Paper,
  Tabs,
  Tab,
  InputAdornment, 
  IconButton,
  Tooltip,
} from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
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
  const [labelVariant, setLabelVariant] = useState('outlined'); // 'outlined' or 'standard'
  const { login } = useAuth();
  const { t, i18n } = useTranslation();
  const langMenuAction = useActionMenu();
  
  // Store credentials securely
  const storeCredentials = (loginVal, passwordVal) => {
    // In production, consider using more secure storage methods or encryption
    localStorage.setItem('rememberMe', 'true');
    localStorage.setItem('login', loginVal);
    
    // Option 1: Store password directly (less secure)
    localStorage.setItem('password', passwordVal);
    
    // Option 2: Store an auth token instead of password (more secure)
    // This would require backend support for persistent tokens
  };
  
  // Clear stored credentials
  const clearStoredCredentials = () => {
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('login');
    localStorage.removeItem('password');
    // If using tokens, also remove those
  };

  // Check for stored credentials on component mount
  useEffect(() => {
    const rememberMeStatus = localStorage.getItem('rememberMe') === 'true';
    if (rememberMeStatus) {
      setRememberMe(true);
      const storedLogin = localStorage.getItem('login');
      const storedPassword = localStorage.getItem('password');
      
      if (storedLogin) setLoginValue(storedLogin);
      if (storedPassword) setPassword(storedPassword);
      
      // Determine login method based on stored login
      if (storedLogin) {
        if (storedLogin.includes('@')) {
          setLoginMethod(1); // Email
        } else if (/^\+?[0-9]{10,15}$/.test(storedLogin)) {
          setLoginMethod(2); // Phone
        } else {
          setLoginMethod(0); // Username
        }
      }
    }
  }, []);
  
  // Dark mode from Redux
  const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);
  const dispatch = useDispatch();
  
  // Get theme color based on dark mode
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
  
  const handleToggleLabelVariant = () => {
    setLabelVariant(prev => prev === 'outlined' ? 'standard' : 'outlined');
  };
  
  const handleTabChange = (event, newValue) => {
    setLoginMethod(newValue);
    setLoginValue('');
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateInput = () => {
    if (!loginValue.trim()) {
    switch (loginMethod) {
        case 0:
          setError(t('login.error.usernameRequired'));
          return false;
        case 1:
          setError(t('login.error.emailRequired'));
          return false;
        case 2:
          setError(t('login.error.phoneRequired'));
          return false;
        default:
          return false;
      }
    }

    if (!password) {
      setError(t('login.error.passwordRequired'));
      return false;
    }

    // Email validation for email method
    if (loginMethod === 1 && !/\S+@\S+\.\S+/.test(loginValue)) {
      setError(t('login.error.invalidEmail'));
      return false;
    }

    // Phone validation for phone method
    if (loginMethod === 2 && !/^\+?[0-9]{10,15}$/.test(loginValue)) {
      setError(t('login.error.invalidPhone'));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateInput()) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Create login data structure with a single login field
      const loginData = {
        password: password,
        login: loginValue
      };
      
      // Handle remember me
      if (rememberMe) {
        storeCredentials(loginValue, password);
      } else {
        clearStoredCredentials();
      }
      
      // For testing/development - log out request data
      console.log('Login request data:', loginData);
      
      try {
        // Direct API call for testing
        const response = await fetch('http://127.0.0.1:8000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData),
        });
        
        // Log response for debugging
        console.log('Login response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Login successful:', data);
          if (data.token) {
            // Extract user role from response
            const userRole = data.user?.role || 'etudiant'; // Default to student if role not provided
            
            // Store both token and role
            
            login(data.token, userRole);
            
            // Role-based navigation is handled in the AuthContext
          } else {
            setError("Login successful but no token received");
          }
        } else {
          // Try to get error details
          try {
            const errorData = await response.json();
            console.error('Login error details:', errorData);
            
            // Handle specific error cases
            if (response.status === 401) {
              setError(t('login.error.invalidCredentials'));
            } else if (response.status === 422) {
              // Validation errors
              const errorMessage = errorData.message || 
                errorData.errors?.login?.[0] || 
                errorData.errors?.password?.[0] ||
                t('login.error.invalidCredentials');
              setError(errorMessage);
            } else if (response.status === 429) {
              setError(t('login.error.tooManyAttempts') || 'Too many login attempts. Please try again later.');
            } else {
              // Default error message
              setError(errorData.message || t('login.error.serverError'));
            }
          } catch (jsonError) {
            setError(t('login.error.serverError'));
          }
        }
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        setError(t('login.error.serverError'));
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(t('login.error.serverError'));
    } finally {
      setIsLoading(false);
    }
  };

  const getLoginLabel = () => {
    switch (loginMethod) {
      case 0:
        return t('login.username');
      case 1:
        return t('login.email');
      case 2:
        return t('login.phone');
      default:
        return t('login.username');
    }
  };

  const getLoginIcon = () => {
    switch (loginMethod) {
      case 0:
        return <PersonIcon />;
      case 1:
        return <EmailIcon />;
      case 2:
        return <PhoneIcon />;
      default:
        return <PersonIcon />;
    }
  };

  // Get current language flag
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
          
          {/* Label Style Toggle */}
          <Tooltip
            title={`Switch to ${labelVariant === 'outlined' ? 'standard' : 'outlined'} label style`}
            arrow
            placement="bottom"
          >
            <Paper
              elevation={3}
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                bgcolor: isDarkMode ? getThemeColor() : 'white',
                color: isDarkMode ? 'white' : getThemeColor(),
                '&:hover': { 
                  boxShadow: 4,
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                px: 2,
                py: 1
              }}
              onClick={handleToggleLabelVariant}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 1
              }}>
                <TextFieldsIcon 
                  fontSize="small" 
                  sx={{
                    transform: labelVariant === 'standard' ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {labelVariant === 'outlined' ? 'Outlined' : 'Standard'}
                </Typography>
              </Box>
            </Paper>
          </Tooltip>
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
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
              fullWidth
              label={getLoginLabel()}
              margin="normal"
              value={loginValue}
              variant={labelVariant}
              onChange={(e) => setLoginValue(e.target.value)}
              required
              disabled={isLoading}
              onFocus={() => setFocusedField('login')}
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
                '& .MuiInput-underline:before': {
                  borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)',
                },
                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                  borderBottomColor: getThemeColor(),
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: getThemeColor(),
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ 
                      transform: focusedField === 'login' ? 'scale(1.2)' : 'scale(1)',
                      color: focusedField === 'login' ? getThemeColor() : 'inherit',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}>
                      {getLoginIcon()}
                    </Box>
                  </InputAdornment>
                ),
              }}
              type={loginMethod === 1 ? 'email' : 'text'}
            />
            <TextField
              fullWidth
              label={t('login.password')}
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              variant={labelVariant}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
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
                '& .MuiInput-underline:before': {
                  borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)',
                },
                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                  borderBottomColor: getThemeColor(),
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: getThemeColor(),
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ 
                      transform: focusedField === 'password' ? 'scale(1.2)' : 'scale(1)',
                      color: focusedField === 'password' ? getThemeColor() : 'inherit',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
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
                href="#" 
                sx={{ 
                  color: getThemeColor(), 
                  textDecoration: 'none',
                  fontWeight: isDarkMode ? 'bold' : 'normal',
                  '&:hover': {
                    textDecoration: 'underline'
                  },
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