import { ProductCard } from '@/app/components/client/product/ProductCard';

interface WishlistGridProps {
  items: any[];
}

export const WishlistGrid = ({ items }: WishlistGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <ProductCard key={item.id} product={item.product || item} />
      ))}
    </div>
  );
};
