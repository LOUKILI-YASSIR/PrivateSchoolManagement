import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaPen, FaCamera, FaGlobe, FaShieldAlt, FaMoon, FaSun, FaExclamationTriangle } from 'react-icons/fa';
import './Profile.css';
import apiServices from '../../api/apiServices';
import { useFetchData, usePostData, useUpdateData } from '../../api/queryHooks';
import { useAuth } from '../../utils/contexts/AuthContext';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../common/LoadingSpinner';

const Profile = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  
  // Dark mode from Redux
  const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);

  const { mutateAsync: updateProfile } = useUpdateData('users/profile');
  const { mutateAsync: uploadImage } = usePostData('users/upload-profile-image');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        if (!isAuthenticated) {
          navigate('/YLSchool/Login');
          return;
        }

        const response = await apiServices.getData('/users/profile');

        if (response.error) {
          // If we get a 401, token might be expired
          if (response.status === 401) {
            logout();
            return;
          }
          setError(response.message || 'Failed to load profile data');
        } else {
          setUser(response.data || response);
          setFormData(response.data || response);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile data');
        setLoading(false);
        console.error('Error fetching profile data:', err);
      }
    };

    fetchUserData();
  }, [navigate, isAuthenticated, logout]);

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
    try {
      const result = await updateProfile({ data: formData });
      
      if (!result.error) {
        setUser(formData);
        setIsEditing(false);
      } else {
        console.error('Error updating profile:', result.message);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const response = await uploadImage(formData);
      
      if (!response.error) {
        setUser(prev => ({
          ...prev,
          ProfileFileNamePL: response.profileImage || response.data?.profileImage
        }));
      } else {
        console.error('Error uploading image:', response.message);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Only proceed if we're on the settings tab and editing
    if (activeTab !== 'security' || !isEditing) return;
    
    try {
      const passwordData = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      };
      
      // Validate passwords match and are not empty
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        console.error('All password fields are required');
        return;
      }
      
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        console.error('New passwords do not match');
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
        // Maybe show a success message here
      } else {
        console.error('Error changing password:', response.message);
      }
    } catch (err) {
      console.error('Error changing password:', err);
    }
  };
  
  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

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
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`profile-container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="profile-header">
        <div className="profile-cover-photo">
          <div className="profile-image-container">
            <div className="profile-avatar">
              {user?.ProfileFileNamePL ? (
                <img src={user.ProfileFileNamePL} alt={`${user.NomPL} ${user.PrenomPL}`} />
              ) : (
                <div className="profile-avatar-placeholder">
                  {user?.PrenomPL ? user.PrenomPL.charAt(0) : ''}
                  {user?.NomPL ? user.NomPL.charAt(0) : ''}
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
            <h1>{`${user?.PrenomPL || ''} ${user?.NomPL || ''}`}</h1>
            <p>{user?.RoleUT || 'Student'}</p>
          </div>
          <button 
            className="edit-profile-button"
            onClick={() => setIsEditing(!isEditing)}
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

                <div className="security-options">
                  <h3>Two-Factor Authentication</h3>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="enable2FA"
                      name="enable2FA"
                      checked={formData.enable2FA || false}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="enable2FA">Enable Two-Factor Authentication</label>
                  </div>

                  {formData.enable2FA && (
                    <div className="auth-methods">
                      <h4>Authentication Methods</h4>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          id="useVerificationCode"
                          name="useVerificationCode"
                          checked={formData.useVerificationCode || false}
                          onChange={handleCheckboxChange}
                        />
                        <label htmlFor="useVerificationCode">Verification Code (Offline)</label>
                      </div>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          id="useGoogleAuth"
                          name="useGoogleAuth"
                          checked={formData.useGoogleAuth || false}
                          onChange={handleCheckboxChange}
                        />
                        <label htmlFor="useGoogleAuth">Google Authenticator</label>
                      </div>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          id="useEmailCode"
                          name="useEmailCode"
                          checked={formData.useEmailCode || false}
                          onChange={handleCheckboxChange}
                        />
                        <label htmlFor="useEmailCode">Email Code</label>
                      </div>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          id="useSmsCode"
                          name="useSmsCode"
                          checked={formData.useSmsCode || false}
                          onChange={handleCheckboxChange}
                        />
                        <label htmlFor="useSmsCode">SMS Code</label>
                      </div>
                    </div>
                  )}
                </div>

                <div className="profile-actions">
                  <button type="button" className="save-button" onClick={handlePasswordChange}>Change Password</button>
                  <button type="submit" className="save-button">Save Security Settings</button>
                  <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
              </div>
            )}

            {activeTab !== 'security' && (
              <div className="profile-actions">
                <button type="submit" className="save-button">Save Changes</button>
                <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
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
                      <p>{`${user?.PrenomPL || 'Not set'} ${user?.NomPL || ''}`}</p>
                    </div>
                  </div>
                  <div className="profile-info-item">
                    <div className="info-icon"><FaEnvelope /></div>
                    <div className="info-content">
                      <h3>Email</h3>
                      <p>{user?.EmailUT || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="profile-info-item">
                    <div className="info-icon"><FaPhone /></div>
                    <div className="info-content">
                      <h3>Phone</h3>
                      <p>{user?.PhoneUT || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="profile-info-item">
                    <div className="info-icon"><FaMapMarkerAlt /></div>
                    <div className="info-content">
                      <h3>Address</h3>
                      <p>{user?.AdressPL || 'Not set'}</p>
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
                      <p>{user?.LanguagePageUT === 'fr' ? 'Français' : 
                         user?.LanguagePageUT === 'en' ? 'English' : 
                         user?.LanguagePageUT === 'ar' ? 'العربية' : 'Not set'}</p>
                    </div>
                  </div>
                  <div className="profile-info-item">
                    <div className="info-icon">{isDarkMode ? <FaMoon /> : <FaSun />}</div>
                    <div className="info-content">
                      <h3>Theme</h3>
                      <p>{user?.ThemePageUT === 'dark' ? 'Dark' : 'Light'}</p>
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
                      <p>Last changed: {user?.password_changed_at || 'Never'}</p>
                    </div>
                  </div>
                  <div className="profile-info-item">
                    <div className="info-content">
                      <h3>Two-Factor Authentication</h3>
                      <p>{user?.enable2FA ? 'Enabled' : 'Disabled'}</p>
                    </div>
                  </div>
                </div>
                <button 
                  className="edit-security-button" 
                  onClick={() => setIsEditing(true)}
                >
                  Manage Security Settings
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