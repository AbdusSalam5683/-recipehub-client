// client/src/app/forbidden/page.jsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function ForbiddenPage() {
  const router = useRouter();

  useEffect(() => {
    document.title = 'Access Denied - RecipeHub';
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center max-w-2xl"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 0.8, 
            type: 'spring',
            stiffness: 200,
            damping: 15
          }}
          className="relative"
        >
          <div className="text-9xl md:text-[10rem]">🔒</div>
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1
            }}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-3 bg-rose-500/20 rounded-full blur-md"
          />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 space-y-4"
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl text-charcoal-900 dark:text-cream-50">
            Access Denied
          </h2>
          <p className="font-body text-lg text-charcoal-500 dark:text-cream-400 max-w-md mx-auto">
            You don't have permission to access this page.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={() => router.back()}
            className="btn-outline min-w-[140px]"
          >
            ← Go Back
          </button>
          <Link
            href="/"
            className="btn-primary min-w-[140px]"
          >
            🏠 Home
          </Link>
          <Link
            href="/login"
            className="btn-secondary min-w-[140px]"
          >
            🔑 Login
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}