import axios from 'axios';
import { handleError } from '../utils/errorHandler';

// Create an axios instance with default configurations
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Base URL for all requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
  timeout: 30000, // 30 seconds
});

// Request interceptor for adding auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common error cases and retries
let retryCount = 0;
const MAX_RETRIES = 2;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Log the error for debugging
    console.error('API Error:', error);
    
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      console.error('Authentication error: Please log in again');
      return Promise.reject(error);
    }

    // Retry logic for timeout and network errors
    const originalRequest = error.config;
    if ((error.code === 'ECONNABORTED' || !error.response) && retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(`Retrying request (${retryCount}/${MAX_RETRIES})...`);
      
      // Wait for 1 second before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return apiClient(originalRequest);
    }

    retryCount = 0; // Reset retry count
    return Promise.reject(error);
  }
);

export default apiClient;
    