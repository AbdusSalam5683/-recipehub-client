// client/src/app/(dashboard)/admin-dashboard/manage-recipes/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { adminService } from '../../../../services/auth';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  EyeIcon,
  TrashIcon,
  SparklesIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import Loader from '../../../../components/common/Loader';

// ✅ Import cn utility - choose ONE of these imports based on your setup:

// Option 1: If you're using class-variance-authority (cva)
// import { cn } from '../../../../lib/utils';

// Option 2: If you're using tailwind-merge + clsx (most common)
// import { cn } from '../../../../lib/utils';

// Option 3: Simple direct import (if you have it in lib/utils)
// This is the most common setup:

// 📁 Create this file if it doesn't exist: client/src/lib/utils.js
// export function cn(...classes) {
//   return classes.filter(Boolean).join(' ');
// }

// OR if you have clsx + tailwind-merge installed:
// import clsx from 'clsx';
// import { twMerge } from 'tailwind-merge';
// export function cn(...inputs) {
//   return twMerge(clsx(inputs));
// }

// For now, let's use a simple inline version
// Remove the import and use this function directly:

export default function ManageRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getRecipes();
      if (response.success) {
        setRecipes(response.recipes);
      } else {
        setError(response.message || 'Failed to load recipes');
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recipeId) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;
    setActionLoading(recipeId);
    try {
      const response = await adminService.toggleFeatureRecipe(recipeId);
      if (response.success) {
        toast.success('Recipe deleted successfully');
        setRecipes(recipes.filter(r => r._id !== recipeId));
      }
    } catch (error) {
      toast.error('Failed to delete recipe');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleFeature = async (recipeId) => {
    setActionLoading(recipeId);
    try {
      const response = await adminService.toggleFeatureRecipe(recipeId);
      if (response.success) {
        toast.success(`Recipe ${response.recipe.isFeatured ? 'featured' : 'unfeatured'} successfully`);
        setRecipes(recipes.map(r => 
          r._id === recipeId ? { ...r, isFeatured: response.recipe.isFeatured } : r
        ));
      }
    } catch (error) {
      toast.error('Failed to toggle featured status');
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ Simple cn function
  const cn = (...classes) => {
    return classes.filter(Boolean).join(' ');
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="card text-center py-12">
        <div className="text-5xl mb-4">⚠️</div>
        <h3 className="font-display font-semibold text-xl text-charcoal-900 dark:text-cream-50">
          Failed to load
        </h3>
        <p className="font-body text-charcoal-500 dark:text-cream-400 mt-2">
          {error}
        </p>
        <button
          onClick={fetchRecipes}
          className="btn-primary mt-4 inline-flex items-center gap-2"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-charcoal-900 dark:text-cream-50">
          Manage Recipes
        </h1>
        <p className="font-body text-charcoal-500 dark:text-cream-400 mt-1">
          View and manage all recipes on the platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recipes.map((recipe, index) => (
          <motion.div
            key={recipe._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="card card-hover"
          >
            <div className="flex gap-4">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-clay-100 dark:bg-charcoal-700">
                <Image
                  src={recipe.recipeImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'}
                  alt={recipe.recipeName || 'Recipe image'} 
                  fill
                  className="object-cover"
                  unoptimized={true}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display font-semibold text-charcoal-900 dark:text-cream-50 truncate">
                      {recipe.recipeName}
                    </p>
                    <p className="font-body text-xs text-charcoal-500 dark:text-cream-400">
                      By {recipe.authorName || 'Unknown'}
                    </p>
                  </div>
                  {recipe.isFeatured && (
                    <span className="badge-premium text-[10px] flex-shrink-0">⭐ Featured</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 mt-1">
                  <span className="badge-category text-[10px]">{recipe.category}</span>
                  <span className="badge-category text-[10px]">{recipe.cuisineType}</span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <Link
                    href={`/recipe-details/${recipe._id}`}
                    className="p-1.5 rounded-lg bg-clay-50 dark:bg-charcoal-700 text-charcoal-500 dark:text-cream-400 hover:bg-clay-100 dark:hover:bg-charcoal-600 transition-colors"
                    title="View Recipe"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleToggleFeature(recipe._id)}
                    disabled={actionLoading === recipe._id}
                    className={cn(
                      'p-1.5 rounded-lg transition-colors',
                      recipe.isFeatured
                        ? 'bg-turmeric-50 dark:bg-turmeric-900/30 text-turmeric-600 dark:text-turmeric-400 hover:bg-turmeric-100'
                        : 'bg-clay-50 dark:bg-charcoal-700 text-charcoal-500 dark:text-cream-400 hover:bg-clay-100'
                    )}
                    title={recipe.isFeatured ? 'Unfeature' : 'Feature'}
                  >
                    {actionLoading === recipe._id ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <SparklesIcon className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(recipe._id)}
                    disabled={actionLoading === recipe._id}
                    className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors ml-auto"
                    title="Delete Recipe"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {recipes.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="font-display font-semibold text-xl text-charcoal-900 dark:text-cream-50">
            No recipes found
          </h3>
          <p className="font-body text-charcoal-500 dark:text-cream-400 mt-2">
            There are no recipes on the platform yet.
          </p>
        </div>
      )}
    </motion.div>
  );
}