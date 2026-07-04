// client/src/components/common/ResponsiveToaster.jsx
'use client';

import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

const ResponsiveToaster = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  return (
    <Toaster
      position={isMobile ? 'top-center' : 'top-right'}
      containerStyle={{ top: isMobile ? 12 : 76 }}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
          borderRadius: '12px',
          fontSize: '14px',
          maxWidth: '90vw',
        },
        success: {
          duration: 3000,
          iconTheme: { primary: '#D85A30', secondary: '#fff' },
        },
        error: {
          duration: 5000,
          iconTheme: { primary: '#DC2626', secondary: '#fff' },
        },
      }}
    />
  );
};

export default ResponsiveToaster;
