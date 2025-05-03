import axios from 'axios';
import { handleError } from '../utils/errorHandler';

// Create an axios instance with default configurations
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Secure config via env variable
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 30000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token'); // Use sessionStorage instead of localStorage (more secure)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
let retryCount = 0;
const MAX_RETRIES = 2;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error:', error);

    const originalRequest = error.config;

    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userRole');
      return Promise.reject(error);
    }

    // Retry network or timeout errors
    if ((error.code === 'ECONNABORTED' || !error.response) && retryCount < MAX_RETRIES) {
      retryCount++;
      console.warn(`Retrying request (${retryCount}/${MAX_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return apiClient(originalRequest);
    }

    retryCount = 0;
    return Promise.reject(error);
  }
);

export default apiClient;
