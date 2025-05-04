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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SecurityIcon from '@mui/icons-material/Security';
import SendIcon from '@mui/icons-material/Send';
import DownloadIcon from '@mui/icons-material/Download';
import DarkModeToggle from '../common/DarkModeToggle';
import MenuCart from '../menu/CartMenu';
import LoadingSpinner from '../common/LoadingSpinner';
import apiServices from '../../api/apiServices';

const GoogleAuthResetPassword = () => {
  const { state: { user } } = useLocation();
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const { t, i18n } = useTranslation();
  const qrCodeRef = useRef(null);

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
        console.log(response.data)
        setQrCodeUrl(response.data.QRCodeUrlUT);
        setSecretKey(response.data.SecretKeyUT);
        setSuccess('resetPassword.success.qrCodeGenerated');
      } else {
        setError('resetPassword.error.qrCodeNotGenerated');
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
      const response = await apiServices.postData('/verify-2fa', {
        identifier: user.EmailUT,
        CodeVerificationUT: code,
        SecretKeyUT: secretKey,
      });

      if (response.status === 'success') {
        navigate('/YLSchool/reset-password', {
          state: { user: { ...user, CodeVerificationUT: code, TypeUT: 'google' } },
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

  const downloadQrCode = () => {
    if (!qrCodeUrl) return;

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `2fa-qrcode-${user.IdUT}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {isLoading && (
        <LoadingSpinner message={t(qrCodeUrl ? 'resetPassword.verifying' : 'resetPassword.generating')} />
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

          {qrCodeUrl && (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Box
                ref={qrCodeRef}
                sx={{
                  width: 200,
                  height: 200,
                  mb: 2,
                  p: 2,
                  bgcolor: 'white',
                  borderRadius: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img src={qrCodeUrl} alt="QR Code" style={{ width: '100%', height: '100%' }} />
              </Box>

              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={downloadQrCode}
                sx={{
                  mb: 2,
                  color: 'white',
                  bgcolor: getThemeColor(),
                  '&:hover': {
                    bgcolor: getThemeColor(0.8),
                    boxShadow: isDarkMode ? '0 0 10px rgba(106, 95, 201, 0.5)' : '0 4px 8px rgba(0,0,0,0.2)',
                  },
                  boxShadow: isDarkMode ? '0 0 8px rgba(106, 95, 201, 0.4)' : '0 2px 4px rgba(0,0,0,0.2)',
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontWeight: 'medium',
                  transition: 'all 0.3s ease',
                }}
              >
                {t('resetPassword.2fa.downloadQrCode')}
              </Button>

              {secretKey && (
                <Typography
                  variant="body2"
                  align="center"
                  sx={{
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                    mb: 2,
                    wordBreak: 'break-all',
                    px: 2,
                  }}
                >
                  {t('resetPassword.2fa.manualEntry')}: <strong>{secretKey}</strong>
                </Typography>
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