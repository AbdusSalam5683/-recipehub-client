// client/src/services/api.js
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

console.log('🔗 API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    const message = error.response?.data?.message || 'Something went wrong';
    
    // 401 - Unauthorized (User not logged in)
    // এটা Normal, এখানে toast দেখাবেন না
    if (error.response?.status === 401) {
      // শুধু /auth/me এর জন্য 401 দেখাবেন না
      if (error.config?.url !== '/auth/me') {
        toast.error('Please login to continue');
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      // কিন্তু error return করবেন, AuthContext handle করবে
      return Promise.reject(error);
    }
    
    if (error.response?.status === 403) {
      toast.error(error.response?.data?.message || 'Access denied');
    }
    
    if (error.code === 'ERR_NETWORK') {
      toast.error('Cannot connect to server. Please make sure the server is running.');
    }
    
    return Promise.reject(error);
  }
);

export default api;