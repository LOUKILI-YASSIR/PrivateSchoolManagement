import { useState, useEffect } from 'react';
import apiServices from '../../../api/apiServices';
import { useAuth } from '../../../utils/contexts/AuthContext';
import { QRCodeCanvas } from 'qrcode.react';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook for handling profile security features including multiple 2FA methods
 */
export const useProfileSecurity = () => {
  const { t } = useTranslation();
  const { user, reloadUserProfile } = useAuth();
  const [twoFactorData, setTwoFactorData] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('qrcode'); // 'qrcode' or 'manual'
  
  // Multiple 2FA methods support
  const [availableMethods, setAvailableMethods] = useState([]);
  const [activeMethods, setActiveMethods] = useState([]);
  const [preferredMethod, setPreferredMethod] = useState('');
  const [verificationMethod, setVerificationMethod] = useState('');
  const [showMethodSelector, setShowMethodSelector] = useState(false);

  // Initialize 2FA settings from user data when component loads
  useEffect(() => {
    if (user) {
      // Legacy support for older implementation
      setIs2FAEnabled(!!user.google2fa_enabled);
      
      // Load all available methods
      loadAvailableMethods();
    }
  }, [user]);
  
  /**
   * Load available 2FA methods for the user
   */
  const loadAvailableMethods = async () => {
    setLoading(true);
    
    try {
      const response = await apiServices.getData('/users/2fa-methods');
      
      if (response.error) {
        console.error('Failed to load 2FA methods:', response.message);
        setLoading(false);
        return;
      }
      
      setAvailableMethods(response.data.methods || []);
      setActiveMethods(response.data.active_methods || []);
      setPreferredMethod(response.data.preferred_method || '');
      setIs2FAEnabled(response.data.any_method_enabled);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading 2FA methods:', error);
      setLoading(false);
    }
  };

  /**
   * Set up Google 2FA for the user
   */
  const setupGoogle2FA = async () => {
    setLoading(true);
    setVerificationError('');
    
    try {
      // Check if user data is available
      if (!user || !user.EmailUT) {
        console.error('Error setting up 2FA: User data or email is missing');
        setVerificationError('User information is not available. Please try again later.');
        setLoading(false);
        return false;
      }

      // Request a new 2FA setup from the backend
      const response = await apiServices.postData('/setupGoogle2FA', {
        identifier: user.EmailUT // Use email as identifier
      });
      
      if (response.error) {
        setVerificationError(response.message || 'Failed to set up 2FA');
        setLoading(false);
        return false;
      }
      
      // Store the received data
      setTwoFactorData(response.data);
      setQrCodeUrl(response.data.otpauthUrl);
      setSecretKey(response.data.SecretKeyUT);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error setting up 2FA:', error);
      setVerificationError('An unexpected error occurred. Please try again.');
      setLoading(false);
      return false;
    }
  };

  /**
   * Verify and activate Google 2FA
   */
  const verifyAndActivate2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setVerificationError('Please enter a valid 6-digit verification code');
      return false;
    }

    setLoading(true);
    setVerificationError('');

    try {
      // Check if user data is available
      if (!user || !user.EmailUT) {
        console.error('Error verifying 2FA: User data or email is missing');
        setVerificationError('User information is not available. Please try again later.');
        setLoading(false);
        return false;
      }

      // Check if we have the secret key
      if (!secretKey) {
        console.error('Error verifying 2FA: Secret key is missing');
        setVerificationError('The 2FA setup is incomplete. Please restart the setup process.');
        setLoading(false);
        return false;
      }

      const response = await apiServices.postData('/verifyGoogle2FA', {
        identifier: user.EmailUT,
        CodeVerificationUT: verificationCode,
        SecretKeyUT: secretKey
      });

      if (response.error) {
        setVerificationError(response.message || 'Failed to verify 2FA code');
        setLoading(false);
        return false;
      }

      // Update 2FA settings with Google auth enabled
      await updateTwoFactorSettings(['google'], 'google');
      
      // Update the 2FA status
      setIs2FAEnabled(true);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error verifying 2FA code:', error);
      setVerificationError('An unexpected error occurred. Please try again.');
      setLoading(false);
      return false;
    }
  };

  /**
   * Disable all 2FA methods for the user
   */
  const disableAll2FA = async () => {
    if (!window.confirm(t('twoFactorAuth.confirmDisable'))) {
      return false;
    }
    
    setLoading(true);
    
    try {
      // Update settings to disable all methods
      const response = await apiServices.postData('/users/update-2fa-settings', {
        methods: [],
        preferred_method: null
      });
      
      if (response.error) {
        setVerificationError(response.message || 'Failed to disable 2FA');
        setLoading(false);
        return false;
      }
      
      // Update the 2FA status
      setIs2FAEnabled(false);
      setActiveMethods([]);
      setPreferredMethod('');
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      setVerificationError('An unexpected error occurred. Please try again.');
      setLoading(false);
      return false;
    }
  };
  
  /**
   * Update the user's 2FA settings
   * 
   * @param {string[]} methods - Array of method IDs to enable
   * @param {string} preferred - Preferred method to use
   */
  const updateTwoFactorSettings = async (methods, preferred = null) => {
    setLoading(true);
    
    try {
      const response = await apiServices.postData('/users/update-2fa-settings', {
        methods,
        preferred_method: preferred
      });
      
      if (response.error) {
        setVerificationError(response.message || 'Failed to update 2FA settings');
        setLoading(false);
        return false;
      }
      
      // Update state with new settings
      setActiveMethods(response.data.active_methods || []);
      setPreferredMethod(response.data.preferred_method || '');
      setIs2FAEnabled(methods.length > 0);

      // Reload user profile to ensure 2FA settings are updated globally
      reloadUserProfile();
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error updating 2FA settings:', error);
      setVerificationError('An unexpected error occurred. Please try again.');
      setLoading(false);
      return false;
    }
  };
  
  /**
   * Send verification code via specified method
   */
  const sendVerificationCode = async (method) => {
    setLoading(true);
    setVerificationError('');
    
    try {
      const response = await apiServices.postData('/send2FAVerificationCode', {
        identifier: user.EmailUT,
        method
      });
      
      if (response.error) {
        setVerificationError(response.message || `Failed to send verification code via ${method}`);
        setLoading(false);
        return false;
      }
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error sending verification code:', error);
      setVerificationError('An unexpected error occurred. Please try again.');
      setLoading(false);
      return false;
    }
  };
  
  /**
   * Verify code using the current verification method
   */
  const verifyCode = async (method, code) => {
    if (!code || (method === 'google' && code.length !== 6)) {
      setVerificationError('Please enter a valid verification code');
      return false;
    }
    
    setLoading(true);
    setVerificationError('');
    
    try {
      const response = await apiServices.postData('/verify2FA', {
        identifier: user.EmailUT,
        method,
        code
      });
      
      if (response.error) {
        setVerificationError(response.message || 'Invalid verification code');
        setLoading(false);
        return false;
      }
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error verifying code:', error);
      setVerificationError('An unexpected error occurred. Please try again.');
      setLoading(false);
      return false;
    }
  };

  /**
   * Handle input change for verification code
   */
  const handleVerificationCodeChange = (e) => {
    const value = e.target.value;
    // Only allow digits and limit to 6 characters
    if (/^\d*$/.test(value) && value.length <= 6) {
      setVerificationCode(value);
      setVerificationError('');
    }
  };

  /**
   * Generate a QR code component from the URL
   */
  const getQRCodeComponent = () => {
    if (!qrCodeUrl) return null;
    
    return (
      <QRCodeCanvas 
        value={qrCodeUrl} 
        size={200} 
        level="H" 
        includeMargin={true}
      />
    );
  };
  
  /**
   * Get method info by ID
   */
  const getMethodById = (methodId) => {
    return availableMethods.find(m => m.id === methodId) || null;
  };
  
  /**
   * Check if a method is enabled
   */
  const isMethodEnabled = (methodId) => {
    return activeMethods.includes(methodId);
  };

  return {
    setupGoogle2FA,
    verifyAndActivate2FA,
    disableAll2FA,
    handleVerificationCodeChange,
    getQRCodeComponent,
    twoFactorData,
    qrCodeUrl,
    secretKey,
    verificationCode,
    verificationError,
    is2FAEnabled,
    loading,
    activeTab,
    setActiveTab,
    
    // Multiple methods support
    availableMethods,
    activeMethods,
    preferredMethod,
    updateTwoFactorSettings,
    sendVerificationCode,
    verifyCode,
    verificationMethod,
    setVerificationMethod,
    showMethodSelector,
    setShowMethodSelector,
    getMethodById,
    isMethodEnabled,
    loadAvailableMethods
  };
}; 