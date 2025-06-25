import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaPen, FaCamera, FaGlobe, FaShieldAlt, FaMoon, FaSun, FaExclamationTriangle, FaLock, FaUnlock, FaFlag, FaCalendarAlt, FaStickyNote } from 'react-icons/fa';
import './Profile.css';
import apiServices from '../../api/apiServices';
import { useFetchData, usePostData, useUpdateData } from '../../api/queryHooks';
import { useAuth } from '../../utils/contexts/AuthContext';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../common/LoadingSpinner';
import SecurityMethods from './SecurityMethods';
import { useProfileSecurity } from './hooks/useProfileSecurity';
import UserProfileInfo from './UserProfileInfo';
import FormWrapper from '../form/FormWrapper';

const Profile = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user: authUser, loadingProfile, reloadUserProfile, checkTokenValidity } = useAuth();
  const MatriculeUT = authUser?.MatriculeUT || sessionStorage.getItem('MatriculeUT') || null;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({});
  // Dark mode from Redux
  const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);

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
  
  // Only trigger a reload if we aren't already loading
  useEffect(()=>{
    if (isAuthenticated && !authUser && !loadingProfile) {
      reloadUserProfile();
    }
  },[isAuthenticated,authUser,loadingProfile])
  
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


const profileAlt = `${authUser?.NomPL ?? ''} ${authUser?.PrenomPL ?? ''}`;
const profileSrc =
  authUser?.ProfileFileNamePL ||
  '/uploads/default.jpg';


  return (
    <div className={`profile-container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="profile-header">
        <div className="profile-cover-photo">
          <div className="profile-image-container">
            <div className="profile-avatar">
              <img src={profileSrc} alt={profileAlt} />;
            </div>
          </div>
          <div className="profile-user-info">
            <h1>{`${authUser?.PrenomPL || ''} ${authUser?.NomPL || ''}`}</h1>
            <p>{authUser?.RoleUT || 'Student'}</p>
          </div>
          <FormWrapper
            ExtraTableName="profile"
            matricule={MatriculeUT}
            row={{...authUser,OldPassword:authUser.PasswordUT,PasswordUT:"",ProfileFileNamePL:authUser?.ProfileFileNamePL || '/uploads/default.jpg'}}
            refetch={()=>{}}
            cancel={reloadUserProfile}
            typeOpt="MOD" // Indicate this is for modification
            key="edit"
            maxWidth="lg"
            fullWidth={true}
            style={{ minHeight: '60vh' }}
            className="edit-profile-button"
            showOptions={true}
          />        </div>
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

            {activeTab === 'personal' && (
              <div className="profile-section">
                <h2>Personal Information</h2>
                <div className="profile-info-grid">
                  {/* Full Name */}
                  <div className="profile-info-item">
                    <div className="info-icon"><FaUser /></div>
                    <div className="info-content">
                      <h3>Full Name</h3>
                      <p>{`${authUser?.PrenomPL || 'Not set'} ${authUser?.NomPL || ''}`}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="profile-info-item">
                    <div className="info-icon"><FaEnvelope /></div>
                    <div className="info-content">
                      <h3>Email</h3>
                      <p>{authUser?.EmailUT || 'Not set'}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="profile-info-item">
                    <div className="info-icon"><FaPhone /></div>
                    <div className="info-content">
                      <h3>Phone</h3>
                      <p>{authUser?.PhoneUT || 'Not set'}</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="profile-info-item">
                    <div className="info-icon"><FaMapMarkerAlt /></div>
                    <div className="info-content">
                      <h3>Address</h3>
                      <p>{authUser?.AdressPL || 'Not set'}</p>
                    </div>
                  </div>

                  {/* UserName */}
                  <div className="profile-info-item">
                    <div className="info-icon"><FaUser /></div>
                    <div className="info-content">
                      <h3>Username</h3>
                      <p>{authUser?.UserNameUT || 'Not set'}</p>
                    </div>
                  </div>

                  {/* Genre */}
                  <div className="profile-info-item">
                    <div className="info-icon"><FaUser /></div>
                    <div className="info-content">
                      <h3>Gender</h3>
                      <p>{authUser?.GenrePL || 'Not set'}</p>
                    </div>
                  </div>

                  {/* Ville */}
                  <div className="profile-info-item">
                    <div className="info-icon"><FaMapMarkerAlt /></div>
                    <div className="info-content">
                      <h3>City</h3>
                      <p>{authUser?.VillePL || 'Not set'}</p>
                    </div>
                  </div>

                  {/* Code Postal */}
                  <div className="profile-info-item">
                    <div className="info-icon"><FaMapMarkerAlt /></div>
                    <div className="info-content">
                      <h3>Postal Code</h3>
                      <p>{authUser?.CodePostalPL || 'Not set'}</p>
                    </div>
                  </div>

                  {/* Pays */}
                  <div className="profile-info-item">
                    <div className="info-icon"><FaGlobe /></div>
                    <div className="info-content">
                      <h3>Country</h3>
                      <p>{authUser?.PaysPL || 'Not set'}</p>
                    </div>
                  </div>

                  {/* Nationalité */}
                  <div className="profile-info-item">
                    <div className="info-icon"><FaFlag /></div>
                    <div className="info-content">
                      <h3>Nationality</h3>
                      <p>{authUser?.NationalitePL || 'Not set'}</p>
                    </div>
                  </div>

                  {/* Lieu de naissance */}
                  <div className="profile-info-item">
                    <div className="info-icon"><FaMapMarkerAlt /></div>
                    <div className="info-content">
                      <h3>Place of Birth</h3>
                      <p>{authUser?.LieuNaissancePL || 'Not set'}</p>
                    </div>
                  </div>

                  {/* Date de naissance */}
                  <div className="profile-info-item">
                    <div className="info-icon"><FaCalendarAlt /></div>
                    <div className="info-content">
                      <h3>Date of Birth</h3>
                      <p>{authUser?.DateNaissancePL || 'Not set'}</p>
                    </div>
                  </div>

                  {/* Observations */}
                  <div className="profile-info-item">
                    <div className="info-icon"><FaStickyNote /></div>
                    <div className="info-content">
                      <h3>Observation</h3>
                      <p>{authUser?.ObservationPL || 'Not set'}</p>
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
                      <p>{
                          (authUser?.LanguagePageUT === 'fr' && 'Français') || 
                          (authUser?.LanguagePageUT === 'en' && 'English') ||
                          (authUser?.LanguagePageUT === 'es' && 'Español') ||
                          (authUser?.LanguagePageUT === 'de' && 'Deutsch')
                         }
                      </p>
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
                
              </div>
            )}
      </div>
    </div>
  );
};

export default Profile;