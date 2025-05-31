import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  IconButton,
  TextField,
  Divider,
  Card,
  CardContent,
  Grid,
  Tab,
  Tabs,
} from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SecurityIcon from '@mui/icons-material/Security';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QrCodeIcon from '@mui/icons-material/QrCode';
import KeyIcon from '@mui/icons-material/Key';
import DarkModeToggle from '../common/DarkModeToggle';
import MenuCart from '../menu/CartMenu';
import LoadingSpinner from '../common/LoadingSpinner';
import apiServices from '../../api/apiServices';
import { useAuth } from '../../utils/contexts/AuthContext';

const GoogleAuthResetPassword = ({ isFromLogin }) => {
  const location = useLocation();
  const { state } = location;
  const user = state?.user;
  const verificationFlow = state?.verificationFlow;
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [otpauthUrl, setOtpauthUrl] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const { t, i18n } = useTranslation();
  const secretKeyRef = useRef(null);
  const { login } = useAuth();

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
    const currentLang = languages.find((lang) => lang.code === i18n.language) || languages[0];
    return currentLang.flag;
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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

  // Fetch QR code on component mount
  useEffect(() => {
    fetchQrCode();
  }, []);

  const fetchQrCode = async () => {
    if (!user) {
      navigate('/YLSchool/select-reset-password');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiServices.postData('/setup-2fa', {
        identifier: user.EmailUT,
      });

      if (response.status === 'success') {
        // Set the secret key and otpauth URL
        setSecretKey(response.data.SecretKeyUT);
        setOtpauthUrl(response.data.otpauthUrl || response.data.QRCodeUrlUT);
        setSuccess('resetPassword.success.2faSetupInitiated');
      } else {
        setError('resetPassword.error.2faSetupFailed');
      }
    } catch (err) {
      console.error('2FA setup error:', err);
      const statusCode = err?.response?.status;
      if (statusCode === 429) {
        setError('resetPassword.error.tooManyAttempts');
      } else {
        setError('resetPassword.error.general');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = verificationCode.join('');

    if (code.length !== 6) {
      setError('resetPassword.error.invalidCode');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiServices.postData('/verify-2fa', {
        identifier: user.EmailUT,
        CodeVerificationUT: code,
        SecretKeyUT: secretKey,
      });

      if (response.status === 'success') {
        if (isFromLogin) {
          // Handle login verification flow
          if (isLastMethod) {
            // If this is the last verification method, complete the authentication process
            try {
              console.log('Last Google Auth verification passed, completing authentication');
              
              // Call a completion endpoint to get a token
              const completionResponse = await apiServices.postData('/complete-2fa', {
                identifier: user.EmailUT || user.UserNameUT || user.PhoneUT,
                verification_status: true,
                password: user.PasswordUT || ''
              });
              
              if (completionResponse.status === 'success' && completionResponse.data?.access_token) {
                // Use the auth context login function with the received token
                sessionStorage.setItem('token', completionResponse.data.access_token);
                sessionStorage.setItem('userRole', completionResponse.data.role);
                 sessionStorage.setItem('userID', completionResponse.data.MatriculeUT);
                // Navigate to dashboard
                navigate('/YLSchool/DashBoard');
              } else {
                console.error('Failed to complete authentication after 2FA verification');
                navigate('/YLSchool/Login');
              }
              return;
            } catch (error) {
              console.error("Error during 2FA completion:", error);
              
              // Fallback to direct navigation if the completion endpoint fails
              console.log('Falling back to direct dashboard navigation');
              navigate('/YLSchool/DashBoard');
              return;
            }
          } else {
            // Move to the next verification method
            const nextMethod = getNextMethod();
            if (!nextMethod) {
              navigate('/YLSchool/DashBoard');
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
                navigate('/YLSchool/reset-password-request-totp', { 
                  state: { 
                    user: { ...user, previousVerification: code },
                    verificationFlow: updatedFlow 
                  }
                });
                break;
                
              case 'email':
              case 'sms':
                navigate('/YLSchool/reset-password-request-' + nextMethod.id, { 
                  state: { 
                    user: { ...user, previousVerification: code },
                      verificationFlow: updatedFlow,
                    type: nextMethod.id
                  }
                });
                break;
                
              case 'db':
                navigate('/YLSchool/reset-password-request', { 
                  state: { 
                    user: { ...user, previousVerification: code },
                    verificationFlow: updatedFlow
                  }
                });
                break;
                
              default:
                navigate('/YLSchool/DashBoard');
            }
          }
        } else {
          // Handle password reset flow
          navigate('/YLSchool/reset-password', {
            state: { user: { ...user, CodeVerificationUT: code, TypeUT: 'google' } },
          });
        }
      } else {
        setError('resetPassword.error.invalidCode');
      }
    } catch (err) {
      console.error('2FA verification error:', err);
      const statusCode = err?.response?.status;

      if (statusCode === 429) {
        setError('resetPassword.error.tooManyAttempts');
      } else if (statusCode === 422) {
        setError('resetPassword.error.invalidCode');
      } else {
        setError('resetPassword.error.general');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setSuccess('resetPassword.2fa.copied');
        setTimeout(() => setSuccess(''), 2000);
      })
      .catch(err => {
        console.error('Copy failed:', err);
        setError('resetPassword.error.copyFailed');
      });
  };

  return (
    <>
      {isLoading && (
        <LoadingSpinner message={t(otpauthUrl ? 'resetPassword.verifying' : 'resetPassword.generating')} />
      )}
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
          pointerEvents: isLoading ? 'none' : 'all',
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
            zIndex: 1,
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
                  <img
                    src={getCurrentLanguageFlag()}
                    alt="Lang Flag"
                    style={{ width: '100%', borderRadius: '50%' }}
                  />
                </Box>
                <Typography>{t('resetPassword.selectLanguage')}</Typography>
              </Box>
            }
          />
          <DarkModeToggle isDarkMode={isDarkMode} />
        </Box>

        {/* Back Button */}
        <IconButton
          component={Link}
          to="/YLSchool/select-reset-password"
          sx={{
            position: 'absolute',
            top: 20,
            left: 20,
            color: getThemeColor(),
            '&:hover': {
              bgcolor: isDarkMode ? 'rgba(106, 95, 201, 0.1)' : 'rgba(42, 33, 133, 0.1)',
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Paper
          elevation={3}
          sx={{
            maxWidth: 600,
            width: '100%',
            p: { xs: 3, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: isDarkMode ? '#1e1e1e' : 'white',
            color: isDarkMode ? 'white' : 'inherit',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            boxShadow: isDarkMode
              ? '0 0 15px rgba(106, 95, 201, 0.3)'
              : '0 3px 5px rgba(0,0,0,0.2)',
          }}
        >
          <SecurityIcon sx={{ fontSize: 60, color: getThemeColor(), mb: 2 }} />

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{
              color: getThemeColor(),
              fontWeight: 'bold',
              mb: 1,
              fontSize: { xs: '1.75rem', sm: '2.125rem' },
              textShadow: isDarkMode ? '0 0 8px rgba(106, 95, 201, 0.5)' : 'none',
            }}
          >
            {t('resetPassword.2fa.verifyTitle')}
          </Typography>

          <Typography
            variant="subtitle1"
            align="center"
            sx={{
              color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary',
              mb: 3,
            }}
          >
            {t('resetPassword.2fa.verifyDescription')}
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

          {secretKey && otpauthUrl && (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="2FA setup options"
                sx={{ 
                  mb: 3,
                  '.MuiTabs-indicator': {
                    backgroundColor: getThemeColor(),
                  },
                }}
              >
                <Tab 
                  icon={<QrCodeIcon />} 
                  label={t('resetPassword.2fa.scanQrCode')} 
                  sx={{ 
                    color: tabValue === 0 ? getThemeColor() : 'inherit',
                    '&.Mui-selected': {
                      color: getThemeColor(),
                    }
                  }}
                />
                <Tab 
                  icon={<KeyIcon />} 
                  label={t('resetPassword.2fa.manualEntry')} 
                  sx={{ 
                    color: tabValue === 1 ? getThemeColor() : 'inherit',
                    '&.Mui-selected': {
                      color: getThemeColor(),
                    }
                  }}
                />
              </Tabs>

              {/* QR Code Tab Panel */}
              {tabValue === 0 && (
                <Card 
                  variant="outlined" 
                  sx={{ 
                    width: '100%', 
                    mb: 3,
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
                  }}
                >
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h6" gutterBottom color={getThemeColor()}>
                      {t('resetPassword.2fa.scanQrCode')}
                    </Typography>
                    
                    <Typography variant="body2" paragraph align="center">
                      {t('resetPassword.2fa.scanInstructions')}
                    </Typography>
                    
                    <Box 
                sx={{
                        p: 3, 
                  bgcolor: 'white',
                  borderRadius: 1,
                        mb: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                        width: '200px',
                        height: '200px',
                      }}
                    >
                      <QRCodeSVG 
                        value={otpauthUrl}
                        size={180}
                        bgColor={"#ffffff"}
                        fgColor={"#000000"}
                        level={"M"}
                        includeMargin={false}
                      />
              </Box>

                    <Typography variant="body2" color="textSecondary">
                      {t('resetPassword.2fa.cantScan')} 
              <Button
                        onClick={() => setTabValue(1)} 
                sx={{
                          textTransform: 'none',
                          color: getThemeColor(),
                  '&:hover': {
                            backgroundColor: 'transparent',
                            textDecoration: 'underline',
                          }
                }}
              >
                        {t('resetPassword.2fa.useManualEntry')}
              </Button>
                    </Typography>
                  </CardContent>
                </Card>
              )}

              {/* Manual Entry Tab Panel */}
              {tabValue === 1 && (
                <Card 
                  variant="outlined" 
                  sx={{
                    width: '100%', 
                    mb: 3,
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom color={getThemeColor()}>
                      {t('resetPassword.2fa.setupInstructions')}
                    </Typography>
                    
                    <Typography variant="body2" paragraph>
                      1. {t('resetPassword.2fa.downloadApp')}
                    </Typography>
                    
                    <Typography variant="body2" paragraph>
                      2. {t('resetPassword.2fa.openApp')}
                    </Typography>
                    
                    <Typography variant="body2" paragraph>
                      3. {t('resetPassword.2fa.addAccount')}
                    </Typography>
                    
                    <Typography variant="body2" paragraph>
                      4. {t('resetPassword.2fa.enterKey')}
                    </Typography>
                    
                    <Box 
                      sx={{ 
                        p: 2, 
                        bgcolor: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 2
                      }}
                    >
                      <Typography
                        ref={secretKeyRef}
                        variant="body1"
                        sx={{
                          fontFamily: 'monospace',
                          fontWeight: 'bold',
                          letterSpacing: 1,
                          fontSize: '1.2rem',
                          wordBreak: 'break-all',
                        }}
                      >
                        {secretKey}
                      </Typography>
                      <IconButton 
                        onClick={() => copyToClipboard(secretKey)}
                        sx={{ color: getThemeColor() }}
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Box>
                    
                    <Typography variant="body2" paragraph>
                      5. {t('resetPassword.2fa.getCode')}
                </Typography>
                  </CardContent>
                </Card>
              )}

              <Divider sx={{ width: '100%', my: 2 }} />
            </Box>
          )}

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Typography
              variant="body1"
              align="center"
              sx={{
                color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'text.primary',
                mb: 2,
                fontWeight: 'medium',
              }}
            >
              {t('resetPassword.2fa.enterCode')}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 1,
                justifyContent: 'center',
                mb: 3,
                flexWrap: 'wrap', // Ensure responsiveness
              }}
            >
              {verificationCode.map((digit, index) => (
                <TextField
                  key={index}
                  id={`code-${index}`}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: 'center',
                      fontSize: '1.5rem',
                      padding: '12px',
                      width: '40px',
                    },
                  }}
                  variant="outlined"
                  autoComplete="off"
                  sx={{
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
                    '& .MuiOutlinedInput-input': {
                      color: isDarkMode ? 'white' : 'inherit',
                    },
                    width: '56px', // Ensure consistent width
                  }}
                />
              ))}
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
              }}
              endIcon={<SendIcon />}
            >
              {t('resetPassword.verifyCode')}
            </Button>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default GoogleAuthResetPassword;