// client/src/components/home/StaticSections.jsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { UsersIcon, BookOpenIcon, GlobeAltIcon, HeartIcon } from '@heroicons/react/24/outline';

const stats = [
  { number: '10K+', label: 'Active Users', icon: UsersIcon },
  { number: '5K+', label: 'Recipes Shared', icon: BookOpenIcon },
  { number: '50+', label: 'Cuisines', icon: GlobeAltIcon },
  { number: '100K+', label: 'Total Likes', icon: HeartIcon },
];

const StaticSections = () => {
  return (
    <>
      {/* Stats Section */}
      <section className="py-16 bg-paprika-500 text-cream-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="space-y-1"
              >
                <stat.icon className="h-8 w-8 mx-auto opacity-80" />
                <div className="font-display font-bold text-3xl md:text-4xl">{stat.number}</div>
                <div className="font-body text-sm opacity-80">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scalloped bottom */}
        
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-cream-50 dark:bg-charcoal-950">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl text-charcoal-900 dark:text-cream-50 mb-4">
              Ready to Share Your <span className="text-paprika-500">Recipe</span>?
            </h2>
            <p className="text-charcoal-600 dark:text-cream-300 font-body text-lg mb-8 leading-relaxed">
              Join our community of food lovers and share your culinary creations with the world.
              Get feedback, earn likes, and inspire others!
            </p>
            <Link
              href="/user-dashboard/add-recipe"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-paprika-500 text-cream-50 font-body font-semibold hover:bg-paprika-600 transition-colors shadow-lg hover:shadow-xl"
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