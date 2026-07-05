// client/src/components/common/Navbar.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
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
  ClipboardDocumentListIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { cn } from '../../lib/cn';
import AnimatedLogo from './AnimatedLogo';

// Main navigation links (always visible)
const mainNavLinks = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/browse-recipes', label: 'Browse Recipes', icon: BookOpenIcon },
];

// Additional links that appear when authenticated (in the center)
const authenticatedNavLinks = [
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

const adminLinks = [
  { href: '/admin-dashboard', label: 'Dashboard', icon: ChartBarIcon },
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

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (latest) => setScrolled(latest > 12));

  useEffect(() => setMounted(true), []);

  const isActive = (href) => pathname === href;
  
  // Get dropdown links based on role
  const getDropdownLinks = () => {
    if (isAdmin) return adminLinks;
    return dropdownLinks;
  };

  if (!mounted) return null;

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 transition-[background-color,box-shadow,padding] duration-300',
        'bg-cream-100/90 dark:bg-charcoal-900/90 backdrop-blur-md',
        scrolled ? 'shadow-[0_1px_0_0_rgba(43,33,24,0.06),0_8px_24px_-16px_rgba(43,33,24,0.35)]' : 'shadow-none'
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
            {/* Main nav links - always visible */}
            {mainNavLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-3 py-2 rounded-lg text-sm font-body font-medium transition-colors duration-200 whitespace-nowrap',
                    active
                      ? 'text-paprika-600 dark:text-paprika-400'
                      : 'text-charcoal-600 dark:text-cream-200 hover:bg-cream-200/70 dark:hover:bg-charcoal-700/70'
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-3 right-3 -bottom-[1px] h-[2px] rounded-full bg-paprika-500"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Authenticated nav links - shown when logged in */}
            {isAuthenticated && !isAdmin && (
              <>
                <span className="w-px h-6 bg-clay-300 dark:bg-charcoal-700 mx-1" />
                {authenticatedNavLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'relative px-3 py-2 rounded-lg text-sm font-body font-medium transition-colors duration-200 whitespace-nowrap',
                        active
                          ? 'text-paprika-600 dark:text-paprika-400'
                          : 'text-charcoal-600 dark:text-cream-200 hover:bg-cream-200/70 dark:hover:bg-charcoal-700/70'
                      )}
                    >
                      {link.label}
                      {active && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute left-3 right-3 -bottom-[1px] h-[2px] rounded-full bg-paprika-500"
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
              className="p-2 rounded-lg text-charcoal-600 dark:text-cream-200 hover:bg-cream-200/70 dark:hover:bg-charcoal-700/70 transition-colors"
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
                      'ml-1 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-body font-medium transition-colors outline-none',
                      'text-charcoal-600 dark:text-cream-200 hover:bg-cream-200/70 dark:hover:bg-charcoal-700/70',
                      dropdownOpen && 'bg-cream-200/70 dark:bg-charcoal-700/70'
                    )}
                  >
                    <UserCircleIcon className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate max-w-[80px]">
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
                      'w-56 rounded-xl border border-clay-300 dark:border-charcoal-700 bg-cream-50 dark:bg-charcoal-800 p-1.5 shadow-xl',
                      'data-[state=open]:animate-[rh-pop_.15s_ease-out]',
                      'z-50'
                    )}
                    side="bottom"
                    align="end"
                  >
                    {getDropdownLinks().map((link) => (
                      <DropdownMenu.Item key={link.href} asChild>
                        <Link
                          href={link.href}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-charcoal-600 dark:text-cream-200 hover:bg-cream-200 dark:hover:bg-charcoal-700 outline-none cursor-pointer transition-colors"
                        >
                          <link.icon className="h-4 w-4 text-sage-600 dark:text-sage-400 flex-shrink-0" />
                          {link.label}
                        </Link>
                      </DropdownMenu.Item>
                    ))}
                    <DropdownMenu.Separator className="my-1 h-px bg-clay-300 dark:bg-charcoal-700" />
                    <DropdownMenu.Item asChild>
                      <button
                        onClick={logout}
                        className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-paprika-600 hover:bg-paprika-50 dark:hover:bg-paprika-900/20 outline-none cursor-pointer transition-colors"
                      >
                        <span className="h-4 w-4 flex-shrink-0" />
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
                  className="px-4 py-2 rounded-lg text-sm font-body font-medium text-charcoal-600 dark:text-cream-200 hover:bg-cream-200/70 dark:hover:bg-charcoal-700/70 transition-colors whitespace-nowrap"
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
              className="p-2 rounded-lg text-charcoal-600 dark:text-cream-200 hover:bg-cream-200/70 dark:hover:bg-charcoal-700/70"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen((v) => !v)}
              className="p-2 rounded-lg text-charcoal-600 dark:text-cream-200 hover:bg-cream-200/70 dark:hover:bg-charcoal-700/70"
              aria-label="Toggle menu"
            >
              {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* stitched hem — the seam along the bottom of an apron */}
      <div
        className="h-px w-full opacity-70"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, currentColor 0 6px, transparent 6px 12px)',
        }}
      >
        <div className="text-clay-400 dark:text-charcoal-700 h-px w-full" />
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-cream-100 dark:bg-charcoal-900 border-t border-clay-300 dark:border-charcoal-700"
          >
            <div className="container-custom py-3 space-y-1">
              {/* Main nav links */}
              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-body font-medium',
                    isActive(link.href)
                      ? 'bg-paprika-50 dark:bg-paprika-900/30 text-paprika-600 dark:text-paprika-400'
                      : 'text-charcoal-600 dark:text-cream-200 hover:bg-cream-200 dark:hover:bg-charcoal-700'
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              ))}

              {/* Authenticated nav links - mobile */}
              {isAuthenticated && !isAdmin && (
                <>
                  <div className="h-px bg-clay-300 dark:bg-charcoal-700 my-2" />
                  {authenticatedNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-body font-medium',
                        isActive(link.href)
                          ? 'bg-paprika-50 dark:bg-paprika-900/30 text-paprika-600 dark:text-paprika-400'
                          : 'text-charcoal-600 dark:text-cream-200 hover:bg-cream-200 dark:hover:bg-charcoal-700'
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  ))}
                </>
              )}

              {/* Dropdown links - mobile */}
              {isAuthenticated && (
                <>
                  <div className="h-px bg-clay-300 dark:bg-charcoal-700 my-2" />
                  {getDropdownLinks().map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-body font-medium text-charcoal-600 dark:text-cream-200 hover:bg-cream-200 dark:hover:bg-charcoal-700"
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
                    className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg text-sm font-body font-medium text-paprika-600 hover:bg-paprika-50 dark:hover:bg-charcoal-700"
                  >
                    <span className="h-5 w-5" />
                    Log out
                  </button>
                </>
              )}

              {/* Auth buttons - mobile */}
              {!isAuthenticated && (
                <div className="space-y-2 pt-2">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-body font-medium text-center text-charcoal-600 dark:text-cream-200 hover:bg-cream-200 dark:hover:bg-charcoal-700"
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