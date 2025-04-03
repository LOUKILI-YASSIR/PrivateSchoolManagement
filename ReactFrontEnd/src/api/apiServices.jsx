import apiClient from './apiClient';

const apiServices = {
  // GET request
  getData: async (endpoint, params = {}) => {
    try {
      const response = await apiClient.get(endpoint, { params });
  return response.data;
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      return handleApiError(error);
    }
  },

  // POST request
  postData: async (endpoint, data) => {
    try {
      console.log(`Making POST request to ${endpoint}:`, data);
      const response = await apiClient.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`Error posting data to ${endpoint}:`, error);
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
  },
  // GET request for paginated data
  getPaginatedData: async (endpoint, start, length) => {
    try {
      if (start < 0 || length <= 0) {
        throw new Error("Invalid pagination parameters");
      }
  
      const response = await apiClient.get(endpoint, {
        params: { start, length },
      });
  
      return response.data;
    } catch (error) {
      console.error(`Error fetching paginated data from ${endpoint}:`, error);
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