import React, { useState, useEffect } from 'react';
import { FaKey, FaQrcode, FaCheck, FaTimes } from 'react-icons/fa';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Tabs, 
  Tab, 
  TextField, 
  Paper, 
  Alert, 
  CircularProgress, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useProfileSecurity } from './hooks/useProfileSecurity';
import { useAuth } from '../../utils/contexts/AuthContext';
import './Profile.css';

const StyledSetupCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(3),
  overflow: 'visible'
}));

const QRCodeContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  maxWidth: '100%',
  boxShadow: theme.shadows[1]
}));

const SecretKeyContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
  borderRadius: theme.spacing(1),
  textAlign: 'center',
  marginBottom: theme.spacing(2),
  wordBreak: 'break-all'
}));

const GoogleAuthSetup = ({ onComplete }) => {
  const { user } = useAuth();
  const {
    setupGoogle2FA,
    verifyAndActivate2FA,
    handleVerificationCodeChange,
    getQRCodeComponent,
    secretKey,
    verificationCode,
    verificationError: hookError,
    loading,
    activeTab,
    setActiveTab
  } = useProfileSecurity();

  const [setupStarted, setSetupStarted] = useState(false);
  const [setupSuccess, setSetupSuccess] = useState(false);
  const [error, setError] = useState('');

  // Effect to check if user data is loaded
  useEffect(() => {
    if (error && user && user.EmailUT) {
      // If user is loaded but we had an error earlier, clear it
      setError('');
    }
  }, [user]);

  // Start the 2FA setup process
  const handleStartSetup = async () => {
    setError('');
    
    // Check if user is logged in and has email
    if (!user || !user.EmailUT) {
      setError('User profile is incomplete. Please ensure your account has a valid email address.');
      return;
    }
    
    const success = await setupGoogle2FA();
    if (success) {
      setSetupStarted(true);
    } else if (hookError) {
      setError(hookError);
    }
  };

  // Verify the code and complete setup
  const handleVerifyCode = async () => {
    setError('');
    const success = await verifyAndActivate2FA();
    if (success) {
      setSetupSuccess(true);
      if (onComplete) onComplete(true);
    } else if (hookError) {
      setError(hookError);
    }
  };

  // Cancel the setup process
  const handleCancel = () => {
    setSetupStarted(false);
    setSetupSuccess(false);
    setError('');
    if (onComplete) onComplete(false);
  };

  // Format secret key for better readability
  const formatSecretKey = (key) => {
    if (!key) return '';
    return key.match(/.{1,4}/g)?.join(' ') || key;
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Initial state - prompt to start setup
  if (!setupStarted) {
    return (
      <StyledSetupCard>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h5" gutterBottom>
            Set Up Google Authenticator
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: '600px', mx: 'auto' }}>
            Two-factor authentication adds an extra layer of security to your account.
            After setup, you'll need both your password and a verification code from 
            Google Authenticator to sign in.
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3, mx: 'auto', maxWidth: '600px' }}>
              {error}
            </Alert>
          )}
          
          {/* Add information about the current user */}
          {user && user.EmailUT && (
            <Alert severity="info" sx={{ mb: 3, mx: 'auto', maxWidth: '600px' }}>
              Setting up 2FA for account: {user.EmailUT}
            </Alert>
          )}
          
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleStartSetup}
            disabled={loading || !user || !user.EmailUT}
            size="large"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Start Setup'}
          </Button>
        </CardContent>
      </StyledSetupCard>
    );
  }

  // Setup complete - show success message
  if (setupSuccess) {
    return (
      <StyledSetupCard>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Two-Factor Authentication Enabled
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2, maxWidth: '600px', mx: 'auto' }}>
            Your account is now protected with Google Authenticator.
            You'll need to enter a verification code when signing in.
          </Typography>
        </CardContent>
      </StyledSetupCard>
    );
  }

  // Setup in progress - show QR code and verification step
  return (
    <StyledSetupCard>
      <CardContent>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab 
            icon={<FaQrcode />}
            label="Scan QR Code" 
            value="qrcode" 
            iconPosition="start"
          />
          <Tab 
            icon={<FaKey />}
            label="Manual Entry" 
            value="manual" 
            iconPosition="start"
          />
        </Tabs>
        
        {activeTab === 'qrcode' && (
          <Box sx={{ mb: 3 }}>
            <QRCodeContainer>
              {getQRCodeComponent()}
            </QRCodeContainer>
            <List component="ol" sx={{ pl: 2 }}>
              <ListItem>
                <ListItemText primary="Install Google Authenticator on your mobile device" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Open the app and tap the '+' icon" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Select 'Scan QR code'" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Scan the QR code shown above" />
              </ListItem>
            </List>
          </Box>
        )}
        
        {activeTab === 'manual' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Secret Key
            </Typography>
            <SecretKeyContainer>
              <Typography
                variant="h6" 
                fontFamily="monospace" 
                letterSpacing="1px"
              >
                {formatSecretKey(secretKey)}
              </Typography>
            </SecretKeyContainer>
            <List component="ol" sx={{ pl: 2 }}>
              <ListItem>
                <ListItemText primary="Install Google Authenticator on your mobile device" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Open the app and tap the '+' icon" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Select 'Enter setup key'" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Enter your account email and the secret key above" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Select 'Time based' for the type of key" />
              </ListItem>
            </List>
          </Box>
        )}
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Verify Setup
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter the 6-digit verification code from Google Authenticator
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <TextField
            fullWidth
              value={verificationCode}
              onChange={handleVerificationCodeChange}
              placeholder="000000"
            inputProps={{ maxLength: 6 }}
            sx={{ mb: 2 }}
            autoFocus
            />
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleVerifyCode}
              disabled={loading || verificationCode.length !== 6}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify & Enable'}
            </Button>
            <Button 
              variant="outlined" 
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </CardContent>
    </StyledSetupCard>
  );
};

export default GoogleAuthSetup; 