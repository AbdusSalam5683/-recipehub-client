// client/src/app/(public)/recipe-details/[id]/page.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { recipeService, userService, paymentService, adminService } from '@/services/auth';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { 
  HeartIcon, 
  FlagIcon, 
  ClockIcon, 
  UserIcon,
  ShoppingCartIcon,
  StarIcon,
  ArrowLeftIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import Loader from '@/components/common/Loader';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFeatureToggling, setIsFeatureToggling] = useState(false);

  const recipeId = id;

  const isOwner = user && recipe && user._id === recipe.authorId?._id;

  const fetchRecipe = useCallback(async () => {
    if (!recipeId) return;
    try {
      setLoading(true);
      const response = await recipeService.getById(recipeId);
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
      toast.error(error.response?.data?.message || 'Failed to update favorites');
    }
  };

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

  const handleDeleteRecipe = async () => {
    setIsDeleting(true);
    try {
      const response = await recipeService.delete(recipeId);
      if (response.success) {
        toast.success('Recipe deleted successfully');
        router.push('/browse-recipes');
      }
    } catch (error) {
      toast.error('Failed to delete recipe');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleToggleFeatured = async () => {
    if (!isAdmin) return;
    setIsFeatureToggling(true);
    try {
      const response = await adminService.toggleFeatureRecipe(recipeId);
      if (response.success) {
        setRecipe(prev => ({ ...prev, isFeatured: !prev.isFeatured }));
        toast.success(`Recipe ${recipe.isFeatured ? 'unfeatured' : 'featured'} successfully`);
      }
    } catch (error) {
      toast.error('Failed to toggle featured');
    } finally {
      setIsFeatureToggling(false);
    }
  };

  const handleEditRecipe = () => {
    router.push(`/user-dashboard/edit-recipe/${recipeId}`);
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
    Easy: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    Medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    Hard: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
  };

  const canViewFullRecipe = () => {
    if (isAdmin) return true;
    if (isOwner) return true;
    if (!recipe.isPremiumOnly) return true;
    if (user?.isPremium) return true;
    return false;
  };

  const showFullRecipe = canViewFullRecipe();

  return (
    <div className="container-custom py-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden bg-clay-100 dark:bg-charcoal-700 shadow-xl">
            <Image
              src={recipe.recipeImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'}
              alt={recipe.recipeName || 'Recipe image'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {recipe.isFeatured && (
              <span className="absolute top-4 left-4 bg-gradient-to-r from-amber-400 to-amber-500 text-charcoal-900 px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1.5">
                <SparklesIcon className="h-4 w-4" />
                Featured
              </span>
            )}
            {recipe.isPremiumOnly && (
              <span className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1.5">
                👑 Premium
              </span>
            )}
          </div>

          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-charcoal-900 dark:text-cream-50">
              {recipe.recipeName}
            </h1>

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="bg-sage-100 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300 px-3 py-1 rounded-full text-sm font-medium">
                {recipe.category}
              </span>
              <span className="bg-clay-100 dark:bg-charcoal-700 text-charcoal-700 dark:text-cream-300 px-3 py-1 rounded-full text-sm font-medium">
                {recipe.cuisineType}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[recipe.difficultyLevel]}`}>
                {recipe.difficultyLevel}
              </span>
            </div>

            <div className="flex items-center gap-6 mt-4 text-sm text-charcoal-500 dark:text-cream-400">
              <div className="flex items-center gap-1.5">
                <ClockIcon className="h-5 w-5" />
                <span>{recipe.preparationTime} minutes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <UserIcon className="h-5 w-5" />
                <span>By {recipe.authorName || 'Unknown'}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button
                onClick={handleToggleLike}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-all duration-200 hover:scale-105"
              >
                {isLiked ? (
                  <HeartSolidIcon className="h-5 w-5 fill-current" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
                <span className="font-medium">{recipe.likesCount || 0}</span>
              </button>

              {isAuthenticated && (
                <button
                  onClick={handleToggleFavorite}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all duration-200 hover:scale-105"
                >
                  <StarIcon className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  <span className="font-medium">{isFavorite ? 'Favorited' : 'Favorite'}</span>
                </button>
              )}

              {isAuthenticated && !isOwner && !isAdmin && (
                <button
                  onClick={() => setShowReportModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-clay-100 dark:bg-charcoal-700 text-charcoal-600 dark:text-cream-400 hover:bg-clay-200 dark:hover:bg-charcoal-600 transition-all duration-200"
                >
                  <FlagIcon className="h-5 w-5" />
                  <span>Report</span>
                </button>
              )}

              {isAdmin && (
                <div className="flex items-center gap-2 ml-2 flex-wrap">
                  <button
                    onClick={handleEditRecipe}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sage-100 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300 hover:bg-sage-200 dark:hover:bg-sage-900/50 transition-all duration-200 text-sm font-medium"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-all duration-200 text-sm font-medium"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                  <button
                    onClick={handleToggleFeatured}
                    disabled={isFeatureToggling}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                      recipe.isFeatured
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200'
                        : 'bg-clay-100 dark:bg-charcoal-700 text-charcoal-600 dark:text-cream-400 hover:bg-clay-200'
                    }`}
                  >
                    <SparklesIcon className="h-4 w-4" />
                    {recipe.isFeatured ? 'Featured ✓' : 'Feature'}
                  </button>
                </div>
              )}

              {isOwner && !isAdmin && (
                <div className="flex items-center gap-2 ml-2">
                  <button
                    onClick={handleEditRecipe}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sage-100 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300 hover:bg-sage-200 dark:hover:bg-sage-900/50 transition-all duration-200 text-sm font-medium"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-all duration-200 text-sm font-medium"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>

            {!isOwner && !isAdmin && !recipe.isPremiumOnly && (
              <button
                onClick={handlePurchase}
                className="mt-6 w-full py-3 btn-primary flex items-center justify-center gap-2 text-lg"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                Purchase Recipe ($4.99)
              </button>
            )}

            {recipe.isPremiumOnly && !user?.isPremium && !isOwner && !isAdmin && (
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border border-amber-200 dark:border-amber-800">
                <p className="text-amber-700 dark:text-amber-300 text-sm flex items-center gap-2">
                  <span className="text-lg">👑</span>
                  This is a premium recipe. Upgrade to premium to access it!
                </p>
                <button
                  onClick={handlePremiumPurchase}
                  className="mt-3 w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-charcoal-900 rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-md"
                >
                  Upgrade to Premium ($9.99/month)
                </button>
              </div>
            )}

            {recipe.isPremiumOnly && (user?.isPremium || isOwner || isAdmin) && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 rounded-lg border border-purple-200 dark:border-purple-800">
                <span className="text-lg">⭐</span>
                <span className="text-sm font-medium">Premium Recipe - Unlocked</span>
              </div>
            )}
          </div>
        </div>

        {showFullRecipe ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <h2 className="font-display font-semibold text-xl text-charcoal-900 dark:text-cream-50 mb-4">
                🛒 Ingredients
              </h2>
              <ul className="space-y-2">
                {recipe.ingredients?.map((ingredient, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 p-2 rounded-lg bg-clay-50 dark:bg-charcoal-700/50 hover:bg-clay-100 dark:hover:bg-charcoal-700 transition-colors"
                  >
                    <span className="text-paprika-500 font-bold mt-0.5">•</span>
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
              <div className="font-body text-charcoal-700 dark:text-cream-200 whitespace-pre-wrap leading-relaxed">
                {recipe.instructions}
              </div>
            </div>
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="font-display font-semibold text-2xl text-charcoal-900 dark:text-cream-50">
              Premium Recipe Locked
            </h3>
            <p className="font-body text-charcoal-500 dark:text-cream-400 mt-2 max-w-md mx-auto">
              This recipe is exclusive to premium members. Upgrade to unlock full ingredients and instructions!
            </p>
            <button
              onClick={handlePremiumPurchase}
              className="btn-primary mt-6 inline-flex items-center gap-2"
            >
              <SparklesIcon className="h-5 w-5" />
              Upgrade to Premium
            </button>
          </div>
        )}
      </motion.div>

      {/* ✨ Enhanced Report Modal with Different Dark Mode Header Colors */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReportModal(false)}
              className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-cream-50 dark:bg-charcoal-800 rounded-2xl shadow-xl border border-clay-300 dark:border-charcoal-700 overflow-hidden"
            >
              {/* Header - Report Modal with special dark mode colors */}
              <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/30 dark:to-pink-900/30 border-b border-clay-300 dark:border-charcoal-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-100 dark:bg-rose-900/40 rounded-lg">
                    <FlagIcon className="h-5 w-5 text-rose-600 dark:text-rose-300" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-xl text-rose-800">
                      Report Recipe
                    </h3>
                    <p className="font-body text-sm text-rose-400">
                      Help us keep the community safe
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setReportReason('');
                    setReportDescription('');
                  }}
                  className="p-2 rounded-lg hover:bg-clay-200 dark:hover:bg-charcoal-700 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-charcoal-500 dark:text-rose-300/70" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-6 space-y-5">
                <div>
                  <label className="block font-body font-medium text-charcoal-700 dark:text-cream-200 mb-2">
                    Reason <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full "
                  >
                    <option value="" className="">Select a reason</option>
                    <option value="Spam" className="">📧 Spam</option>
                    <option value="Offensive Content" className="">🚫 Offensive Content</option>
                    <option value="Copyright Issue" className="">©️ Copyright Issue</option>
                    <option value="Inappropriate" className="">⚠️ Inappropriate</option>
                    <option value="Other" className="">📌 Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-body font-medium text-charcoal-700 dark:text-cream-200 mb-2">
                    Description <span className="text-charcoal-400 dark:text-cream-500 text-sm">(optional)</span>
                  </label>
                  <textarea
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-2.5 rounded-xl border-2 bg-cream-50 dark:bg-charcoal-700 border-clay-300 dark:border-charcoal-600 focus:border-rose-400 dark:focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 dark:focus:ring-rose-400/20 text-charcoal-900 dark:text-cream-50 placeholder:text-charcoal-400 dark:placeholder:text-cream-500 font-body transition-all duration-200 outline-none resize-none"
                    placeholder="Describe the issue in detail..."
                    maxLength={500}
                  />
                  <p className="font-body text-xs text-charcoal-400 dark:text-cream-500 mt-1.5 text-right">
                    {reportDescription.length}/500 characters
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <p className="text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
                    <ExclamationTriangleIcon className="h-4 w-4 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                    <span>Your report will be reviewed by our team. False reports may result in account restrictions.</span>
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 px-6 py-4 bg-clay-50 dark:bg-charcoal-700/30 border-t border-clay-300 dark:border-charcoal-700">
                <button
                  onClick={handleReport}
                  className="flex-1 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-medium hover:from-rose-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Submit Report
                </button>
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setReportReason('');
                    setReportDescription('');
                  }}
                  className="flex-1 py-2.5 bg-clay-200 dark:bg-charcoal-700 text-charcoal-700 dark:text-cream-200 rounded-xl font-medium hover:bg-clay-300 dark:hover:bg-charcoal-600 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ✨ Enhanced Delete Confirmation Modal with Different Dark Mode Header Colors */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-cream-50 dark:bg-charcoal-800 rounded-2xl shadow-xl border border-clay-300 dark:border-charcoal-700 overflow-hidden"
            >
              {/* Header - Delete Modal with special dark mode colors */}
              <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-900/30 dark:to-red-900/30 border-b border-clay-300 dark:border-charcoal-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-100 dark:bg-rose-900/40 rounded-lg">
                    <TrashIcon className="h-5 w-5 text-rose-600 dark:text-red-300" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-xl text-charcoal-900 dark:!text-red-800">
                      Delete Recipe
                    </h3>
                    <p className="font-body text-sm text-charcoal-500 dark:!text-red-800">
                      This action is irreversible
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="p-2 rounded-lg hover:bg-clay-200 dark:hover:bg-charcoal-700 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-charcoal-500 dark:text-red-300/70" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-full flex-shrink-0">
                    <ExclamationTriangleIcon className="h-8 w-8 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <p className="font-body text-lg text-charcoal-700 dark:text-cream-200">
                      Are you sure you want to delete <span className="font-bold text-charcoal-900 dark:text-cream-50">"{recipe.recipeName}"</span>?
                    </p>
                    <p className="font-body text-sm text-charcoal-500 dark:text-cream-400 mt-2">
                      This action cannot be undone. All data associated with this recipe will be permanently removed.
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800">
                  <p className="text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                    <ShieldCheckIcon className="h-4 w-4 flex-shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                    <span>Only you and administrators can delete this recipe. This action is logged for security purposes.</span>
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 px-6 py-4 bg-clay-50 dark:bg-charcoal-700/30 border-t border-clay-300 dark:border-charcoal-700">
                <button
                  onClick={handleDeleteRecipe}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-xl font-medium hover:from-rose-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Deleting...
                    </span>
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
    </div>
  );
}