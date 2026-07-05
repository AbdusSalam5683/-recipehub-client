// client/src/app/(public)/recipe-details/[id]/page.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  StarIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import Loader from '../../../../components/common/Loader';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  const recipeId = id;

  // ✅ Fetch Recipe
  const fetchRecipe = useCallback(async () => {
    if (!recipeId) return;
    
    try {
      setLoading(true);
      console.log('🔄 Fetching recipe with ID:', recipeId);
      
      const response = await recipeService.getById(recipeId);
      console.log('✅ Recipe response:', response);
      
      if (response.success) {
        setRecipe(response.recipe);
      } else {
        toast.error(response.message || 'Recipe not found');
        router.push('/browse-recipes');
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
      toast.error('Failed to load recipe');
      router.push('/browse-recipes');
    } finally {
      setLoading(false);
    }
  }, [recipeId, router]);

  // ✅ Check Favorite
  const checkFavorite = useCallback(async () => {
    if (!isAuthenticated || !recipeId) return;
    try {
      const response = await userService.checkFavorite(recipeId);
      if (response.success) {
        setIsFavorite(response.isFavorite);
      }
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  }, [recipeId, isAuthenticated]);

  useEffect(() => {
    if (recipeId) {
      fetchRecipe();
      if (isAuthenticated) {
        checkFavorite();
      }
    }
  }, [recipeId, fetchRecipe, checkFavorite, isAuthenticated]);

  // ✅ Toggle Favorite
  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add favorites');
      router.push('/login');
      return;
    }
    try {
      const response = await userService.toggleFavorite(recipeId);
      if (response.success) {
        setIsFavorite(response.isFavorite);
        toast.success(response.message);
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  // ✅ Toggle Like
  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like recipes');
      router.push('/login');
      return;
    }
    try {
      const action = isLiked ? 'unlike' : 'like';
      const response = await recipeService.toggleLike(recipeId, action);
      if (response.success) {
        setIsLiked(!isLiked);
        setRecipe(prev => ({ ...prev, likesCount: response.likesCount }));
        toast.success(response.message);
      }
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  // ✅ Report Recipe
  const handleReport = async () => {
    if (!reportReason) {
      toast.error('Please select a reason');
      return;
    }
    try {
      const response = await recipeService.report(recipeId, {
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

  // ✅ Purchase Recipe
  const handlePurchase = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase');
      router.push('/login');
      return;
    }
    try {
      const response = await paymentService.createRecipeCheckout(recipeId);
      if (response.success && response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      toast.error('Failed to initiate purchase');
    }
  };

  // ✅ Premium Purchase
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
      <div className="container-custom py-8">
        <Loader />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container-custom py-12 text-center">
        <div className="text-6xl mb-4">🍳</div>
        <h2 className="font-display font-bold text-2xl text-charcoal-900 dark:text-cream-50">
          Recipe not found
        </h2>
        <p className="font-body text-charcoal-500 dark:text-cream-400 mt-2">
          The recipe you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/browse-recipes"
          className="btn-primary mt-6 inline-flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Browse Recipes
        </Link>
      </div>
    );
  }

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    Hard: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <div className="container-custom py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-charcoal-500 dark:text-cream-400 hover:text-charcoal-700 dark:hover:text-cream-200 transition-colors mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Recipe Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden bg-clay-100 dark:bg-charcoal-700">
            <Image
              src={recipe.recipeImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'}
              alt={recipe.recipeName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {recipe.isFeatured && (
              <span className="absolute top-4 left-4 badge-featured">⭐ Featured</span>
            )}
            {recipe.isPremiumOnly && (
              <span className="absolute top-4 right-4 badge-premium">👑 Premium</span>
            )}
          </div>

          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-charcoal-900 dark:text-cream-50">
              {recipe.recipeName}
            </h1>

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="badge-category">{recipe.category}</span>
              <span className="badge-category">{recipe.cuisineType}</span>
              <span className={`badge-category ${difficultyColors[recipe.difficultyLevel]}`}>
                {recipe.difficultyLevel}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-4 text-sm text-charcoal-500 dark:text-cream-400">
              <div className="flex items-center gap-1.5">
                <ClockIcon className="h-5 w-5" />
                <span>{recipe.preparationTime} minutes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <UserIcon className="h-5 w-5" />
                <span>By {recipe.authorName || 'Unknown'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleToggleLike}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-paprika-50 dark:bg-paprika-900/20 text-paprika-600 dark:text-paprika-400 hover:bg-paprika-100 dark:hover:bg-paprika-900/30 transition-colors"
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
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-turmeric-50 dark:bg-turmeric-900/20 text-turmeric-600 dark:text-turmeric-400 hover:bg-turmeric-100 dark:hover:bg-turmeric-900/30 transition-colors"
              >
                <StarIcon className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
              </button>

              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-clay-100 dark:bg-charcoal-700 text-charcoal-600 dark:text-cream-400 hover:bg-clay-200 dark:hover:bg-charcoal-600 transition-colors"
              >
                <FlagIcon className="h-5 w-5" />
                <span>Report</span>
              </button>
            </div>

            {/* Purchase Button */}
            {!recipe.isPremiumOnly && (
              <button
                onClick={handlePurchase}
                className="mt-6 w-full py-3 btn-primary flex items-center justify-center gap-2"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                Purchase Recipe ($4.99)
              </button>
            )}

            {/* Premium Upsell */}
            {recipe.isPremiumOnly && !user?.isPremium && (
              <div className="mt-6 p-4 rounded-xl bg-turmeric-50 dark:bg-turmeric-900/20 border border-turmeric-200 dark:border-turmeric-800">
                <p className="text-turmeric-700 dark:text-turmeric-300 text-sm">
                  👑 This is a premium recipe. Upgrade to premium to access it!
                </p>
                <button
                  onClick={handlePremiumPurchase}
                  className="mt-3 w-full py-2 bg-turmeric-500 text-charcoal-900 rounded-lg font-medium hover:bg-turmeric-600 transition-colors"
                >
                  Upgrade to Premium ($9.99/month)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Ingredients & Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="font-display font-semibold text-xl text-charcoal-900 dark:text-cream-50 mb-4">
              🛒 Ingredients
            </h2>
            <ul className="space-y-2">
              {recipe.ingredients?.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 p-2 rounded-lg bg-clay-50 dark:bg-charcoal-700/50"
                >
                  <span className="text-paprika-500 font-bold">•</span>
                  <span className="font-body text-charcoal-700 dark:text-cream-200">
                    {ingredient}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h2 className="font-display font-semibold text-xl text-charcoal-900 dark:text-cream-50 mb-4">
              👨‍🍳 Instructions
            </h2>
            <p className="font-body text-charcoal-700 dark:text-cream-200 whitespace-pre-wrap leading-relaxed">
              {recipe.instructions}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-cream-50 dark:bg-charcoal-800 rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="font-display font-semibold text-xl text-charcoal-900 dark:text-cream-50 mb-4">
              Report Recipe
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block font-body font-medium text-charcoal-700 dark:text-cream-200 mb-1">
                  Reason *
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="input-field"
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
                <label className="block font-body font-medium text-charcoal-700 dark:text-cream-200 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  rows="3"
                  className="input-field"
                  placeholder="Describe the issue..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleReport}
                  className="btn-primary flex-1"
                >
                  Submit Report
                </button>
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setReportReason('');
                    setReportDescription('');
                  }}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}