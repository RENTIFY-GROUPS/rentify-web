import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000, // 10 seconds timeout
});

// Add response interceptor for error handling
API.interceptors.response.use(
  response => response,
  error => {
    // You can customize error handling here
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error('API error:', error.response.data.message || error.message);
    } else if (error.request) {
      // Request was made but no response received
      console.error('API error: No response received');
    } else {
      // Something else happened
      console.error('API error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default API;