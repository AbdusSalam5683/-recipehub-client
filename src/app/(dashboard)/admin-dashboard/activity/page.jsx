// client/src/app/(dashboard)/admin-dashboard/activity/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminService } from '../../../../services/auth';
import {
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  FlagIcon,
  ArrowPathIcon,
  UserPlusIcon,
  UserMinusIcon,
  TrashIcon,
  StarIcon,
  ShoppingCartIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';
import { cn } from '../../../../lib/cn';
import Loader from '../../../../components/common/Loader';
import toast from 'react-hot-toast';

const actionIcons = {
  'User logged in': UserIcon,
  'User logged out': UserIcon,
  'User registered': UserPlusIcon,
  'Created recipe': DocumentTextIcon,
  'Updated recipe': DocumentTextIcon,
  'Deleted recipe': TrashIcon,
  'Liked recipe': StarIcon,
  'Reported recipe': FlagIcon,
  'Blocked user': UserMinusIcon,
  'Unblocked user': UserPlusIcon,
  'Changed user role': UserIcon,
  'Deleted user': TrashIcon,
  'Purchased premium membership': CreditCardIcon,
  'Purchased recipe': ShoppingCartIcon,
};

const actionColors = {
  'User logged in': 'sage',
  'User logged out': 'clay',
  'User registered': 'paprika',
  'Created recipe': 'sage',
  'Updated recipe': 'turmeric',
  'Deleted recipe': 'rose',
  'Liked recipe': 'turmeric',
  'Reported recipe': 'rose',
  'Blocked user': 'rose',
  'Unblocked user': 'sage',
  'Changed user role': 'paprika',
  'Deleted user': 'rose',
  'Purchased premium membership': 'paprika',
  'Purchased recipe': 'sage',
};

const colors = {
  sage: 'bg-sage-50 dark:bg-sage-900/20 text-sage-600 dark:text-sage-400',
  paprika: 'bg-paprika-50 dark:bg-paprika-900/20 text-paprika-600 dark:text-paprika-400',
  turmeric: 'bg-turmeric-50 dark:bg-turmeric-900/20 text-turmeric-600 dark:text-turmeric-400',
  rose: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
  clay: 'bg-clay-100 dark:bg-charcoal-700 text-charcoal-600 dark:text-cream-300',
};

export default function ActivityLog() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getActivities(page);
      if (response.success) {
        setActivities(response.activities);
        setPagination(response.pagination);
      } else {
        setError(response.message || 'Failed to load activities');
        toast.error('Failed to load activities');
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError('Network error. Please try again.');
      toast.error('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return new Date(date).toLocaleDateString();
  };

  const getActionIcon = (action) => {
    const Icon = actionIcons[action] || DocumentTextIcon;
    return Icon;
  };

  const getActionColor = (action) => {
    return colors[actionColors[action] || 'clay'];
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
          onClick={() => fetchActivities(1)}
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
          Activity Log
        </h1>
        <p className="font-body text-charcoal-500 dark:text-cream-400 mt-1">
          Recent activities on the platform
        </p>
      </div>

      <div className="card">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="font-display font-semibold text-xl text-charcoal-900 dark:text-cream-50">
              No activities yet
            </h3>
            <p className="font-body text-charcoal-500 dark:text-cream-400 mt-2">
              Activities will appear here as users interact with the platform.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity, index) => {
              const Icon = getActionIcon(activity.action);
              const colorClass = getActionColor(activity.action);
              return (
                <motion.div
                  key={activity._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index, 10) * 0.04 }}
                  className="flex items-start gap-4 p-3 rounded-xl hover:bg-clay-50 dark:hover:bg-charcoal-700/50 transition-colors"
                >
                  <div className={cn('p-2 rounded-lg flex-shrink-0', colorClass)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-charcoal-700 dark:text-cream-200">
                      <span className="font-medium">{activity.userName || activity.userEmail || 'System'}</span>
                      {' '}{activity.action}
                      {activity.target && (
                        <span className="font-medium text-paprika-600 dark:text-paprika-400">
                          {' '}"{activity.target}"'
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-charcoal-500 dark:text-cream-400">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-3.5 w-3.5" />
                        {formatTime(activity.createdAt)}
                      </span>
                      {activity.details && (
                        <span className="text-charcoal-400 dark:text-cream-500">
                          • {JSON.stringify(activity.details)}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => fetchActivities(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 rounded-lg border border-clay-300 dark:border-charcoal-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-clay-100 dark:hover:bg-charcoal-700 transition-colors text-sm font-body"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm font-body text-charcoal-600 dark:text-cream-400">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => fetchActivities(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="px-4 py-2 rounded-lg border border-clay-300 dark:border-charcoal-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-clay-100 dark:hover:bg-charcoal-700 transition-colors text-sm font-body"
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
}