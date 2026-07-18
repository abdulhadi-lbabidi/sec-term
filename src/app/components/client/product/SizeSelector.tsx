import { SizeVariant } from '../../../../types/Client/product';
import { Skeleton } from '../../ui/skeleton';

interface SizeSelectorProps {
  sizes: SizeVariant[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  title: string;
}

export function SizeSelector({ sizes, selectedId, onSelect, title }: SizeSelectorProps) {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div>
      <h3 className="font-bold text-[#1C1A17] mb-3">{title}</h3>
      <div className="flex flex-wrap gap-3">
        {sizes.map(size => (
          <button
            key={size.size_id}
            onClick={() => onSelect(size.size_id)}
            className={`px-6 py-3 rounded-xl border font-bold transition-all flex flex-col items-center gap-1 ${selectedId === size.size_id ? 'bg-[#C5A880] text-white border-[#C5A880]' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'}`}
          >
            <span>{size.size_name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function SizeSelectorSkeleton() {
  return (
    <div>
      <Skeleton className="h-5 w-16 mb-3" />
      <div className="flex flex-wrap gap-3">
        {[1, 2, 3].map(item => (
          <Skeleton key={item} className="h-12 w-20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
