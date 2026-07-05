// client/src/app/(dashboard)/user-dashboard/purchased-recipes/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { paymentService } from '../../../../services/auth';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ClockIcon, UserIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Loader from '../../../../components/common/Loader';

export default function PurchasedRecipesPage() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPurchasedRecipes();
  }, []);

  const fetchPurchasedRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await paymentService.getPurchasedRecipes();
      if (response.success) {
        setPurchases(response.purchases || []);
      } else {
        setError(response.message || 'Failed to load purchased recipes');
        toast.error('Failed to load purchased recipes');
      }
    } catch (error) {
      console.error('Error fetching purchased recipes:', error);
      setError('Network error. Please try again.');
      toast.error('Failed to connect to server');
    } finally {
      setLoading(false);
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
          onClick={fetchPurchasedRecipes}
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
          My Purchased Recipes 🛒
        </h1>
        <p className="font-body text-charcoal-500 dark:text-cream-400 mt-1">
          Recipes you've bought and own
        </p>
      </div>

      {purchases.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🛍️</div>
          <h3 className="font-display font-semibold text-xl text-charcoal-900 dark:text-cream-50">
            No purchases yet
          </h3>
          <p className="font-body text-charcoal-500 dark:text-cream-400 mt-1">
            Browse recipes and purchase your favorites!
          </p>
          <Link
            href="/browse-recipes"
            className="btn-primary mt-4 inline-flex"
          >
            Browse Recipes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {purchases.map((purchase, index) => {
            const recipe = purchase.recipeId;
            if (!recipe) return null;
            return (
              <motion.div
                key={purchase._id}
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
                    <Link href={`/recipe-details/${recipe._id}`}>
                      <h3 className="font-display font-semibold text-lg text-charcoal-900 dark:text-cream-50 hover:text-paprika-600 dark:hover:text-turmeric-400 transition-colors truncate">
                        {recipe.recipeName}
                      </h3>
                    </Link>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <span className="badge-category">{recipe.category}</span>
                      <span className="badge-category">{recipe.cuisineType}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-charcoal-500 dark:text-cream-400">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-3.5 w-3.5" />
                        {recipe.preparationTime}m
                      </span>
                      <span className="flex items-center gap-1">
                        <UserIcon className="h-3.5 w-3.5" />
                        {recipe.authorName}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs font-medium text-sage-600 dark:text-sage-400">
                        ${purchase.amount}
                      </span>
                      <span className="text-xs text-charcoal-400 dark:text-cream-500">
                        {new Date(purchase.purchasedAt).toLocaleDateString()}
                      </span>
                      <Link
                        href={`/recipe-details/${recipe._id}`}
                        className="btn-primary text-xs py-1 px-3 ml-auto"
                      >
                        View Recipe
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}