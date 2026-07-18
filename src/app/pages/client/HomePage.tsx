import { useProducts } from '@/app/api/client/useProducts';
import { useCategories } from '@/app/api/client/useCategories';

// Import home sections
import { HeroSection } from '@/app/components/client/home/HeroSection';
import { CategorySection } from '@/app/components/client/home/CategorySection';
// import { PromoBannersRow1 } from '@/app/components/client/home/PromoBannersRow1';
import { ProductSection } from '@/app/components/client/home/ProductSection';
import { PromoBannersRow2 } from '@/app/components/client/home/PromoBannersRow2';
import { BrandLogosSection } from '@/app/components/client/home/BrandLogosSection';
import { NewsletterSection } from '@/app/components/client/home/NewsletterSection';

export default function HomePage() {
  const { data: productsData, isLoading: loadingProducts } = useProducts();
  const { data: categoriesData } = useCategories();

  const rawProducts = (productsData as any)?.products ?? productsData;
  const products: unknown[] = Array.isArray(rawProducts) ? rawProducts : [];

  const categories: any = categoriesData

  return (
    <div className="w-full bg-white text-gray-900 pb-20 max-w-7xl mx-auto">
      <HeroSection />
      <CategorySection categories={categories} />
      {/* <PromoBannersRow1 /> */}
      <ProductSection products={products} isLoading={loadingProducts} />
      <PromoBannersRow2 />
      <BrandLogosSection />
      <NewsletterSection />
    </div>
  );
}
