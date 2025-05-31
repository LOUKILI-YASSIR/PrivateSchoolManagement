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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIcon from '@mui/icons-material/Phone';
import SchoolIcon from '@mui/icons-material/School';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../../Store/Slices/ThemeSlice';
import PHONE from '../Fields/PhoneField';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const CheckUserResetPassword = () => {
  const [loginValue, setLoginValue] = useState('');
  const [loginMethod, setLoginMethod] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [autoLogin, setAutoLogin] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const { t } = useTranslation();
  const nav = useNavigate();

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
  const handleTabChange = (event, newValue) => {
    setLoginMethod(newValue);
    setLoginValue('');
    setError('');
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
    const validateInput = () => {
    if (!loginValue.trim()) {
      setError([
        'login.error.usernameRequired',
        'login.error.emailRequired',
        'login.error.phoneRequired'
      ][loginMethod]);
    }

    if (loginMethod === 0 && !/\b([A-Z][a-z]*)([ -][A-Z][a-z]*)*\b/.test(loginValue)) {
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
        identifier: loginValue,
      };
      const response = await apiServices.postData('/check-user', loginData);

      if (response.status === 'success') {
        // Check if the user has 2FA methods
        if (response.data.active_2fa_methods && response.data.active_2fa_methods.length > 0) {
          const methods = response.data.active_2fa_methods.map(methodId => {
            // Create a method object for the verification flow
            // This should match the structure expected by other components
            const methodNames = {
              'google': 'Google Authenticator',
              'email': 'Email Verification',
              'sms': 'SMS Verification',
              'db': 'Secret Code'
            };
            
            return {
              id: methodId,
              name: methodNames[methodId] || methodId,
              description: `Verify using ${methodNames[methodId] || methodId}`
            };
          });
          
          // Create verification flow object
          const verificationFlow = {
            allMethods: methods,
            currentIndex: 0,
            isLastMethod: methods.length === 1
          };
          
          // Start with the first method
          const firstMethod = methods[0];
          
          // Navigate to the appropriate verification method
          switch (firstMethod.id) {
            case 'google':
              nav('/YLSchool/reset-password-request-totp', { 
                state: { 
                  user: {...response.data},
                  verificationFlow
                }
              });
              break;
              
            case 'email':
            case 'sms':
              nav('/YLSchool/email-sms-reset-password', { 
                state: { 
                  user: {...response.data},
                  verificationFlow,
                  type: firstMethod.id
                }
              });
              break;
              
            case 'db':
              nav('/YLSchool/reset-password-request', { 
                state: { 
                  user: {...response.data},
                  verificationFlow
                }
              });
              break;
              
            default:
              // Fallback to regular reset password selection
              nav(`/YLSchool/select-reset-password`, { state: { user: {...response.data} } });
          }
        } else {
          // Just go to the selection screen if no 2FA methods
          nav(`/YLSchool/select-reset-password`, { state: { user: {...response.data} } });
        }
        setSuccess('resetPassword.success.linkSent');
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
          component={Link}
          to="/YLSchool/Login"
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
          {success && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              {t(success)}
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Link 
                to="/YLSchool/Login"
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

export default CheckUserResetPassword;