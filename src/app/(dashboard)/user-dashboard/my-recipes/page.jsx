// client/src/app/(dashboard)/user-dashboard/my-recipes/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { recipeService } from '../../../../services/auth';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon, 
  ArrowPathIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import Loader from '../../../../components/common/Loader';

export default function MyRecipesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const fetchMyRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await recipeService.getMyRecipes();
      if (response.success) {
        setRecipes(response.recipes || []);
      } else {
        setError(response.message || 'Failed to load recipes');
        toast.error('Failed to load recipes');
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Network error. Please try again.');
      toast.error('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    router.push(`/user-dashboard/edit-recipe/${id}`);
  };

  const handleDeleteClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRecipe) return;

    setDeletingId(selectedRecipe._id);
    try {
      const response = await recipeService.delete(selectedRecipe._id);
      if (response.success) {
        toast.success('Recipe deleted successfully');
        setRecipes(recipes.filter(r => r._id !== selectedRecipe._id));
        setShowDeleteModal(false);
        setSelectedRecipe(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete recipe');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="font-display font-semibold text-xl text-charcoal-900 dark:text-cream-50">
          Something went wrong
        </h3>
        <p className="font-body text-charcoal-500 dark:text-cream-400 mt-1">
          {error}
        </p>
        <button
          onClick={fetchMyRecipes}
          className="btn-primary mt-4 inline-flex items-center gap-2"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-charcoal-900 dark:text-cream-50">
              My Recipes
            </h1>
            <p className="font-body text-charcoal-500 dark:text-cream-400 mt-1">
              Manage your created recipes
            </p>
          </div>
          <Link
            href="/user-dashboard/add-recipe"
            className="btn-primary text-sm inline-flex items-center gap-2"
          >
            <span>+</span> Add Recipe
          </Link>
        </div>

        {recipes.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-6xl mb-4">🍳</div>
            <h3 className="font-display font-semibold text-xl text-charcoal-900 dark:text-cream-50">
              No recipes yet
            </h3>
            <p className="font-body text-charcoal-500 dark:text-cream-400 mt-2">
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
                className="card card-hover group"
              >
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-clay-100 dark:bg-charcoal-700">
                    <Image
                      src={recipe.recipeImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'}
                      alt={recipe.recipeName}
                      fill
                      className="object-cover"
                    />
                    {recipe.isFeatured && (
                      <span className="absolute top-1 right-1 text-[8px] bg-sage-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                        ⭐
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/recipe-details/${recipe._id}`}>
                        <h3 className="font-display font-semibold text-lg text-charcoal-900 dark:text-cream-50 hover:text-paprika-600 dark:hover:text-turmeric-400 transition-colors truncate">
                          {recipe.recipeName}
                        </h3>
                      </Link>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <span className="badge-category">{recipe.category}</span>
                      <span className="badge-category">{recipe.cuisineType}</span>
                      <span className="badge-category">{recipe.difficultyLevel}</span>
                    </div>

                    <div className="flex items-center gap-3 mt-2 text-xs text-charcoal-400 dark:text-cream-500">
                      <span className="flex items-center gap-1">
                        <EyeIcon className="h-3.5 w-3.5" />
                        {recipe.viewsCount || 0} views
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-3.5 w-3.5" />
                        {recipe.preparationTime}m
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(recipe._id)}
                        className="p-1.5 rounded-lg bg-sage-50 dark:bg-sage-900/20 text-sage-600 dark:text-sage-400 hover:bg-sage-100 dark:hover:bg-sage-900/30 transition-all duration-200"
                        title="Edit Recipe"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteClick(recipe)}
                        disabled={deletingId === recipe._id}
                        className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-all duration-200 disabled:opacity-50"
                        title="Delete Recipe"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>

                      {/* View Button */}
                      <Link
                        href={`/recipe-details/${recipe._id}`}
                        className="p-1.5 rounded-lg bg-clay-50 dark:bg-charcoal-700 text-charcoal-500 dark:text-cream-400 hover:bg-clay-100 dark:hover:bg-charcoal-600 transition-all duration-200 ml-auto"
                        title="View Recipe"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* ✅ Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedRecipe && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-cream-50 dark:bg-charcoal-800 rounded-2xl shadow-2xl border border-clay-200 dark:border-charcoal-700 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-900/30 dark:to-red-900/30 border-b border-clay-200 dark:border-charcoal-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-100 dark:bg-rose-900/40 rounded-lg">
                    <TrashIcon className="h-5 w-5 text-rose-600 dark:text-red-300" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-charcoal-900 dark:text-cream-50">
                      Delete Recipe
                    </h3>
                    <p className="font-body text-sm text-charcoal-500 dark:text-cream-400">
                      This action is irreversible
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="p-1.5 rounded-lg hover:bg-clay-200 dark:hover:bg-charcoal-700 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-charcoal-500 dark:text-cream-400" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-full flex-shrink-0">
                    <ExclamationTriangleIcon className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <p className="font-body text-charcoal-700 dark:text-cream-200">
                      Are you sure you want to delete{' '}
                      <span className="font-bold text-charcoal-900 dark:text-cream-50">
                        "{selectedRecipe.recipeName}"
                      </span>
                      ?
                    </p>
                    <p className="font-body text-sm text-charcoal-500 dark:text-cream-400 mt-1.5">
                      This will permanently remove this recipe and all associated data.
                    </p>
                  </div>
                </div>

                {/* Recipe Preview */}
                <div className="mt-4 p-3 rounded-xl bg-clay-50 dark:bg-charcoal-700/50 border border-clay-200 dark:border-charcoal-600 flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={selectedRecipe.recipeImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'}
                      alt={selectedRecipe.recipeName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-body font-medium text-charcoal-700 dark:text-cream-200 text-sm">
                      {selectedRecipe.recipeName}
                    </p>
                    <p className="font-body text-xs text-charcoal-500 dark:text-cream-400">
                      {selectedRecipe.category} • {selectedRecipe.cuisineType}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 px-6 py-4 bg-clay-50 dark:bg-charcoal-700/30 border-t border-clay-200 dark:border-charcoal-700">
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deletingId === selectedRecipe._id}
                  className="flex-1 py-2.5 bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-xl font-medium hover:from-rose-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deletingId === selectedRecipe._id ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    'Delete Recipe'
                  )}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2.5 bg-clay-200 dark:bg-charcoal-700 text-charcoal-700 dark:text-cream-200 rounded-xl font-medium hover:bg-clay-300 dark:hover:bg-charcoal-600 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}