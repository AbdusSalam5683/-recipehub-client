// client/src/app/global-error.jsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Global Error:', error);
    document.title = 'Critical Error - RecipeHub';
  }, [error]);

  return (
    <html>
      <body className="bg-cream-50 dark:bg-charcoal-950">
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center max-w-2xl"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.8, 
                type: 'spring',
                stiffness: 200,
                damping: 15
              }}
              className="text-9xl md:text-[10rem]"
            >
              🚨
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-8 space-y-4"
            >
              <h2 className="font-display font-bold text-3xl md:text-4xl text-charcoal-900 dark:text-cream-50">
                Critical Error
              </h2>
              <p className="font-body text-lg text-charcoal-500 dark:text-cream-400 max-w-md mx-auto">
                {error?.message || 'A critical error occurred. Please try again.'}
              </p>
              {error?.digest && (
                <p className="font-body text-sm text-charcoal-400 dark:text-cream-500">
                  Error ID: {error.digest}
                </p>
              )}
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <button
                onClick={reset}
                className="btn-primary min-w-[140px]"
              >
                🔄 Try Again
              </button>
              <Link
                href="/"
                className="btn-secondary min-w-[140px]"
              >
                🏠 Home
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </body>
    </html>
  );
}