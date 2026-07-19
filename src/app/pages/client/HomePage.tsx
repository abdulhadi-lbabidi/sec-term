import { useProductsQuery } from '@/app/api/client/useProducts';
import { useCategoriesQuery } from '@/app/api/client/useCategories';

// Import home sections
import { HeroSection } from '@/app/components/client/home/HeroSection';
import { CategorySection } from '@/app/components/client/home/CategorySection';
import { ProductSection } from '@/app/components/client/home/ProductSection';
import { BrandLogosSection } from '@/app/components/client/home/BrandLogosSection';

export default function HomePage() {
  const { data: productsData, isLoading: loadingProducts } = useProductsQuery();
  const { data: categoriesData } = useCategoriesQuery();

  const rawProducts = (productsData as any)?.data ?? (productsData as any)?.products ?? productsData;
  const products: unknown[] = Array.isArray(rawProducts) ? rawProducts : [];

  const categories: any = categoriesData || [];

  return (
    <div className="w-full bg-white text-gray-900 pb-20 max-w-7xl mx-auto">
      <HeroSection />
      <CategorySection categories={categories} />
      <ProductSection products={products} isLoading={loadingProducts} />
      <BrandLogosSection />
    </div>
  );
}
