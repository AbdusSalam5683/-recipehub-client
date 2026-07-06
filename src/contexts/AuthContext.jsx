// client/src/contexts/AuthContext.jsx
'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { authService } from '../services/auth';
import api from '../services/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isMounted = useRef(true);
  const checkAttempts = useRef(0);

  const checkAuth = useCallback(async () => {
    if (checkAttempts.current > 2 && !user) {
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Checking auth...');
      const response = await authService.getMe();
      console.log('✅ Auth response:', response);
      
      if (isMounted.current) {
        if (response.success && response.user) {
          setUser(response.user);
          console.log('👤 User logged in:', response.user.email);
          checkAttempts.current = 0;
        } else {
          setUser(null);
          console.log('👤 No user logged in');
        }
        setLoading(false);
      }
    } catch (error) {
      console.log('ℹ️ User not authenticated (401 is normal)');
      if (isMounted.current) {
        setUser(null);
        setLoading(false);
        checkAttempts.current += 1;
      }
    }
  }, [user]);

  useEffect(() => {
    checkAuth();
    return () => {
      isMounted.current = false;
    };
  }, [checkAuth]);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        // ✅ Token সংরক্ষণ করুন
        if (response.token) {
          localStorage.setItem('token', response.token);
          api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
        }
        
        setUser(response.user);
        toast.success('Login successful! 🎉');
        
        setTimeout(() => {
          router.push('/');
        }, 300);
        
        return { success: true };
      }
      return { success: false, error: response.message };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.success) {
        // ✅ Token সংরক্ষণ করুন
        if (response.token) {
          localStorage.setItem('token', response.token);
          api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
        }
        
        setUser(response.user);
        toast.success('Registration successful! 🎉');
        
        setTimeout(() => {
          router.push('/');
        }, 300);
        
        return { success: true };
      }
      return { success: false, error: response.message };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  // ✅ ফিক্সড Google Login
  const googleLogin = async (userData) => {
    try {
      console.log('🔄 Google login start:', userData);
      
      const response = await authService.googleLogin(userData);
      console.log('📥 Google login response:', response);
      
      if (response.success) {
        // ✅ Token সংরক্ষণ করুন (Cookie + LocalStorage Fallback)
        if (response.token) {
          localStorage.setItem('token', response.token);
          // ✅ API interceptor এ token যোগ করুন
          api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
        }
        
        // ✅ User State আপডেট করুন
        setUser(response.user);
        toast.success('Google login successful! 🎉');
        
        // ✅ Cookie set হতে সময় লাগে, সামান্য delay দিন
        setTimeout(() => {
          router.push('/');
        }, 500);
        
        return { success: true };
      } else {
        console.error('❌ Google login failed:', response);
        toast.error(response.message || 'Google login failed');
        return { success: false, error: response.message || 'Google login failed' };
      }
    } catch (error) {
      console.error('❌ Google login error:', error);
      const message = error.response?.data?.message || 'Google login failed. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      
      // ✅ Clear localStorage and headers
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    googleLogin,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isPremium: user?.isPremium || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};