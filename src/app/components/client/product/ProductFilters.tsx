import React from 'react';
import { Filter, X, Search } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Slider } from '@/app/components/ui/slider';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { useCategories } from '@/app/api/client/useCategories';
import { useSizes } from '@/app/api/client/useSizes';
import { useAppStore } from '@/app/store/useAppStore';
import { translations } from '@/app/i18n/translations';

interface ProductFiltersProps {
  filters: {
    search: string;
    category_id: string;
    size_id: string;
    min_price: number;
    max_price: number;
  };
  onFilterChange: (key: string, value: string | number) => void;
  onClearFilters: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({ filters, onFilterChange, onClearFilters }) => {
  const { language } = useAppStore();
  const t = translations[language];

  const { data: categories = [], isLoading: loadingCategories } = useCategories();
  const { data: sizes = [], isLoading: loadingSizes } = useSizes();

  const handlePriceChange = (value: number[]) => {
    onFilterChange('min_price', value[0]);
    onFilterChange('max_price', value[1]);
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#EAE5DF]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Filter size={20} className="text-[#C5A880]" />
          {t.filterCategory || (language === 'ar' ? 'الفلاتر' : 'Filters')}
        </h3>
        <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-gray-500 hover:text-red-500">
          <X size={16} className="mr-1" /> {language === 'ar' ? 'مسح' : 'Clear'}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Search Filter */}
        <div>
          <h4 className="font-semibold text-sm mb-3 text-gray-700">{language === 'ar' ? 'بحث' : 'Search'}</h4>
          <div className="relative">
            <Search className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-gray-400`} size={18} />
            <Input
              type="text"
              placeholder={t.searchPlaceholder || (language === 'ar' ? 'ابحث عن منتج...' : 'Search for a product...')}
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className={`${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <h4 className="font-semibold text-sm mb-3 text-gray-700">{language === 'ar' ? 'الأقسام' : 'Categories'}</h4>
          <Select
            value={filters.category_id}
            onValueChange={(value) => onFilterChange('category_id', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={language === 'ar' ? 'اختر القسم' : 'Select category'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
              {!loadingCategories && categories.map((cat: any) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat?.image && <img src={cat.image} alt={cat.name} className="w-6 h-6 rounded-md ltr:mr-2" />}
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Size Filter */}
        <div>
          <h4 className="font-semibold text-sm mb-3 text-gray-700">{language === 'ar' ? 'المقاسات' : 'Sizes'}</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.size_id === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange('size_id', 'all')}
              className={`rounded-lg ${filters.size_id === 'all' ? 'bg-[#C5A880] text-white hover:bg-[#b09672]' : ''}`}
            >
              {language === 'ar' ? 'الكل' : 'All'}
            </Button>
            {loadingSizes ? (
              <div className="text-gray-500 text-sm">{t.loading}</div>
            ) : (
              sizes.map((size: any) => (
                <Button
                  key={size.id}
                  variant={filters.size_id === size.id.toString() ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onFilterChange('size_id', size.id.toString())}
                  className={`rounded-lg ${filters.size_id === size.id.toString() ? 'bg-[#C5A880] text-white hover:bg-[#b09672]' : ''}`}
                >
                  {size.name || size.size}
                </Button>
              ))
            )}
          </div>
        </div>

        {/* Price Filter */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm text-gray-700">{language === 'ar' ? 'السعر' : 'Price'}</h4>
            <span className="text-xs text-gray-500 font-medium">{filters.min_price} - {filters.max_price} {t.currency}</span>
          </div>
          <div className="px-2">
            <Slider
              defaultValue={[filters.min_price, filters.max_price]}
              max={1000}
              step={10}
              value={[filters.min_price, filters.max_price]}
              onValueChange={handlePriceChange}
              className="mt-4 [&_[data-slot=slider-range]]:bg-[#C5A880] [&_[data-slot=slider-thumb]]:border-[#C5A880]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
