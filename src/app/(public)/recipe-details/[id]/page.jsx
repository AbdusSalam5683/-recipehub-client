// client/src/app/(public)/recipe-details/[id]/page.jsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { recipeService, userService, paymentService } from '../../../../services/auth';
import { useAuth } from '../../../../contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { 
  HeartIcon, 
  FlagIcon, 
  ClockIcon, 
  UserIcon,
  ShoppingCartIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const isMounted = useRef(true);

  const fetchRecipe = useCallback(async () => {
    if (!isMounted.current) return;
    try {
      const response = await recipeService.getById(id);
      if (isMounted.current && response.success) {
        setRecipe(response.recipe);
      }
    } catch (error) {
      if (isMounted.current) {
        toast.error('Failed to load recipe');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [id]);

  const checkFavorite = useCallback(async () => {
    if (!isAuthenticated || !isMounted.current) return;
    try {
      const response = await userService.checkFavorite(id);
      if (isMounted.current && response.success) {
        setIsFavorite(response.isFavorite);
      }
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  }, [id, isAuthenticated]);

  useEffect(() => {
    fetchRecipe();
    if (isAuthenticated) {
      checkFavorite();
    }
    return () => {
      isMounted.current = false;
    };
  }, [fetchRecipe, checkFavorite, isAuthenticated]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add favorites');
      return;
    }
    try {
      const response = await userService.toggleFavorite(id);
      if (response.success) {
        setIsFavorite(response.isFavorite);
        toast.success(response.message);
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like recipes');
      return;
    }
    try {
      const action = isLiked ? 'unlike' : 'like';
      const response = await recipeService.toggleLike(id, action);
      if (response.success) {
        setIsLiked(!isLiked);
        setRecipe(prev => ({ ...prev, likesCount: response.likesCount }));
        toast.success(response.message);
      }
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase');
      return;
    }
    try {
      const response = await paymentService.createRecipeCheckout(id);
      if (response.success && response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      toast.error('Failed to initiate purchase');
    }
  };

  const handleReport = async () => {
    if (!reportReason) {
      toast.error('Please select a reason');
      return;
    }
    try {
      const response = await recipeService.report(id, {
        reason: reportReason,
        description: reportDescription
      });
      if (response.success) {
        toast.success('Recipe reported successfully');
        setShowReportModal(false);
        setReportReason('');
        setReportDescription('');
      }
    } catch (error) {
      toast.error('Failed to report recipe');
    }
  };

  const handlePremiumPurchase = async () => {
    try {
      const response = await paymentService.createPremiumCheckout();
      if (response.success && response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      toast.error('Failed to initiate premium purchase');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container-custom py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recipe not found</h2>
        <Link href="/browse-recipes" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          Browse Recipes →
        </Link>
      </div>
    );
  }

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <div className="container-custom py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Recipe Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="relative h-96 lg:h-full min-h-[400px] rounded-2xl overflow-hidden">
            <Image
              src={recipe.recipeImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'}
              alt={recipe.recipeName}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <div className="flex items-start justify-between">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {recipe.recipeName}
              </h1>
              {recipe.isPremiumOnly && (
                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  👑 Premium
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                {recipe.category}
              </span>
              <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                {recipe.cuisineType}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${difficultyColors[recipe.difficultyLevel]}`}>
                {recipe.difficultyLevel}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-4 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <ClockIcon className="h-5 w-5" />
                <span>{recipe.preparationTime} minutes</span>
              </div>
              <div className="flex items-center gap-1">
                <UserIcon className="h-5 w-5" />
                <span>By {recipe.authorName || 'Unknown'}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={handleToggleLike}
                className="flex items-center gap-1 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                {isLiked ? (
                  <HeartSolidIcon className="h-5 w-5 fill-current" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
                <span>{recipe.likesCount || 0}</span>
              </button>

              <button
                onClick={handleToggleFavorite}
                className="flex items-center gap-1 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
              >
                <StarIcon className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                <span>{isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
              </button>

              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <FlagIcon className="h-5 w-5" />
                <span>Report</span>
              </button>
            </div>

            {/* Purchase Button */}
            {!recipe.isPremiumOnly && (
              <button
                onClick={handlePurchase}
                className="mt-4 w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                Purchase Recipe ($4.99)
              </button>
            )}

            {/* Premium Upsell */}
            {recipe.isPremiumOnly && !user?.isPremium && (
              <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <p className="text-purple-600 dark:text-purple-400 text-sm mb-2">
                  👑 This is a premium recipe. Upgrade to premium to access it!
                </p>
                <button
                  onClick={handlePremiumPurchase}
                  className="w-full py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Upgrade to Premium ($9.99/month)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Ingredients & Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              🛒 Ingredients
            </h2>
            <ul className="space-y-2">
              {recipe.ingredients?.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <span className="text-primary-600">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              👨‍🍳 Instructions
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {recipe.instructions}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Report Recipe
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reason
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select a reason</option>
                  <option value="Spam">Spam</option>
                  <option value="Offensive Content">Offensive Content</option>
                  <option value="Copyright Issue">Copyright Issue</option>
                  <option value="Inappropriate">Inappropriate</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Describe the issue..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleReport}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Submit Report
                </button>
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setReportReason('');
                    setReportDescription('');
                  }}
                  className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}