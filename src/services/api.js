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

// ✅ Request interceptor - Token add
api.interceptors.request.use(
  (config) => {
    // ✅ LocalStorage form token gate
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// ✅ Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    // Silent 401 for /auth/me
    if (error.response?.status === 401 && error.config?.url === '/auth/me') {
      console.log('ℹ️ Auth check 401 - silent handling');
      return Promise.reject(error);
    }
    
    // ✅ 401 Unauthorized - Logout
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      
      if (typeof window !== 'undefined' && 
          !window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/register')) {
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
    
    console.error('❌ Response error:', error);
    const message = error.response?.data?.message || 'Something went wrong';
    
    if (error.response?.status === 403) {
      toast.error(error.response?.data?.message || 'Access denied');
    }
    
    if (error.code === 'ERR_NETWORK') {
      toast.error('Cannot connect to server. Please check your connection.');
    }
    
    return Promise.reject(error);
  },
);

export default api;