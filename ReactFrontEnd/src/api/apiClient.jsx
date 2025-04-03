import axios from 'axios';
import { handleError } from '../utils/errorHandler';

// Create an axios instance with default configurations
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Base URL for all requests
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000, // 10 seconds
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

// Response interceptor for handling common error cases
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the error for debugging
    console.error('API Error:', error);
    
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Don't use navigate here as it causes errors
      console.error('Authentication error: Please log in again');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
    