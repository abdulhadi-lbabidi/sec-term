import { Link } from 'react-router-dom';
import { PackageSearch } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';
import { ProductSkeleton } from '../product/ProductSkeleton';
import { useTranslation } from 'react-i18next';

interface ProductSectionProps {
  products: any[];
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
}

export const ProductSection = ({ products, isLoading, title, subtitle }: ProductSectionProps) => {
  const { t } = useTranslation();

  return (
    <section className="container mx-auto px-4 md:px-8 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-2">{title || t('sectionTitle')}</h2>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
        <Link to="/shop" className="text-sm font-medium text-gray-500 hover:text-[var(--color-primary)] transition-colors duration-300">
          {t('viewAllText')}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? Array.from({ length: 4 }).map((_, idx) => <ProductSkeleton key={idx} />) : Array.isArray(products) && products.length > 0
          ? products.map((product: any) => <ProductCard key={product.id} product={product} />)
          : (
            <div className="col-span-full py-16 flex flex-col items-center justify-center bg-muted/30 rounded-3xl border border-dashed border-border/60">
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                <PackageSearch className="w-10 h-10 text-primary/60" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {t('noProductsFound')}
              </h3>
              <p className="text-muted-foreground max-w-sm text-center mb-6">
                {t('noProductsDesc')}
              </p>
              <Link to="/shop" className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-full font-medium transition-colors shadow-sm">
                {t('browseShop')}
              </Link>
            </div>
          )}
      </div>
    </section>
  );
};
