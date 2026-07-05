// client/src/app/(dashboard)/user-dashboard/premium/page.jsx
'use client';

import { useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { paymentService } from '../../../../services/auth';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  RocketLaunchIcon,
  StarIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { cn } from '../../../../lib/cn';

const premiumFeatures = [
  { icon: RocketLaunchIcon, text: 'Unlimited recipe uploads' },
  { icon: StarIcon, text: 'Premium badge on profile' },
  { icon: ShieldCheckIcon, text: 'Early access to new features' },
  { icon: SparklesIcon, text: 'Exclusive premium recipes' },
];

export default function PremiumPage() {
  const { user, isPremium } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePremiumPurchase = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const response = await paymentService.createPremiumCheckout();

      if (response.success && response.url) {
        window.location.href = response.url;
      } else {
        toast.error('Failed to initiate premium purchase');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isPremium) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="font-display font-bold text-2xl text-charcoal-900 dark:text-cream-50">
            You're already a Premium Member!
          </h2>
          <p className="font-body text-charcoal-500 dark:text-cream-400 mt-2">
            Enjoy unlimited recipes and exclusive features.
          </p>
          <Link
            href="/user-dashboard"
            className="btn-primary mt-6 inline-flex"
          >
            Go to Dashboard
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-charcoal-900 dark:text-cream-50">
          Upgrade to Premium ⭐
        </h1>
        <p className="font-body text-charcoal-500 dark:text-cream-400 mt-1">
          Unlock unlimited recipes and exclusive features
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Plan */}
        <div className="card">
          <h3 className="font-display font-semibold text-lg text-charcoal-900 dark:text-cream-50 mb-2">
            Current Plan
          </h3>
          <div className="p-4 rounded-xl bg-clay-50 dark:bg-charcoal-700/50 border border-clay-200 dark:border-charcoal-600">
            <p className="font-body font-medium text-charcoal-700 dark:text-cream-200">Free</p>
            <p className="font-body text-sm text-charcoal-500 dark:text-cream-400 mt-1">
              • 2 recipe uploads<br />
              • Basic features<br />
              • Community access
            </p>
          </div>
          <div className="mt-4 p-4 rounded-xl bg-turmeric-50 dark:bg-turmeric-900/20 border border-turmeric-200 dark:border-turmeric-800">
            <p className="font-body text-sm text-turmeric-700 dark:text-turmeric-300">
              ⚡ You've used {user?.recipeCount || 0} of 2 free recipes
            </p>
          </div>
        </div>

        {/* Premium Plan */}
        <div className="card border-2 border-turmeric-500 dark:border-turmeric-400 relative">
          <span className="absolute -top-3 right-4 badge-premium">BEST VALUE</span>
          <h3 className="font-display font-semibold text-lg text-charcoal-900 dark:text-cream-50 mb-2">
            Premium
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="font-display font-bold text-3xl text-charcoal-900 dark:text-cream-50">
              $9.99
            </span>
            <span className="font-body text-sm text-charcoal-500 dark:text-cream-400">/month</span>
          </div>
          <p className="font-body text-sm text-charcoal-500 dark:text-cream-400 mt-1">
            Cancel anytime. No commitment.
          </p>
          <ul className="mt-4 space-y-3">
            {premiumFeatures.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <feature.icon className="h-5 w-5 text-turmeric-500 flex-shrink-0 mt-0.5" />
                <span className="font-body text-sm text-charcoal-700 dark:text-cream-200">
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>
          <button
            onClick={handlePremiumPurchase}
            disabled={loading}
            className={cn(
              'btn-primary w-full mt-6 flex items-center justify-center gap-2',
              loading && 'opacity-70 cursor-not-allowed'
            )}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <RocketLaunchIcon className="h-5 w-5" />
                Upgrade Now
              </>
            )}
          </button>
          <p className="font-body text-xs text-charcoal-400 dark:text-cream-500 text-center mt-3">
            🔒 Secure payment via Stripe
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="card">
        <h3 className="font-display font-semibold text-lg text-charcoal-900 dark:text-cream-50 mb-4">
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-body font-medium text-charcoal-700 dark:text-cream-200">
              What happens if I cancel my subscription?
            </h4>
            <p className="font-body text-sm text-charcoal-500 dark:text-cream-400 mt-1">
              You can cancel anytime. Your premium features will remain active until the end of your billing period.
            </p>
          </div>
          <div>
            <h4 className="font-body font-medium text-charcoal-700 dark:text-cream-200">
              Can I upgrade later?
            </h4>
            <p className="font-body text-sm text-charcoal-500 dark:text-cream-400 mt-1">
              Yes, you can upgrade to Premium at any time from this page.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}