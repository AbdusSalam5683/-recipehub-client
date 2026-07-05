// client/src/components/common/Loader.jsx
'use client';

import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="loader mx-auto" />
        <p className="font-body text-sm text-charcoal-500 dark:text-cream-400 mt-4">
          Loading...
        </p>
      </motion.div>
    </div>
  );
};

export default Loader;