// client/src/components/auth/GoogleLoginButton.jsx
'use client';

import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useState } from 'react';
import Image from 'next/image';

export default function GoogleLoginButton({ mode = 'login' }) {
  const { googleLogin } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await googleLogin();
      if (result.success) {
        toast.success(`${mode === 'login' ? 'Login' : 'Registration'} successful! 🎉`);
        router.push('/');
      } else {
        toast.error(result.error || 'Google authentication failed');
      }
    } catch (error) {
      toast.error('Something went wrong with Google login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <div className="flex items-center gap-3">
          {/* ✅ Google Logo Image */}
          <div className="relative w-6 h-6 flex-shrink-0">
            <Image
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </div>
          <span>
            {mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}
          </span>
        </div>
      )}
    </button>
  );
}