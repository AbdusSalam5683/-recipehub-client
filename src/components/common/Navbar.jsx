// client/src/components/common/Navbar.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from 'next-themes';
import { 
  Bars3Icon, 
  XMarkIcon,
  SunIcon,
  MoonIcon,
  UserCircleIcon,
  HomeIcon,
  BookOpenIcon,
  PlusCircleIcon,
  HeartIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  UsersIcon,
  FlagIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/browse-recipes', label: 'Browse Recipes', icon: BookOpenIcon },
  ];

  const userLinks = [
    { href: '/user-dashboard', label: 'Dashboard', icon: ChartBarIcon },
    { href: '/user-dashboard/add-recipe', label: 'Add Recipe', icon: PlusCircleIcon },
    { href: '/user-dashboard/my-recipes', label: 'My Recipes', icon: ClipboardDocumentListIcon },
    { href: '/user-dashboard/my-favorites', label: 'Favorites', icon: HeartIcon },
    { href: '/user-dashboard/purchased-recipes', label: 'Purchased', icon: ShoppingBagIcon },
    { href: '/user-dashboard/profile', label: 'Profile', icon: UserCircleIcon },
  ];

  const adminLinks = [
    { href: '/admin-dashboard', label: 'Dashboard', icon: ChartBarIcon },
    { href: '/admin-dashboard/manage-users', label: 'Manage Users', icon: UsersIcon },
    { href: '/admin-dashboard/manage-recipes', label: 'Manage Recipes', icon: BookOpenIcon },
    { href: '/admin-dashboard/reports', label: 'Reports', icon: FlagIcon },
  ];

  const isActive = (href) => pathname === href;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 border-b dark:border-gray-800">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-3xl transition-transform group-hover:rotate-12">🍳</span>
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              RecipeHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  <div className="relative group ml-2">
                    <button className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <UserCircleIcon className="h-5 w-5" />
                      <span>Admin</span>
                    </button>
                    <div className="absolute right-0 mt-1 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-1 hidden group-hover:block border dark:border-gray-700">
                      {adminLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <link.icon className="h-4 w-4" />
                          <span>{link.label}</span>
                        </Link>
                      ))}
                      <hr className="my-1 dark:border-gray-700" />
                      <button
                        onClick={logout}
                        className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative group ml-2">
                    <button className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <UserCircleIcon className="h-5 w-5" />
                      <span>{user?.name?.split(' ')[0]}</span>
                      {user?.isPremium && (
                        <span className="ml-1 text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full">⭐</span>
                      )}
                    </button>
                    <div className="absolute right-0 mt-1 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-1 hidden group-hover:block border dark:border-gray-700">
                      {userLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <link.icon className="h-4 w-4" />
                          <span>{link.label}</span>
                        </Link>
                      ))}
                      <hr className="my-1 dark:border-gray-700" />
                      <button
                        onClick={logout}
                        className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center space-x-2 ml-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-all shadow-sm hover:shadow-md"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="ml-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {theme === 'dark' ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800">
          <div className="container-custom py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive(link.href)
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  adminLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setIsOpen(false)}
                    >
                      <link.icon className="h-5 w-5" />
                      <span>{link.label}</span>
                    </Link>
                  ))
                ) : (
                  userLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setIsOpen(false)}
                    >
                      <link.icon className="h-5 w-5" />
                      <span>{link.label}</span>
                    </Link>
                  ))
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;