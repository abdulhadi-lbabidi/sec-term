import React from 'react';
import { Skeleton } from '../../ui/skeleton';

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full relative">
      <div className="relative aspect-[4/3] bg-gray-50">
        <Skeleton className="w-full h-full" />
      </div>

      <div className="p-5 flex flex-col flex-grow gap-4">
        <div className="flex justify-between items-start gap-2">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>
    </div>
  );
};
