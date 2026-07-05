// client/src/app/(dashboard)/user-dashboard/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { userService } from '../../../services/auth';
import { motion } from 'framer-motion';
import {
  BookOpenIcon,
  HeartIcon,
  StarIcon,
  EyeIcon,
  PlusCircleIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { cn } from '../../../lib/cn';
import Loader from '../../../components/common/Loader';
import Link from 'next/link';

const statsCards = [
  { key: 'totalRecipes', label: 'Total Recipes', icon: BookOpenIcon, color: 'paprika' },
  { key: 'totalFavorites', label: 'Favorites', icon: HeartIcon, color: 'sage' },
  { key: 'totalLikesReceived', label: 'Likes Received', icon: StarIcon, color: 'turmeric' },
  { key: 'totalViews', label: 'Total Views', icon: EyeIcon, color: 'clay' },
];

export default function DashboardOverview() {
  const { user, isPremium } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await userService.getStats();
      if (response.success) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display font-bold text-2xl md:text-3xl text-charcoal-900 dark:text-cream-50">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="font-body text-charcoal-500 dark:text-cream-400 mt-1">
          Here's what's happening with your recipes
        </p>
        {isPremium && (
          <span className="badge-premium mt-3 inline-block">⭐ Premium Member</span>
        )}
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          const value = stats?.[stat.key] ?? 0;
          const colors = {
            paprika: 'bg-paprika-50 dark:bg-paprika-900/20 text-paprika-600 dark:text-paprika-400',
            sage: 'bg-sage-50 dark:bg-sage-900/20 text-sage-600 dark:text-sage-400',
            turmeric: 'bg-turmeric-50 dark:bg-turmeric-900/20 text-turmeric-600 dark:text-turmeric-400',
            clay: 'bg-clay-100 dark:bg-charcoal-700 text-charcoal-600 dark:text-cream-300',
          };

          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="flex items-center gap-3">
                <div className={cn('p-2.5 rounded-xl', colors[stat.color])}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display font-bold text-xl text-charcoal-900 dark:text-cream-50">
                    {value}
                  </p>
                  <p className="font-body text-xs text-charcoal-500 dark:text-cream-400">
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="card"
      >
        <h2 className="font-display font-semibold text-lg text-charcoal-900 dark:text-cream-50 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/user-dashboard/add-recipe"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-paprika-50 dark:bg-paprika-900/20 text-paprika-600 dark:text-paprika-400 font-body font-medium hover:bg-paprika-100 dark:hover:bg-paprika-900/30 transition-colors"
          >
            <PlusCircleIcon className="h-5 w-5" />
            Add New Recipe
          </Link>
          <Link
            href="/user-dashboard/my-recipes"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-sage-50 dark:bg-sage-900/20 text-sage-600 dark:text-sage-400 font-body font-medium hover:bg-sage-100 dark:hover:bg-sage-900/30 transition-colors"
          >
            <ClipboardDocumentListIcon className="h-5 w-5" />
            View My Recipes
          </Link>
        </div>
      </motion.div>
    </div>
  );
}