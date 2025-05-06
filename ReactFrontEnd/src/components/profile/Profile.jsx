import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaPen, FaCamera, FaGlobe, FaShieldAlt, FaMoon, FaSun, FaExclamationTriangle, FaLock, FaUnlock } from 'react-icons/fa';
import './Profile.css';
import apiServices from '../../api/apiServices';
import { useFetchData, usePostData, useUpdateData } from '../../api/queryHooks';
import { useAuth } from '../../utils/contexts/AuthContext';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../common/LoadingSpinner';
import SecurityMethods from './SecurityMethods';
import { useProfileSecurity } from './hooks/useProfileSecurity';
import UserProfileInfo from './UserProfileInfo';

const Profile = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user: authUser, loadingProfile, reloadUserProfile, checkTokenValidity } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showGoogleAuthSetup, setShowGoogleAuthSetup] = useState(false);
  const { is2FAEnabled, disable2FA } = useProfileSecurity();
  
  // Dark mode from Redux
  const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);

  const { mutateAsync: updateProfile } = useUpdateData('users/profile');
  const { mutateAsync: uploadImage } = usePostData('users/upload-profile-image');

  // Initialize form data with user data from auth context
  useEffect(() => {
    if (authUser) {
      setFormData(authUser);
    }
  }, [authUser]);

  // Check authentication state
  useEffect(() => {
    // First check if token is valid
    const isTokenValid = checkTokenValidity();
    
    // If not loading profile and either not authenticated or token invalid, redirect to login
    if (!loadingProfile && (!isAuthenticated || !isTokenValid)) {
      console.log("Redirecting to login: Not authenticated or token invalid");
      navigate('/YLSchool/Login');
    }
  }, [isAuthenticated, loadingProfile, navigate, checkTokenValidity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await updateProfile({ data: formData });
      
      if (!result.error) {
        setIsEditing(false);
        // Reload user profile to get updated data
        await reloadUserProfile();
      } else {
        console.error('Error updating profile:', result.message);
        setError(result.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profileImage', file);
    setLoading(true);

    try {
      const response = await uploadImage(formData);
      
      if (!response.error) {
        // Reload user profile to get updated image
        await reloadUserProfile();
      } else {
        console.error('Error uploading image:', response.message);
        setError(response.message || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Only proceed if we're on the settings tab and editing
    if (activeTab !== 'security' || !isEditing) return;
    
    setLoading(true);
    try {
      const passwordData = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      };
      
      // Validate passwords match and are not empty
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setError('All password fields are required');
        setLoading(false);
        return;
      }
      
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('New passwords do not match');
        setLoading(false);
        return;
      }
      
      const response = await apiServices.postData('/users/change-password', passwordData);
      
      if (!response.error) {
        // Clear password fields after successful change
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        
        setIsEditing(false);
        setError(null);
      } else {
        console.error('Error changing password:', response.message);
        setError(response.message || 'Failed to change password');
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setError('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Authentication
  const handleGoogle2FAToggle = async () => {
    if (is2FAEnabled) {
      // If already enabled, prompt for disabling
      if (window.confirm('Are you sure you want to disable two-factor authentication? This will reduce the security of your account.')) {
        setLoading(true);
        try {
          const success = await disable2FA();
          if (success) {
            // Reload user profile after disabling 2FA
            await reloadUserProfile();
          }
        } catch (error) {
          console.error('Error disabling 2FA:', error);
          setError('Failed to disable 2FA');
        } finally {
          setLoading(false);
        }
      }
    } else {
      // If not enabled, show setup component
      setShowGoogleAuthSetup(true);
    }
  };

  // Handle completion of Google Auth setup
  const handleGoogleAuthSetupComplete = async (success) => {
    setShowGoogleAuthSetup(false);
    if (success) {
      try {
        // Reload user profile to get updated 2FA status
        await reloadUserProfile();
      } catch (error) {
        console.error('Error reloading profile after 2FA setup:', error);
        setError('Failed to reload profile after 2FA setup');
      }
    }
  };
  
  // Show loading only if we're actually fetching data
  if (loading) {
    return <LoadingSpinner message="Updating profile..." />;
  }

  // If the auth context is still loading the profile
  if (loadingProfile) {
    return <LoadingSpinner message="Loading profile data..." />;
  }

  // If we're authenticated but no user data is available, try to reload
  if (isAuthenticated && !authUser && !loadingProfile) {
    // Only trigger a reload if we aren't already loading
    reloadUserProfile();
    return <LoadingSpinner message="Retrieving user data..." />;
  }

  // Show error if any
  if (error) {
    return (
      <div className={`profile-error-container ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="profile-error-message">
          <div className="error-icon">
            <FaExclamationTriangle />
          </div>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button 
            className="retry-button"
            onClick={() => {
              setError(null);
              reloadUserProfile();
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If user is authenticated but data is not available yet, show a message
  if (isAuthenticated && !authUser) {
    return <LoadingSpinner message="User data unavailable. Please try refreshing the page." />;
  }

  // Render different content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <>
            <UserProfileInfo />
            {/* ... existing personal profile content ... */}
          </>
        );
      case 'security':
        return <SecurityMethods />;
      // ... other cases ...
      default:
        return null;
    }
  };

  return (
    <div className={`profile-container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="profile-header">
        <div className="profile-cover-photo">
          <div className="profile-image-container">
            <div className="profile-avatar">
              {authUser?.ProfileFileNamePL ? (
                <img src={authUser.ProfileFileNamePL} alt={`${authUser.NomPL} ${authUser.PrenomPL}`} />
              ) : (
                <div className="profile-avatar-placeholder">
                  {authUser?.PrenomPL ? authUser.PrenomPL.charAt(0) : ''}
                  {authUser?.NomPL ? authUser.NomPL.charAt(0) : ''}
                </div>
              )}
              {isEditing && (
                <label className="profile-image-upload" htmlFor="profile-image-input">
                  <FaCamera />
                  <input
                    id="profile-image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
          </div>
          <div className="profile-user-info">
            <h1>{`${authUser?.PrenomPL || ''} ${authUser?.NomPL || ''}`}</h1>
            <p>{authUser?.RoleUT || 'Student'}</p>
          </div>
          <button 
            className="edit-profile-button"
            onClick={() => {
              if (isEditing) {
                // If canceling, reset form data to current user data
                setFormData(authUser);
              }
              setIsEditing(!isEditing);
            }}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'} <FaPen />
          </button>
        </div>
      </div>

      <div className={`profile-content ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="profile-tabs">
          <button 
            className={activeTab === 'personal' ? 'active' : ''} 
            onClick={() => setActiveTab('personal')}
          >
            Personal Information
          </button>
          <button 
            className={activeTab === 'settings' ? 'active' : ''} 
            onClick={() => setActiveTab('settings')}
          >
            Preferences
          </button>
          <button 
            className={activeTab === 'security' ? 'active' : ''} 
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-edit-form">
            {activeTab === 'personal' && (
              <div className="profile-section">
                <h2>Personal Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="PrenomPL">First Name</label>
                    <input
                      type="text"
                      id="PrenomPL"
                      name="PrenomPL"
                      value={formData.PrenomPL || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="NomPL">Last Name</label>
                    <input
                      type="text"
                      id="NomPL"
                      name="NomPL"
                      value={formData.NomPL || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="EmailUT">Email</label>
                    <input
                      type="email"
                      id="EmailUT"
                      name="EmailUT"
                      value={formData.EmailUT || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="PhoneUT">Phone</label>
                    <input
                      type="tel"
                      id="PhoneUT"
                      name="PhoneUT"
                      value={formData.PhoneUT || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="AdressPL">Address</label>
                    <input
                      type="text"
                      id="AdressPL"
                      name="AdressPL"
                      value={formData.AdressPL || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="VillePL">City</label>
                    <input
                      type="text"
                      id="VillePL"
                      name="VillePL"
                      value={formData.VillePL || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="CodePostalPL">Postal Code</label>
                    <input
                      type="text"
                      id="CodePostalPL"
                      name="CodePostalPL"
                      value={formData.CodePostalPL || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="PaysPL">Country</label>
                    <input
                      type="text"
                      id="PaysPL"
                      name="PaysPL"
                      value={formData.PaysPL || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="profile-section">
                <h2>Preferences</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="LanguagePageUT">Language</label>
                    <select
                      id="LanguagePageUT"
                      name="LanguagePageUT"
                      value={formData.LanguagePageUT || 'fr'}
                      onChange={handleChange}
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="ar">العربية</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="ThemePageUT">Theme</label>
                    <select
                      id="ThemePageUT"
                      name="ThemePageUT"
                      value={formData.ThemePageUT || 'dark'}
                      onChange={handleChange}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="profile-section">
                <h2>Security Settings</h2>
                
                <h3>Change Password</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="profile-actions">
                  <button type="button" className="save-button" onClick={handlePasswordChange}>Change Password</button>
                </div>
                
                <SecurityMethods />
                
                <div className="profile-actions">
                  <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>Done</button>
                </div>
              </div>
            )}

            {activeTab !== 'security' && (
              <div className="profile-actions">
                <button type="submit" className="save-button" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  className="cancel-button" 
                  disabled={loading}
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(authUser); // Reset form data to current user data
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        ) : (
          <>
            {activeTab === 'personal' && (
              <div className="profile-section">
                <h2>Personal Information</h2>
                <div className="profile-info-grid">
                  <div className="profile-info-item">
                    <div className="info-icon"><FaUser /></div>
                    <div className="info-content">
                      <h3>Full Name</h3>
                      <p>{`${authUser?.PrenomPL || 'Not set'} ${authUser?.NomPL || ''}`}</p>
                    </div>
                  </div>
                  <div className="profile-info-item">
                    <div className="info-icon"><FaEnvelope /></div>
                    <div className="info-content">
                      <h3>Email</h3>
                      <p>{authUser?.EmailUT || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="profile-info-item">
                    <div className="info-icon"><FaPhone /></div>
                    <div className="info-content">
                      <h3>Phone</h3>
                      <p>{authUser?.PhoneUT || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="profile-info-item">
                    <div className="info-icon"><FaMapMarkerAlt /></div>
                    <div className="info-content">
                      <h3>Address</h3>
                      <p>{authUser?.AdressPL || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="profile-section">
                <h2>Preferences</h2>
                <div className="profile-info-grid">
                  <div className="profile-info-item">
                    <div className="info-icon"><FaGlobe /></div>
                    <div className="info-content">
                      <h3>Language</h3>
                      <p>{authUser?.LanguagePageUT === 'fr' ? 'Français' : 
                         authUser?.LanguagePageUT === 'en' ? 'English' : 
                         authUser?.LanguagePageUT === 'ar' ? 'العربية' : 'Not set'}</p>
                    </div>
                  </div>
                  <div className="profile-info-item">
                    <div className="info-icon">{isDarkMode ? <FaMoon /> : <FaSun />}</div>
                    <div className="info-content">
                      <h3>Theme</h3>
                      <p>{authUser?.ThemePageUT === 'dark' ? 'Dark' : 'Light'}</p>
                    </div>
                  </div>
                </div>
                <button 
                  className="edit-settings-button" 
                  onClick={() => setIsEditing(true)}
                >
                  Edit Preferences
                </button>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="profile-section">
                <h2>Security Settings</h2>
                <div className="security-info">
                  <div className="profile-info-item">
                    <div className="info-icon"><FaShieldAlt /></div>
                    <div className="info-content">
                      <h3>Password</h3>
                      <p>Last changed: {authUser?.password_changed_at || 'Never'}</p>
                    </div>
                  </div>
                </div>
                
                <SecurityMethods />
                
                <button 
                  className="edit-security-button" 
                  onClick={() => setIsEditing(true)}
                >
                  Manage Password
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;