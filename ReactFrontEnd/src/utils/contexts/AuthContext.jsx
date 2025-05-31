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
  const [isRedirecting, setIsRedirecting] = useState(false);
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
          sessionStorage.clear();
          setIsAuthenticated(false);
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
        sessionStorage.clear();
        setIsAuthenticated(false);
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

    console.log('Initializing auth state with token:', !!token, 'and role:', storedRole);

    if (token && storedRole) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
      console.log('Auto-login successful with role:', storedRole);
      
      // Load user profile after authentication
      loadUserProfile().catch(error => {
        console.error('Failed to load profile during initialization:', error);
        setLoadingProfile(false);
        
        // If profile loading fails, check if it's an auth issue
        if (error.response && error.response.status === 401) {
          // Invalid token, clear auth state
          console.log('Invalid token detected during initialization, clearing auth state');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('userRole');
          setIsAuthenticated(false);
          setUserRole(null);
          setUser(null);
        }
      });
    } else {
      // Ensure we're not authenticated if there's no token
      console.log('No token found, ensuring logged out state');
      setIsAuthenticated(false);
      setUserRole(null);
      setUser(null);
      
      // Clear any leftover data
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userRole');
    }

    setIsLoading(false);
  }, []);

  // Fix navigation logic with a more controlled approach
  useEffect(() => {
    // Skip if still loading or already redirecting
    if (isLoading || isRedirecting) return;

    const currentPath = location.pathname;
    const isLoginPage = currentPath === '/YLSchool/Login';
    const isDashboardPage = currentPath === '/YLSchool/DashBoard';
    
    const isResetPasswordPage = [
      '/YLSchool/reset-password-request',
      '/YLSchool/reset-password',
      '/YLSchool/select-reset-password',
      '/YLSchool/reset-password-request-sms', 
      '/YLSchool/reset-password-request-email',
      '/YLSchool/check-user-reset-password',
      '/YLSchool/reset-password-request-totp' 
    ].includes(currentPath);

    // Make sure our isAuthenticated state matches the token
    const hasToken = checkTokenValidity();
    if (isAuthenticated !== hasToken) {
      console.log('Authentication state mismatch, updating to match token presence');
      setIsAuthenticated(hasToken);
      setUserRole(hasToken ? sessionStorage.getItem('userRole') : null);
      return; // Exit to let the updated state trigger the next cycle
    }

    // Case 1: Not authenticated user trying to access protected pages
    if (!isAuthenticated && !isLoginPage && !isResetPasswordPage) {
      console.log('Not authenticated, redirecting to login from:', currentPath);
      setIsRedirecting(true);
      navigate('/YLSchool/Login', { replace: true });
      // Reset redirecting flag after navigation completes
      setTimeout(() => setIsRedirecting(false), 100);
      return;
    }

    // Case 2: Authenticated user on login page should go to dashboard
    if (isAuthenticated && isLoginPage) {
      console.log('Authenticated on login page, redirecting to dashboard');
      setIsRedirecting(true);
      navigate('/YLSchool/DashBoard', { replace: true });
      // Reset redirecting flag after navigation completes
      setTimeout(() => setIsRedirecting(false), 100);
      return;
    }
    
    // All other cases are valid and don't need redirection
  }, [isAuthenticated, isLoading, isRedirecting, location.pathname, navigate, checkTokenValidity]);

  const login = async (MatriculeUT, token, role, must_change_password=false, obj) => {
    // For password change or 2FA flows, don't set token yet
    if (must_change_password || obj?.requires2FA) {
      // Only store minimal information needed for the flow
      if (obj?.requires_password_change) {
        // For password change flow, navigate but don't authenticate yet
        setIsRedirecting(true);
        navigate('/YLSchool/reset-password', { 
          state: { 
            user: {
              ...obj.user,
              requires_password_change: true
            } 
          }
        });
        setTimeout(() => setIsRedirecting(false), 100);
      } else if (obj?.requires2FA) {
        // For 2FA flow, handle separately
        setIsRedirecting(true);
        navigate('/YLSchool/select-reset-password', { 
          state: { 
            user: obj.user,
            methods: obj.methods
          }
        });
        setTimeout(() => setIsRedirecting(false), 100);
      } else {
        // Legacy handling for older code paths
        setIsRedirecting(true);
        navigate('/YLSchool/reset-password', { state: { ...obj } });
        setTimeout(() => setIsRedirecting(false), 100);
      }
      return;
    }
    
    // Normal login with valid token
    if (token) {
      // First update state
      console.log('Setting authentication with token and role:', role);
      
      // Set storage
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userRole', role);
       sessionStorage.setItem('userID', MatriculeUT);
      // Update state
      setUserRole(role);
      setIsAuthenticated(true);
      
      // Load user profile right after login
      await loadUserProfile();
      
      // Prevent loops by setting redirecting flag
      setIsRedirecting(true);
      
      // Navigate to dashboard directly
      console.log('Login successful, navigating to dashboard');
      navigate('/YLSchool/DashBoard', { replace: true });
      
      // Reset flag after navigation
      setTimeout(() => setIsRedirecting(false), 100);
    } else {
      console.error('Login attempted with no token');
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
