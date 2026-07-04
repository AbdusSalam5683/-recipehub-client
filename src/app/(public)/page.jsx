// client/src/app/(public)/page.jsx
import Banner from '../../components/home/Banner';
import FeaturedRecipes from '../../components/home/FeaturedRecipes';
import PopularRecipes from '../../components/home/PopularRecipes';
import StaticSections from '../../components/home/StaticSections';

export default function HomePage() {
  return (
    <>
      <Banner />
      <FeaturedRecipes />
      <PopularRecipes />
      <StaticSections />
    </>
  );
}