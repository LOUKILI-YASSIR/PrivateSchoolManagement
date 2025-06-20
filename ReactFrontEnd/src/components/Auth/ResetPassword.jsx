import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import apiServices from '../../api/apiServices';
import LoadingSpinner from '../common/LoadingSpinner';
import DarkModeToggle from '../common/DarkModeToggle';
import MenuCart from '../menu/CartMenu';
import { useAuth } from '../../utils/contexts/AuthContext';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Paper, 
  Alert, 
  InputAdornment, 
  IconButton,
  LinearProgress
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../../Store/Slices/ThemeSlice';

const ResetPassword = () => {

  const navigate = useNavigate();
  const { login } = useAuth();

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState({
    "password" : false,
    "confirmationPassword" : false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const { t } = useTranslation();
  const { state : { user } } = useLocation();
  const nav = useNavigate();
  // Dark mode from Redux
  const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);
  const dispatch = useDispatch();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  // Check if this is a first-time password change coming from login
  const isFirstTimeChange = user?.requires_password_change || 
                          (user?.MatriculeUT && !user?.CodeVerificationUT);

  const calculatePasswordStrength = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    setPasswordRequirements(requirements);
    const strengthScore = Object.values(requirements).filter(Boolean).length;
    setPasswordStrength((strengthScore / 5) * 100);
  };

  useEffect(() => {
    calculatePasswordStrength(password);
  }, [password]);

  const getThemeColor = (alpha = 1) => 
    isDarkMode ? `rgba(106, 95, 201, ${alpha})` : `rgba(42, 33, 133, ${alpha})`;

  const languages = [
    { code: 'fr', flag: '/Locales/fr.png' },
    { code: 'en', flag: '/Locales/en.png' },
    { code: 'es', flag: '/Locales/es.png' },
    { code: 'de', flag: '/Locales/de.png' },
  ];

  const handleTogglePasswordVisibility = (key) => {
    setShowPassword((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const validateInput = () => {
    if (!user || !password || !passwordConfirmation) {
      setError('resetPassword.error.allFieldsRequired');
      return false;
    }
    if (passwordStrength < 100) {
      setError('resetPassword.error.passwordStrength');
      return false;
    }

    if (password !== passwordConfirmation) {
      setError('resetPassword.error.passwordsDoNotMatch');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    if (!validateInput()) return;
    try {
      setIsLoading(true);
      
      // Prepare request payload based on whether it's a first-time change
      const payload = {
        identifier: user.TypeUT == "sms" ? user.PhoneUT : 
                    user.TypeUT == "email" ? user.EmailUT : 
                    user.UserNameUT || user.MatriculeUT,
        PasswordUT: password,
        PasswordUT_confirmation: passwordConfirmation,
        TypeUT: user.TypeUT || 'db',
        is_first_change: isFirstTimeChange
      };
      
      // Only include CodeVerificationUT if not a first-time change
      if (!isFirstTimeChange && user.CodeVerificationUT) {
        payload.CodeVerificationUT = user.CodeVerificationUT;
      }
      
      const response = await apiServices.postData('/reset-password', payload);
  
      if (response.status === 'success') {
        setSuccess('resetPassword.success.passwordReset');
        
        if(response.message === 'is first login' || isFirstTimeChange) {
          // For first time login, we need to authenticate with the backend again
          try {
            // Get a token by logging in with the new password
            const loginResponse = await apiServices.postData('/login', {
              identifier: payload.identifier,
              PasswordUT: password
            });
            
            if (loginResponse.status === 'success' && loginResponse?.data?.access_token) {
              // Now we have a token, authenticate the user properly
              setTimeout(() => {
                // Clear any redirection flags before logging in to prevent loops
                login(loginResponse.data.access_token, loginResponse.data.role);
              }, 1500);
            } else {
              // If login fails, just redirect to login page
              setTimeout(() => navigate('/YLSchool/Login'), 1500);
            }
          } catch (loginError) {
            console.error('Auto-login error after password change:', loginError);
            setTimeout(() => navigate('/YLSchool/Login'), 1500);
          }
        } else {
          // For regular password reset, redirect to login page
          setTimeout(() => navigate('/YLSchool/Login'), 1500);
        }
      } else {
        setError('resetPassword.error.failedReset');
        try{
          payload.identifier = user.EmailUT || user.PhoneUT || user.UserNameUT;
          const response = await apiServices.postData('/reset-password', payload);
          
      if (response.status === 'success') {
        setSuccess('resetPassword.success.passwordReset');
        
        if(response.message === 'is first login' || isFirstTimeChange) {
          // For first time login, we need to authenticate with the backend again
          try {
            // Get a token by logging in with the new password
            const loginResponse = await apiServices.postData('/login', {
              identifier: payload.identifier,
              PasswordUT: password
            });
            
            if (loginResponse.status === 'success' && loginResponse?.data?.access_token) {
              // Now we have a token, authenticate the user properly
              setTimeout(() => {
                // Clear any redirection flags before logging in to prevent loops
                login(loginResponse.data.access_token, loginResponse.data.role);
              }, 1500);
            } else {
              // If login fails, just redirect to login page
              setTimeout(() => navigate('/YLSchool/Login'), 1500);
            }
          } catch (loginError) {
            console.error('Auto-login error after password change:', loginError);
            setTimeout(() => navigate('/YLSchool/Login'), 1500);
          }
        }
        } else {
          // For regular password reset, redirect to login page
          setTimeout(() => navigate('/YLSchool/Login'), 1500);
        }
        } catch (error) {
      console.error('Reset password error:', error);
      if (error.message === 'Invalid verification code.') {
        setError('resetPassword.error.invalidCode');
      } else {
      setError('resetPassword.error.general');
      }
    } finally {
      setIsLoading(false);
    }       
      }
    } catch (error) {
      console.error('Reset password error:', error);
      if (error.message === 'Invalid verification code.') {
        setError('resetPassword.error.invalidCode');
      } else {
      setError('resetPassword.error.general');
      }
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
          onClick={() => {
            if (isFirstTimeChange || state?.fromLogin) {
              // For first-time change, go back to login
              nav('/YLSchool/Login');
            } else {
              // For normal reset, go back to selection
              nav('/YLSchool/select-reset-password', { state: { user } });
            }
          }}
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
            {isFirstTimeChange 
              ? t('resetPassword.firstTimeTitle') 
              : t('resetPassword.title')}
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
            {isFirstTimeChange 
              ? t('resetPassword.firstTimeSubtitle') 
              : t('resetPassword.subtitle')}
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
              label={t('resetPassword.newPassword')}
              type={showPassword.password ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              margin="normal"
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
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}>
                      <LockIcon />
                    </Box>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={()=>handleTogglePasswordVisibility("password")}
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
                      {showPassword.password ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label={t('resetPassword.confirmPassword')}
              type={showPassword.confirmationPassword ? 'text' : 'password'}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              disabled={isLoading}
              onFocus={() => setFocusedField('passwordConfirmation')}
              onBlur={() => setFocusedField(null)}
              margin="normal"
              sx={{ 
                mb: 3,
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
                      transform: focusedField === 'passwordConfirmation' ? 'scale(1.2)' : 'scale(1)',
                      color: focusedField === 'passwordConfirmation' ? getThemeColor() : 'inherit',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}>
                      <LockIcon />
                    </Box>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={()=>handleTogglePasswordVisibility("confirmationPassword")}
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
                      {showPassword.confirmationPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <LinearProgress 
              variant="determinate" 
              value={passwordStrength} 
              sx={{ 
                height: 10, 
                borderRadius: 5, 
                mb: 1, 
                bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: passwordStrength < 40 ? '#f44336' : 
                          passwordStrength < 70 ? '#ff9800' : 
                          '#4caf50',
                  transition: 'all 0.3s ease'
                }
              }} 
            />
            {password && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 1,
                  width: '100%'
                }}>
                  {[
                    { key: 'length', label: 'At least 8 characters' },
                    { key: 'uppercase', label: 'One uppercase letter' },
                    { key: 'lowercase', label: 'One lowercase letter' },
                    { key: 'number', label: 'One number' },
                    { key: 'special', label: 'One special character' }
                  ].map(({ key, label }) => (
                    <Typography
                      key={key}
                      variant="caption"
                      sx={{
                        color: passwordRequirements[key] 
                          ? (isDarkMode ? '#4caf50' : 'success.main')
                          : (isDarkMode ? 'rgba(255,255,255,0.5)' : 'text.secondary'),
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        transition: 'color 0.3s ease'
                      }}
                    >
                      {passwordRequirements[key] ? '✓' : '○'} {label}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}
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
              {isLoading ? t('resetPassword.resetting') : t('resetPassword.reset')}
            </Button>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default ResetPassword;