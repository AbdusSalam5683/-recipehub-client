// client/src/components/common/AnimatedLogo.jsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const AnimatedLogo = ({ variant = 'default', className = '', size = 'md' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sizes = {
    sm: { icon: 36, text: 'text-xl', spacing: 'gap-2' },
    md: { icon: 44, text: 'text-2xl', spacing: 'gap-3' },
    lg: { icon: 52, text: 'text-3xl', spacing: 'gap-4' },
    xl: { icon: 64, text: 'text-4xl', spacing: 'gap-5' },
  };

  const currentSize = sizes[size] || sizes.md;

  const colors = {
    light: {
      primary: '#D85A30',
      icon: '#FFFBF5',
      steam: '#FAECE7',
    },
    dark: {
      primary: '#EF9F27',
      icon: '#412402',
      steam: '#412402',
    },
  };

  const theme = variant === 'dark' ? colors.dark : colors.light;

  const LogoSVG = ({ size = 52 }) => {
    // Fixed values to prevent hydration mismatch
    const cx1 = 18, cx2 = 26, cx3 = 34;
    const cy1 = 16, cy2 = 15, cy3 = 16;
    const qx1 = 16, qy1 = 12, qx2 = 18, qy2 = 8;
    const qx3 = 24, qy3 = 11, qx4 = 26, qy4 = 7;
    const qx5 = 32, qy5 = 12, qx6 = 34, qy6 = 8;

    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 52 52"
        className="overflow-visible flex-shrink-0"
      >
        <circle cx="26" cy="26" r="26" fill={theme.primary} />
        
        {/* Steam - fixed values */}
        <g className="steam s1">
          <path d={`M${cx1} ${cy1} Q${qx1} ${qy1} ${qx2} ${qy2}`} fill="none" stroke={theme.steam} strokeWidth="1.6" strokeLinecap="round"/>
        </g>
        <g className="steam s2">
          <path d={`M${cx2} ${cy2} Q${qx3} ${qy3} ${qx4} ${qy4}`} fill="none" stroke={theme.steam} strokeWidth="1.6" strokeLinecap="round"/>
        </g>
        <g className="steam s3">
          <path d={`M${cx3} ${cy3} Q${qx5} ${qy5} ${qx6} ${qy6}`} fill="none" stroke={theme.steam} strokeWidth="1.6" strokeLinecap="round"/>
        </g>

        {/* Fork */}
        <g className="fork">
          <line x1="18" y1="20" x2="18" y2="38" stroke={theme.icon} strokeWidth="2" strokeLinecap="round"/>
          <line x1="15" y1="20" x2="15" y2="27" stroke={theme.icon} strokeWidth="1.6" strokeLinecap="round"/>
          <line x1="18" y1="20" x2="18" y2="27" stroke={theme.icon} strokeWidth="1.6" strokeLinecap="round"/>
          <line x1="21" y1="20" x2="21" y2="27" stroke={theme.icon} strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M15 27 Q18 30 21 27" fill="none" stroke={theme.icon} strokeWidth="1.6" strokeLinecap="round"/>
        </g>

        {/* Spoon */}
        <g className="spoon">
          <line x1="34" y1="24" x2="34" y2="38" stroke={theme.icon} strokeWidth="2" strokeLinecap="round"/>
          <ellipse cx="34" cy="20" rx="4.5" ry="6" fill={theme.icon}/>
        </g>
      </svg>
    );
  };

  if (!isMounted) {
    return (
      <Link href="/" className={`flex items-center ${currentSize.spacing} group ${className}`}>
        <div className="w-[44px] h-[44px] bg-coral-600 dark:bg-amber-500 rounded-full flex-shrink-0" />
        <span className={`font-poppins ${currentSize.text} font-bold tracking-tight`}>
          <span className="text-charcoal-600 dark:text-cream-100">Recipe</span>
          <span className="text-coral-600 dark:text-amber-500">Hub</span>
        </span>
      </Link>
    );
  }

  return (
    <Link 
      href="/" 
      className={`flex items-center ${currentSize.spacing} group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="RecipeHub Home"
    >
      <motion.div
        initial={{ scale: 1 }}
        animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative flex-shrink-0"
      >
        <LogoSVG size={currentSize.icon} />
      </motion.div>

      <motion.div
        initial={{ opacity: 1, x: 0 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className={`font-poppins ${currentSize.text} font-bold tracking-tight`}
      >
        <span className="text-charcoal-600 dark:text-cream-100">Recipe</span>
        <span className="text-coral-600 dark:text-amber-500 transition-colors duration-300">
          Hub
        </span>
      </motion.div>
    </Link>
  );
};

export default AnimatedLogo;