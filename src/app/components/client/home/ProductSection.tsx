import { Link } from 'react-router-dom';
import { useAppStore } from '@/app/store/useAppStore';
import { ProductCard } from '../product/ProductCard';
import { ProductSkeleton } from '../product/ProductSkeleton';
import { useTranslation } from 'react-i18next';

interface ProductSectionProps {
  products: any[];
  isLoading?: boolean;
}

export const ProductSection = ({ products, isLoading }: ProductSectionProps) => {
  const { language } = useAppStore();
  const { t } = useTranslation();



  return (
    <section className="container mx-auto px-4 md:px-8 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">{t('products.sectionTitle')}</h2>
        <Link to="/shop" className="text-sm font-medium text-gray-500 hover:text-[var(--color-secondary)]">
          {t('products.viewAllText')}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? Array.from({ length: 4 }).map((_, idx) => <ProductSkeleton key={idx} />) : Array.isArray(products) && products.length > 0
          ? products.slice(0, 4).map((product: any) => <ProductCard key={product.id} product={product} />)
          : (
            <div className="col-span-full py-10 text-center text-gray-500">
              {language === 'ar' ? 'لا توجد منتجات حالياً.' : 'No products available.'}
            </div>
          )}
      </div>
    </section>
  );
};
