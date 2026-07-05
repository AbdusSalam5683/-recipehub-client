// client/src/app/(dashboard)/user-dashboard/purchased-recipes/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { paymentService, recipeService } from '../../../../services/auth';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ShoppingBagIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import Loader from '../../../../components/common/Loader';

export default function PurchasedRecipesPage() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchasedRecipes();
  }, []);

  const fetchPurchasedRecipes = async () => {
    try {
      // এখানে purchased recipes API call হবে
      // বর্তমানে ডামি ডেটা দেখাচ্ছি
      const dummyPurchases = [
        {
          _id: '1',
          recipeId: {
            _id: 'recipe1',
            recipeName: 'Butter Chicken',
            recipeImage: 'https://images.unsplash.com/photo-1604909052743-94c293edc3cb?w=400',
            category: 'Dinner',
            cuisineType: 'Indian',
            preparationTime: 45,
            authorName: 'John Doe',
          },
          purchasedAt: new Date('2024-01-15'),
          amount: 4.99,
          transactionId: 'txn_123456',
        },
        {
          _id: '2',
          recipeId: {
            _id: 'recipe2',
            recipeName: 'Chicken Biryani',
            recipeImage: 'https://images.unsplash.com/photo-1563379091-3fe6d62e2c8c?w=400',
            category: 'Dinner',
            cuisineType: 'Bangladeshi',
            preparationTime: 60,
            authorName: 'Jane Smith',
          },
          purchasedAt: new Date('2024-02-20'),
          amount: 4.99,
          transactionId: 'txn_789012',
        },
      ];
      setPurchases(dummyPurchases);
    } catch (error) {
      toast.error('Failed to load purchased recipes');
    } finally {
      setLoading(false);
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