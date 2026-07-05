// client/src/app/(public)/browse-recipes/page.jsx
'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { recipeService } from '../../../services/auth';
import RecipeCard from '../../../components/recipes/RecipeCard';
import RecipeFilter from '../../../components/recipes/RecipeFilter';
import Loader from '../../../components/common/Loader';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

function BrowseRecipesContent() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page')) || 1;
  const category = searchParams.get('category') || 'All';

  // ✅ fetchRecipes with better error handling
  const fetchRecipes = useCallback(async (pageNum, cat) => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Fetching:', { pageNum, cat });
      const response = await recipeService.getAll(pageNum, 12, cat === 'All' ? '' : cat);
      console.log('✅ Response:', response);
      
      if (response.success) {
        setRecipes(response.recipes || []);
        setPagination(response.pagination);
        setSelectedCategory(cat);
      } else {
        setError(response.message || 'Failed to load recipes');
        toast.error('Failed to load recipes');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      setError('Network error. Please try again.');
      toast.error('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }, []);

  
  useEffect(() => {
    fetchRecipes(page, category);
  }, [page, category, fetchRecipes]);

  
  const handleCategoryChange = (cat) => {
    if (cat === selectedCategory) return;
    console.log(`🔄 Changing category to: ${cat}`);
    setSelectedCategory(cat);
    router.push(`/browse-recipes?page=1&category=${cat}`);
  };

  // ✅ পৃষ্ঠা পরিবর্তন
  const handlePageChange = (newPage) => {
    router.push(`/browse-recipes?page=${newPage}&category=${category}`);
  };

  // ✅ Retry function
  const handleRetry = () => {
    fetchRecipes(page, category);
  };

  if (loading) {
    return (
      <div className="container-custom py-8">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="font-display font-bold text-3xl md:text-4xl text-charcoal-900 dark:text-cream-50">
          Browse Recipes
        </h1>
        <p className="font-body text-charcoal-500 dark:text-cream-400 mt-2">
          Discover delicious recipes from our community
        </p>
      </motion.div>

      {/* ✅ Filter Component */}
      <RecipeFilter 
        selectedCategory={selectedCategory} 
        onCategoryChange={handleCategoryChange} 
      />

      {/* ✅ Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card text-center py-12 max-w-md mx-auto"
        >
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="font-display font-semibold text-xl text-charcoal-900 dark:text-cream-50">
            Something went wrong
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
        </motion.div>
      )}

      {/* ✅ Success State */}
      {!error && (
        <>
          {/* Recipes Count */}
          <div className="mb-4 text-sm text-charcoal-500 dark:text-cream-400 text-center">
            Showing {recipes.length} recipes {selectedCategory !== 'All' ? `in ${selectedCategory}` : ''}
          </div>

          {/* Recipes Grid */}
          {recipes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card text-center py-16 max-w-md mx-auto"
            >
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="font-display font-semibold text-xl text-charcoal-900 dark:text-cream-50">
                No recipes found
              </h3>
              <p className="font-body text-charcoal-500 dark:text-cream-400 mt-2">
                {selectedCategory === 'All' 
                  ? 'No recipes available at the moment.'
                  : `No recipes found in "${selectedCategory}" category.`}
              </p>
              {selectedCategory !== 'All' && (
                <button 
                  onClick={() => handleCategoryChange('All')}
                  className="btn-primary mt-4 inline-flex"
                >
                  View All Recipes
                </button>
              )}
            </motion.div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory + page}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {recipes.map((recipe, index) => (
                    <motion.div
                      key={recipe._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
                    >
                      <RecipeCard 
                        recipe={recipe} 
                        index={index}
                        priority={index < 4}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center gap-2 mt-10"
                >
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg border border-clay-300 dark:border-charcoal-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-clay-100 dark:hover:bg-charcoal-700 transition-colors font-body text-sm"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm font-body text-charcoal-600 dark:text-cream-400">
                    Page {page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === pagination.totalPages}
                    className="px-4 py-2 rounded-lg border border-clay-300 dark:border-charcoal-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-clay-100 dark:hover:bg-charcoal-700 transition-colors font-body text-sm"
                  >
                    Next
                  </button>
                </motion.div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default function BrowseRecipesPage() {
  return (
    <Suspense fallback={<Loader />}>
      <BrowseRecipesContent />
    </Suspense>
  );
}