
'use client'; 

import Link from 'next/link';
import { motion } from 'framer-motion';
import { XCircleIcon } from '@heroicons/react/24/solid';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full card text-center py-12"
      >
        <div className="flex justify-center mb-4">
          <XCircleIcon className="h-20 w-20 text-paprika-500" />
        </div>
        <h1 className="font-display font-bold text-2xl text-charcoal-900 dark:text-cream-50">
          Payment Cancelled
        </h1>
        <p className="font-body text-charcoal-500 dark:text-cream-400 mt-2">
          Your payment was not completed. You can try again anytime.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link
            href="/user-dashboard/premium"
            className="btn-primary flex-1 text-center"
          >
            Try Again
          </Link>
          <Link
            href="/browse-recipes"
            className="btn-outline flex-1 text-center"
          >
            Browse Recipes
          </Link>
        </div>
      </motion.div>
    </div>
  );
}