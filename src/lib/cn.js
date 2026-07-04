// client/src/lib/cn.js
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge conditional class names without Tailwind class collisions.
 * e.g. cn('px-2', isActive && 'px-4') -> 'px-4' (last one wins, not both)
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
