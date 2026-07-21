import { useProductsQuery, useFeaturedProductsQuery } from '@/app/api/client/useProducts';
import { useCategoriesQuery } from '@/app/api/client/useCategories';
import { useTranslation } from 'react-i18next';
import { Category } from '@/lib/types/api.types';

// Import home sections
import { HeroSection } from '@/app/components/client/home/HeroSection';
import { CategorySection } from '@/app/components/client/home/CategorySection';
import { ProductSection } from '@/app/components/client/home/ProductSection';
import { SEO } from '@/app/components/client/seo/SEO';

export default function HomePage() {
  const { data: productsData, isLoading: loadingProducts } = useProductsQuery();
  const { data: featuredProductsData, isLoading: loadingFeatured } = useFeaturedProductsQuery();
  const { data: categoriesData } = useCategoriesQuery();
  const { t } = useTranslation();

  const rawProducts = (productsData as any)?.data ?? productsData;
  const products = Array.isArray(rawProducts) ? rawProducts : [];

  const rawFeaturedProducts = (featuredProductsData as any)?.data ?? featuredProductsData;
  const featuredProducts = Array.isArray(rawFeaturedProducts) ? rawFeaturedProducts : [];

  const rawCategories = (categoriesData as any)?.data ?? categoriesData;
  const categories: Category[] = Array.isArray(rawCategories) ? rawCategories : [];

  const topTwoCategories = categories.slice(0, 2);

  return (
    <div className="w-full bg-white text-gray-900 max-w-7xl mx-auto">
      <SEO title={t('home', 'Home')} description={t('homeDescription', 'Welcome to our store')} />
      <HeroSection topCategories={topTwoCategories} topProducts={products.slice(0, 3)} />
      <CategorySection
        categories={categories}
        title={t('filterCategory')}
        subtitle={t('filterCategorySubtitle')}
      />

      <ProductSection
        title={t('bestsellersTitle')}
        subtitle={t('bestsellersSubtitle')}
        products={featuredProducts.slice(0, 4)}
        isLoading={loadingFeatured}
      />

      <ProductSection
        title={t('freshToday')}
        subtitle={t('freshTodaySubtitle')}
        products={products.slice(0, 4)}
        isLoading={loadingProducts}
      />
    </div>
  );
}
