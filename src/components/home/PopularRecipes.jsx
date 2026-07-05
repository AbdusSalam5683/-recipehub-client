// client/src/components/home/PopularRecipes.jsx
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { recipeService } from '../../services/auth';
import RecipeCard from '../recipes/RecipeCard';
import Loader from '../common/Loader';
import { motion } from 'framer-motion';
import { FireIcon } from '@heroicons/react/24/outline';

const PopularRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  const fetchPopular = useCallback(async () => {
    try {
      const response = await recipeService.getPopular();
      if (isMounted.current) {
        if (response.success) {
          setRecipes(response.recipes || []);
          setError(null);
        } else {
          setError(response.message || 'Failed to fetch popular recipes');
        }
        setLoading(false);
      }
    } catch (error) {
      if (isMounted.current) {
        setError(error.message || 'Network error');
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchPopular();
    return () => {
      isMounted.current = false;
    };
  }, [fetchPopular]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <section className="py-16 bg-cream-50 dark:bg-charcoal-950">
        <div className="container-custom">
          <div className="text-center py-12">
            <p className="text-paprika-600 dark:text-paprika-400">⚠️ {error}</p>
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                fetchPopular();
              }}
              className="mt-4 px-6 py-2 bg-paprika-500 text-cream-50 rounded-lg hover:bg-paprika-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!recipes.length) {
    return (
      <section className="py-16 bg-cream-50 dark:bg-charcoal-950">
        <div className="container-custom">
          <div className="text-center py-12">
            <p className="text-charcoal-500 dark:text-cream-400">No popular recipes yet</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-cream-100 dark:bg-charcoal-900/50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-8"
        >
          <FireIcon className="h-7 w-7 text-paprika-500" />
          <div>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-charcoal-900 dark:text-cream-50">
              Popular Recipes
            </h2>
            <p className="text-charcoal-500 dark:text-cream-400 text-sm font-body">
              Most loved recipes by our community
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <motion.div
              key={recipe._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <RecipeCard 
      key={recipe._id} 
      recipe={recipe} 
      index={index}
      priority={index === 0}
    />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularRecipes;