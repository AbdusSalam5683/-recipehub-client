// client/src/app/payment/success/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { paymentService } from '../../../services/auth';
import { useAuth } from '../../../contexts/AuthContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [paymentType, setPaymentType] = useState('');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      router.push('/');
      return;
    }

    verifyPayment(sessionId);
  }, []);

  const verifyPayment = async (sessionId) => {
    try {
      const response = await paymentService.verifyPayment(sessionId);
      if (response.success) {
        setPaymentType(response.payment?.paymentType || 'premium_membership');
        toast.success('Payment verified successfully! 🎉');
      } else {
        toast.error('Payment verification failed');
        router.push('/');
      }
    } catch (error) {
      toast.error('Failed to verify payment');
      router.push('/');
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="loader mx-auto mb-4" />
          <p className="font-body text-charcoal-500 dark:text-cream-400">
            Verifying your payment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full card text-center py-12"
      >
        <div className="flex justify-center mb-4">
          <CheckCircleIcon className="h-20 w-20 text-sage-500" />
        </div>
        <h1 className="font-display font-bold text-2xl text-charcoal-900 dark:text-cream-50">
          Payment Successful! 🎉
        </h1>
        <p className="font-body text-charcoal-500 dark:text-cream-400 mt-2">
          {paymentType === 'premium_membership'
            ? 'Welcome to Premium! You now have unlimited access.'
            : 'Your recipe purchase was successful!'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link
            href="/user-dashboard"
            className="btn-primary flex-1 text-center"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/browse-recipes"
            className="btn-outline flex-1 text-center"
          >
            Browse More Recipes
          </Link>
        </div>
      </motion.div>
    </div>
  );
}