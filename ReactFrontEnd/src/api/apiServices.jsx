import apiClient from './apiClient';

const apiServices = {
  // GET request with optional params
  getData: async (endpoint, params = {}) => {
    try {
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      if (error.response?.status === 401) {
        console.error('Unauthorized access. Please log in.');
      }
      return handleApiError(error);
    }
  },

  // POST request
  postData: async (endpoint, data) => {
    try {
      console.log(`Making POST request to ${endpoint}:`, data);
      const response = await apiClient.post(endpoint, data);
      
      // Check if the response contains 2FA required status
      if (response.data?.status === 'error' && response.data?.message === '2fa_required') {
        console.log('2FA required detected in success response:', response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error posting data to ${endpoint}:`, error);
      
      // Log the specific response for debugging 2FA issues
      if (error.response?.status === 403 && error.response?.data?.message === '2fa_required') {
        console.log('2FA required detected in error response:', error.response.data);
      }
      
      return handleApiError(error);
    }
  },

  // PUT request
  updateData: async (apiName, matricule, data) => {
    try {
      const response = await apiClient.put(`/${apiName}/${matricule}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating data in ${apiName} with ID ${matricule}:`, error);
      return handleApiError(error);
    }
  },

  // DELETE request
  deleteData: async (endpoint, matricule) => {
    try {
      const response = await apiClient.delete(`${endpoint}/${matricule}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting data at ${endpoint}/${matricule}:`, error);
      return handleApiError(error);
    }
  }
};

// Helper function to handle API errors
const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('Response error:', error.response.data);
    
    // Special handling for 403 errors with status 'user' (for password change)
    if (error.response.status === 403 && error.response.data?.status === 'user') {
      // Return the server's response directly to maintain its structure
      return error.response.data;
    }
    
    // Special handling for 2FA required errors (403 status code)
    if (error.response.status === 403 && error.response.data?.message === '2fa_required') {
      // Return the server's response directly to maintain its structure for 2FA handling
      return error.response.data;
    }
    
    // Special handling for verification code errors
    if (error.response.status === 401 && error.response.data?.message === 'Invalid verification code.') {
      return {
        error: true,
        status: 401,
        message: 'Invalid verification code.',
        errors: { code: 'resetPassword.error.invalidCode' }
      };
    }
    
    // Return the error data for handling in the component
    return {
      error: true,
      status: error.response.status,
      message: error.response.data.message || 'An error occurred',
      errors: error.response.data.errors || {}
    };
  } else if (error.request) {
    // The request was made but no response was received
    console.error('Request error:', error.request);
    return {
      error: true,
      message: 'No response from server. Please try again later.',
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error setting up request:', error.message);
    return {
      error: true,
      message: 'Error in making request. Please try again.',
    };
  }
};

export default apiServices;