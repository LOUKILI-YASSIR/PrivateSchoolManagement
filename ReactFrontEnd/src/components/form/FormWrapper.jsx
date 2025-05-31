import { useContext, useState, useEffect } from 'react';
import ActionMenu from '../menu/ActionMenu'; // Adjust path to match your project structure
import MultiStepForm from './Form'; // Adjust path to match your MultiStepForm location
import { useTranslation } from 'react-i18next';
import { MainContext } from '../../utils/contexts/MainContext';
import { getFromActionMenu } from './options/FormActionMenuOption';
import { Box, Typography, IconButton, Button, Paper, Snackbar, Alert } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const FormWrapper = ({ matricule = null, row = null, typeOpt = 'ADD' }) => {
  const { t: Traduction } = useTranslation();
  const { TableName } = useContext(MainContext);
  const [buttons, setButtons] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [copied, setCopied] = useState({});
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(prev => ({ ...prev, [field]: true }));
    setNotification({
      open: true,
      message: Traduction('Copied to clipboard'),
      severity: 'success'
    });
    setTimeout(() => {
      setCopied(prev => ({ ...prev, [field]: false }));
    }, 2000);
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleClose = () => {
    
    setUserInfo(null);
  };

  const UserInfoDisplay = () => {
    if (!userInfo) return null;

    const infoFields = [
      { key: 'username', label: 'Username' },
      { key: 'password', label: 'Password' },
      { key: 'validationCode', label: 'Validation Code' },
      { key: 'EmailUT', label: 'Email' },
      { key: 'PhoneUT', label: 'Phone' }
    ];

    return (
      <Paper elevation={3} sx={{ p: 3, mt: 2, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleIcon color="success" />
          {Traduction('User Information')}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {infoFields.map(({ key, label }) => (
            userInfo[key] && (
              <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle1" sx={{ minWidth: 150 }}>
                  {Traduction(label)}:
                </Typography>
                <Typography variant="body1" sx={{ flex: 1 }}>
                  {userInfo[key]}
                </Typography>
                <IconButton 
                  onClick={() => handleCopy(userInfo[key], key)}
                  color={copied[key] ? "success" : "primary"}
                  size="small"
                >
                  <ContentCopyIcon />
                </IconButton>
              </Box>
            )
          ))}
        </Box>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleClose}>
            {Traduction('OK')}
          </Button>
        </Box>
      </Paper>
    );
  };

  // Map TableName to the corresponding translation key
  const getTableTranslationKey = (tableName) => {
    const mapping = {
      'etudiants': 'student',
      'professeurs': 'prof',
      'matiere': 'subject',
      'niveaux': 'level',
      'salles': 'room',
      'groupes': 'group',
      'evaluations': 'evaluation',
      'regular-timetables': 'timetable'
    };
    return mapping[tableName] || 'student';
  };

  // Get the translated table name
  const tableNameTranslated = Traduction(`TableDBName.${getTableTranslationKey(TableName)}`);

  // Determine contentOptions based on typeOpt
  const actionMenuConfig = typeOpt === 'ADD'
    ? getFromActionMenu("actions.add", TableName, Traduction, tableNameTranslated).ADD
    : getFromActionMenu("actions.edit", TableName, Traduction, tableNameTranslated).UPDATE;

  const contentOptions = {
    Title: actionMenuConfig.Title, 
    Btns: buttons,
    MainBtn: actionMenuConfig.MainBtn,
  };
 
  return (
    <>
      <ActionMenu
        DialogContentComponent={
          <>
            <MultiStepForm 
              matricule={matricule} 
              row={row} 
              setButtons={setButtons} 
              setUserInfo={setUserInfo}
            />
            <UserInfoDisplay />
          </>
        }
        contentOptions={contentOptions}
        fullWidth={true}
        maxWidth="lg"
        style={{ minHeight: '60vh' }}
        showOptions={true}
      />
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FormWrapper;