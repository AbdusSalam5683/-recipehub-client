// client/src/components/recipes/RecipeCard.jsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ClockIcon, UserIcon, HeartIcon } from '@heroicons/react/24/outline';

const RecipeCard = ({ recipe, priority = false }) => {
  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <div className="bg-cream-100 dark:bg-charcoal-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-cream-200 dark:border-charcoal-700">
      <Link href={`/recipe-details/${recipe._id}`}>
        <div className="relative h-48 overflow-hidden bg-charcoal-100 dark:bg-charcoal-700">
          <Image
            src={recipe.recipeImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'}
            alt={recipe.recipeName}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading={priority ? 'eager' : 'lazy'}
            priority={priority}
          />
          {recipe.isFeatured && (
            <span className="absolute top-3 right-3 bg-teal-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
              ⭐ Featured
            </span>
          )}
          {recipe.isPremiumOnly && (
            <span className="absolute top-3 left-3 bg-amber-500 text-charcoal-900 text-xs font-semibold px-2 py-1 rounded-full">
              👑 Premium
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/recipe-details/${recipe._id}`}>
          <h3 className="text-lg font-poppins font-semibold text-charcoal-700 dark:text-cream-100 hover:text-coral-600 dark:hover:text-amber-500 transition-colors line-clamp-1">
            {recipe.recipeName}
          </h3>
        </Link>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="text-xs bg-cream-200 dark:bg-charcoal-700 text-charcoal-600 dark:text-cream-300 font-nunito px-2 py-1 rounded">
            {recipe.category}
          </span>
          <span className="text-xs bg-cream-200 dark:bg-charcoal-700 text-charcoal-600 dark:text-cream-300 font-nunito px-2 py-1 rounded">
            {recipe.cuisineType}
          </span>
          <span className={`text-xs font-nunito px-2 py-1 rounded ${difficultyColors[recipe.difficultyLevel] || 'bg-cream-200'}`}>
            {recipe.difficultyLevel}
          </span>
        </div>

        <div className="flex items-center justify-between mt-3 text-sm text-charcoal-500 dark:text-cream-400">
          <div className="flex items-center space-x-1">
            <ClockIcon className="h-4 w-4" />
            <span className="font-nunito">{recipe.preparationTime}m</span>
          </div>
          <div className="flex items-center space-x-1">
            <UserIcon className="h-4 w-4" />
            <span className="font-nunito truncate max-w-[80px]">{recipe.authorName || 'Unknown'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <HeartIcon className="h-4 w-4 text-coral-500" />
            <span className="font-nunito">{recipe.likesCount || 0}</span>
          </div>
        </div>

        <Link
          href={`/recipe-details/${recipe._id}`}
          className="mt-3 w-full block text-center px-4 py-2 bg-coral-50 dark:bg-coral-900/20 text-coral-600 dark:text-coral-400 rounded-lg text-sm font-nunito font-medium hover:bg-coral-100 dark:hover:bg-coral-900/30 transition-colors"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default RecipeCard;