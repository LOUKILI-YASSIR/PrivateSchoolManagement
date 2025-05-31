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
import SecurityMethodConfirmation from './SecurityMethodConfirmation';
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

// Sort methods by security level
const getMethodSecurityLevel = (methodId) => {
  // Order from most secure to least secure
  switch (methodId) {
    case 'google': return 3; // Most secure
    case 'email': return 2;
    case 'sms': return 1;
    case 'db': return 0; // Least secure
    default: return -1;
  }
};

// Component to show security level
const SecurityLevelIndicator = ({ level, small = false }) => {
  const getColor = (l) => {
    switch (l) {
      case 3: return 'success.main'; // High security
      case 2: return 'info.main';    // Medium-high security
      case 1: return 'warning.main'; // Medium security
      case 0: return 'error.main';   // Low security
      default: return 'text.disabled';
    }
  };
  
  const getLabel = (l) => {
    switch (l) {
      case 3: return 'High';
      case 2: return 'Medium-High';
      case 1: return 'Medium';
      case 0: return 'Basic';
      default: return 'Unknown';
    }
  };
  
  return (
    <Chip 
      label={`${getLabel(level)} Security`}
      size={small ? "small" : "medium"}
      sx={{ 
        backgroundColor: (theme) => `${getColor(level)}20`,
        color: getColor(level),
        fontWeight: 'medium',
        fontSize: small ? '0.7rem' : '0.75rem'
      }}
    />
  );
};

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
  // Track previously enabled methods that need verification when re-enabled
  const [previouslyEnabledMethods, setPreviouslyEnabledMethods] = useState([]);

  // Confirmation dialog states
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState({
    methodId: '',
    methodName: '',
    isLastMethod: false,
    is2FADisable: false,
    action: 'disable',
    onConfirm: () => {}
  });

  // Initialize selected methods from active methods
  useEffect(() => {
    setSelectedMethods(activeMethods);
    setSelectedPreferred(preferredMethod);
    
    // Keep track of previously enabled methods for re-verification
    if (activeMethods && activeMethods.length > 0) {
      setPreviouslyEnabledMethods(prev => {
        // Add currently active methods to the tracking list
        const combined = [...new Set([...prev, ...activeMethods])];
        return combined;
      });
    }
  }, [activeMethods, preferredMethod]);

  useEffect(() => {
    // If user data is loaded, ensure 2FA methods are also loaded
    if (user && user.id) {
      loadAvailableMethods();
    }
  }, [user]);

  // Handle method toggling with confirmation
  const toggleMethod = (methodId) => {
    // Find method details
    const method = availableMethods.find(m => m.id === methodId);
    if (!method) return;
    
    const isSelected = selectedMethods.includes(methodId);
    const wasEnabledBefore = previouslyEnabledMethods.includes(methodId);
    
    if (isSelected) {
      // Removing a method - check if confirmation needed
      const isLastActiveMethod = activeMethods.length === 1 && activeMethods.includes(methodId);
      
      if (isLastActiveMethod) {
        // Show confirmation for disabling last method (which disables 2FA)
        setConfirmationData({
          methodId,
          methodName: method.name,
          isLastMethod: true,
          is2FADisable: true,
          action: 'disable',
          onConfirm: () => performToggleMethod(methodId)
        });
        setShowConfirmation(true);
      } else {
        // Show regular confirmation for disabling a method
        setConfirmationData({
          methodId,
          methodName: method.name,
          isLastMethod: false,
          is2FADisable: false,
          action: 'disable',
          onConfirm: () => performToggleMethod(methodId)
        });
        setShowConfirmation(true);
      }
    } else {
      // Adding a method
      if (methodId === 'google') {
        // Google Auth needs setup flow - always show QR code setup
        setConfirmationData({
          methodId,
          methodName: method.name,
          isLastMethod: false,
          is2FADisable: false,
          action: 'enable',
          onConfirm: () => {
            // Always show the setup flow for Google Auth, even for re-enabling
            setShowGoogleAuthSetup(true);
          }
        });
        setShowConfirmation(true);
      } else if (['email', 'sms'].includes(methodId) || wasEnabledBefore) {
        // These methods always require verification
        setConfirmationData({
          methodId,
          methodName: method.name,
          isLastMethod: false,
          is2FADisable: false,
          action: 'enable',
          onConfirm: () => {
            // Show verification screen after confirmation
            setVerifyingMethod(methodId);
            setShowVerification(true);
          }
        });
        setShowConfirmation(true);
      } else {
        // Other methods just need regular enable confirmation
        setConfirmationData({
          methodId,
          methodName: method.name,
          isLastMethod: false,
          is2FADisable: false,
          action: 'enable',
          onConfirm: () => performToggleMethod(methodId)
        });
        setShowConfirmation(true);
      }
    }
  };

  // Actual method toggling implementation
  const performToggleMethod = (methodId) => {
    const isSelected = selectedMethods.includes(methodId);
    let newSelectedMethods;
    
    if (isSelected) {
      // Remove method
      newSelectedMethods = selectedMethods.filter(id => id !== methodId);
      
      // If removing preferred method, update preferred as well
      if (selectedPreferred === methodId) {
        setSelectedPreferred(newSelectedMethods.length > 0 ? newSelectedMethods[0] : '');
      }
      
      // Add to previously enabled methods list when disabling
      setPreviouslyEnabledMethods(prev => {
        if (!prev.includes(methodId)) {
          return [...prev, methodId];
        }
        return prev;
      });
    } else {
      // Add method
      newSelectedMethods = [...selectedMethods, methodId];
      
      // If this is the first method, make it preferred
      if (selectedMethods.length === 0) {
        setSelectedPreferred(methodId);
      }
    }
    
    setSelectedMethods(newSelectedMethods);
  };

  // Override the existing disableAll2FA with confirmation
  const handleDisableAll2FA = () => {
    // Set confirmation data
    setConfirmationData({
      methodId: '',
      methodName: '',
      isLastMethod: false,
      is2FADisable: true,
      action: 'disable',
      onConfirm: disableAll2FA
    });
    setShowConfirmation(true);
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
      // Show confirmation first
      setConfirmationData({
        methodId: 'db',
        methodName: availableMethods.find(m => m.id === 'db')?.name || 'Database',
        isLastMethod: false,
        is2FADisable: false,
        action: 'enable',
        onConfirm: async () => {
          const success = await updateTwoFactorSettings(['db'], 'db');
          if (success) {
            loadAvailableMethods();
          }
        }
      });
      setShowConfirmation(true);
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

  // Send verification code for email/SMS/google setup
  const handleSendVerificationCode = async () => {
    // Google doesn't need to send a code - verification is done directly with user's authenticator app
    if (verifyingMethod === 'google') {
      // Just mark as sent so verification UI shows code input
      setVerificationSent(true);
      return;
    }
    
    const success = await sendVerificationCode(verifyingMethod);
    if (success) {
      setVerificationSent(true);
    }
  };

  // Verify code for email/SMS/google setup
  const handleVerifyCode = async () => {
    if (!code) {
      return;
    }

    // Verify the code based on the method
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
    // Allow 8 digits for email/SMS, 6 for Google Auth
    const maxLength = ['email', 'sms'].includes(verifyingMethod) ? 8 : 6;
    if (/^\d*$/.test(value) && value.length <= maxLength) {
      setCode(value);
    }
  };

  // Helper function to get verification title based on method
  const getVerificationTitle = (methodId) => {
    switch (methodId) {
      case 'google': return t('auth.twoFactorAuth.verifyGoogle');
      case 'email': return t('auth.twoFactorAuth.verifyEmail');
      case 'sms': return t('auth.twoFactorAuth.verifySMS');
      case 'db': return t('auth.twoFactorAuth.verifySetup');
      default: return t('auth.twoFactorAuth.verifySetup');
    }
  };

  // Helper function to get re-verification message based on method
  const getReVerificationMessage = (methodId) => {
    switch (methodId) {
      case 'google': return t('auth.twoFactorAuth.googleReVerificationRequired');
      case 'email': return t('auth.twoFactorAuth.emailReVerificationRequired');
      case 'sms': return t('auth.twoFactorAuth.smsReVerificationRequired');
      case 'db': return t('auth.twoFactorAuth.dbReVerificationRequired');
      default: return t('auth.twoFactorAuth.reVerificationRequired');
    }
  };

  // Helper function to get verification code input message based on method
  const getVerificationCodeMessage = (methodId) => {
    switch (methodId) {
      case 'google': return t('auth.twoFactorAuth.enterGoogleCode');
      case 'email': return t('auth.twoFactorAuth.enterEmailCode') + ' (8 digits)';
      case 'sms': return t('auth.twoFactorAuth.enterSMSCode') + ' (8 digits)';
      default: return t('auth.twoFactorAuth.enterSetupCode');
    }
  };

  // Helper function to get verification send message based on method
  const getVerificationSendMessage = (methodId) => {
    switch (methodId) {
      case 'email': return t('auth.twoFactorAuth.sendEmailCode');
      case 'sms': return t('auth.twoFactorAuth.sendSMSCode');
      default: return t('auth.twoFactorAuth.reVerificationRequired');
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
            onClick={handleDisableAll2FA}
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
      
      {/* Confirmation Dialog */}
      <SecurityMethodConfirmation 
        open={showConfirmation}
        onConfirm={() => {
          confirmationData.onConfirm();
          setShowConfirmation(false);
        }}
        onCancel={() => {
          setShowConfirmation(false);
          if (['email', 'sms'].includes(confirmationData.methodId) && 
              confirmationData.action === 'enable') {
            setShowVerification(false);
          }
        }}
        isLastMethod={confirmationData.isLastMethod}
        is2FADisable={confirmationData.is2FADisable}
        methodName={confirmationData.methodName}
        action={confirmationData.action}
      />
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('profile.twoFactorAuthDesc')}
        <Box component="span" sx={{ color: 'primary.main', fontWeight: 500 }}> {t('auth.twoFactorAuth.multiSelectDesc')}</Box>
      </Typography>

      {showGoogleAuthSetup ? (
        <GoogleAuthSetup onComplete={handleGoogleAuthSetupComplete} />
      ) : showVerification ? (
        <VerificationPanel>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <MethodIcon>
              {getMethodIcon(verifyingMethod)}
            </MethodIcon>
            {getVerificationTitle(verifyingMethod)}
          </Typography>
          
          {/* Add note about re-verification if needed */}
          {previouslyEnabledMethods.includes(verifyingMethod) && 
           !activeMethods.includes(verifyingMethod) && (
            <Alert 
              severity="info" 
              icon={<FaInfoCircle />} 
              sx={{ mb: 2 }}
            >
              {t('auth.twoFactorAuth.methodReEnableDescription')}
            </Alert>
          )}
          
          {!verificationSent ? (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {getVerificationSendMessage(verifyingMethod)}
              </Typography>
              <Button 
                variant="contained"
                onClick={handleSendVerificationCode}
                disabled={loading}
                color="primary"
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : t('auth.twoFactorAuth.sendCode')}
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {getVerificationCodeMessage(verifyingMethod)}
              </Typography>
              <TextField
                fullWidth
                value={code}
                onChange={handleCodeChange}
                placeholder={['email', 'sms'].includes(verifyingMethod) ? "00000000" : "000000"}
                inputProps={{ maxLength: ['email', 'sms'].includes(verifyingMethod) ? 8 : 6 }}
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
                  disabled={loading || (['email', 'sms'].includes(verifyingMethod) ? code.length < 8 : code.length < 6)}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : t('auth.twoFactorAuth.verifyCode')}
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

          {/* Security Methods Comparison */}
          <Paper sx={{ p: 2, mb: 3, borderRadius: 1 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FaShieldAlt />
              {t('auth.twoFactorAuth.methodComparisonTitle')}
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 1 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ 
                  border: '1px solid',
                  borderColor: 'success.main',
                  borderRadius: 1,
                  p: 2,
                  height: '100%',
                  backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.08)' : 'rgba(76, 175, 80, 0.04)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <MethodIcon>{getMethodIcon('google')}</MethodIcon>
                    <Box>
                      <Typography variant="subtitle1">Google Authenticator</Typography>
                      <Chip 
                        label={t('auth.twoFactorAuth.recommendedMethod')}
                        size="small"
                        color="success"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </Box>
                  </Box>
                  <Typography variant="body2">{t('auth.twoFactorAuth.googleIsMostSecure')}</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ 
                  border: '1px solid',
                  borderColor: 'info.main',
                  borderRadius: 1,
                  p: 2,
                  height: '100%',
                  backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.08)' : 'rgba(33, 150, 243, 0.04)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <MethodIcon>{getMethodIcon('email')}</MethodIcon>
                    <Box>
                      <Typography variant="subtitle1">Email</Typography>
                      <Chip 
                        label={t('auth.twoFactorAuth.strongSecurity')}
                        size="small"
                        color="info"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </Box>
                  </Box>
                  <Typography variant="body2">{t('auth.twoFactorAuth.emailIsSecure')}</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ 
                  border: '1px solid',
                  borderColor: 'warning.main',
                  borderRadius: 1,
                  p: 2,
                  height: '100%',
                  backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 152, 0, 0.08)' : 'rgba(255, 152, 0, 0.04)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <MethodIcon>{getMethodIcon('sms')}</MethodIcon>
                    <Box>
                      <Typography variant="subtitle1">SMS</Typography>
                      <Chip 
                        label={t('auth.twoFactorAuth.moderateSecurity')}
                        size="small"
                        color="warning"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </Box>
                  </Box>
                  <Typography variant="body2">{t('auth.twoFactorAuth.smsIsModeratelySecure')}</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ 
                  border: '1px solid',
                  borderColor: 'error.main',
                  borderRadius: 1,
                  p: 2,
                  height: '100%',
                  backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(244, 67, 54, 0.08)' : 'rgba(244, 67, 54, 0.04)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <MethodIcon>{getMethodIcon('db')}</MethodIcon>
                    <Box>
                      <Typography variant="subtitle1">Database</Typography>
                      <Chip 
                        label={t('auth.twoFactorAuth.basicSecurity')}
                        size="small"
                        color="error"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </Box>
                  </Box>
                  <Typography variant="body2">{t('auth.twoFactorAuth.dbIsBasicSecurity')}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Box sx={{ mb: 3 }}>
            {/* Sort methods by security level (highest to lowest) */}
            {availableMethods
              .sort((a, b) => getMethodSecurityLevel(b.id) - getMethodSecurityLevel(a.id))
              .map(method => {
                // Prepare props for styled component to avoid DOM warnings
                const cardProps = {
                  key: method.id,
                  selected: selectedMethods.includes(method.id),
                };
                
                // Only add the unavailable prop if the method is unavailable
                if (!method.available) {
                  cardProps.unavailable = 1;
                }

                const securityLevel = getMethodSecurityLevel(method.id);

                return (
                  <StyledMethodCard {...cardProps}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <MethodIcon>
                          {getMethodIcon(method.id)}
                        </MethodIcon>
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Tooltip 
                              title={method.description} 
                              placement="top" 
                              arrow
                            >
                              <Typography variant="h6" sx={{ cursor: 'help' }}>
                                {method.name}
                              </Typography>
                            </Tooltip>
                            <SecurityLevelIndicator level={securityLevel} small />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {securityLevel === 3 
                              ? t('auth.twoFactorAuth.mostSecureMethod')
                              : securityLevel === 2 
                                ? t('auth.twoFactorAuth.verySecureMethod')
                                : securityLevel === 1
                                  ? t('auth.twoFactorAuth.secureMethod')
                                  : t('auth.twoFactorAuth.basicSecurityMethod')
                            }
                          </Typography>
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
                            label={t('auth.twoFactorAuth.preferredMethod')}
                          />
                        </>
                      )}
                      
                      {!method.available && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                          {t('auth.twoFactorAuth.methodUnavailable')}{' '}
                          {method.id === 'sms' && t('auth.twoFactorAuth.addPhoneNumber')}
                          {method.id === 'email' && t('auth.twoFactorAuth.addEmail')}
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