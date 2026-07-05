// client/src/app/(dashboard)/user-dashboard/my-favorites/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { userService } from '../../../../services/auth';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Loader from '../../../../components/common/Loader';

export default function MyFavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await userService.getFavorites();
      if (response.success) {
        setFavorites(response.favorites);
      }
    } catch (error) {
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (recipeId) => {
    try {
      const response = await userService.toggleFavorite(recipeId);
      if (response.success) {
        setFavorites(favorites.filter(f => f.recipeId._id !== recipeId));
        toast.success('Removed from favorites');
      }
    } catch (error) {
      toast.error('Failed to remove favorite');
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
          My Favorites ❤️
        </h1>
        <p className="font-body text-charcoal-500 dark:text-cream-400 mt-1">
          Your saved recipes
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">💔</div>
          <h3 className="font-display font-semibold text-xl text-charcoal-900 dark:text-cream-50">
            No favorites yet
          </h3>
          <p className="font-body text-charcoal-500 dark:text-cream-400 mt-1">
            Start saving recipes you love!
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
          {favorites.map((fav, index) => {
            const recipe = fav.recipeId;
            if (!recipe) return null;
            return (
              <motion.div
                key={fav._id}
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
                    <button
                      onClick={() => handleRemoveFavorite(recipe._id)}
                      className="mt-2 text-paprika-500 hover:text-paprika-600 dark:hover:text-paprika-400 transition-colors"
                    >
                      <HeartSolidIcon className="h-5 w-5" />
                    </button>
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