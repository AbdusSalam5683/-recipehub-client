// client/src/components/home/PopularRecipes.jsx
'use client';

import { useEffect, useState } from 'react';
import { recipeService } from '../../services/auth';
import RecipeCard from '../recipes/RecipeCard';
import Loader from '../common/Loader';
import { motion } from 'framer-motion';

const PopularRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopular();
  }, []);

  const fetchPopular = async () => {
    try {
      const response = await recipeService.getPopular();
      if (response.success) {
        setRecipes(response.recipes);
      }
    } catch (error) {
      console.error('Error fetching popular recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (!recipes.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No popular recipes yet</p>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900/50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🔥 Popular Recipes
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Most liked recipes by our community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <motion.div
              key={recipe._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <RecipeCard recipe={recipe} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularRecipes;