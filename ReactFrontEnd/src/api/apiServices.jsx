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

// Time Table Services
export const getDays = async () => {
    try {
        const response = await apiClient.get('/day-weeks');
        return response.data;
    } catch (error) {
        console.error('Error fetching days:', error);
        throw error;
    }
};

export const getTimeSlots = async () => {
    try {
        const response = await apiClient.get('/time-slots');
        return response.data;
    } catch (error) {
        console.error('Error fetching time slots:', error);
        throw error;
    }
};

export const saveDays = async (data) => {
    try {
        const response = await apiClient.post('/day-weeks', data);
        return response.data;
    } catch (error) {
        console.error('Error saving days:', error);
        throw error;
    }
};

export const saveTimeSlots = async (data) => {
    try {
        const response = await apiClient.post('/time-slots', data);
        return response.data;
    } catch (error) {
        console.error('Error saving time slots:', error);
        throw error;
    }
};

export const updateTimeSlot = async (id, data) => {
    try {
        const formattedData = {
            StartTimeTS: data.StartTimeTS?.slice(0, 5),
            EndTimeTS: data.EndTimeTS?.slice(0, 5),
            MatriculeTS: id,
            updated_at: new Date().toISOString()
        };
        console.log('Sending update data:', formattedData);
        const response = await apiClient.put(`/time-slots/${id}`, formattedData);
        return response.data;
    } catch (error) {
        console.error('Error updating time slot:', error);
        throw error;
    }
};

export const deleteTimeSlot = async (id) => {
    try {
        const formattedData = {
            MatriculeTS: id,
            deleted_at: new Date().toISOString()
        };
        console.log('Sending delete data:', formattedData);
        const response = await apiClient.delete(`/time-slots/${id}`, { data: formattedData });
        return response.data;
    } catch (error) {
        console.error('Error deleting time slot:', error);
        throw error;
    }
};

export const getTimeTableResources = async (MatriculeTS = null, MatriculeDW = null, MatriculeGP = null) => {
    try {
        const response = await apiClient.get(`/time-table/resources/${MatriculeTS || ''}/${MatriculeDW || ''}/${MatriculeGP || ''}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching time table resources:', error);
        throw handleApiError(error);
    }
};

export const createTimeTableEntry = async (data) => {
    try {
        const response = await apiClient.post('/time-table/regular-timetables', data);
        return response.data;
    } catch (error) {
        console.error('Error creating time table entry:', error);
        throw handleApiError(error);
    }
};

export const updateTimeTableEntry = async (id, data) => {
    try {
        const response = await apiClient.put(`/time-table/regular-timetables/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating time table entry:', error);
        throw handleApiError(error);
    }
};

export const deleteTimeTableEntry = async (id) => {
    try {
        const response = await apiClient.delete(`/time-table/regular-timetables/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting time table entry:', error);
        throw handleApiError(error);
    }
};

export const updateTimeTablePosition = async (data) => {
    try {
        const response = await apiClient.post('/time-table/update-position', data);
        return response.data;
    } catch (error) {
        console.error('Error updating time table position:', error);
        throw handleApiError(error);
    }
};

export const getGroupTimeTable = async (groupId) => {
    try {
        const response = groupId && groupId!="null" ? await apiClient.get(`/time-table/group/${groupId}`) : {data:[]};
        return response.data;
    } catch (error) {
        console.error('Error fetching group time table:', error);
        throw handleApiError(error);
    }
};

export const getTimeTableConflicts = async (groupId) => {
    try {
        const response = await apiClient.get(`/time-table/conflicts/${groupId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching time table conflicts:', error);
        throw handleApiError(error);
    }
};
export const generateFullTimetable = async () => {
  try {
    const response = await apiClient.post("/time-table/generate");
    return response.data;
  } catch (error) {
    console.error('Error generating schedules:', error);
    throw handleApiError(error);
  }
}
export const ClearFullTimetable = async () => {
  try {
    const response = await apiClient.post("/time-table/clear");
    return response.data;
  } catch (error) {
    console.error('Error clearing schedules:', error);
    throw handleApiError(error);
  }
}
export const getGroupSchedule = async (groupId) => {
    try {
        const response = await apiClient.get(`/time-table/schedule/${groupId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching group schedule:', error);
        throw handleApiError(error);
    }
};

export const bulkUpdateTimeTable = async (data) => {
    try {
        const response = await apiClient.post('/time-table/bulk-update', data);
        return response.data;
    } catch (error) {
        console.error('Error performing bulk update:', error);
        throw handleApiError(error);
    }
};

export const bulkDeleteTimeTable = async (ids) => {
    try {
        const response = await apiClient.delete('/time-table/bulk-delete', { data: { ids } });
        return response.data;
    } catch (error) {
        console.error('Error performing bulk delete:', error);
        throw handleApiError(error);
    }
};

// Helper function to handle time table data transformation
export const transformTimeTableData = (data) => {
    return data.map(entry => ({
        id: entry.id,
        day: entry.dayWeek.DayNameDW,
        timeSlot: entry.timeSlot.StartTimeTS,
        subject: entry.matiere.NameMT,
        teacher: entry.professeur.NamePR,
        group: entry.group.NameGP,
        room: entry.salle.NameSL,
        color: getSubjectColor(entry.matiere.NameMT)
    }));
};

// Helper function to get subject color
const getSubjectColor = (subject) => {
    const colorMap = {
        'Maths': '#ffebee',
        'English': '#f3e5f5',
        'Computer': '#e8f5e9',
        'Spanish': '#e3f2fd',
        'Physics': '#fff3e0',
        'Chemistry': '#f3e5f5',
        'Science': '#e0f7fa'
    };
    return colorMap[subject] || '#ffffff';
};

export default apiServices;