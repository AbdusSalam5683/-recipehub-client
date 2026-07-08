/**
 * ============================================
 * POPULAR RECIPES COMPONENT
 * ============================================
 * Displays most liked recipes with conditional data:
 * - Large: Shows 3 cards (first 3)
 * - Medium: Shows 4 cards (all)
 * - Small: Shows 4 cards (all)
 * ============================================
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { recipeService } from '../../services/auth';
import RecipeCard from '../recipes/RecipeCard';
import { motion } from 'framer-motion';
import { FireIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';

const PopularRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  const fetchPopular = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Fetching popular recipes...');
      const response = await recipeService.getPopular();
      console.log('✅ Popular recipes response:', response);
      
      if (response.success) {
        setRecipes(response.recipes || []);
      } else {
        setError(response.message || 'Failed to fetch popular recipes');
      }
    } catch (error) {
      console.error('❌ Error fetching popular recipes:', error);
      setError(error.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPopular();
  }, [fetchPopular]);

  const handleRetry = () => {
    fetchPopular();
  };

  // ✅ Get responsive grid columns
  const getGridClasses = () => {
    const count = recipes.length;
    
    // If 1 or 2 recipes, show all in a single row with proper centering
    if (count === 1) {
      return 'grid-cols-1 max-w-md mx-auto';
    }
    if (count === 2) {
      return 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto';
    }
    
    // 3+ recipes: responsive grid
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  };

  // ✅ Loading Skeleton
  if (loading) {
    return (
      <section className="py-16 bg-cream-100 dark:bg-charcoal-900/50">
        <div className="container-custom">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-paprika-100 dark:bg-paprika-900/30">
              <FireIcon className="h-6 w-6 text-paprika-600 dark:text-paprika-400 animate-pulse" />
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-charcoal-900 dark:text-cream-50">
                Popular Recipes
              </h2>
              <p className="text-charcoal-500 dark:text-cream-400 text-sm font-body flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-paprika-500 dark:bg-paprika-400 animate-pulse" />
                Loading popular recipes...
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-clay-200 dark:bg-charcoal-700 rounded-2xl h-72"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ✅ Error State
  if (error) {
    return (
      <section className="py-16 bg-cream-100 dark:bg-charcoal-900/50">
        <div className="container-custom">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/30">
              <FireIcon className="h-6 w-6 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-charcoal-900 dark:text-cream-50">
                Popular Recipes
              </h2>
              <p className="text-charcoal-500 dark:text-cream-400 text-sm font-body">
                Most loved recipes by our community
              </p>
            </div>
          </div>
          <div className="card text-center py-12 max-w-md mx-auto">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="font-display font-semibold text-xl text-charcoal-900 dark:text-cream-50">
              Failed to load
            </h3>
            <p className="font-body text-charcoal-500 dark:text-cream-400 mt-2">
              {error}
            </p>
            <button
              onClick={handleRetry}
              className="btn-primary mt-4 inline-flex items-center gap-2"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ✅ Empty State
  if (!recipes.length) {
    return (
      <section className="py-16 bg-cream-100 dark:bg-charcoal-900/50">
        <div className="container-custom">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-clay-100 dark:bg-charcoal-700">
              <FireIcon className="h-6 w-6 text-clay-500 dark:text-clay-400" />
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-charcoal-900 dark:text-cream-50">
                Popular Recipes
              </h2>
              <p className="text-charcoal-400 dark:text-cream-500 text-sm font-body">
                No popular recipes yet
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ✅ Success State - Light & Dark Mode Customized
  return (
    <section className="py-16 bg-gradient-to-b from-cream-100 to-cream-50 dark:from-charcoal-900 dark:to-charcoal-950">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-10"
        >
          {/* Light Mode Icon Background */}
          <div className="hidden dark:block p-3 rounded-2xl bg-paprika-500/10 border border-paprika-500/20">
            <FireIcon className="h-8 w-8 text-paprika-400" />
          </div>
          <div className="dark:hidden p-3 rounded-2xl bg-paprika-100 border border-paprika-200">
            <FireIcon className="h-8 w-8 text-paprika-600" />
          </div>
          
          <div>
            {/* Light Mode Title */}
            <h2 className="dark:hidden font-display font-bold text-3xl md:text-4xl text-charcoal-900">
              <span className="bg-gradient-to-r from-paprika-600 to-paprika-400 bg-clip-text text-transparent">
                Popular
              </span>{' '}
              <span className="text-charcoal-800">Recipes</span>
            </h2>
            {/* Dark Mode Title */}
            <h2 className="hidden dark:block font-display font-bold text-3xl md:text-4xl text-cream-50">
              <span className="bg-gradient-to-r from-paprika-400 to-paprika-300 bg-clip-text text-transparent">
                Popular
              </span>{' '}
              <span className="text-cream-100">Recipes</span>
            </h2>
            
            {/* Light Mode Subtitle */}
            <p className="dark:hidden text-charcoal-500 text-sm md:text-base font-body mt-1 flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-paprika-500" />
              Most loved recipes by our community
            </p>
            {/* Dark Mode Subtitle */}
            <p className="hidden dark:block text-cream-400 text-sm md:text-base font-body mt-1 flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-paprika-400" />
              Most loved recipes by our community
            </p>
          </div>
        </motion.div>

        {/* ✅ Dynamic Grid with Conditional Data */}
        {/* 
          Large Screen (lg): Shows first 3 recipes (index 0, 1, 2)
          Medium Screen (sm): Shows all 4 recipes (index 0, 1, 2, 3)
          Small Screen: Shows all 4 recipes (index 0, 1, 2, 3)
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.slice(0, 12).map((recipe, index) => {
            // ✅ Hide 4th recipe (index 3) on large screens only
            const hideOnLarge = index === 3 ? 'lg:hidden' : '';
            
            return (
              <motion.div
                key={recipe._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={hideOnLarge}
              >
                <RecipeCard 
                  recipe={recipe} 
                  index={index}
                  priority={index === 0}
                />
              </motion.div>
            );
          })}
        </div>

        {/* ✅ Show "View All" button if more than 4 recipes */}
        {recipes.length > 4 && (
          <div className="text-center mt-8">
            <button 
              onClick={() => window.location.href = '/browse-recipes'}
              className="px-6 py-2 bg-paprika-500 hover:bg-paprika-600 text-white rounded-full transition-colors"
            >
              View All Popular Recipes →
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularRecipes;