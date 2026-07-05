// client/src/components/home/Banner.jsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';

const Banner = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const patternStyle = mounted ? {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D85A30' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    backgroundSize: '60px 60px',
  } : {};

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-paprika-50 via-cream-50 to-sage-50 dark:from-charcoal-900 dark:via-charcoal-950 dark:to-charcoal-900 px-4 sm:px-6 lg:px-8">
      {/* Decorative pattern */}
      {mounted && (
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]">
          <div className="absolute inset-0" style={patternStyle} />
        </div>
      )}

      <div className="container-custom relative py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-paprika-100/80 dark:bg-paprika-900/30 text-paprika-700 dark:text-paprika-300 text-xs font-body font-medium mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-paprika-500 dark:bg-paprika-400 animate-pulse" />
              <span>Discover & Share Amazing Recipes</span>
            </div>

            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-charcoal-900 dark:text-cream-50 leading-[1.1]">
              Find your next
              <br />
              <span className="bg-gradient-to-r from-paprika-500 via-turmeric-500 to-sage-500 bg-clip-text text-transparent">favorite recipe</span>
            </h1>

            <p className="mt-4 text-lg text-charcoal-600 dark:text-cream-300 max-w-lg leading-relaxed">
              Join thousands of food lovers sharing and discovering delicious recipes from around the world.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/browse-recipes"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-paprika-500 text-cream-50 font-body font-semibold hover:bg-paprika-600 transition-colors shadow-md hover:shadow-lg"
              >
                Explore Recipes
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/user-dashboard/add-recipe"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cream-200/80 dark:bg-charcoal-700/80 text-charcoal-700 dark:text-cream-200 font-body font-semibold hover:bg-cream-300/80 dark:hover:bg-charcoal-600/80 transition-colors border border-cream-300 dark:border-charcoal-600"
              >
                Share Your Recipe
              </Link>
            </div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-8 flex items-center gap-6 text-sm text-charcoal-500 dark:text-cream-400"
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <StarSolidIcon key={i} className="h-4 w-4 text-turmeric-500" />
                ))}
                <span className="ml-1 font-medium">4.9/5</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span className="font-medium">10K+</span>
                <span>Happy Cooks</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span className="font-medium">5K+</span>
                <span>Recipes</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md aspect-square">
              {/* Main Image Card */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl ring-1 ring-cream-300/20 dark:ring-charcoal-700/50">
                <Image
                  src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&h=800&fit=crop"
                  alt="Delicious roasted chicken with vegetables"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/40 via-transparent to-transparent" />
                
                {/* Recipe Badge Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="bg-cream-50/95 dark:bg-charcoal-800/95 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-lg">
                    <p className="text-xs text-charcoal-500 dark:text-cream-400 font-body">🔥 Popular</p>
                    <p className="font-display font-semibold text-sm text-charcoal-900 dark:text-cream-50">
                      Roasted Chicken
                    </p>
                  </div>
                  <div className="bg-paprika-500/95 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-lg">
                    <p className="text-xs text-cream-200 font-body">⭐ 4.9</p>
                    <p className="font-display font-semibold text-sm text-cream-50">
                      45 min
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Decorative Images */}
              {mounted && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20, rotate: -8 }}
                    animate={{ opacity: 1, y: 0, rotate: -8 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl overflow-hidden shadow-xl rotate-6 hidden sm:block"
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=200&h=200&fit=crop"
                      alt="Biryani"
                      fill
                      className="object-cover"
                      priority
  sizes="(max-width: 768px) 100vw, 50vw"  
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20, rotate: 8 }}
                    animate={{ opacity: 1, y: 0, rotate: 8 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="absolute -bottom-4 -left-6 w-20 h-20 rounded-2xl overflow-hidden shadow-xl -rotate-6 hidden sm:block"
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop"
                      alt="Healthy salad"
                      fill
                      className="object-cover"
                      priority
  sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Banner;