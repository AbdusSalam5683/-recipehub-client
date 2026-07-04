// client/src/components/recipes/RecipeCard.jsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ClockIcon, UserIcon, HeartIcon } from '@heroicons/react/24/outline';

const RecipeCard = ({ recipe }) => {
  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link href={`/recipe-details/${recipe._id}`}>
        <div className="relative h-48 overflow-hidden">
          <Image
            src={recipe.recipeImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'}
            alt={recipe.recipeName}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
          {recipe.isFeatured && (
            <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
              ⭐ Featured
            </span>
          )}
          {recipe.isPremiumOnly && (
            <span className="absolute top-3 left-3 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
              👑 Premium
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/recipe-details/${recipe._id}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-1">
            {recipe.recipeName}
          </h3>
        </Link>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
            {recipe.category}
          </span>
          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
            {recipe.cuisineType}
          </span>
          <span className={`text-xs px-2 py-1 rounded ${difficultyColors[recipe.difficultyLevel] || 'bg-gray-100'}`}>
            {recipe.difficultyLevel}
          </span>
        </div>

        <div className="flex items-center justify-between mt-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <ClockIcon className="h-4 w-4" />
            <span>{recipe.preparationTime}m</span>
          </div>
          <div className="flex items-center space-x-1">
            <UserIcon className="h-4 w-4" />
            <span>{recipe.authorName || 'Unknown'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <HeartIcon className="h-4 w-4 text-red-500" />
            <span>{recipe.likesCount || 0}</span>
          </div>
        </div>

        <Link
          href={`/recipe-details/${recipe._id}`}
          className="mt-3 w-full block text-center px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default RecipeCard;