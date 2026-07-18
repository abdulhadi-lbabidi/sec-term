import { MaterialOption } from '../../../../types/Client/product';
import { Skeleton } from '../../ui/skeleton';

interface MaterialSelectorProps {
  options: MaterialOption[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  title: string;
}

export function MaterialSelector({ options, selectedId, onSelect, title }: MaterialSelectorProps) {
  if (!options || options.length === 0) return null;

  return (
    <div>
      <h3 className="font-bold text-[#1C1A17] mb-3">{title}</h3>
      <div className="flex flex-wrap gap-3">
        {options.map(material => (
          <button
            key={material.material_id}
            onClick={() => onSelect(material.material_id)}
            className={`px-6 py-3 rounded-xl border font-bold transition-all ${selectedId === material.material_id ? 'bg-[#111] text-white border-[#111]' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'}`}
          >
            {material.material_name}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MaterialSelectorSkeleton() {
  return (
    <div>
      <Skeleton className="h-5 w-24 mb-3" />
      <div className="flex flex-wrap gap-3">
        {[1, 2].map(item => (
          <Skeleton key={item} className="h-12 w-28 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
