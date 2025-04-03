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
    // Check for stored token and auto-login
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole');
    
    if (token && storedRole) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
      console.log('Auto-login successful with role:', storedRole);
    } else {
      console.log('No stored credentials found');
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Don't do redirects while still loading
    if (isLoading) return;
    
    console.log('Route check:', { 
      isAuthenticated, 
      userRole, 
      currentPath: location.pathname 
    });

    const isLoginPage = location.pathname === '/YLSchool/Login';
    
    if (!isAuthenticated && !isLoginPage) {
      // If not authenticated and not on login page, redirect to login
      console.log('Redirecting to login');
      navigate('/YLSchool/Login', { replace: true });
    } else if (isAuthenticated && isLoginPage) {
      // If authenticated and on login page, redirect to dashboard
      console.log('Redirecting to dashboard');
      redirectToDashboard();
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate, userRole]);

  const redirectToDashboard = () => {
    console.log('Redirecting to dashboard based on role:', userRole);
    
    // Redirect to a single dashboard route instead of role-specific routes
    navigate('/YLSchool/DashBoard', { replace: true });
  };

  const login = (token, role) => {
    console.log('Login with role:', role);
    
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    
    setUserRole(role);
    setIsAuthenticated(true);
    
    // Redirect will happen in the useEffect
  };

  const logout = () => {
    console.log('Logging out');
    
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    
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