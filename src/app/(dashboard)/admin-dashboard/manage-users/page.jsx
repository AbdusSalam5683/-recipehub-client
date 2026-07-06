// client/src/app/(dashboard)/admin-dashboard/manage-users/page.jsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { adminService } from '../../../../services/auth';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useAuth } from '../../../../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  ShieldCheckIcon,
  ShieldExclamationIcon,
  ArrowPathIcon,
  TrashIcon,
  UserIcon,
  UserMinusIcon,
  UserPlusIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  UsersIcon,
  BookOpenIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { Crown } from 'lucide-react';
import { cn } from '../../../../lib/cn';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'admin', label: 'Admins' },
  { key: 'blocked', label: 'Blocked' },
  { key: 'active', label: 'Active' },
];

// ✅ StatCard Component
function StatCard({ icon: Icon, label, value, accent, loading }) {
  const accentClasses = {
    charcoal: 'bg-charcoal-100 dark:bg-charcoal-700 text-charcoal-700 dark:text-cream-200',
    paprika: 'bg-paprika-100 dark:bg-paprika-900/30 text-paprika-600 dark:text-paprika-300',
    rose: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300',
    sage: 'bg-sage-100 dark:bg-sage-900/30 text-sage-600 dark:text-sage-300',
  };
  return (
    <div className="card px-4 py-3.5 flex items-center gap-3">
      <div className={cn('flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl', accentClasses[accent])}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-body text-charcoal-400 dark:text-cream-500 truncate">{label}</p>
        {loading ? (
          <div className="h-4 w-10 mt-1 rounded bg-clay-200 dark:bg-charcoal-700 animate-pulse" />
        ) : (
          <p className="font-display font-bold text-lg text-charcoal-900 dark:text-cream-50 tabular-nums">{value}</p>
        )}
      </div>
    </div>
  );
}

// ✅ RoleBadge Component
function RoleBadge({ isAdmin }) {
  return isAdmin ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-paprika-100 dark:bg-paprika-900/30 text-paprika-700 dark:text-paprika-300 text-xs font-medium">
      <Crown className="h-3 w-3" />
      Admin
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-clay-100 dark:bg-charcoal-700 text-charcoal-600 dark:text-cream-300 text-xs font-medium">
      <UserIcon className="h-3 w-3" />
      User
    </span>
  );
}

// ✅ StatusBadge Component
function StatusBadge({ isBlocked }) {
  return isBlocked ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-xs font-medium">
      <ShieldExclamationIcon className="h-3 w-3" />
      Blocked
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sage-100 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300 text-xs font-medium">
      <ShieldCheckIcon className="h-3 w-3" />
      Active
    </span>
  );
}

// ✅ SkeletonRow Component
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-clay-200 dark:bg-charcoal-700" />
          <div className="space-y-2">
            <div className="h-3 w-28 rounded bg-clay-200 dark:bg-charcoal-700" />
            <div className="h-2.5 w-36 rounded bg-clay-100 dark:bg-charcoal-700/70" />
          </div>
        </div>
      </td>
      <td className="px-4 py-3"><div className="h-5 w-16 mx-auto rounded-full bg-clay-200 dark:bg-charcoal-700" /></td>
      <td className="px-4 py-3"><div className="h-3 w-6 mx-auto rounded bg-clay-200 dark:bg-charcoal-700" /></td>
      <td className="px-4 py-3"><div className="h-5 w-16 mx-auto rounded-full bg-clay-200 dark:bg-charcoal-700" /></td>
      <td className="px-4 py-3"><div className="h-8 w-8 ml-auto rounded-lg bg-clay-200 dark:bg-charcoal-700" /></td>
    </tr>
  );
}

// ✅ EmptyState Component
function EmptyState({ query }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-clay-100 dark:bg-charcoal-700 mb-3">
        <UsersIcon className="h-6 w-6 text-charcoal-400 dark:text-cream-500" />
      </div>
      <h3 className="font-display font-semibold text-charcoal-800 dark:text-cream-100">
        {query ? 'No users match your search' : 'No users found'}
      </h3>
      <p className="font-body text-sm text-charcoal-400 dark:text-cream-500 mt-1">
        {query ? `Try a different name or email than "${query}"` : 'New sign-ups will show up here'}
      </p>
    </div>
  );
}

// ✅ MenuItem Component
function MenuItem({ icon: Icon, label, onClick, tone }) {
  const toneClasses = {
    sage: 'text-sage-600 dark:text-sage-400',
    rose: 'text-rose-600 dark:text-rose-400',
    paprika: 'text-paprika-600 dark:text-paprika-400',
    charcoal: 'text-charcoal-600 dark:text-cream-300',
  };
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-body text-charcoal-700 dark:text-cream-200 hover:bg-clay-100 dark:hover:bg-charcoal-700 transition-colors"
    >
      <Icon className={cn('h-4 w-4 flex-shrink-0', toneClasses[tone])} />
      {label}
    </button>
  );
}

// ✅ ActionMenu Component
// client/src/app/(dashboard)/admin-dashboard/manage-users/page.jsx

// ✅ ActionMenu কম্পোনেন্টের ভিতরে এই পরিবর্তনগুলো যোগ করুন

function ActionMenu({ 
  user, 
  isAdmin, 
  open, 
  onToggle, 
  actionLoading,
  onBlockClick,
  onAdminClick,
  onDelete,
  menuRef 
}) {
  const isBusy =
    actionLoading === `block-${user._id}` ||
    actionLoading === `role-${user._id}` ||
    actionLoading === `delete-${user._id}`;

  return (
    <div className= "relative "    ref={open ? menuRef : null}>
      {/* Three Dots Button */}
      <button
        onClick={onToggle}
        disabled={isBusy}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-charcoal-500 dark:text-cream-400 hover:bg-clay-200 dark:hover:bg-charcoal-700 transition-colors disabled:opacity-50"
        title="Actions"
      >
        {isBusy ? (
          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <EllipsisVerticalIcon className="h-5 w-5" />
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-20 mt-1 w-48 overflow-hidden rounded-xl border border-clay-200 dark:border-charcoal-700  shadow-xl modal-admin-bg"
             style={{
        background: `
          radial-gradient(circle at 30% 70%, rgba(232, 163, 61, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 70% 30%, rgba(237, 184, 104, 0.05) 0%, transparent 50%),
          repeating-linear-gradient(-45deg, transparent, transparent 12px, rgba(232, 163, 61, 0.03) 12px, rgba(232, 163, 61, 0.03) 13px),
          #FFFBF5
        `
      }}
          >
            {/* Block/Unblock */}
            <MenuItem
              icon={user.isBlocked ? UserPlusIcon : UserMinusIcon}
              label={user.isBlocked ? 'Unblock user' : 'Block user'}
              onClick={() => onBlockClick(user)}
              tone={user.isBlocked ? 'sage' : 'rose'}
            />

            {/* Make Admin / Remove Admin */}
            <MenuItem
              icon={isAdmin ? UserIcon : Crown}
              label={isAdmin ? 'Remove admin' : 'Make admin'}
              onClick={() => onAdminClick(user)}
              tone={isAdmin ? 'charcoal' : 'paprika'}
            />

            {/* Delete User (only for non-admin) */}
            {!isAdmin && (
              <>
                <div className="my-1 border-t border-clay-200 dark:border-charcoal-700" />
                <MenuItem
                  icon={TrashIcon}
                  label="Delete user"
                  onClick={() => onDelete(user)}
                  tone="rose"
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ✅ Main Component
export default function ManageUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const handleBlockClick = (user) => {
    if (user._id === currentUser?._id) {
      toast.error('You cannot block yourself');
      return;
    }
    setSelectedUser(user);
    setActionType(user.isBlocked ? 'unblock' : 'block');
    setShowBlockModal(true);
    setOpenMenuId(null);
  };

  const handleBlockConfirm = async () => {
    if (!selectedUser) return;
    setActionLoading(`block-${selectedUser._id}`);
    try {
      const response = await adminService.toggleBlockUser(selectedUser._id);
      if (response.success) {
        toast.success(`User ${response.user.isBlocked ? 'blocked' : 'unblocked'} successfully`);
        setUsers(users.map(u =>
          u._id === selectedUser._id ? { ...u, isBlocked: response.user.isBlocked } : u
        ));
        setShowBlockModal(false);
        setSelectedUser(null);
        setActionType(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to toggle user block status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAdminClick = (user) => {
    if (user._id === currentUser?._id) {
      toast.error('You cannot change your own role');
      return;
    }
    setSelectedUser(user);
    setActionType(user.role === 'admin' ? 'removeAdmin' : 'makeAdmin');
    setShowAdminModal(true);
    setOpenMenuId(null);
  };

  const handleAdminConfirm = async () => {
    if (!selectedUser) return;
    const newRole = selectedUser.role === 'admin' ? 'user' : 'admin';
    setActionLoading(`role-${selectedUser._id}`);
    try {
      const response = await adminService.changeUserRole(selectedUser._id, newRole);
      if (response.success) {
        toast.success(`User role changed to ${newRole} successfully`);
        setUsers(users.map(u =>
          u._id === selectedUser._id ? { ...u, role: response.user.role } : u
        ));
        setShowAdminModal(false);
        setSelectedUser(null);
        setActionType(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change role');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteClick = (user) => {
    if (user._id === currentUser?._id) {
      toast.error('You cannot delete yourself');
      return;
    }
    setSelectedUser(user);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    setActionLoading(`delete-${selectedUser._id}`);
    try {
      const response = await adminService.deleteUser(selectedUser._id);
      if (response.success) {
        toast.success('User deleted successfully');
        setUsers(users.filter(u => u._id !== selectedUser._id));
        setShowDeleteModal(false);
        setSelectedUser(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  const stats = useMemo(() => ({
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    blocked: users.filter(u => u.isBlocked).length,
    recipes: users.reduce((sum, u) => sum + (u.recipeCount || 0), 0),
  }), [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesQuery =
        query.trim() === '' ||
        u.name?.toLowerCase().includes(query.toLowerCase()) ||
        u.email?.toLowerCase().includes(query.toLowerCase());

      const matchesFilter =
        filter === 'all' ||
        (filter === 'admin' && u.role === 'admin') ||
        (filter === 'blocked' && u.isBlocked) ||
        (filter === 'active' && !u.isBlocked);

      return matchesQuery && matchesFilter;
    });
  }, [users, query, filter]);

  const ringClass = (user) => {
    if (user.isBlocked) return 'ring-rose-400 dark:ring-rose-500';
    if (user.role === 'admin') return 'ring-paprika-400 dark:ring-paprika-500';
    return 'ring-sage-300 dark:ring-sage-600';
  };

  if (error) {
    return (
      <div className="card text-center py-12">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
          <ExclamationTriangleIcon className="h-7 w-7 text-rose-500 dark:text-rose-400" />
        </div>
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
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header & Search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-charcoal-900 dark:text-cream-50">
              Manage Users
            </h1>
            <p className="font-body text-charcoal-500 dark:text-cream-400 mt-1">
              View, manage, and control all registered users
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400 dark:text-cream-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email"
              className="w-full rounded-xl border border-clay-300 dark:border-charcoal-700 bg-cream-50 dark:bg-charcoal-800 py-2.5 pl-9 pr-3 text-sm font-body text-charcoal-700 dark:text-cream-200 placeholder:text-charcoal-400 dark:placeholder:text-cream-500 focus:outline-none focus:ring-2 focus:ring-paprika-400/60 focus:border-paprika-400 transition-all"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={UsersIcon} label="Total users" value={stats.total} accent="charcoal" loading={loading} />
          <StatCard icon={Crown} label="Admins" value={stats.admins} accent="paprika" loading={loading} />
          <StatCard icon={ShieldExclamationIcon} label="Blocked" value={stats.blocked} accent="rose" loading={loading} />
          <StatCard icon={BookOpenIcon} label="Recipes shared" value={stats.recipes} accent="sage" loading={loading} />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-body font-semibold transition-all duration-200',
                filter === f.key
                  ? 'bg-charcoal-900 text-cream-50 dark:bg-cream-50 dark:text-charcoal-900'
                  : 'bg-clay-100 dark:bg-charcoal-700 text-charcoal-600 dark:text-cream-300 hover:bg-clay-200 dark:hover:bg-charcoal-600'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="card overflow-visible">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-clay-50 dark:bg-charcoal-700/50">
                <tr>
                  <th className="text-left px-4 py-3 font-body font-semibold text-charcoal-600 dark:text-cream-300">User</th>
                  <th className="text-left px-4 py-3 font-body font-semibold text-charcoal-600 dark:text-cream-300">Role</th>
                  <th className="text-center px-4 py-3 font-body font-semibold text-charcoal-600 dark:text-cream-300">Recipes</th>
                  <th className="text-center px-4 py-3 font-body font-semibold text-charcoal-600 dark:text-cream-300">Status</th>
                  <th className="text-right px-4 py-3 font-body font-semibold text-charcoal-600 dark:text-cream-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-clay-200 dark:divide-charcoal-700">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-14">
                      <EmptyState query={query} />
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => {
                    const isSelf = user._id === currentUser?._id;
                    const isAdmin = user.role === 'admin';
                    return (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: Math.min(index, 8) * 0.04 }}
                        className={cn(
                          'hover:bg-clay-50 dark:hover:bg-charcoal-700/50 transition-colors',
                          isSelf && 'bg-paprika-50/40 dark:bg-paprika-900/10'
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={cn('relative h-9 w-9 flex-shrink-0 rounded-full overflow-hidden ring-2', ringClass(user))}>
                            <Image
    src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
    alt={user.name}
    fill
    className="object-cover"
    loading="lazy"
    quality={60}
    sizes="(max-width: 768px) 100vw, 50vw"
    unoptimized={true}
    draggable={false}
    onContextMenu={(e) => e.preventDefault()}
  />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-body font-medium text-charcoal-700 dark:text-cream-200 truncate">
                                  {user.name}
                                </span>
                                {isSelf && (
                                  <span className="rounded-full bg-paprika-100 dark:bg-paprika-900/30 px-1.5 py-0.5 text-[10px] font-semibold text-paprika-600 dark:text-paprika-300">
                                    You
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-charcoal-400 dark:text-cream-500 truncate">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <RoleBadge isAdmin={isAdmin} />
                        </td>
                        <td className="px-4 py-3 text-center text-charcoal-600 dark:text-cream-300 font-body tabular-nums">
                          {user.recipeCount || 0}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <StatusBadge isBlocked={user.isBlocked} />
                        </td>
                        <td className="px-4 py-3 ">
                          <div className="flex justify-end">
                            {isSelf ? (
                              <span className="text-xs text-charcoal-300 dark:text-cream-600 italic pr-1">No actions</span>
                            ) : (
                              <ActionMenu
                                user={user}
                                isAdmin={isAdmin}
                                open={openMenuId === user._id}
                                onToggle={() => setOpenMenuId(openMenuId === user._id ? null : user._id)}
                                onBlockClick={handleBlockClick}
                                onAdminClick={handleAdminClick}
                                onDelete={handleDeleteClick}
                                actionLoading={actionLoading}
                                menuRef={menuRef}
                              />
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden divide-y divide-clay-200 dark:divide-charcoal-700">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 flex items-center gap-3 animate-pulse">
                  <div className="h-10 w-10 rounded-full bg-clay-200 dark:bg-charcoal-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 rounded bg-clay-200 dark:bg-charcoal-700" />
                    <div className="h-2.5 w-44 rounded bg-clay-100 dark:bg-charcoal-700/70" />
                  </div>
                </div>
              ))
            ) : filteredUsers.length === 0 ? (
              <div className="py-14 px-4">
                <EmptyState query={query} />
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isSelf = user._id === currentUser?._id;
                const isAdmin = user.role === 'admin';
                return (
                  <div key={user._id} className={cn('p-4', isSelf && 'bg-paprika-50/40 dark:bg-paprika-900/10')}>
                    <div className="flex items-center gap-3">
                      <div className={cn('relative h-10 w-10 flex-shrink-0 rounded-full overflow-hidden ring-2', ringClass(user))}>
                        <Image
    src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
    alt={user.name}
    fill
    className="object-cover"
    loading="lazy"
    quality={60}
    sizes="(max-width: 768px) 100vw, 50vw"
    unoptimized={true}
    draggable={false}
    onContextMenu={(e) => e.preventDefault()}
  />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-body font-medium text-charcoal-700 dark:text-cream-200 truncate">{user.name}</span>
                          {isSelf && (
                            <span className="rounded-full bg-paprika-100 dark:bg-paprika-900/30 px-1.5 py-0.5 text-[10px] font-semibold text-paprika-600 dark:text-paprika-300">You</span>
                          )}
                        </div>
                        <p className="text-xs text-charcoal-400 dark:text-cream-500 truncate">{user.email}</p>
                      </div>
                      {!isSelf && (
                        <ActionMenu
                          user={user}
                          isAdmin={isAdmin}
                          open={openMenuId === user._id}
                          onToggle={() => setOpenMenuId(openMenuId === user._id ? null : user._id)}
                          onBlockClick={handleBlockClick}
                          onAdminClick={handleAdminClick}
                          onDelete={handleDeleteClick}
                          actionLoading={actionLoading}
                          menuRef={menuRef}
                        />
                      )}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <RoleBadge isAdmin={isAdmin} />
                      <StatusBadge isBlocked={user.isBlocked} />
                      <span className="ml-auto text-xs font-body text-charcoal-500 dark:text-cream-400">
                        {user.recipeCount || 0} recipes
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </motion.div>

      {/* Block/Unblock Modal */}
      <AnimatePresence>
        {showBlockModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBlockModal(false)}
              className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-clay-300 dark:border-charcoal-700 shadow-2xl"
            >
              {/* Background Image for Block Modal */}
              <div className="absolute inset-0 z-0  modal-block-bg">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 via-paprika-500/10 to-transparent" />
                <svg className="absolute inset-0 h-full w-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="blockBg" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                      <circle cx="20" cy="20" r="8" fill="currentColor" opacity="0.15" />
                      <circle cx="0" cy="0" r="6" fill="currentColor" opacity="0.1" />
                      <circle cx="40" cy="40" r="6" fill="currentColor" opacity="0.1" />
                    </pattern>
                    <linearGradient id="blockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E2572B" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#C74620" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#blockGrad)" />
                  <rect width="100%" height="100%" fill="url(#blockBg)" />
                </svg>
                <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-rose-500/10 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-paprika-500/10 blur-3xl" />
              </div>

              <div className="relative z-10">
                <div className={cn(
                  'flex items-center justify-between px-6 py-4 border-b border-clay-300 dark:border-charcoal-700',
                  actionType === 'block' ? 'bg-rose-50/80 dark:bg-rose-900/30' : 'bg-sage-50/80 dark:bg-sage-900/30'
                )}>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'p-2 rounded-lg backdrop-blur-sm',
                      actionType === 'block' ? 'bg-rose-100/80 dark:bg-rose-900/50' : 'bg-sage-100/80 dark:bg-sage-900/50'
                    )}>
                      {actionType === 'block' ? (
                        <UserMinusIcon className="h-5 w-5 text-rose-600 dark:text-rose-300" />
                      ) : (
                        <UserPlusIcon className="h-5 w-5 text-sage-600 dark:text-sage-300" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-lg text-charcoal-900 dark:text-cream-50">
                        {actionType === 'block' ? 'Block user' : 'Unblock user'}
                      </h3>
                      <p className="font-body text-sm text-charcoal-500 dark:text-cream-400">
                        {actionType === 'block' ? 'This will restrict their access' : 'This will restore their access'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowBlockModal(false)}
                    className="p-1.5 rounded-lg hover:bg-clay-200/80 dark:hover:bg-charcoal-700/80 transition-colors backdrop-blur-sm"
                  >
                    <XMarkIcon className="h-5 w-5 text-charcoal-500 dark:text-cream-400" />
                  </button>
                </div>

                <div className="px-6 py-6 bg-cream-50/90 dark:bg-charcoal-800/90 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'p-3 rounded-full flex-shrink-0 backdrop-blur-sm',
                      actionType === 'block' ? 'bg-rose-100/80 dark:bg-rose-900/40' : 'bg-sage-100/80 dark:bg-sage-900/40'
                    )}>
                      {actionType === 'block' ? (
                        <ExclamationTriangleIcon className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                      ) : (
                        <CheckIcon className="h-6 w-6 text-sage-600 dark:text-sage-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-body text-charcoal-700 dark:text-cream-200">
                        {actionType === 'block' ? (
                          <>Are you sure you want to block <span className="font-bold text-charcoal-900 dark:text-cream-50">"{selectedUser.name}"</span>?</>
                        ) : (
                          <>Are you sure you want to unblock <span className="font-bold text-charcoal-900 dark:text-cream-50">"{selectedUser.name}"</span>?</>
                        )}
                      </p>
                      <p className="font-body text-sm text-charcoal-500 dark:text-cream-400 mt-1.5">
                        {actionType === 'block'
                          ? 'Blocked users cannot login or access any features.'
                          : 'Unblocked users will regain full access to the platform.'
                        }
                      </p>
                    </div>
                  </div>

                  <div className={cn(
                    'mt-4 p-3 rounded-xl border backdrop-blur-sm',
                    actionType === 'block'
                      ? 'bg-rose-50/80 dark:bg-rose-900/20 border-rose-200/50 dark:border-rose-800/50'
                      : 'bg-sage-50/80 dark:bg-sage-900/20 border-sage-200/50 dark:border-sage-800/50'
                  )}>
                    <p className={cn(
                      'text-xs',
                      actionType === 'block'
                        ? 'text-rose-700 dark:text-rose-300'
                        : 'text-sage-700 dark:text-sage-300'
                    )}  style={{
        background: `
          radial-gradient(circle at 30% 70%, rgba(232, 163, 61, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 70% 30%, rgba(237, 184, 104, 0.05) 0%, transparent 50%),
          repeating-linear-gradient(-45deg, transparent, transparent 12px, rgba(232, 163, 61, 0.03) 12px, rgba(232, 163, 61, 0.03) 13px),
          #FFFBF5
        `
      }}>
                      {actionType === 'block'
                        ? '⚠️ This action can be reversed by unblocking the user later.'
                        : '✅ The user will be able to access all features again.'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 px-6 py-4 bg-clay-50/80 dark:bg-charcoal-700/30 border-t border-clay-300 dark:border-charcoal-700 backdrop-blur-sm">
                  <button
                    onClick={() => setShowBlockModal(false)}
                    className="flex-1 py-2.5 bg-clay-200/80 dark:bg-charcoal-700/80 text-charcoal-700 dark:text-cream-200 rounded-xl font-medium hover:bg-clay-300/80 dark:hover:bg-charcoal-600/80 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBlockConfirm}
                    disabled={actionLoading === `block-${selectedUser._id}`}
                    className={cn(
                      'flex-1 py-2.5 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
                      actionType === 'block'
                        ? 'bg-rose-500 hover:bg-rose-600'
                        : 'bg-sage-500 hover:bg-sage-600'
                    )}
                  >
                    {actionLoading === `block-${selectedUser._id}` ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        {actionType === 'block' ? 'Blocking...' : 'Unblocking...'}
                      </span>
                    ) : (
                      actionType === 'block' ? 'Block user' : 'Unblock user'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Modal */}
      <AnimatePresence>
        {showAdminModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdminModal(false)}
              className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-clay-300 dark:border-charcoal-700 shadow-2xl"
            >
              <div className="absolute inset-0 z-0 modal-admin-bg">
                <div className="absolute inset-0 bg-gradient-to-br from-paprika-500/20 via-turmeric-500/10 to-transparent" />
                <svg className="absolute inset-0 h-full w-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="adminBg" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                      <rect x="18" y="18" width="4" height="4" fill="currentColor" opacity="0.15" rx="1" />
                      <circle cx="0" cy="0" r="3" fill="currentColor" opacity="0.1" />
                      <circle cx="40" cy="40" r="3" fill="currentColor" opacity="0.1" />
                    </pattern>
                    <linearGradient id="adminGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E8A33D" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#EDB868" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#adminGrad)" />
                  <rect width="100%" height="100%" fill="url(#adminBg)" />
                </svg>
                <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-turmeric-500/10 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-paprika-500/10 blur-3xl" />
              </div>

              <div className="relative z-10">
                <div className={cn(
                  'flex items-center justify-between px-6 py-4 border-b border-clay-300 dark:border-charcoal-700',
                  actionType === 'makeAdmin' ? 'bg-paprika-50/80 dark:bg-paprika-900/30' : 'bg-clay-100/80 dark:bg-charcoal-700/50'
                )}>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'p-2 rounded-lg backdrop-blur-sm',
                      actionType === 'makeAdmin' ? 'bg-paprika-100/80 dark:bg-paprika-900/50' : 'bg-clay-200/80 dark:bg-charcoal-700/50'
                    )}>
                      {actionType === 'makeAdmin' ? (
                        <Crown className="h-5 w-5 text-paprika-600 dark:text-paprika-300" />
                      ) : (
                        <UserIcon className="h-5 w-5 text-charcoal-500 dark:text-cream-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-lg text-charcoal-900 dark:text-cream-50">
                        {actionType === 'makeAdmin' ? 'Make Admin' : 'Remove Admin'}
                      </h3>
                      <p className="font-body text-sm text-charcoal-500 dark:text-cream-400">
                        {actionType === 'makeAdmin' ? 'Grant admin privileges' : 'Revoke admin privileges'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAdminModal(false)}
                    className="p-1.5 rounded-lg hover:bg-clay-200/80 dark:hover:bg-charcoal-700/80 transition-colors backdrop-blur-sm"
                  >
                    <XMarkIcon className="h-5 w-5 text-charcoal-500 dark:text-cream-400" />
                  </button>
                </div>

                <div className="px-6 py-6 bg-cream-50/90 dark:bg-charcoal-800/90 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'p-3 rounded-full flex-shrink-0 backdrop-blur-sm',
                      actionType === 'makeAdmin' ? 'bg-paprika-100/80 dark:bg-paprika-900/40' : 'bg-clay-100/80 dark:bg-charcoal-700'
                    )}>
                      {actionType === 'makeAdmin' ? (
                        <Crown className="h-6 w-6 text-paprika-600 dark:text-paprika-400" />
                      ) : (
                        <UserIcon className="h-6 w-6 text-charcoal-500 dark:text-cream-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-body text-charcoal-700 dark:text-cream-200">
                        {actionType === 'makeAdmin' ? (
                          <>Make <span className="font-bold text-charcoal-900 dark:text-cream-50">"{selectedUser.name}"</span> an admin?</>
                        ) : (
                          <>Remove admin privileges from <span className="font-bold text-charcoal-900 dark:text-cream-50">"{selectedUser.name}"</span>?</>
                        )}
                      </p>
                      <p className="font-body text-sm text-charcoal-500 dark:text-cream-400 mt-1.5">
                        {actionType === 'makeAdmin'
                          ? 'Admins can manage users, recipes, and reports.'
                          : 'They will lose all admin capabilities.'
                        }
                      </p>
                    </div>
                  </div>

                  <div className={cn(
                    'mt-4 p-3 rounded-xl border backdrop-blur-sm',
                    actionType === 'makeAdmin'
                      ? 'bg-paprika-50/80 dark:bg-paprika-900/20 border-paprika-200/50 dark:border-paprika-800/50'
                      : 'bg-clay-50/80 dark:bg-charcoal-700/30 border-clay-200/50 dark:border-charcoal-700/50'
                  )}>
                    <p className={cn(
                      'text-xs',
                      actionType === 'makeAdmin'
                        ? 'text-paprika-700 dark:text-paprika-300'
                        : 'text-charcoal-500 dark:text-cream-400'
                    )}>
                      {actionType === 'makeAdmin'
                        ? '👑 Admin users have full access to all management features.'
                        : '⚠️ This action can be reversed by making them an admin again.'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 px-6 py-4 bg-clay-50/80 dark:bg-charcoal-700/30 border-t border-clay-300 dark:border-charcoal-700 backdrop-blur-sm">
                  <button
                    onClick={() => setShowAdminModal(false)}
                    className="flex-1 py-2.5 bg-clay-200/80 dark:bg-charcoal-700/80 text-charcoal-700 dark:text-cream-200 rounded-xl font-medium hover:bg-clay-300/80 dark:hover:bg-charcoal-600/80 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAdminConfirm}
                    disabled={actionLoading === `role-${selectedUser._id}`}
                    className={cn(
                      'flex-1 py-2.5 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
                      actionType === 'makeAdmin'
                        ? 'bg-paprika-500 hover:bg-paprika-600'
                        : 'bg-charcoal-600 hover:bg-charcoal-700 dark:bg-charcoal-700 dark:hover:bg-charcoal-600'
                    )}
                  >
                    {actionLoading === `role-${selectedUser._id}` ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        {actionType === 'makeAdmin' ? 'Making admin...' : 'Removing admin...'}
                      </span>
                    ) : (
                      actionType === 'makeAdmin' ? 'Make Admin' : 'Remove Admin'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-clay-300 dark:border-charcoal-700 shadow-2xl"
            >
              <div className="absolute inset-0 z-0 modal-delete-bg">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-600/20 via-red-500/10 to-transparent" />
                <svg className="absolute inset-0 h-full w-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="deleteBg" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M20 10 L22 18 L30 18 L24 24 L26 32 L20 28 L14 32 L16 24 L10 18 L18 18 Z" fill="currentColor" opacity="0.12" />
                      <circle cx="0" cy="0" r="4" fill="currentColor" opacity="0.08" />
                      <circle cx="40" cy="40" r="4" fill="currentColor" opacity="0.08" />
                    </pattern>
                    <linearGradient id="deleteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#DC2626" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#EF4444" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#deleteGrad)" />
                  <rect width="100%" height="100%" fill="url(#deleteBg)" />
                </svg>
                <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-rose-500/10 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-red-500/10 blur-3xl" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between px-6 py-4 bg-rose-50/80 dark:bg-rose-900/30 border-b border-clay-300 dark:border-charcoal-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-100/80 dark:bg-rose-900/50 rounded-lg backdrop-blur-sm">
                      <TrashIcon className="h-5 w-5 text-rose-600 dark:text-rose-300" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-lg text-charcoal-900 dark:text-cream-50">
                        Delete user
                      </h3>
                      <p className="font-body text-sm text-charcoal-500 dark:text-cream-400">This action is irreversible</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="p-1.5 rounded-lg hover:bg-clay-200/80 dark:hover:bg-charcoal-700/80 transition-colors backdrop-blur-sm"
                  >
                    <XMarkIcon className="h-5 w-5 text-charcoal-500 dark:text-cream-400" />
                  </button>
                </div>

                <div className="px-6 py-6 bg-cream-50/90 dark:bg-charcoal-800/90 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-rose-100/80 dark:bg-rose-900/40 rounded-full flex-shrink-0 backdrop-blur-sm">
                      <ExclamationTriangleIcon className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div>
                      <p className="font-body text-charcoal-700 dark:text-cream-200">
                        Delete{' '}
                        <span className="font-bold text-charcoal-900 dark:text-cream-50">"{selectedUser.name}"</span>?
                      </p>
                      <p className="font-body text-sm text-charcoal-500 dark:text-cream-400 mt-1.5">
                        This will permanently remove the user and all their associated data.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-rose-50/80 dark:bg-rose-900/20 border border-rose-200/50 dark:border-rose-800/50 backdrop-blur-sm">
                    <p className="text-xs text-rose-700 dark:text-rose-300">
                      All recipes, favorites, and reports by this user will be deleted along with their account.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 px-6 py-4 bg-clay-50/80 dark:bg-charcoal-700/30 border-t border-clay-300 dark:border-charcoal-700 backdrop-blur-sm">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-2.5 bg-clay-200/80 dark:bg-charcoal-700/80 text-charcoal-700 dark:text-cream-200 rounded-xl font-medium hover:bg-clay-300/80 dark:hover:bg-charcoal-600/80 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={actionLoading === `delete-${selectedUser._id}`}
                    className="flex-1 py-2.5 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading === `delete-${selectedUser._id}` ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Deleting...
                      </span>
                    ) : (
                      'Delete user'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}