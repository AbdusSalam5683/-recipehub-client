// client/src/components/home/Banner.jsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const Banner = () => {
  return (
    <section className="relative bg-gradient-to-r from-primary-600 to-primary-400 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-8xl">🍳</div>
        <div className="absolute bottom-10 right-10 text-8xl">🥘</div>
        <div className="absolute top-1/2 left-1/3 text-6xl">👨‍🍳</div>
      </div>
      
      <div className="container-custom py-20 md:py-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Discover & Share <br />
            <span className="text-yellow-300">Amazing Recipes</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl opacity-90">
            Join thousands of food enthusiasts in sharing and discovering 
            delicious recipes from around the world. Cook, learn, and inspire!
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/browse-recipes"
              className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
            >
              Explore Recipes
            </Link>
            <Link
              href="/user-dashboard/add-recipe"
              className="px-6 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition-all shadow-lg hover:shadow-xl"
            >
              Share Your Recipe
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Banner;