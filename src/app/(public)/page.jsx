// client/src/app/(public)/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Banner from '../../components/home/Banner';
import FeaturedRecipes from '../../components/home/FeaturedRecipes';
import PopularRecipes from '../../components/home/PopularRecipes';
import StaticSections from '../../components/home/StaticSections';

export default function HomePage() {
  const pathname = usePathname();
  const [mountKey, setMountKey] = useState(0);

  // ✅ Force remount when navigating to home
  useEffect(() => {
    if (pathname === '/') {
      setMountKey(prev => prev + 1);
      console.log('🏠 Home page refreshed, key:', mountKey + 1);
    }
  }, [pathname]);

  return (
    <>
      <Banner />
      {/* ✅ Key changes on navigation → Component remounts → Data refetches */}
      <FeaturedRecipes key={`featured-${mountKey}`} />
      <PopularRecipes key={`popular-${mountKey}`} />
      <StaticSections />
    </>
  );
}