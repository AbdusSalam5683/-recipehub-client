// client/src/app/offline/page.jsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function OfflinePage() {
  useEffect(() => {
    document.title = 'Offline - RecipeHub';
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
          📡
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 space-y-4"
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl text-charcoal-900 dark:text-cream-50">
            You're Offline
          </h2>
          <p className="font-body text-lg text-charcoal-500 dark:text-cream-400 max-w-md mx-auto">
            Please check your internet connection and try again.
          </p>
        </motion.div>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8"
        >
          <button
            onClick={() => window.location.reload()}
            className="btn-primary min-w-[180px]"
          >
            🔄 Try Again
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}