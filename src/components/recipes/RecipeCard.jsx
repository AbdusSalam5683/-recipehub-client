// client/src/components/recipes/RecipeCard.jsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ClockIcon, UserIcon, HeartIcon, EyeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { cn } from '../../lib/cn';
import { useState } from 'react';

const RecipeCard = ({ recipe, priority = false, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const difficultyColors = {
    Easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    Hard: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  };

  const difficultyIcons = {
    Easy: '🟢',
    Medium: '🟡',
    Hard: '🔴',
  };

  const altText = recipe?.recipeName || 'Delicious recipe';

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        delay: index * 0.05,
        ease: 'easeOut'
      }
    },
    hover: {
      y: -8,
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-cream-100 dark:bg-charcoal-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-clay-200 dark:border-charcoal-700"
    >
      {recipe.isPremiumOnly && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-turmeric-500/5 via-transparent to-transparent" />
        </div>
      )}

      <Link href={`/recipe-details/${recipe._id}`}>
        <div className="relative h-56 overflow-hidden bg-charcoal-100 dark:bg-charcoal-700">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-clay-100 to-clay-200 dark:from-charcoal-700 dark:to-charcoal-600 animate-pulse" />
          )}
          <Image
            src={recipe.recipeImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'}
            alt={altText}
            fill
            className={cn(
              'object-cover transition-all duration-700',
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105',
              isHovered ? 'scale-110' : 'group-hover:scale-105'
            )}
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading={priority ? 'eager' : 'lazy'}
            priority={priority}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {recipe.isFeatured && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                className="badge-featured flex items-center gap-1 shadow-lg"
              >
                <StarSolidIcon className="h-3 w-3" />
                Featured
              </motion.span>
            )}
            {recipe.isPremiumOnly && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                className="badge-premium flex items-center gap-1 shadow-lg"
              >
                👑 Premium
              </motion.span>
            )}
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.3 }}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-charcoal-900/70 backdrop-blur-sm text-cream-50 px-3 py-1.5 rounded-full text-sm font-body font-medium shadow-lg"
          >
            <HeartSolidIcon className="h-4 w-4 text-rose-400" />
            <span>{recipe.likesCount || 0}</span>
          </motion.div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/recipe-details/${recipe._id}`}>
          <h3 className="font-display font-semibold text-lg text-charcoal-900 dark:text-cream-50 hover:text-paprika-600 dark:hover:text-turmeric-400 transition-colors line-clamp-1 group-hover:text-paprika-600 dark:group-hover:text-turmeric-400">
            {recipe.recipeName}
          </h3>
        </Link>

        <div className="flex items-center gap-3 mt-1.5 text-sm text-charcoal-500 dark:text-cream-400 font-body">
          <div className="flex items-center gap-1">
            <UserIcon className="h-3.5 w-3.5" />
            <span className="truncate max-w-[100px]">{recipe.authorName || 'Unknown'}</span>
          </div>
          <span className="text-clay-300 dark:text-charcoal-600">•</span>
          <div className="flex items-center gap-1">
            <ClockIcon className="h-3.5 w-3.5" />
            <span>{recipe.preparationTime}m</span>
          </div>
          <span className="text-clay-300 dark:text-charcoal-600">•</span>
          <div className="flex items-center gap-1">
            <EyeIcon className="h-3.5 w-3.5" />
            <span>{recipe.viewsCount || 0}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
          <span className="text-xs font-body bg-clay-100 dark:bg-charcoal-700 text-charcoal-600 dark:text-cream-300 px-2.5 py-1 rounded-full">
            {recipe.category}
          </span>
          <span className="text-xs font-body bg-clay-100 dark:bg-charcoal-700 text-charcoal-600 dark:text-cream-300 px-2.5 py-1 rounded-full">
            {recipe.cuisineType}
          </span>
          <span className={cn(
            'text-xs font-body px-2.5 py-1 rounded-full flex items-center gap-1',
            difficultyColors[recipe.difficultyLevel] || 'bg-clay-100 text-charcoal-600'
          )}>
            {difficultyIcons[recipe.difficultyLevel] || '•'}
            {recipe.difficultyLevel}
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0.8 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Link
            href={`/recipe-details/${recipe._id}`}
            className="mt-3.5 w-full block text-center px-4 py-2.5 bg-paprika-500 text-cream-50 rounded-xl text-sm font-body font-semibold hover:bg-paprika-600 transition-all duration-300 shadow-md hover:shadow-lg relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              View Details
              <motion.span
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ duration: 0.3 }}
              >
                →
              </motion.span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-paprika-400 to-paprika-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </motion.div>
      </div>

      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
        <div className="absolute -top-8 -right-8 w-16 h-16 bg-paprika-500/10 dark:bg-turmeric-500/10 rotate-45" />
      </div>
    </motion.div>
  );
};

export default RecipeCard;