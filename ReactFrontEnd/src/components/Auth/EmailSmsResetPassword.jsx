import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SendIcon from '@mui/icons-material/Send';
import DarkModeToggle from '../common/DarkModeToggle';
import MenuCart from '../menu/CartMenu';
import LoadingSpinner from '../common/LoadingSpinner';
import apiServices from '../../api/apiServices';

const EmailSmsResetPassword = ({ type }) => {
  const { state: { user } } = useLocation();
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(60); // 60 seconds countdown
  const [isResendDisabled, setIsResendDisabled] = useState(true); // Disable resend initially
  const { t, i18n } = useTranslation();

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

    // Send verification code on component mount
    useEffect(() => {
        sendVerificationCode();
      }, []);    

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (countdown > 0 && codeSent) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsResendDisabled(false); // Enable resend button when countdown reaches 0
    }
    return () => clearInterval(timer); // Cleanup on unmount
  }, [countdown, codeSent]);

  const sendVerificationCode = async () => {
    if (!user) {
      navigate('/YLSchool/select-reset-password');
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = type === 'email' ? '/send-email-code' : '/send-sms-code';
      const response = await apiServices.postData(endpoint, {
        phone: user.PhoneUT,
        email: user.EmailUT,
      });

      if (response.status === 'success') {
        setSuccess(
          type === 'email'
            ? 'resetPassword.success.emailCodeSent'
            : 'resetPassword.success.smsCodeSent'
        );
        setCodeSent(true);
        setCountdown(60); // Reset countdown to 60 seconds
        setIsResendDisabled(true); // Disable resend button
      } else {
        setError(
          type === 'email'
            ? 'resetPassword.error.emailCodeNotSent'
            : 'resetPassword.error.smsCodeNotSent'
        );
      }
    } catch (err) {
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

    if (value && index < 7) {
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

    if (code.length !== 8) {
      setError('resetPassword.error.invalidCode');
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = '/verify-code';

      const response = await apiServices.postData(endpoint, {
        identifier: type === 'email' ? user.EmailUT : user.PhoneUT,
        code,
      });

      if (response.status === 'success') {
        navigate('/YLSchool/reset-password', {
          state: { user :  {...user, CodeVerificationUT: code, TypeUT: type} },
        });
      } else {
        setError('resetPassword.error.invalidCode');
      }
    } catch (err) {
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

  // Format countdown time (MM:SS)
  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <>
      {isLoading && (
        <LoadingSpinner message={t(codeSent ? 'resetPassword.verifying' : 'resetPassword.sending')} />
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
          {type === 'email' ? (
            <EmailIcon sx={{ fontSize: 60, color: getThemeColor(), mb: 2 }} />
          ) : (
            <PhoneIcon sx={{ fontSize: 60, color: getThemeColor(), mb: 2 }} />
          )}

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
            {t(type === 'email' ? 'resetPassword.email.verifyTitle' : 'resetPassword.sms.verifyTitle')}
          </Typography>

          <Typography
            variant="subtitle1"
            align="center"
            sx={{
              color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary',
              mb: 3,
            }}
          >
            {t(
              type === 'email'
                ? 'resetPassword.email.verifyDescription'
                : 'resetPassword.sms.verifyDescription'
            )}
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

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, alignItems: 'center', gap: 2 }}>
              <Button
                variant="text"
                onClick={sendVerificationCode}
                disabled={isLoading || isResendDisabled}
                sx={{
                  color: isResendDisabled ? 'text.disabled' : getThemeColor(),
                  '&:hover': {
                    bgcolor: isDarkMode ? 'rgba(106, 95, 201, 0.1)' : 'rgba(42, 33, 133, 0.1)',
                  },
                }}
              >
                {t('resetPassword.resendCode')}
              </Button>
              {isResendDisabled && (
                <Typography
                  variant="body2"
                  sx={{
                    width: '40%',
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                  }}
                >
                  {t('resetPassword.wait')} {formatCountdown(countdown)}
                </Typography>
              )}
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

export default EmailSmsResetPassword;