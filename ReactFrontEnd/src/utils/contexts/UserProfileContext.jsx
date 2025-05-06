import React, { createContext, useContext, useState, useEffect } from 'react';
import apiServices from '../../api/apiServices';
import { useAuth } from './AuthContext';

// Create the context
const UserProfileContext = createContext(null);

// Custom hook to use the user profile context
export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

// Provider component
export const UserProfileProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Function to fetch user profile data
  const fetchUserProfile = async (forceFetch = false) => {
    // Return existing data if it's already loaded and not forcing a refresh
    if (userProfile && !forceFetch) {
      return userProfile;
    }
    
    // Don't fetch if not authenticated
    if (!isAuthenticated) {
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiServices.getData('/users/profile');
      
      if (response.error) {
        throw new Error(response.message || 'Failed to load user profile');
      }
      
      const userData = response.data;
      setUserProfile(userData);
      setLastUpdated(new Date());
      return userData;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err.message || 'An error occurred while fetching user profile');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Function to update user profile
  const updateUserProfile = async (updatedData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiServices.postData('/users/profile', updatedData);
      
      if (response.error) {
        throw new Error(response.message || 'Failed to update user profile');
      }
      
      // Merge updated data with existing data
      const updatedProfile = { ...userProfile, ...response.data };
      setUserProfile(updatedProfile);
      setLastUpdated(new Date());
      return updatedProfile;
    } catch (err) {
      console.error('Error updating user profile:', err);
      setError(err.message || 'An error occurred while updating user profile');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Clear profile data (e.g., on logout)
  const clearUserProfile = () => {
    setUserProfile(null);
    setLastUpdated(null);
    setError(null);
  };
  
  // Load profile when authenticated
  useEffect(() => {
    if (isAuthenticated && !userProfile) {
      fetchUserProfile();
    }
    
    if (!isAuthenticated) {
      clearUserProfile();
    }
  }, [isAuthenticated]);
  
  // Value provided by the context
  const value = {
    userProfile,
    loading,
    error,
    lastUpdated,
    fetchUserProfile,
    updateUserProfile,
    clearUserProfile
  };
  
  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};

export default UserProfileContext; 