// client/src/app/(public)/browse-recipes/page.jsx
'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { recipeService } from '../../../services/auth';
import RecipeCard from '../../../components/recipes/RecipeCard';
import Loader from '../../../components/common/Loader';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

const categories = [
  'All',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Dessert',
  'Snack',
  'Beverage',
  'Soup',
  'Salad'
];

// Separate component that uses useSearchParams
function BrowseRecipesContent() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMounted = useRef(true);

  const page = parseInt(searchParams.get('page')) || 1;
  const category = searchParams.get('category') || 'All';

  const fetchRecipes = useCallback(async (pageNum, cat) => {
    if (!isMounted.current) return;
    setLoading(true);
    try {
      console.log('🔄 Fetching recipes for browse page:', { pageNum, cat });
      const response = await recipeService.getAll(pageNum, 10, cat === 'All' ? '' : cat);
      console.log('✅ Browse recipes response:', response);
      
      if (isMounted.current && response.success) {
        setRecipes(response.recipes || []);
        setPagination(response.pagination);
        setSelectedCategory(cat);
      }
    } catch (error) {
      console.error('❌ Error fetching recipes:', error);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchRecipes(page, category);
    return () => {
      isMounted.current = false;
    };
  }, [page, category, fetchRecipes]);

  const handleCategoryChange = (cat) => {
    router.push(`/browse-recipes?page=1&category=${cat}`);
  };

  const handlePageChange = (newPage) => {
    router.push(`/browse-recipes?page=${newPage}&category=${category}`);
  };

  if (loading) return <Loader />;

  return (
    <div className="container-custom py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Browse Recipes
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Discover delicious recipes from our community
        </p>
      </motion.div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recipes Grid */}
      {recipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No recipes found</p>
          <button 
            onClick={() => fetchRecipes(1, 'All')}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe, index) => (
              <motion.div
                key={recipe._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <RecipeCard recipe={recipe} />
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === pagination.totalPages}
                className="px-4 py-2 rounded-lg border dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Main component with Suspense
export default function BrowseRecipesPage() {
  return (
    <Suspense fallback={<Loader />}>
      <BrowseRecipesContent />
    </Suspense>
  );
}