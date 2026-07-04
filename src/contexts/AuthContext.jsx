// client/src/contexts/AuthContext.jsx
'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { authService } from '../services/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isMounted = useRef(true);

  const checkAuth = useCallback(async () => {
    try {
      console.log('🔄 Checking auth...');
      const response = await authService.getMe();
      console.log('✅ Auth response:', response);
      
      if (isMounted.current) {
        if (response.success && response.user) {
          setUser(response.user);
          console.log('👤 User logged in:', response.user.email);
        } else {
          setUser(null);
          console.log('👤 No user logged in');
        }
        setLoading(false);
      }
    } catch (error) {
      // 401 Error - User not authenticated (এটা Normal)
      console.log('ℹ️ User not authenticated (401 is normal)');
      if (isMounted.current) {
        setUser(null);
        setLoading(false);
      }
    }
  }, []);

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
        setUser(response.user);
        toast.success('Login successful! 🎉');
        router.push('/');
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
        setUser(response.user);
        toast.success('Registration successful! 🎉');
        router.push('/');
        return { success: true };
      }
      return { success: false, error: response.message };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const googleLogin = async (userData) => {
    try {
      const response = await authService.googleLogin(userData);
      if (response.success) {
        setUser(response.user);
        toast.success('Google login successful! 🎉');
        router.push('/');
        return { success: true };
      }
      return { success: false, error: response.message };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Google login failed' };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
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