// client/src/app/not-found.jsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    document.title = 'Page Not Found - RecipeHub';
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center max-w-2xl"
      >
        {/* Animated 404 */}
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
          <div className="text-9xl md:text-[12rem] font-display font-bold leading-none">
            <span className="text-paprika-500 dark:text-paprika-400">4</span>
            <motion.span
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
              className="text-turmeric-500 dark:text-turmeric-400 inline-block"
            >
              0
            </motion.span>
            <span className="text-paprika-500 dark:text-paprika-400">4</span>
          </div>
          
          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute -top-4 -right-4 w-20 h-20 bg-paprika-500/10 rounded-full blur-2xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="absolute -bottom-4 -left-4 w-32 h-32 bg-turmeric-500/10 rounded-full blur-2xl"
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
            Oops! Page Not Found
          </h2>
          <p className="font-body text-lg text-charcoal-500 dark:text-cream-400 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
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
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-body text-charcoal-400 dark:text-cream-500"
        >
          <Link href="/browse-recipes" className="hover:text-paprika-500 dark:hover:text-paprika-400 transition-colors">
            Browse Recipes
          </Link>
          <span className="text-clay-300 dark:text-charcoal-600">•</span>
          <Link href="/user-dashboard" className="hover:text-paprika-500 dark:hover:text-paprika-400 transition-colors">
            Dashboard
          </Link>
          <span className="text-clay-300 dark:text-charcoal-600">•</span>
          <Link href="/login" className="hover:text-paprika-500 dark:hover:text-paprika-400 transition-colors">
            Login
          </Link>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mt-8 max-w-sm mx-auto"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search for recipes..."
              className="input w-full pl-10"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  router.push(`/browse-recipes?search=${encodeURIComponent(e.target.value.trim())}`);
                }
              }}
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal-400 dark:text-cream-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}