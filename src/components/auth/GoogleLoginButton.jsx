// client/src/components/auth/GoogleLoginButton.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function GoogleLoginButton({ mode = 'login' }) {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { googleLogin } = useAuth();
  const isInitialized = useRef(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    
    if (typeof window === 'undefined') return;
    if (!GOOGLE_CLIENT_ID) {
      console.error('❌ Google Client ID not found in .env.local');
      return;
    }

    // Check if already loaded
    if (window.google) {
      setScriptLoaded(true);
      setTimeout(() => initializeGoogle(), 100);
      return;
    }

    // Load Google Script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (isMounted.current) {
        setScriptLoaded(true);
        setTimeout(() => initializeGoogle(), 100);
      }
    };
    script.onerror = () => {
      console.error('❌ Failed to load Google script');
    };
    document.body.appendChild(script);

    return () => {
      isMounted.current = false;
    };
  }, []);

  const initializeGoogle = () => {
    if (!window.google || isInitialized.current) return;
    if (!GOOGLE_CLIENT_ID) return;

    try {
      // FedCM বন্ধ করে দিন (পুরনো পদ্ধতি ব্যবহার করুন)
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
        cancel_on_tap_outside: false,
        // FedCM বন্ধ করুন - এটি main fix
        use_fedcm_for_prompt: false,
        // auto_select: false,
      });
      isInitialized.current = true;
      console.log('✅ Google initialized (FedCM disabled)');
    } catch (error) {
      console.error('❌ Google init error:', error);
    }
  };

  const handleGoogleCallback = async (response) => {
    try {
      setLoading(true);
      
      if (!response || !response.credential) {
        throw new Error('No credential received');
      }

      const token = response.credential;
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      const userData = {
        name: payload.name,
        email: payload.email,
        image: payload.picture,
      };

      console.log('🔄 Google user data:', userData);

      const result = await googleLogin(userData);
      if (result.success) {
        toast.success(`${mode === 'login' ? 'Login' : 'Registration'} successful! 🎉`);
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      } else {
        toast.error(result.error || 'Google login failed');
      }
    } catch (error) {
      console.error('❌ Google login error:', error);
      toast.error('Google login failed. Please try again.');
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const showGoogleOneTap = () => {
    if (loading) return;
    
    if (!scriptLoaded) {
      toast.error('Google is loading. Please wait...');
      return;
    }

    if (!GOOGLE_CLIENT_ID) {
      toast.error('Google Client ID not configured');
      return;
    }

    // Re-initialize if needed
    if (!isInitialized.current) {
      initializeGoogle();
    }

    setLoading(true);
    try {
      // One Tap দেখান
      window.google.accounts.id.prompt((notification) => {
        console.log('📢 Google prompt:', notification);
        
        if (notification.isNotDisplayed()) {
          console.log('ℹ️ One Tap not displayed:', notification.getNotDisplayedReason());
          setLoading(false);
          
          // Fallback: Popup Login
          showPopupLogin();
        } else if (notification.isSkippedMoment()) {
          console.log('ℹ️ One Tap skipped');
          setLoading(false);
          showPopupLogin();
        } else if (notification.isDismissedMoment()) {
          console.log('ℹ️ One Tap dismissed');
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('❌ Google prompt error:', error);
      setLoading(false);
      showPopupLogin();
    }
  };

  // Popup Login Fallback
  const showPopupLogin = () => {
    toast.info('Opening Google login...');
    
    try {
      // Popup window তৈরি করুন
      const popup = window.open(
        'https://accounts.google.com/o/oauth2/v2/auth?' +
        'client_id=' + GOOGLE_CLIENT_ID +
        '&response_type=token' +
        '&scope=email%20profile' +
        '&redirect_uri=' + encodeURIComponent(window.location.origin),
        '_blank',
        'width=500,height=600'
      );

      // Popup close হলে চেক করুন
      const checkPopup = setInterval(() => {
        if (popup && popup.closed) {
          clearInterval(checkPopup);
          setLoading(false);
        }
      }, 500);

      // 30 সেকেন্ড পর timeout
      setTimeout(() => {
        clearInterval(checkPopup);
        if (popup && !popup.closed) {
          popup.close();
          setLoading(false);
        }
      }, 30000);

    } catch (error) {
      console.error('Popup error:', error);
      toast.error('Please try again or use email login');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={showGoogleOneTap}
      disabled={loading}
      className="w-full py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <div className="animate-spin h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full"></div>
      ) : (
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      )}
      <span>
        {loading 
          ? 'Loading...' 
          : mode === 'login' 
            ? 'Continue with Google' 
            : 'Sign up with Google'
        }
      </span>
    </button>
  );
}