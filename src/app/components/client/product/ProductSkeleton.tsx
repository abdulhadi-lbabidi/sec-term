import React from 'react';
import { Skeleton } from '../../ui/skeleton';

interface ProductSkeletonProps {
  layout?: 'grid' | 'list';
}

export const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ layout = 'grid' }) => {
  return (
    <div className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex ${layout === 'list' ? 'flex-row h-48' : 'flex-col h-full'} relative`}>
      <div className={`relative ${layout === 'list' ? 'w-1/3 min-w-[150px] shrink-0' : 'aspect-[4/3] w-full'} bg-gray-50`}>
        <Skeleton className="w-full h-full" />
      </div>

      <div className={`p-5 flex flex-col flex-grow gap-4 ${layout === 'list' ? 'justify-center' : ''}`}>
        <div className="flex justify-between items-start gap-2">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        
        <div className={`flex items-center justify-between pt-4 border-t border-gray-100 mt-auto ${layout === 'list' ? 'md:w-1/2' : ''}`}>
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
};
