// client/src/components/recipes/RecipeFilter.jsx
'use client';

import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

const categories = [
  'All',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Dessert',
  'Snack',
  'Beverage',
  'Soup',
  'Salad'
];

const RecipeFilter = ({ selectedCategory, onCategoryChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-wrap justify-center gap-2 mb-8"
    >
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-300',
            selectedCategory === cat
              ? 'bg-paprika-500 text-cream-50 shadow-md shadow-paprika-500/30 scale-105'
              : 'bg-clay-100 dark:bg-charcoal-700 text-charcoal-700 dark:text-cream-200 hover:bg-clay-200 dark:hover:bg-charcoal-600 hover:scale-105'
          )}
        >
          {cat}
          {selectedCategory === cat && (
            <span className="ml-1.5 text-xs">✓</span>
          )}
        </button>
      ))}
    </motion.div>
  );
};

export default RecipeFilter;