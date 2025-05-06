import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaGoogle, FaMobileAlt, FaEnvelope, FaKey, FaShieldAlt, FaInfoCircle, FaLock, FaLockOpen } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Divider, 
  Switch, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  TextField, 
  Chip, 
  Paper, 
  Alert, 
  Tooltip, 
  CircularProgress, 
  Grid 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useProfileSecurity } from './hooks/useProfileSecurity';
import GoogleAuthSetup from './GoogleAuthSetup';
import './Profile.css';
import { useAuth } from '../../utils/contexts/AuthContext';

// Styled components with prop filtering
const StyledMethodCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'selected' && prop !== 'unavailable'
})(({ theme, selected, unavailable }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(1),
  transition: 'all 0.2s ease-in-out',
  border: selected ? `1px solid ${theme.palette.primary.main}` : '1px solid transparent',
  backgroundColor: selected 
    ? theme.palette.mode === 'dark' 
      ? 'rgba(66, 133, 244, 0.08)' 
      : 'rgba(66, 133, 244, 0.04)'
    : theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.05)' 
      : theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  opacity: unavailable ? 0.7 : 1,
  '&:hover': {
    boxShadow: theme.shadows[3],
  }
}));

const StatusBanner = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isEnabled'
})(({ theme, isEnabled }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(3),
  backgroundColor: isEnabled 
    ? theme.palette.mode === 'dark' 
      ? 'rgba(76, 175, 80, 0.15)' 
      : 'rgba(76, 175, 80, 0.1)' 
    : theme.palette.mode === 'dark' 
      ? 'rgba(244, 67, 54, 0.15)' 
      : 'rgba(244, 67, 54, 0.1)',
  border: `1px solid ${isEnabled 
    ? theme.palette.mode === 'dark' 
      ? 'rgba(76, 175, 80, 0.3)' 
      : 'rgba(76, 175, 80, 0.2)' 
    : theme.palette.mode === 'dark' 
      ? 'rgba(244, 67, 54, 0.3)' 
      : 'rgba(244, 67, 54, 0.2)'}`
}));

const StatusIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isEnabled'
})(({ theme, isEnabled }) => ({
  width: 48,
  height: 48,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: isEnabled ? theme.palette.success.main : theme.palette.error.main,
  color: theme.palette.common.white,
  marginRight: theme.spacing(2),
  flexShrink: 0,
  fontSize: 20
}));

const MethodIcon = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(66, 133, 244, 0.2)' 
    : 'rgba(66, 133, 244, 0.1)',
  color: theme.palette.primary.main,
  marginRight: theme.spacing(2),
  flexShrink: 0
}));

const VerificationPanel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)' 
    : theme.palette.background.paper,
}));

const SecurityMethods = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const {
    availableMethods,
    activeMethods,
    preferredMethod,
    updateTwoFactorSettings,
    disableAll2FA,
    loading,
    is2FAEnabled,
    loadAvailableMethods,
    verificationCode,
    handleVerificationCodeChange,
    verificationError,
    verificationMethod,
    setVerificationMethod,
    showMethodSelector,
    setShowMethodSelector,
    sendVerificationCode,
    verifyCode
  } = useProfileSecurity();

  const [selectedMethods, setSelectedMethods] = useState([]);
  const [selectedPreferred, setSelectedPreferred] = useState('');
  const [showGoogleAuthSetup, setShowGoogleAuthSetup] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verifyingMethod, setVerifyingMethod] = useState(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [code, setCode] = useState('');

  // Initialize selected methods from active methods
  useEffect(() => {
    setSelectedMethods(activeMethods);
    setSelectedPreferred(preferredMethod);
  }, [activeMethods, preferredMethod]);

  useEffect(() => {
    // If user data is loaded, ensure 2FA methods are also loaded
    if (user && user.id) {
      loadAvailableMethods();
    }
  }, [user]);

  // Handle method toggling
  const toggleMethod = (methodId) => {
    if (methodId === 'google' && !activeMethods.includes('google')) {
      // Special case for Google Auth - needs setup flow
      setShowGoogleAuthSetup(true);
      return;
    }

    const isSelected = selectedMethods.includes(methodId);
    let newSelectedMethods;
    
    if (isSelected) {
      // Remove method
      newSelectedMethods = selectedMethods.filter(id => id !== methodId);
      
      // If removing preferred method, update preferred as well
      if (selectedPreferred === methodId) {
        setSelectedPreferred(newSelectedMethods.length > 0 ? newSelectedMethods[0] : '');
      }
    } else {
      // Add method
      newSelectedMethods = [...selectedMethods, methodId];
      
      // If this is the first method, make it preferred
      if (selectedMethods.length === 0) {
        setSelectedPreferred(methodId);
      }
      
      // If this method requires verification, show the verification screen
      if (['email', 'sms'].includes(methodId)) {
        setVerifyingMethod(methodId);
        setShowVerification(true);
        return;
      }
    }
    
    setSelectedMethods(newSelectedMethods);
  };

  // Handle preferred method selection
  const handlePreferredChange = (methodId) => {
    setSelectedPreferred(methodId);
  };

  // Save changes to 2FA settings
  const saveChanges = async () => {
    const success = await updateTwoFactorSettings(selectedMethods, selectedPreferred);
    if (success) {
      // Refresh the methods list
      loadAvailableMethods();
    }
  };

  // Cancel changes and reset to current settings
  const cancelChanges = () => {
    setSelectedMethods(activeMethods);
    setSelectedPreferred(preferredMethod);
  };

  // Enable 2FA with Google Auth as default
  const quickEnable2FA = async () => {
    // Check if Google Auth is available
    const googleMethod = availableMethods.find(method => method.id === 'google');
    if (googleMethod && googleMethod.available) {
      setShowGoogleAuthSetup(true);
    } else {
      // Fallback to DB method if Google Auth is not available
      const success = await updateTwoFactorSettings(['db'], 'db');
      if (success) {
        loadAvailableMethods();
      }
    }
  };

  // Handle Google Auth setup completion
  const handleGoogleAuthSetupComplete = async (success) => {
    setShowGoogleAuthSetup(false);
    if (success) {
      // Update the 2FA settings with Google Auth as the preferred method
      await updateTwoFactorSettings(['google'], 'google');
      // Refresh methods after successful setup
      loadAvailableMethods();
    }
  };

  // Send verification code for email/SMS setup
  const handleSendVerificationCode = async () => {
    const success = await sendVerificationCode(verifyingMethod);
    if (success) {
      setVerificationSent(true);
    }
  };

  // Verify code for email/SMS setup
  const handleVerifyCode = async () => {
    if (!code) {
      return;
    }

    const success = await verifyCode(verifyingMethod, code);
    if (success) {
      setShowVerification(false);
      setVerificationSent(false);
      setCode('');
      
      // Add the method to selected methods
      if (!selectedMethods.includes(verifyingMethod)) {
        const newMethods = [...selectedMethods, verifyingMethod];
        setSelectedMethods(newMethods);
        
        // If this is the first method, make it preferred
        if (selectedMethods.length === 0) {
          setSelectedPreferred(verifyingMethod);
        }
      }
      
      // Update settings immediately
      await updateTwoFactorSettings(
        [...selectedMethods, verifyingMethod].filter((v, i, a) => a.indexOf(v) === i),
        selectedPreferred || verifyingMethod
      );
      
      // Refresh methods
      loadAvailableMethods();
    }
  };

  // Get icon for a method
  const getMethodIcon = (methodId) => {
    switch (methodId) {
      case 'google':
        return <FaGoogle />;
      case 'sms':
        return <FaMobileAlt />;
      case 'email':
        return <FaEnvelope />;
      case 'db':
        return <FaKey />;
      default:
        return <FaShieldAlt />;
    }
  };

  // Get label for a method
  const getMethodLabel = (method) => {
    if (!method) return '';
    return method.name || method.id;
  };

  // Handle code input change
  const handleCodeChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setCode(value);
    }
  };

  // If methods are not loaded yet or user data is not available, show loading
  if ((availableMethods.length === 0 && loading) || !user) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress size={40} color="primary" />
        <Typography variant="body1" sx={{ mt: 2 }}>
          {t('common.loading')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        {t('profile.twoFactorAuth')} 
        <Chip 
          label={t('auth.twoFactorAuth.multiSelectAvailable')} 
          size="small" 
          color="primary" 
          variant="outlined" 
          sx={{ ml: 1.5, fontSize: '0.7rem' }} 
        />
      </Typography>
      
      {/* 2FA Status Banner */}
      <StatusBanner isEnabled={activeMethods.length > 0}>
        <StatusIcon isEnabled={activeMethods.length > 0}>
          {activeMethods.length > 0 ? <FaLock /> : <FaLockOpen />}
        </StatusIcon>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" color={activeMethods.length > 0 ? "success.main" : "error.main"}>
            {activeMethods.length > 0 ? t('auth.twoFactorAuth.enabled') : t('auth.twoFactorAuth.disabled')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activeMethods.length > 0 
              ? t('auth.twoFactorAuth.statusEnabledDesc', {count: activeMethods.length}) 
              : t('auth.twoFactorAuth.statusDisabledDesc')}
          </Typography>
        </Box>
        {activeMethods.length > 0 ? (
          <Button 
            variant="contained" 
            color="error"
            onClick={disableAll2FA}
            disabled={loading}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : t('auth.twoFactorAuth.disable')}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            onClick={quickEnable2FA}
            disabled={loading}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : t('auth.twoFactorAuth.enable')}
          </Button>
        )}
      </StatusBanner>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('profile.twoFactorAuthDesc')}
        <Box component="span" sx={{ color: 'primary.main', fontWeight: 500 }}> {t('auth.twoFactorAuth.multiSelectDesc')}</Box>
      </Typography>

      {showGoogleAuthSetup ? (
        <GoogleAuthSetup onComplete={handleGoogleAuthSetupComplete} />
      ) : showVerification ? (
        <VerificationPanel>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            {getMethodIcon(verifyingMethod)}{' '}
            {verifyingMethod === 'email' 
              ? t('twoFactorAuth.verifyEmail') 
              : t('twoFactorAuth.verifySMS')}
          </Typography>
          
          {!verificationSent ? (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {verifyingMethod === 'email'
                  ? t('twoFactorAuth.sendEmailCode')
                  : t('twoFactorAuth.sendSMSCode')}
              </Typography>
              <Button 
                variant="contained"
                onClick={handleSendVerificationCode}
                disabled={loading}
                color="primary"
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : t('twoFactorAuth.sendCode')}
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {verifyingMethod === 'email'
                  ? t('twoFactorAuth.enterEmailCode')
                  : t('twoFactorAuth.enterSMSCode')}
              </Typography>
              <TextField
                fullWidth
                value={code}
                onChange={handleCodeChange}
                placeholder="000000"
                inputProps={{ maxLength: 6 }}
                sx={{ mb: 2 }}
                autoFocus
              />
              {verificationError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {verificationError}
                </Alert>
              )}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="contained"
                  color="primary"
                  onClick={handleVerifyCode}
                  disabled={loading || code.length < 4}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : t('twoFactorAuth.verifyCode')}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setShowVerification(false);
                    setVerificationSent(false);
                    setCode('');
                  }}
                >
                  {t('common.cancel')}
                </Button>
              </Box>
            </>
          )}
        </VerificationPanel>
      ) : (
        <>
          <Alert severity="info" icon={<FaInfoCircle />} sx={{ mb: 3 }}>
            {t('auth.twoFactorAuth.multiSelectExplanation')}
          </Alert>

          <Box sx={{ mb: 3 }}>
            {availableMethods.map(method => {
              // Prepare props for styled component to avoid DOM warnings
              const cardProps = {
                key: method.id,
                selected: selectedMethods.includes(method.id),
              };
              
              // Only add the unavailable prop if the method is unavailable
              if (!method.available) {
                cardProps.unavailable = 1;
              }

              return (
                <StyledMethodCard {...cardProps}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <MethodIcon>
                        {getMethodIcon(method.id)}
                      </MethodIcon>
                      <Box sx={{ flexGrow: 1 }}>
                        <Tooltip 
                          title={method.description} 
                          placement="top" 
                          arrow
                        >
                          <Typography variant="h6" sx={{ cursor: 'help' }}>
                            {method.name}
                          </Typography>
                        </Tooltip>
                      </Box>
                      <Switch
                        checked={selectedMethods.includes(method.id)}
                        onChange={() => method.available && toggleMethod(method.id)}
                        disabled={!method.available || loading}
                        color="primary"
                      />
                    </Box>
                    
                    {selectedMethods.includes(method.id) && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <FormControlLabel
                          control={
                            <Radio 
                              checked={selectedPreferred === method.id}
                              onChange={() => handlePreferredChange(method.id)}
                              disabled={loading}
                              color="primary"
                            />
                          }
                          label={t('twoFactorAuth.preferredMethod')}
                        />
                      </>
                    )}
                    
                    {!method.available && (
                      <Alert severity="warning" sx={{ mt: 2 }}>
                        {t('twoFactorAuth.methodUnavailable')}{' '}
                        {method.id === 'sms' && t('twoFactorAuth.addPhoneNumber')}
                        {method.id === 'email' && t('twoFactorAuth.addEmail')}
                      </Alert>
                    )}
                  </CardContent>
                </StyledMethodCard>
              );
            })}
          </Box>
          
          {selectedMethods.length > 0 && selectedMethods.length !== activeMethods.length || 
           selectedMethods.length > 0 && selectedPreferred !== preferredMethod ? (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
              <Button 
                variant="contained"
                color="primary"
                onClick={saveChanges}
                disabled={loading || selectedMethods.length === 0}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : t('common.save')}
              </Button>
              <Button 
                variant="outlined"
                onClick={cancelChanges}
                disabled={loading}
              >
                {t('common.cancel')}
              </Button>
            </Box>
          ) : null}
        </>
      )}
    </Box>
  );
};

export default SecurityMethods; 