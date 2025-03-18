import axios from 'axios';

const Axios = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    // Remove 'Access-Control-Allow-Origin' header (server should handle CORS)
  },
  withCredentials: true // Essential for sending cookies
});

export default Axios;
    