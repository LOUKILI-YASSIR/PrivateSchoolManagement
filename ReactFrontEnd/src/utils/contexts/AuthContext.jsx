import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import apiServices from '../../api/apiServices';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if token exists and is valid
  const checkTokenValidity = () => {
    const token = sessionStorage.getItem('token');
    return !!token; // Returns true if token exists, false otherwise
  };

  // Load user profile from API
  const loadUserProfile = async () => {
    // First check if user is authenticated AND we have a valid token
    if (!isAuthenticated || !checkTokenValidity()) {
      console.log("Not loading profile - user not authenticated or token invalid");
      return null;
    }

    setLoadingProfile(true);
    try {
      const response = await apiServices.getData('/users/profile');
      
      if (response.error) {
        console.error('Failed to load user profile:', response.message);
        
        // If we get a 401 Unauthorized error, token might be expired
        if (response.status === 401) {
          console.log("Token appears to be invalid - logging out");
          setIsAuthenticated(false);
          sessionStorage.clear();
        }
        
        return null;
      }

      const userData = response.data;
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Error loading user profile:', error);
      
      // Check if the error is due to unauthorized access
      if (error.response && error.response.status === 401) {
        console.log("Unauthorized error during profile fetch - logging out");
        setIsAuthenticated(false);
        sessionStorage.clear();
      }
      
      return null;
    } finally {
      // Ensure loadingProfile is set to false in all cases
      setLoadingProfile(false);
    }
  };

  // Reload user profile (e.g., after updates)
  const reloadUserProfile = () => {
    return loadUserProfile();
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const storedRole = sessionStorage.getItem('userRole');

    if (token && storedRole) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
      console.log('Auto-login successful with role:', storedRole);
      
      // Load user profile after authentication
      loadUserProfile().catch(error => {
        console.error('Failed to load profile during initialization:', error);
        // If profile loading fails during initialization, we should still continue
        setLoadingProfile(false);
      });
    } else {
      // Ensure we're not authenticated if there's no token
      setIsAuthenticated(false);
      setUserRole(null);
      setUser(null);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const isLoginPage = location.pathname === '/YLSchool/Login';
    const isResetPasswordPage = [
      '/YLSchool/reset-password-request',
      '/YLSchool/reset-password',
      '/YLSchool/select-reset-password',
      '/YLSchool/reset-password-request-sms', 
      '/YLSchool/reset-password-request-email',
      '/YLSchool/check-user-reset-password',
      '/YLSchool/reset-password-request-totp' 
    ].includes(location.pathname);

    // Only redirect to login if not authenticated and not already on login or reset password pages
    if (!isAuthenticated && !isLoginPage && !isResetPasswordPage) {
      navigate('/YLSchool/Login', { replace: true });
    } 
    // Redirect to dashboard if authenticated and on login page (not on reset password page)
    else if (isAuthenticated && isLoginPage) {
      redirectToDashboard();
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate, userRole]);

  const redirectToDashboard = () => {
    navigate('/YLSchool/DashBoard', { replace: true });
  };

  const login = async (token, role, must_change_password=false, obj) => {
    // Set authentication state
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('userRole', role);
    setUserRole(role);
    setIsAuthenticated(true);
    
    // Load user profile right after login
    await loadUserProfile();
    
    // Handle navigation based on password change requirement
    if(must_change_password) {
      navigate('/YLSchool/reset-password', { state: { ...obj } });
    } else {
      // Use replace: true to prevent back navigation to login
      navigate('/YLSchool/DashBoard', { replace: true });
    }
  };

  const logout = () => {
    sessionStorage.clear(); // Remove all sensitive data
    setUserRole(null);
    setIsAuthenticated(false);
    setUser(null); // Clear user data on logout
    navigate('/YLSchool/Login', { replace: true });
  };

  const value = {
    isAuthenticated,
    isLoading,
    userRole,
    user,
    loadingProfile,
    reloadUserProfile,
    checkTokenValidity,
    login,
    logout
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading application..." />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
