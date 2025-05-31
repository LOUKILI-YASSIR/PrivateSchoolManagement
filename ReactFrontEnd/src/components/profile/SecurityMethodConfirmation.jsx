import React from 'react';
import ActionMenu from '../menu/ActionMenu';
import { Box, Typography, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';

/**
 * Component for confirming security method changes with appropriate warnings
 * 
 * @param {Object} props Component props
 * @param {boolean} props.open Whether the dialog is open
 * @param {Function} props.onConfirm Callback when action is confirmed
 * @param {Function} props.onCancel Callback when action is canceled
 * @param {boolean} props.isLastMethod Whether this is the last enabled 2FA method
 * @param {boolean} props.is2FADisable Whether this action will disable 2FA entirely
 * @param {string} props.methodName Name of the method being modified
 * @param {string} props.action The action being performed (disable/enable)
 */
const SecurityMethodConfirmation = ({ 
  open,
  onConfirm,
  onCancel,
  isLastMethod = false,
  is2FADisable = false,
  methodName = "",
  action = "disable"
}) => {
  const { t } = useTranslation();
  
  // Create a trigger button component that will be hidden
  const TriggerButton = ({ ClickToOpen }) => (
    <div style={{ display: 'none' }}>
      {open && ClickToOpen()}
    </div>
  );
  
  // Configure dialog content based on the scenario
  const getTitle = () => {
    if (is2FADisable) {
      return t('auth.twoFactorAuth.confirmDisable2FATitle');
    }
    if (isLastMethod) {
      return t('auth.twoFactorAuth.confirmDisableLastMethodTitle');
    }
    if (action === "enable") {
      return t('auth.twoFactorAuth.confirmEnableMethodTitle', { method: methodName });
    }
    return t('auth.twoFactorAuth.confirmDisableMethodTitle', { method: methodName });
  };
  
  const getContent = () => {
    return (
      <Box sx={{ py: 1 }}>
        {is2FADisable && (
          <Alert 
            severity="warning" 
            icon={<FaExclamationTriangle />}
            sx={{ mb: 2 }}
          >
            {t('auth.twoFactorAuth.disabling2FAWarning')}
          </Alert>
        )}
        
        {isLastMethod && !is2FADisable && (
          <Alert 
            severity="warning" 
            icon={<FaExclamationTriangle />}
            sx={{ mb: 2 }}
          >
            {t('auth.twoFactorAuth.lastMethodWarning')}
          </Alert>
        )}
        
        <Typography variant="body1">
          {is2FADisable 
            ? t('auth.twoFactorAuth.disable2FAConfirmText')
            : isLastMethod 
              ? t('auth.twoFactorAuth.disableLastMethodConfirmText', { method: methodName })
              : action === "enable"
                ? t('auth.twoFactorAuth.enableMethodConfirmText', { method: methodName })
                : t('auth.twoFactorAuth.disableMethodConfirmText', { method: methodName })
          }
        </Typography>
        
        {(isLastMethod || is2FADisable) && (
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            {t('auth.twoFactorAuth.accountVulnerableWarning')}
          </Typography>
        )}
        
        {action === "enable" && (
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            {t('auth.twoFactorAuth.verificationRequiredAfterEnable')}
          </Typography>
        )}
      </Box>
    );
  };
  
  // Action buttons for the dialog
  const buttons = [
    {
      value: action === "enable" 
        ? t('auth.twoFactorAuth.enable') 
        : t('auth.twoFactorAuth.disable'),
      handleClick: onConfirm,
      handleClose: true,
      className: action === "enable" ? "bg-blue-500 text-white" : "bg-red-500 text-white"
    },
    {
      value: t('common.cancel'),
      handleClick: onCancel,
      handleClose: true,
    }
  ];
  
  // Dialog content and configuration
  const contentOptions = {
    Title: (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FaShieldAlt /> {getTitle()}
      </Box>
    ),
    Btns: buttons,
    MainBtn: TriggerButton
  };
  
  return (
    <ActionMenu 
      DialogContentComponent={getContent()}
      contentOptions={contentOptions}
      maxWidth="sm"
    />
  );
};

export default SecurityMethodConfirmation; 