// client/src/app/(dashboard)/admin-dashboard/manage-recipes/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { adminService } from '../../../../services/auth';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import Loader from '../../../../components/common/Loader';
import RecipeCard from '../../../../components/recipes/RecipeCard';

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
          <RecipeCard
            key={recipe._id}
            recipe={recipe}
            index={index}
            showAdminActions={true}
            fromAdmin={true}
            onFeature={handleToggleFeature}
            onDelete={handleDelete}
            adminLoading={actionLoading}
          />
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