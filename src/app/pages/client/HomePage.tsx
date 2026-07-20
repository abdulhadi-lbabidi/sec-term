import { useProductsQuery } from '@/app/api/client/useProducts';
import { useCategoriesQuery } from '@/app/api/client/useCategories';
import { useTranslation } from 'react-i18next';
import { Category } from '@/lib/types/api.types';

// Import home sections
import { HeroSection } from '@/app/components/client/home/HeroSection';
import { CategorySection } from '@/app/components/client/home/CategorySection';
import { ProductSection } from '@/app/components/client/home/ProductSection';

export default function HomePage() {
  const { data: productsData, isLoading: loadingProducts } = useProductsQuery();
  const { data: categoriesData } = useCategoriesQuery();
  const { t } = useTranslation();

  const rawProducts = (productsData as any)?.data ?? (productsData as any)?.products ?? productsData;
  const products: unknown[] = Array.isArray(rawProducts) ? rawProducts : [];

  const categories: Category[] = Array.isArray((categoriesData as any)?.data) 
    ? (categoriesData as any).data 
    : Array.isArray(categoriesData) 
      ? categoriesData 
      : [];

  const topTwoCategories = categories.slice(0, 2);

  return (
    <div className="w-full bg-white text-gray-900 pb-20 max-w-7xl mx-auto">
      <HeroSection topCategories={topTwoCategories} />
      <CategorySection categories={categories} />
      
      <ProductSection 
        title={t('products.featuredTitle', 'المنتجات المميزة')} 
        products={(products as any[]).slice(0, 4)} 
        isLoading={loadingProducts} 
      />

      <ProductSection 
        title={t('products.sectionTitle', 'المنتجات')} 
        products={(products as any[]).slice(4, 12)} 
        isLoading={loadingProducts} 
      />
    </div>
  );
}
