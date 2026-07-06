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
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentTextIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { cn } from '../../../lib/cn';
import Loader from '../../../components/common/Loader';
import Link from 'next/link';

const statsCards = [
  { key: 'totalUsers', label: 'Total Users', icon: UsersIcon, color: 'paprika', bg: 'bg-paprika-50 dark:bg-paprika-900/20' },
  { key: 'totalRecipes', label: 'Total Recipes', icon: BookOpenIcon, color: 'sage', bg: 'bg-sage-50 dark:bg-sage-900/20' },
  { key: 'totalPremium', label: 'Premium Members', icon: StarIcon, color: 'turmeric', bg: 'bg-turmeric-50 dark:bg-turmeric-900/20' },
  { key: 'totalReports', label: 'Pending Reports', icon: FlagIcon, color: 'clay', bg: 'bg-clay-100 dark:bg-charcoal-700' },
];

const quickActions = [
  { href: '/admin-dashboard/manage-users', label: 'Manage Users', icon: UsersIcon, color: 'paprika' },
  { href: '/admin-dashboard/manage-recipes', label: 'Manage Recipes', icon: BookOpenIcon, color: 'sage' },
  { href: '/admin-dashboard/reports', label: 'View Reports', icon: FlagIcon, color: 'turmeric' },
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
            paprika: 'text-paprika-600 dark:text-paprika-400',
            sage: 'text-sage-600 dark:text-sage-400',
            turmeric: 'text-turmeric-600 dark:text-turmeric-400',
            clay: 'text-charcoal-600 dark:text-cream-300',
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
                <div className={cn('p-2.5 rounded-xl', stat.bg)}>
                  <Icon className={cn('h-5 w-5', colors[stat.color])} />
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
          {quickActions.map((action) => {
            const Icon = action.icon;
            const colors = {
              paprika: 'bg-paprika-50 dark:bg-paprika-900/20 text-paprika-600 dark:text-paprika-400 hover:bg-paprika-100 dark:hover:bg-paprika-900/30',
              sage: 'bg-sage-50 dark:bg-sage-900/20 text-sage-600 dark:text-sage-400 hover:bg-sage-100 dark:hover:bg-sage-900/30',
              turmeric: 'bg-turmeric-50 dark:bg-turmeric-900/20 text-turmeric-600 dark:text-turmeric-400 hover:bg-turmeric-100 dark:hover:bg-turmeric-900/30',
            };

            return (
              <Link
                key={action.href}
                href={action.href}
                className={cn(
                  'flex items-center justify-center gap-2 p-3 rounded-xl font-body font-medium transition-colors',
                  colors[action.color]
                )}
              >
                <Icon className="h-5 w-5" />
                {action.label}
              </Link>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}