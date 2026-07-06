// client/src/app/(dashboard)/admin-dashboard/layout.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import {
  ChartBarIcon,
  UsersIcon,
  BookOpenIcon,
  FlagIcon,
  Cog6ToothIcon,
  ClockIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import { cn } from '../../../lib/cn';
import ProtectedRoute from '../../../components/common/ProtectedRoute';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/admin-dashboard', label: 'Overview', icon: ChartBarIcon, description: 'Platform stats' },
  { href: '/admin-dashboard/manage-users', label: 'Manage Users', icon: UsersIcon, description: 'All users' },
  { href: '/admin-dashboard/manage-recipes', label: 'Manage Recipes', icon: BookOpenIcon, description: 'All recipes' },
  { href: '/admin-dashboard/reports', label: 'Reports', icon: FlagIcon, description: 'Pending reports' },
  { href: '/admin-dashboard/activity', label: 'Activity Log', icon: ClockIcon, description: 'Recent activities' },
  { href: '/admin-dashboard/settings', label: 'Settings', icon: Cog6ToothIcon, description: 'Admin preferences' },
];

const quickStats = [
  { label: 'Total Users', value: '1,234', icon: UsersIcon, color: 'paprika' },
  { label: 'Total Recipes', value: '456', icon: BookOpenIcon, color: 'sage' },
  { label: 'Premium Members', value: '89', icon: ShieldCheckIcon, color: 'turmeric' },
  { label: 'Pending Reports', value: '12', icon: FlagIcon, color: 'clay' },
];

export default function AdminDashboardLayout({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href) => pathname === href || pathname?.startsWith(href + '/');

  const colors = {
    paprika: 'bg-paprika-50 dark:bg-paprika-900/20 text-paprika-600 dark:text-paprika-400',
    sage: 'bg-sage-50 dark:bg-sage-900/20 text-sage-600 dark:text-sage-400',
    turmeric: 'bg-turmeric-50 dark:bg-turmeric-900/20 text-turmeric-600 dark:text-turmeric-400',
    clay: 'bg-clay-100 dark:bg-charcoal-700 text-charcoal-600 dark:text-cream-300',
  };

  const userAvatar = user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=random&size=48`;

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen flex flex-col bg-cream-50 dark:bg-charcoal-950">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-40 bg-cream-100/90 dark:bg-charcoal-900/90 backdrop-blur-md border-b border-clay-200/70 dark:border-charcoal-700/70 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8 rounded-full overflow-hidden ring-2 ring-paprika-500/20">
                <Image
                  src={userAvatar}
                  alt={user?.name || 'Admin'}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-body font-medium text-charcoal-900 dark:text-cream-50 text-sm">
                  {user?.name}
                </p>
                <p className="font-body text-xs text-charcoal-500 dark:text-cream-400">
                  Admin Dashboard
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-clay-100 dark:hover:bg-charcoal-700 transition-colors"
            >
              <svg className="h-6 w-6 text-charcoal-700 dark:text-cream-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-1">
          {/* Sidebar - Desktop */}
          <aside
            className={cn(
              'hidden lg:flex flex-col',
              'bg-cream-100 dark:bg-charcoal-900',
              'border-r border-clay-200/70 dark:border-charcoal-700/70',
              'transition-all duration-300',
              isSidebarCollapsed ? 'w-20' : 'w-72',
              'h-full sticky top-0'
            )}
          >
            <div className="relative z-10 flex flex-col h-screen">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between h-16 px-4 border-b border-clay-200/70 dark:border-charcoal-700/70 flex-shrink-0">
                <div className={cn('flex items-center gap-3', isSidebarCollapsed && 'justify-center w-full')}>
                  <div className="text-2xl">⚡</div>
                  {!isSidebarCollapsed && (
                    <span className="font-display font-bold text-lg text-charcoal-900 dark:text-cream-50">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="p-1.5 rounded-lg hover:bg-clay-100 dark:hover:bg-charcoal-700 transition-colors flex-shrink-0"
                >
                  <svg className="h-4 w-4 text-charcoal-700 dark:text-cream-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isSidebarCollapsed ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    )}
                  </svg>
                </button>
              </div>

              {/* Admin Profile Section */}
              <div className={cn(
                'p-4 border-b border-clay-200/70 dark:border-charcoal-700/70 flex-shrink-0',
                isSidebarCollapsed ? 'flex justify-center' : ''
              )}>
                <div className={cn(
                  'flex items-center gap-3',
                  isSidebarCollapsed && 'flex-col'
                )}>
                  <div className="relative h-14 w-14 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-paprika-500/20">
                    <Image
                      src={userAvatar}
                      alt={user?.name || 'Admin'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {!isSidebarCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-semibold text-sm text-charcoal-900 dark:text-cream-50 truncate">
                        {user?.name}
                      </p>
                      <p className="font-body text-xs text-charcoal-500 dark:text-cream-400 truncate">
                        {user?.email}
                      </p>
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-paprika-500 dark:text-paprika-400">
                        <ShieldCheckIcon className="h-3 w-3" />
                        Admin
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              {!isSidebarCollapsed && (
                <div className="px-4 py-4 border-b border-clay-200/70 dark:border-charcoal-700/70 flex-shrink-0">
                  <p className="text-xs font-body font-medium text-charcoal-500 dark:text-cream-400 uppercase tracking-wider mb-3">
                    Quick Stats
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickStats.slice(0, 4).map((stat) => {
                      const Icon = stat.icon;
                      return (
                        <div key={stat.label} className="p-2 rounded-lg bg-clay-50 dark:bg-charcoal-800/50">
                          <div className="flex items-center gap-2">
                            <div className={cn('p-1 rounded', colors[stat.color])}>
                              <Icon className="h-3 w-3" />
                            </div>
                            <div>
                              <p className="font-display font-bold text-sm text-charcoal-900 dark:text-cream-50">
                                {stat.value}
                              </p>
                              <p className="font-body text-[10px] text-charcoal-500 dark:text-cream-400">
                                {stat.label}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation - Takes remaining space */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm font-medium transition-all duration-200 group relative',
                        active
                          ? 'bg-paprika-50 dark:bg-paprika-900/20 text-paprika-600 dark:text-paprika-400'
                          : 'text-charcoal-600 dark:text-cream-200 hover:bg-clay-100 dark:hover:bg-charcoal-700'
                      )}
                    >
                      <Icon className={cn('h-5 w-5 flex-shrink-0', active && 'text-paprika-600 dark:text-paprika-400')} />
                      {!isSidebarCollapsed && (
                        <div className="flex-1 min-w-0">
                          <span className="block truncate">{item.label}</span>
                          <span className="text-[10px] text-charcoal-400 dark:text-cream-500 block truncate">
                            {item.description}
                          </span>
                        </div>
                      )}
                      {isSidebarCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-charcoal-900 dark:bg-cream-100 text-cream-50 dark:text-charcoal-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {item.label}
                        </div>
                      )}
                      {active && !isSidebarCollapsed && (
                        <motion.div
                          layoutId="admin-active-indicator"
                          className="absolute right-2 w-1.5 h-6 rounded-full bg-paprika-500"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Logout Button with Background Image */}
              <div className="border-t border-clay-200/70 dark:border-charcoal-700/70 p-4 flex-shrink-0">
                <button
                  onClick={logout}
                  className={cn(
                    'relative w-full flex items-center gap-3 px-3 py-3 rounded-xl overflow-hidden',
                    'text-charcoal-600 dark:text-cream-200',
                    'hover:text-rose-600 dark:hover:text-rose-400',
                    'transition-all duration-300 group'
                  )}
                >
                  {/* ✅ Background Image with subtle pattern */}
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-pink-500/10 to-transparent" />
                    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="logoutPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                          <circle cx="2" cy="2" r="1" fill="currentColor" opacity="0.3" />
                          <circle cx="12" cy="12" r="1.5" fill="currentColor" opacity="0.2" />
                          <circle cx="7" cy="17" r="0.8" fill="currentColor" opacity="0.25" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#logoutPattern)" />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex items-center gap-3">
                    <ArrowRightOnRectangleIcon className="h-5 w-5 flex-shrink-0" />
                    {!isSidebarCollapsed && (
                      <span className="font-body font-medium">Logout</span>
                    )}
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 -z-0 bg-gradient-to-r from-rose-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                </button>
              </div>
            </div>
          </aside>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          )}
          <div
            className={cn(
              'lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-cream-100 dark:bg-charcoal-900 transform transition-transform duration-300',
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-clay-200/70 dark:border-charcoal-700/70 sticky top-0 bg-cream-100 dark:bg-charcoal-900 z-10">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">⚡</div>
                  <span className="font-display font-bold text-lg text-charcoal-900 dark:text-cream-50">Admin</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-clay-100 dark:hover:bg-charcoal-700 transition-colors"
                >
                  <svg className="h-6 w-6 text-charcoal-700 dark:text-cream-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-4 border-b border-clay-200/70 dark:border-charcoal-700/70">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-paprika-500/20">
                    <Image
                      src={userAvatar}
                      alt={user?.name || 'Admin'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-sm text-charcoal-900 dark:text-cream-50 truncate">
                      {user?.name}
                    </p>
                    <p className="font-body text-xs text-charcoal-500 dark:text-cream-400 truncate">
                      {user?.email}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-paprika-500">
                      <ShieldCheckIcon className="h-3 w-3" />
                      Admin
                    </span>
                  </div>
                </div>
              </div>

              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm font-medium transition-all duration-200',
                        active
                          ? 'bg-paprika-50 dark:bg-paprika-900/20 text-paprika-600 dark:text-paprika-400'
                          : 'text-charcoal-600 dark:text-cream-200 hover:bg-clay-100 dark:hover:bg-charcoal-700'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <div className="flex-1 min-w-0">
                        <span className="block truncate">{item.label}</span>
                        <span className="text-[10px] text-charcoal-400 dark:text-cream-500 block truncate">
                          {item.description}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-clay-200/70 dark:border-charcoal-700/70 p-4 sticky bottom-0 bg-cream-100 dark:bg-charcoal-900">
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="relative w-full flex items-center gap-3 px-3 py-3 rounded-xl overflow-hidden text-charcoal-600 dark:text-cream-200 hover:text-rose-600 dark:hover:text-rose-400 transition-all duration-300 group"
                >
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-pink-500/10 to-transparent" />
                    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="logoutPatternMobile" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                          <circle cx="2" cy="2" r="1" fill="currentColor" opacity="0.3" />
                          <circle cx="12" cy="12" r="1.5" fill="currentColor" opacity="0.2" />
                          <circle cx="7" cy="17" r="0.8" fill="currentColor" opacity="0.25" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#logoutPatternMobile)" />
                    </svg>
                  </div>
                  <div className="relative z-10 flex items-center gap-3">
                    <ArrowRightOnRectangleIcon className="h-5 w-5 flex-shrink-0" />
                    Logout
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content - No extra margin, fills remaining space */}
          <main className={cn(
            'flex-1 transition-all duration-300 min-h-screen',
            'lg:ml-4',
            isSidebarCollapsed && 'lg:ml-4'
          )}>
            <div className="p-4 md:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>

        {/* Footer */}
        <footer className="bg-cream-100 dark:bg-charcoal-900 border-t border-clay-200/70 dark:border-charcoal-700/70">
          <div className="container-custom py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-charcoal-500 dark:text-cream-400">
              <div className="flex items-center gap-4">
                <span>© 2026 RecipeHub Admin</span>
                <span className="hidden sm:inline">•</span>
                <span>v2.0.0</span>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/" className="hover:text-paprika-600 dark:hover:text-paprika-400 transition-colors">
                  Home
                </Link>
                <Link href="/browse-recipes" className="hover:text-paprika-600 dark:hover:text-paprika-400 transition-colors">
                  Browse
                </Link>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline text-sage-500 dark:text-sage-400">🟢 All systems normal</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}