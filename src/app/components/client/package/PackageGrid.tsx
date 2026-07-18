import { Package as PackageIcon } from 'lucide-react';
import { Package } from '../../../../types/Client/product';
import { Button } from '../../ui/button';
import { Skeleton } from '../../ui/skeleton';

interface PackageGridProps {
  packages: Package[];
  title: string;
  quantityLabel: string;
  addButtonLabel: string;
  currency: string;
  onAdd: (pkg: Package) => void;
}

export function PackageGrid({
  packages,
  title,
  quantityLabel,
  addButtonLabel,
  currency,
  onAdd
}: PackageGridProps) {
  if (!packages || packages.length === 0) return null;

  return (
    <div className="pt-6 border-t border-gray-100">
      <h3 className="font-bold text-[#1C1A17] mb-4 flex items-center gap-2">
        <PackageIcon size={20} className="text-[#C5A880]" />
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {packages.map(pkg => (
          <div key={pkg.id} className="bg-[#FCFAF7] border border-[#EAE5DF] rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-[#111] mb-1">{pkg.name}</h4>
              <p className="text-sm text-gray-500 mb-3">{quantityLabel}: {pkg.quantity}</p>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <span className="font-black text-[#C5A880] text-lg">{pkg.price} {currency}</span>
              <Button
                size="sm"
                onClick={() => onAdd(pkg)}
                className="bg-white text-[#111] border border-gray-200 hover:bg-gray-50 hover:text-[#C5A880] rounded-lg"
              >
                {addButtonLabel}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PackageGridSkeleton() {
  return (
    <div className="pt-6 border-t border-gray-100">
      <Skeleton className="h-5 w-48 mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2].map(item => (
          <div key={item} className="border border-gray-100 rounded-2xl p-4 flex flex-col gap-4">
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="flex items-center justify-between mt-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
