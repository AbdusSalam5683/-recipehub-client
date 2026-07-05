// client/src/app/(dashboard)/admin-dashboard/manage-users/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { adminService } from '../../../../services/auth';
import { motion } from 'framer-motion';
import Image from 'next/image';
import toast from 'react-hot-toast';
import {
  UserCircleIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import Loader from '../../../../components/common/Loader';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getUsers();
      if (response.success) {
        setUsers(response.users);
      } else {
        setError(response.message || 'Failed to load users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId, currentStatus) => {
    setActionLoading(userId);
    try {
      const response = await adminService.toggleBlockUser(userId);
      if (response.success) {
        toast.success(`User ${response.user.isBlocked ? 'blocked' : 'unblocked'} successfully`);
        setUsers(users.map(u => 
          u._id === userId ? { ...u, isBlocked: response.user.isBlocked } : u
        ));
      }
    } catch (error) {
      toast.error('Failed to toggle user block status');
    } finally {
      setActionLoading(null);
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
          onClick={fetchUsers}
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
          Manage Users
        </h1>
        <p className="font-body text-charcoal-500 dark:text-cream-400 mt-1">
          View and manage all registered users
        </p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-clay-50 dark:bg-charcoal-700/50">
              <tr>
                <th className="text-left px-4 py-3 font-body font-semibold text-charcoal-600 dark:text-cream-300">
                  User
                </th>
                <th className="text-left px-4 py-3 font-body font-semibold text-charcoal-600 dark:text-cream-300">
                  Email
                </th>
                <th className="text-center px-4 py-3 font-body font-semibold text-charcoal-600 dark:text-cream-300">
                  Role
                </th>
                <th className="text-center px-4 py-3 font-body font-semibold text-charcoal-600 dark:text-cream-300">
                  Status
                </th>
                <th className="text-center px-4 py-3 font-body font-semibold text-charcoal-600 dark:text-cream-300">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-clay-200 dark:divide-charcoal-700">
              {users.map((user, index) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-clay-50 dark:hover:bg-charcoal-700/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-8 w-8 rounded-full overflow-hidden bg-clay-200 dark:bg-charcoal-700">
                        <Image
                          src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                          alt={user.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-body font-medium text-charcoal-700 dark:text-cream-200">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-charcoal-600 dark:text-cream-300 font-body">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {user.role === 'admin' ? (
                      <span className="badge-premium text-xs">Admin</span>
                    ) : (
                      <span className="badge-category text-xs">User</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {user.isBlocked ? (
                      <span className="badge-popular text-xs bg-rose-500">Blocked</span>
                    ) : (
                      <span className="badge-featured text-xs bg-sage-500">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                        disabled={actionLoading === user._id}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all duration-200',
                          user.isBlocked
                            ? 'bg-sage-100 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300 hover:bg-sage-200'
                            : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 hover:bg-rose-200'
                        )}
                      >
                        {actionLoading === user._id ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto" />
                        ) : user.isBlocked ? (
                          'Unblock'
                        ) : (
                          'Block'
                        )}
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}