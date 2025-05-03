import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';

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
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const storedRole = sessionStorage.getItem('userRole');

    if (token && storedRole) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
      console.log('Auto-login successful with role:', storedRole);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const isLoginPage = location.pathname === '/YLSchool/Login'
    const isResetPasswordPage = [
      '/YLSchool/reset-password-request',
      '/YLSchool/reset-password',
      '/YLSchool/select-reset-password',
      '/YLSchool/reset-password-request-sms', 
      '/YLSchool/reset-password-request-email',
      '/YLSchool/check-user-reset-password' 
    ].includes(location.pathname);

    if (!isAuthenticated && !isLoginPage && !isResetPasswordPage) {
      navigate('/YLSchool/Login', { replace: true });
    } else if (isAuthenticated && isLoginPage && isResetPasswordPage) {
      redirectToDashboard();
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate, userRole]);

  const redirectToDashboard = () => {
    navigate('/YLSchool/DashBoard', { replace: true });
  };

  const login = (token, role, must_change_password=false, obj) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('userRole', role);
    setUserRole(role);
    setIsAuthenticated(true);
    if(must_change_password) {
      navigate('/YLSchool/reset-password', { state: { ...obj } });
    }else{
      navigate('/YLSchool/DashBoard', { replace: true });
    }
  };

  const logout = () => {
    sessionStorage.clear(); // Remove all sensitive data
    setUserRole(null);
    setIsAuthenticated(false);
    navigate('/YLSchool/Login', { replace: true });
  };

  const value = {
    isAuthenticated,
    isLoading,
    userRole,
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
