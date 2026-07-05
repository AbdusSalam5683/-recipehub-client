// client/src/app/(dashboard)/user-dashboard/layout.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import {
  ChartBarIcon,
  PlusCircleIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { cn } from '../../../lib/cn';
import ProtectedRoute from '../../../components/common/ProtectedRoute';

const navItems = [
  { href: '/user-dashboard', label: 'Overview', icon: ChartBarIcon },
  { href: '/user-dashboard/add-recipe', label: 'Add Recipe', icon: PlusCircleIcon },
  { href: '/user-dashboard/my-recipes', label: 'My Recipes', icon: ClipboardDocumentListIcon },
  { href: '/user-dashboard/my-favorites', label: 'Favorites', icon: HeartIcon },
  { href: '/user-dashboard/purchased-recipes', label: 'Purchased', icon: ShoppingBagIcon },
  { href: '/user-dashboard/premium', label: 'Premium', icon: StarIcon },
  { href: '/user-dashboard/profile', label: 'Profile', icon: UserCircleIcon },
];

export default function UserDashboardLayout({ children }) {
  const pathname = usePathname();
  const { user, isPremium } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              {/* User Card */}
              <div className="card card-hover mb-6 text-center">
                <div className="avatar-xl mx-auto mb-3 overflow-hidden rounded-full ring-2 ring-paprika-500/20">
                  <img
                    src={user?.image || 'https://ui-avatars.com/api/?name=User&background=random'}
                    alt={user?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-display font-semibold text-lg text-charcoal-900 dark:text-cream-50">
                  {user?.name}
                </h3>
                <p className="font-body text-sm text-charcoal-500 dark:text-cream-400">
                  {user?.email}
                </p>
                {isPremium && (
                  <span className="badge-premium mt-2">⭐ Premium Member</span>
                )}
              </div>

              {/* Navigation */}
              <nav className="card p-2 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-paprika-50 dark:bg-paprika-900/20 text-paprika-600 dark:text-paprika-400'
                          : 'text-charcoal-600 dark:text-cream-200 hover:bg-clay-100 dark:hover:bg-charcoal-700'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}