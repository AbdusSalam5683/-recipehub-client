// client/src/components/common/Navbar.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  HomeIcon,
  BookOpenIcon,
  PlusCircleIcon,
  HeartIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  UsersIcon,
  FlagIcon,
  ClipboardDocumentListIcon,
  ChevronDownIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { cn } from '../../lib/cn';
import AnimatedLogo from './AnimatedLogo';

// Main navigation links (always visible)
const mainNavLinks = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/browse-recipes', label: 'Browse Recipes', icon: BookOpenIcon },
];

// Admin Links
const adminNavLinks = [
  { href: '/admin-dashboard', label: 'Dashboard', icon: ChartBarIcon },
  { href: '/user-dashboard/add-recipe', label: 'Add Recipe', icon: PlusCircleIcon },
];

// User links
const userNavLinks = [
  { href: '/user-dashboard', label: 'Dashboard', icon: ChartBarIcon },
  { href: '/user-dashboard/add-recipe', label: 'Add Recipe', icon: PlusCircleIcon },
];

// Dropdown menu links
const dropdownLinks = [
  { href: '/user-dashboard/my-recipes', label: 'My Recipes', icon: ClipboardDocumentListIcon },
  { href: '/user-dashboard/my-favorites', label: 'Favorites', icon: HeartIcon },
  { href: '/user-dashboard/purchased-recipes', label: 'Purchased', icon: ShoppingBagIcon },
  { href: '/user-dashboard/profile', label: 'Profile', icon: UserCircleIcon },
];

const adminDropdownLinks = [
  { href: '/admin-dashboard/manage-users', label: 'Manage Users', icon: UsersIcon },
  { href: '/admin-dashboard/manage-recipes', label: 'Manage Recipes', icon: BookOpenIcon },
  { href: '/admin-dashboard/reports', label: 'Reports', icon: FlagIcon },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href) => pathname === href;

  const getNavLinks = () => {
    if (isAdmin) return adminNavLinks;
    if (isAuthenticated) return userNavLinks;
    return [];
  };

  const getDropdownLinks = () => {
    if (isAdmin) return adminDropdownLinks;
    return dropdownLinks;
  };

  if (!mounted) return null;

  const userAvatar = user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random&size=32`;

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        'bg-cream-100 dark:bg-charcoal-900',
        'border-b border-clay-200/70 dark:border-charcoal-700/70',
        scrolled && 'shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)]'
      )}
    >
      <div className="container-custom">
        <div className={cn('flex justify-between items-center transition-[height] duration-300', scrolled ? 'h-14' : 'h-16')}>
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <AnimatedLogo size={scrolled ? 'sm' : 'md'} variant={theme === 'dark' ? 'dark' : 'default'} />
          </div>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center justify-center flex-1 gap-1 px-4">
            {mainNavLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-3 py-2 rounded-lg text-sm font-body font-medium transition-colors duration-200 whitespace-nowrap',
                    active
                      ? 'text-paprika-600 dark:text-paprika-400 bg-paprika-50/80 dark:bg-paprika-900/20'
                      : 'text-charcoal-700 dark:text-cream-200 hover:bg-cream-200/80 dark:hover:bg-charcoal-700/80'
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-3 right-3 -bottom-[1px] h-[2px] rounded-full bg-paprika-500 dark:bg-turmeric-500"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </Link>
              );
            })}

            {isAuthenticated && (
              <>
                <span className="w-px h-6 bg-clay-300/70 dark:bg-charcoal-700/70 mx-1" />
                {getNavLinks().map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'relative px-3 py-2 rounded-lg text-sm font-body font-medium transition-colors duration-200 whitespace-nowrap',
                        active
                          ? 'text-paprika-600 dark:text-paprika-400 bg-paprika-50/80 dark:bg-paprika-900/20'
                          : 'text-charcoal-700 dark:text-cream-200 hover:bg-cream-200/80 dark:hover:bg-charcoal-700/80'
                      )}
                    >
                      {link.label}
                      {active && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute left-3 right-3 -bottom-[1px] h-[2px] rounded-full bg-paprika-500 dark:bg-turmeric-500"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </>
            )}
          </div>

          {/* Right: Theme toggle + Auth buttons */}
          <div className="hidden md:flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-charcoal-700 dark:text-cream-200 hover:bg-cream-200/80 dark:hover:bg-charcoal-700/80 transition-colors"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block"
                >
                  {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                </motion.span>
              </AnimatePresence>
            </button>

            {isAuthenticated ? (
              <DropdownMenu.Root onOpenChange={setDropdownOpen}>
                <DropdownMenu.Trigger asChild>
                  <button
                    className={cn(
                      'ml-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-body font-medium transition-colors outline-none',
                      'text-charcoal-700 dark:text-cream-200 hover:bg-cream-200/80 dark:hover:bg-charcoal-700/80',
                      dropdownOpen && 'bg-cream-200/80 dark:bg-charcoal-700/80'
                    )}
                  >
                    <div className="relative h-7 w-7 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-paprika-500/20 dark:ring-turmeric-500/20">
                      <Image
                        src={userAvatar}
                        alt={user?.name || 'User'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="truncate max-w-[80px] font-medium">
                      {isAdmin ? 'Admin' : user?.name?.split(' ')[0] || 'User'}
                    </span>
                    {!isAdmin && user?.isPremium && (
                      <span className="ml-0.5 text-[10px] leading-none bg-turmeric-500 text-charcoal-900 px-1.5 py-1 rounded-full font-bold flex-shrink-0">
                        ★
                      </span>
                    )}
                    <ChevronDownIcon className={cn(
                      'h-3.5 w-3.5 opacity-60 transition-transform duration-200 flex-shrink-0',
                      dropdownOpen && 'rotate-180'
                    )} />
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align="end"
                    sideOffset={8}
                    className={cn(
                      'w-56 rounded-xl border p-1.5 shadow-xl z-50',
                      // ✅ সঠিক dark mode colors
                      'bg-cream-100 dark:bg-charcoal-800',
                      'border-clay-300 dark:border-charcoal-700',
                      'data-[state=open]:animate-[rh-pop_.15s_ease-out]'
                    )}
                  >
                    <div className="px-3 py-2 mb-1 border-b border-clay-200/70 dark:border-charcoal-700/70">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-paprika-500/20 dark:ring-turmeric-500/20 flex-shrink-0">
                          <Image
                            src={userAvatar}
                            alt={user?.name || 'User'}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body font-medium text-charcoal-900 dark:text-cream-50 text-sm truncate">
                            {user?.name}
                          </p>
                          <p className="font-body text-xs text-charcoal-500 dark:text-cream-400 truncate">
                            {user?.email}
                          </p>
                          {isAdmin && (
                            <span className="text-[10px] font-bold text-paprika-500 dark:text-paprika-400">
                              🔑 Admin
                            </span>
                          )}
                          {!isAdmin && user?.isPremium && (
                            <span className="text-[10px] font-bold text-turmeric-500 dark:text-turmeric-400">
                              ⭐ Premium
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Dropdown Links */}
                    {getDropdownLinks().map((link) => (
                      <DropdownMenu.Item key={link.href} asChild>
                        <Link
                          href={link.href}
                          className={cn(
                            'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm outline-none cursor-pointer transition-colors',
                            'text-charcoal-700 dark:text-cream-200',
                            'hover:bg-cream-200/80 dark:hover:bg-charcoal-700/80'
                          )}
                        >
                          <link.icon className="h-4 w-4 text-sage-600 dark:text-sage-400 flex-shrink-0" />
                          {link.label}
                        </Link>
                      </DropdownMenu.Item>
                    ))}

                    <DropdownMenu.Separator className="my-1 h-px bg-clay-300/70 dark:bg-charcoal-700/70" />

                    {/* Logout Button */}
                    <DropdownMenu.Item asChild>
                      <button
                        onClick={logout}
                        className={cn(
                          'flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-sm outline-none cursor-pointer transition-colors',
                          'text-paprika-600 dark:text-paprika-400',
                          'hover:bg-paprika-50/80 dark:hover:bg-paprika-900/20'
                        )}
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4 flex-shrink-0" />
                        Log out
                      </button>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-sm font-body font-medium text-charcoal-700 dark:text-cream-200 hover:bg-cream-200/80 dark:hover:bg-charcoal-700/80 transition-colors whitespace-nowrap"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg text-sm font-body font-semibold bg-paprika-500 text-cream-50 hover:bg-paprika-600 transition-colors shadow-sm hover:shadow-md whitespace-nowrap"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex items-center md:hidden gap-1">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-charcoal-700 dark:text-cream-200 hover:bg-cream-200/80 dark:hover:bg-charcoal-700/80"
            >
              {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen((v) => !v)}
              className="p-2 rounded-lg text-charcoal-700 dark:text-cream-200 hover:bg-cream-200/80 dark:hover:bg-charcoal-700/80"
            >
              {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-cream-100 dark:bg-charcoal-900 border-t border-clay-300/50 dark:border-charcoal-700/50"
          >
            <div className="container-custom py-3 space-y-1">
              {isAuthenticated && (
                <div className="flex items-center gap-3 px-3 py-3 mb-2 border-b border-clay-200/70 dark:border-charcoal-700/70">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-paprika-500/20 dark:ring-turmeric-500/20 flex-shrink-0">
                    <Image
                      src={userAvatar}
                      alt={user?.name || 'User'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-medium text-charcoal-900 dark:text-cream-50">
                      {user?.name}
                    </p>
                    <p className="font-body text-xs text-charcoal-500 dark:text-cream-400 truncate">
                      {user?.email}
                    </p>
                    {isAdmin && (
                      <span className="text-[10px] font-bold text-paprika-500 dark:text-paprika-400">
                        🔑 Admin
                      </span>
                    )}
                    {!isAdmin && user?.isPremium && (
                      <span className="text-[10px] font-bold text-turmeric-500 dark:text-turmeric-400 inline-block mt-0.5">
                        ⭐ Premium
                      </span>
                    )}
                  </div>
                </div>
              )}

              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-body font-medium',
                    isActive(link.href)
                      ? 'bg-paprika-50/80 dark:bg-paprika-900/20 text-paprika-600 dark:text-paprika-400'
                      : 'text-charcoal-700 dark:text-cream-200 hover:bg-cream-200/80 dark:hover:bg-charcoal-700/80'
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              ))}

              {isAuthenticated && (
                <>
                  <div className="h-px bg-clay-300/50 dark:bg-charcoal-700/50 my-2" />
                  {getNavLinks().map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-body font-medium',
                        isActive(link.href)
                          ? 'bg-paprika-50/80 dark:bg-paprika-900/20 text-paprika-600 dark:text-paprika-400'
                          : 'text-charcoal-700 dark:text-cream-200 hover:bg-cream-200/80 dark:hover:bg-charcoal-700/80'
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  ))}
                </>
              )}

              {isAuthenticated && (
                <>
                  <div className="h-px bg-clay-300/50 dark:bg-charcoal-700/50 my-2" />
                  {getDropdownLinks().map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-body font-medium',
                        'text-charcoal-700 dark:text-cream-200',
                        'hover:bg-cream-200/80 dark:hover:bg-charcoal-700/80'
                      )}
                    >
                      <link.icon className="h-5 w-5 text-sage-600 dark:text-sage-400" />
                      {link.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className={cn(
                      'flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg text-sm font-body font-medium',
                      'text-paprika-600 dark:text-paprika-400',
                      'hover:bg-paprika-50/80 dark:hover:bg-paprika-900/20'
                    )}
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    Log out
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <div className="space-y-2 pt-2">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-body font-medium text-center text-charcoal-700 dark:text-cream-200 hover:bg-cream-200/80 dark:hover:bg-charcoal-700/80"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-body font-semibold text-center bg-paprika-500 text-cream-50 hover:bg-paprika-600"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;