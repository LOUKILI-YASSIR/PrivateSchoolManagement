import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Grid,
  Button,
  TextField,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import LoadingSpinner from '../common/LoadingSpinner';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useSelector } from 'react-redux';
import './Profile.css'; // Import the CSS file
import UserForm from "./hooks/UserFormHook"
import apiServices from '../../api/apiServices'; // Ensure apiServices is imported

const Profile = () => {
  const { userRole, logout } = useAuth();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [editState, setEditState] = useState({
    account: false,
    personal: false,
    password: false
  });
  const ImgPathUploads = userData?.RoleUT ? `/uploads/${userData.RoleUT}` : '';
  const handleAvatarChange = (uploadedFilename) => {
    const newAvatarUrl = uploadedFilename!=="" ? `${ImgPathUploads}/${uploadedFilename}` : "";
    setUserData({
      ...userData,
      avatar: newAvatarUrl,
    });
  };
  const [accountData, setAccountData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [personalData, setPersonalData] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const darkMode = useSelector((state) => state?.theme?.darkMode || false);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true); // Start loading
      try {
        // Fetch user data from the API
        const response = await apiServices.getData('/user'); 
        console.log('Fetched User Data Direct:', response); // Log the direct user object

        // The response from /user is the user object directly
        if (response) { 
          const fetchedUser = response; // Assign direct response
          setUserData(fetchedUser);

          // Map backend fields to frontend state
          setAccountData({
            name: `${fetchedUser?.NomPL || ''} ${fetchedUser?.PrenomPL || ''}`.trim(), 
            email: fetchedUser?.EmailUT || '',
            phone: fetchedUser?.PhoneUT || ''
          });

          setPersonalData({
            address: fetchedUser?.address || '', 
            city: fetchedUser?.city || '',
            postalCode: fetchedUser?.postalCode || '',
            country: fetchedUser?.country || ''
          });
        } else {
           // This else might indicate an actual API error handled by handleApiError
           console.error('API service returned no user data:', response);
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error state, maybe show a message to the user
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []); // Removed userRole dependency as we fetch based on auth token

  const handleEditToggle = (section) => {
    setEditState({
      ...editState,
      [section]: !editState[section]
    });
  };

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountData({
      ...accountData,
      [name]: value
    });
  };

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalData({
      ...personalData,
      [name]: value
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  // Consolidated save handler
  const handleSave = async (section, dataToSave) => {
    setIsLoading(true);
    let apiPayload = {};
    let updatedLocalData = {};

    // Prepare API payload based on section
    if (section === 'account') {
      // Split name back into NomPL and PrenomPL if needed by backend
      const nameParts = dataToSave.name.split(' ');
      apiPayload = {
        NomPL: nameParts[0] || '',
        PrenomPL: nameParts.slice(1).join(' ') || '',
        EmailUT: dataToSave.email,
        PhoneUT: dataToSave.phone,
      };
      updatedLocalData = { ...dataToSave };
    } else if (section === 'personal') {
      // Assuming backend expects these fields directly
      apiPayload = { ...dataToSave }; 
      updatedLocalData = { ...dataToSave };
    } else if (section === 'password') {
      if (dataToSave.newPassword !== dataToSave.confirmPassword) {
        alert(t('profile.passwordMismatch') || 'Passwords do not match');
        setIsLoading(false);
        return; // Stop if passwords don't match
      }
      apiPayload = {
        current_password: dataToSave.currentPassword,
        new_password: dataToSave.newPassword,
        new_password_confirmation: dataToSave.confirmPassword, // Often required by Laravel validation
      };
      // Don't store password data locally after save
      updatedLocalData = {}; 
    }

    console.log(`Saving ${section} data:`, apiPayload); // Log before sending

    try {
      const response = await apiServices.putData('/profile', apiPayload);
      console.log(`Save ${section} response:`, response); // Log response

      if (response && response.data) {
        // Update the main userData state with the fresh data from backend
        setUserData(prevData => ({ ...prevData, ...response.data })); 

        // Update the specific section's state if needed (e.g., account, personal)
        if (section === 'account') {
            setAccountData(updatedLocalData);
        } else if (section === 'personal') {
            setPersonalData(updatedLocalData);
        } else if (section === 'password') {
             // Clear password fields after successful save
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        }

        // Close the edit mode for the saved section
        setEditState({ ...editState, [section]: false });
         // Optionally show a success message
         alert(t(`profile.saveSuccess.${section}`) || `${section.charAt(0).toUpperCase() + section.slice(1)} data saved successfully!`);

      } else {
        console.error(`Failed to save ${section} data:`, response);
        alert(t('profile.saveError') || 'Failed to save data. Please check the console.');
      }

    } catch (error) {
      console.error(`Error saving ${section} data:`, error);
      // Display specific validation errors if available
      let errorMessage = t('profile.saveError');
      if (error?.errors) {
          errorMessage += '\n' + Object.values(error.errors).flat().join('\n');
      }
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Update existing handlers to use the consolidated function
  const handleAccountSave = () => handleSave('account', accountData);
  const handlePersonalSave = () => handleSave('personal', personalData);
  const handlePasswordSave = () => handleSave('password', passwordData);

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return <LoadingSpinner message={t('profile.loading')} />;
  }

  if (!userData) {
    return <Typography>{t('profile.loadError') || 'Could not load profile data.'}</Typography>;
  }

  return (
    <Box className={`profile-container ${darkMode ? 'dark' : 'light'}`}>
    <Typography variant="h4" className="profile-title">
      {t('profile.title') || 'My Profile'}
    </Typography>

    <Grid container spacing={3}>
      {/* Profile Summary */}
      <Grid item xs={12} md={4}>
        <Paper className={`paper ${darkMode ? 'dark' : 'light'} profile-summary`}>
          <UserForm {...{userData, ImgPathUploads, handleAvatarChange}} />
          <Button
            className="logout-button"
            variant="contained"
            color="primary"
            onClick={handleLogout}
          >
            {t('menu.logOut')}
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12} md={8}>
        {/* Account Information */}
        <Paper className={`paper ${darkMode ? 'dark' : 'light'}`}>
          <Box className="flex-header">
            <Typography variant="h6">
              {t('profile.accountInfo') || 'Account Information'}
            </Typography>
            {!editState.account ? (
              <IconButton
                color="primary"
                onClick={() => handleEditToggle('account')}
                size="small"
              >
                <EditIcon />
              </IconButton>
            ) : (
              <Box className="edit-buttons-container">
                <IconButton
                  color="error"
                  onClick={() => handleEditToggle('account')}
                  size="small"
                >
                  <CancelIcon />
                </IconButton>
                <IconButton
                  color="success"
                  onClick={handleAccountSave}
                  size="small"
                >
                  <SaveIcon />
                </IconButton>
              </Box>
            )}
          </Box>
          <Divider className="divider" />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" className="secondary-text">
                {t('profile.fullName') || 'Full Name'}
              </Typography>
              {editState.account ? (
                <TextField
                  name="name"
                  label={t('profile.fullName') || 'Full Name'}
                  value={accountData.name}
                  onChange={handleAccountChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  className="edit-field"
                />
              ) : (
                <Typography variant="body1">{accountData.name}</Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" className="secondary-text">
                {t('profile.email') || 'Email'}
              </Typography>
              {editState.account ? (
                <TextField
                  name="email"
                  label={t('profile.email') || 'Email'}
                  value={accountData.email}
                  onChange={handleAccountChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  type="email"
                  className="edit-field"
                />
              ) : (
                <Typography variant="body1">{accountData.email}</Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" className="secondary-text">
                {t('profile.phoneNumber') || 'Phone Number'}
              </Typography>
              {editState.account ? (
                <TextField
                  name="phone"
                  label={t('profile.phoneNumber') || 'Phone Number'}
                  value={accountData.phone}
                  onChange={handleAccountChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  type="tel"
                  className="edit-field"
                />
              ) : (
                <Typography variant="body1">{accountData.phone}</Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" className="secondary-text">
                {t('profile.RoleUT') || 'RoleUT'}
              </Typography>
              <Typography variant="body1">
                {userData.RoleUT.charAt(0).toUpperCase() + userData.RoleUT.slice(1)}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Personal Information */}
        <Paper className={`paper ${darkMode ? 'dark' : 'light'}`}>
          <Box className="flex-header">
            <Typography variant="h6">
              {t('profile.personalInfo') || 'Personal Information'}
            </Typography>
            {!editState.personal ? (
              <IconButton
                color="primary"
                onClick={() => handleEditToggle('personal')}
                size="small"
              >
                <EditIcon />
              </IconButton>
            ) : (
              <Box className="edit-buttons-container">
                <IconButton
                  color="error"
                  onClick={() => handleEditToggle('personal')}
                  size="small"
                >
                  <CancelIcon />
                </IconButton>
                <IconButton
                  color="success"
                  onClick={handlePersonalSave}
                  size="small"
                >
                  <SaveIcon />
                </IconButton>
              </Box>
            )}
          </Box>
          <Divider className="divider" />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" className="secondary-text">
                {t(' Success!address') || 'Address'}
              </Typography>
              {editState.personal ? (
                <TextField
                  name="address"
                  label={t('profile.address') || 'Address'}
                  value={personalData.address}
                  onChange={handlePersonalChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  className="edit-field"
                />
              ) : (
                <Typography variant="body1">{personalData.address}</Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" className="secondary-text">
                {t('profile.city') || 'City'}
              </Typography>
              {editState.personal ? (
                <TextField
                  name="city"
                  label={t('profile.city') || 'City'}
                  value={personalData.city}
                  onChange={handlePersonalChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  className="edit-field"
                />
              ) : (
                <Typography variant="body1">{personalData.city}</Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" className="secondary-text">
                {t('profile.postalCode') || 'Postal Code'}
              </Typography>
              {editState.personal ? (
                <TextField
                  name="postalCode"
                  label={t('profile.postalCode') || 'Postal Code'}
                  value={personalData.postalCode}
                  onChange={handlePersonalChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  className="edit-field"
                />
              ) : (
                <Typography variant="body1">{personalData.postalCode}</Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" className="secondary-text">
                {t('profile.country') || 'Country'}
              </Typography>
              {editState.personal ? (
                <TextField
                  name="country"
                  label={t('profile.country') || 'Country'}
                  value={personalData.country}
                  onChange={handlePersonalChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  className="edit-field"
                />
              ) : (
                <Typography variant="body1">{personalData.country}</Typography>
              )}
            </Grid>
          </Grid>
        </Paper>

{/* Password Section */}
<Paper className={`paper ${darkMode ? 'dark' : 'light'}`}>
            <Box className="flex-header">
              <Typography variant="h6">
                {t('profile.security') || 'Security'}
              </Typography>
              {!editState.password ? (
                <IconButton
                  color="primary"
                  onClick={() => handleEditToggle('password')}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
              ) : (
                <Box className="edit-buttons-container">
                  <IconButton
                    color="error"
                    onClick={() => handleEditToggle('password')}
                    size="small"
                  >
                    <CancelIcon />
                  </IconButton>
                  <IconButton
                    color="success"
                    onClick={handlePasswordSave}
                    size="small"
                  >
                    <SaveIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
            <Divider className="divider" />
            {editState.password ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" className="secondary-text">
                    {t('profile.currentPassword') || 'Current Password'}
                  </Typography>
                  <TextField
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="password"
                    className="edit-field"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" className="secondary-text">
                    {t('profile.newPassword') || 'New Password'}
                  </Typography>
                  <TextField
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="connect"
                    className="edit-field"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" className="secondary-text">
                    {t('profile.confirmPassword') || 'Confirm Password'}
                  </Typography>
                  <TextField
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="password"
                    className="edit-field"
                  />
                </Grid>
              </Grid>
            ) : (
              <Typography variant="body2" className="password-hidden">
                {t('profile.passwordHidden') || 'Password information is hidden for security reasons.'}
              </Typography>
            )}
          </Paper>
      </Grid>
    </Grid>
  </Box>
  );
};

export default Profile;