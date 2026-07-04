// client/src/components/common/AnimatedLogo.jsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useId } from 'react';

/**
 * AnimatedLogo — a "stamped seal" mark.
 * The badge reads like a wax stamp pressed into a recipe card: a perforated
 * ring (like a postage stamp edge), crossed utensils at the center, and
 * steam wisps drifting off the top. Hovering "presses" the stamp; the
 * wordmark's underline draws itself in on mount, like a pen flourish.
 */
const SIZES = {
  sm: { icon: 36, text: 'text-lg', gap: 'gap-2' },
  md: { icon: 44, text: 'text-xl', gap: 'gap-2.5' },
  lg: { icon: 52, text: 'text-2xl', gap: 'gap-3' },
  xl: { icon: 64, text: 'text-3xl', gap: 'gap-4' },
};

const THEME = {
  default: { ring: '#E2572B', mark: '#FFFBF3', steam: '#FCE3D6', ink: '#2B2118', hub: '#E2572B' },
  dark: { ring: '#E8A33D', mark: '#2B2118', steam: '#2B2118', ink: '#FBF3E7', hub: '#E8A33D' },
};

const PERFORATIONS = Array.from({ length: 20 });

const AnimatedLogo = ({ variant = 'default', size = 'md', className = '' }) => {
  const uid = useId().replace(/:/g, '');
  const { icon, text, gap } = SIZES[size] || SIZES.md;
  const t = THEME[variant] || THEME.default;

  return (
    <Link href="/" className={cnJoin('group flex items-center', gap, className)} aria-label="RecipeHub home">
      <style>{`
        .rh-${uid}-steam { transform-origin: center bottom; animation: rh-${uid}-rise 2.8s ease-in-out infinite; }
        .rh-${uid}-steam.s2 { animation-delay: .35s; }
        .rh-${uid}-steam.s3 { animation-delay: .7s; }
        @keyframes rh-${uid}-rise {
          0%   { transform: translateY(2px) scaleY(.85); opacity: 0; }
          25%  { opacity: .9; }
          75%  { opacity: .25; }
          100% { transform: translateY(-8px) scaleY(1.2); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rh-${uid}-steam { animation: none; opacity: .5; }
        }
      `}</style>

      <motion.svg
        width={icon}
        height={icon}
        viewBox="0 0 64 64"
        className="shrink-0"
        initial={false}
        whileHover={{ rotate: -4, scale: 1.06 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      >
        {/* perforated stamp ring */}
        {PERFORATIONS.map((_, i) => {
          const angle = (i / PERFORATIONS.length) * Math.PI * 2;
          const cx = 32 + Math.cos(angle) * 30;
          const cy = 32 + Math.sin(angle) * 30;
          return <circle key={i} cx={cx} cy={cy} r="1.6" fill={t.ring} opacity="0.55" />;
        })}

        <circle cx="32" cy="32" r="25" fill={t.ring} />

        <g className={`rh-${uid}-steam s1`}>
          <path d="M22 20 Q20 15 22 10" fill="none" stroke={t.steam} strokeWidth="2" strokeLinecap="round" />
        </g>
        <g className={`rh-${uid}-steam s2`}>
          <path d="M32 18 Q30 13 32 8" fill="none" stroke={t.steam} strokeWidth="2" strokeLinecap="round" />
        </g>
        <g className={`rh-${uid}-steam s3`}>
          <path d="M42 20 Q40 15 42 10" fill="none" stroke={t.steam} strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* fork */}
        <g>
          <line x1="22" y1="24" x2="22" y2="46" stroke={t.mark} strokeWidth="2.4" strokeLinecap="round" />
          <line x1="18.5" y1="24" x2="18.5" y2="33" stroke={t.mark} strokeWidth="2" strokeLinecap="round" />
          <line x1="22" y1="24" x2="22" y2="33" stroke={t.mark} strokeWidth="2" strokeLinecap="round" />
          <line x1="25.5" y1="24" x2="25.5" y2="33" stroke={t.mark} strokeWidth="2" strokeLinecap="round" />
          <path d="M18.5 33 Q22 37 25.5 33" fill="none" stroke={t.mark} strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* spoon */}
        <g>
          <line x1="42" y1="29" x2="42" y2="46" stroke={t.mark} strokeWidth="2.4" strokeLinecap="round" />
          <ellipse cx="42" cy="24" rx="5.5" ry="7.5" fill={t.mark} />
        </g>
      </motion.svg>

      <span className={cnJoin('font-body font-semibold tracking-tight leading-none', text)}>
        <span style={{ color: t.ink }}>Recipe</span>
        <span className="relative inline-block font-display italic font-bold" style={{ color: t.hub }}>
          Hub
          <motion.svg
            viewBox="0 0 60 10"
            className="absolute left-0 -bottom-1.5 w-full h-2 pointer-events-none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7, ease: 'easeInOut' }}
          >
            <motion.path
              d="M2 6 Q 20 2, 30 6 T 58 5"
              fill="none"
              stroke={t.hub}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </motion.svg>
        </span>
      </span>
    </Link>
  );
};

function cnJoin(...parts) {
  return parts.filter(Boolean).join(' ');
}

export default AnimatedLogo;
