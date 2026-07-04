// client/src/components/home/FeaturedRecipes.jsx
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { recipeService } from '../../services/auth';
import RecipeCard from '../recipes/RecipeCard';
import Loader from '../common/Loader';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const FeaturedRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  const fetchFeatured = useCallback(async () => {
    try {
      console.log('🔄 Fetching featured recipes...');
      const response = await recipeService.getFeatured();
      console.log('✅ Featured recipes response:', response);
      
      if (isMounted.current) {
        if (response.success) {
          setRecipes(response.recipes || []);
          setError(null);
        } else {
          setError(response.message || 'Failed to fetch featured recipes');
        }
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Error fetching featured recipes:', error);
      if (isMounted.current) {
        setError(error.message || 'Network error');
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchFeatured();
    return () => {
      isMounted.current = false;
    };
  }, [fetchFeatured]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <section className="py-12">
        <div className="container-custom">
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400">⚠️ {error}</p>
            <button 
              onClick={() => {
                setLoading(true);
                setError(null);
                fetchFeatured();
              }}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
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
      <section className="py-12">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🌟 Featured Recipes
          </h2>
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No featured recipes yet</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🌟 Featured Recipes
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Our hand-picked selection of the best recipes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <motion.div
              key={recipe._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <RecipeCard recipe={recipe} priority={index === 0} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedRecipes;