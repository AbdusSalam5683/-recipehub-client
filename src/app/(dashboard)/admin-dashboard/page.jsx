// client/src/app/(dashboard)/admin-dashboard/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { adminService } from '../../../services/auth';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  BookOpenIcon,
  StarIcon,
  FlagIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { cn } from '../../../lib/cn';
import Loader from '../../../components/common/Loader';

const statsCards = [
  { key: 'totalUsers', label: 'Total Users', icon: UsersIcon, color: 'paprika' },
  { key: 'totalRecipes', label: 'Total Recipes', icon: BookOpenIcon, color: 'sage' },
  { key: 'totalPremium', label: 'Premium Members', icon: StarIcon, color: 'turmeric' },
  { key: 'totalReports', label: 'Total Reports', icon: FlagIcon, color: 'clay' },
];

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getOverview();
      if (response.success) {
        setStats(response.overview);
      } else {
        setError(response.message || 'Failed to load stats');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="card text-center py-12">
        <div className="text-5xl mb-4">⚠️</div>
        <h3 className="font-display font-semibold text-xl text-charcoal-900 dark:text-cream-50">
          Failed to load
        </h3>
        <p className="font-body text-charcoal-500 dark:text-cream-400 mt-2">
          {error}
        </p>
        <button
          onClick={fetchStats}
          className="btn-primary mt-4 inline-flex items-center gap-2"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Try Again
        </button>
      </div>
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
          Admin Dashboard
        </h1>
        <p className="font-body text-charcoal-500 dark:text-cream-400 mt-1">
          Overview of RecipeHub platform
        </p>
      </div>

      {/* Stats Grid */}
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

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="card"
      >
        <h2 className="font-display font-semibold text-lg text-charcoal-900 dark:text-cream-50 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="/admin-dashboard/manage-users"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-paprika-50 dark:bg-paprika-900/20 text-paprika-600 dark:text-paprika-400 font-body font-medium hover:bg-paprika-100 dark:hover:bg-paprika-900/30 transition-colors"
          >
            <UsersIcon className="h-5 w-5" />
            Manage Users
          </a>
          <a
            href="/admin-dashboard/manage-recipes"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-sage-50 dark:bg-sage-900/20 text-sage-600 dark:text-sage-400 font-body font-medium hover:bg-sage-100 dark:hover:bg-sage-900/30 transition-colors"
          >
            <BookOpenIcon className="h-5 w-5" />
            Manage Recipes
          </a>
          <a
            href="/admin-dashboard/reports"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-turmeric-50 dark:bg-turmeric-900/20 text-turmeric-600 dark:text-turmeric-400 font-body font-medium hover:bg-turmeric-100 dark:hover:bg-turmeric-900/30 transition-colors"
          >
            <FlagIcon className="h-5 w-5" />
            View Reports
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}