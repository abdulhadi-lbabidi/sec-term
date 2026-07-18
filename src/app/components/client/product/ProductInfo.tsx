import { Skeleton } from '../../ui/skeleton';

interface ProductInfoProps {
  name: string;
  categoryName?: string;
  currentPrice: number;
  originalPrice?: number;
  currency: string;
  description: string;
}

export function ProductInfo({
  name,
  categoryName,
  currentPrice,
  originalPrice,
  currency,
  description
}: ProductInfoProps) {
  return (
    <div className="mb-8 border-b border-gray-100 pb-8">
      {categoryName && (
        <span className="text-sm font-bold text-[#C5A880] mb-2 block">{categoryName}</span>
      )}
      <h1 className="text-4xl font-black text-[#1C1A17] mb-4 leading-tight">{name}</h1>
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl font-black text-[#C5A880]">
          {currentPrice} {currency}
        </span>
        {originalPrice && originalPrice > currentPrice && (
          <span className="text-xl text-gray-400 line-through">
            {originalPrice} {currency}
          </span>
        )}
      </div>
      {description && (
        <div 
          className="text-lg text-gray-600 leading-relaxed" 
          dangerouslySetInnerHTML={{ __html: description }} 
        />
      )}
    </div>
  );
}

export function ProductInfoSkeleton() {
  return (
    <div className="mb-8 border-b border-gray-100 pb-8">
      <Skeleton className="h-4 w-32 mb-2" />
      <Skeleton className="h-10 w-3/4 mb-4" />
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
