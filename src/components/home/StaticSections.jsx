// client/src/components/home/StaticSections.jsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const StaticSections = () => {
  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '5K+', label: 'Recipes Shared' },
    { number: '50+', label: 'Cuisines' },
    { number: '100K+', label: 'Total Likes' },
  ];

  return (
    <>
      {/* Stats Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold">{stat.number}</div>
                <div className="text-sm md:text-base opacity-80 mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Share Your Recipe?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Join our community of food lovers and share your culinary creations 
              with the world. Get feedback, earn likes, and inspire others!
            </p>
            <Link
              href="/user-dashboard/add-recipe"
              className="inline-block px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl"
            >
              Start Sharing Now
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default StaticSections;