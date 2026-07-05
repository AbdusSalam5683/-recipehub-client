// client/src/app/(dashboard)/user-dashboard/my-recipes/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { recipeService } from '../../../../services/auth';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import Loader from '../../../../components/common/Loader';

export default function MyRecipesPage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const fetchMyRecipes = async () => {
    try {
      const response = await recipeService.getMyRecipes();
      if (response.success) {
        setRecipes(response.recipes);
      }
    } catch (error) {
      toast.error('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    setDeletingId(id);
    try {
      const response = await recipeService.delete(id);
      if (response.success) {
        toast.success('Recipe deleted successfully');
        setRecipes(recipes.filter(r => r._id !== id));
      }
    } catch (error) {
      toast.error('Failed to delete recipe');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-charcoal-900 dark:text-cream-50">
          My Recipes
        </h1>
        <p className="font-body text-charcoal-500 dark:text-cream-400 mt-1">
          Manage your created recipes
        </p>
      </div>

      {recipes.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🍳</div>
          <h3 className="font-display font-semibold text-xl text-charcoal-900 dark:text-cream-50">
            No recipes yet
          </h3>
          <p className="font-body text-charcoal-500 dark:text-cream-400 mt-1">
            Start sharing your culinary creations!
          </p>
          <Link
            href="/user-dashboard/add-recipe"
            className="btn-primary mt-4 inline-flex"
          >
            Add Your First Recipe
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recipes.map((recipe, index) => (
            <motion.div
              key={recipe._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="card card-hover"
            >
              <div className="flex gap-4">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={recipe.recipeImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'}
                    alt={recipe.recipeName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-lg text-charcoal-900 dark:text-cream-50 truncate">
                    {recipe.recipeName}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="badge-category">{recipe.category}</span>
                    <span className="badge-category">{recipe.cuisineType}</span>
                    <span className="badge-category">{recipe.difficultyLevel}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <Link
                      href={`/recipe-details/${recipe._id}`}
                      className="text-charcoal-400 hover:text-paprika-500 dark:hover:text-turmeric-400 transition-colors"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(recipe._id)}
                      disabled={deletingId === recipe._id}
                      className="text-charcoal-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}