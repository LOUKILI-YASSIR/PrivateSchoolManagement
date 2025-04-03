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
  const ImgPathUploads = userData?.role ? `/uploads/${userData.role}` : ''
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
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockData = {
          id: 1,
          name: 'Admin User',
          email: 'admin@ylschool.ma',
          role: userRole || 'admin',
          phone: '+212612345678',
          joinDate: '2023-01-15',
          avatar: '',
          language: localStorage.getItem('i18nextLng') || 'en',
          address: '123 School Avenue',
          city: 'Casablanca',
          postalCode: '20000',
          country: 'Morocco'
        };
        setUserData(mockData);
        setAccountData({
          name: mockData.name,
          email: mockData.email,
          phone: mockData.phone
        });
        setPersonalData({
          address: mockData.address,
          city: mockData.city,
          postalCode: mockData.postalCode,
          country: mockData.country
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [userRole]);

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

  const handleAccountSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserData({
        ...userData,
        ...accountData
      });
      setEditState({ ...editState, account: false });
    } catch (error) {
      console.error('Error saving account data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonalSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserData({
        ...userData,
        ...personalData
      });
      setEditState({ ...editState, personal: false });
    } catch (error) {
      console.error('Error saving personal data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSave = async () => {
    setIsLoading(true);
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert(t('profile.passwordMismatch') || 'Passwords do not match');
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setEditState({ ...editState, password: false });
    } catch (error) {
      console.error('Error saving password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return <LoadingSpinner message={t('profile.loading')} />;
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
                {t('profile.role') || 'Role'}
              </Typography>
              <Typography variant="body1">
                {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
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