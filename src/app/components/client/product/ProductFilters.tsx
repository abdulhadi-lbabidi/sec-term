import React from 'react';
import { Filter, X, Search } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Slider } from '@/app/components/ui/slider';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui/accordion';
import { useCategoriesQuery } from '@/app/api/client/useCategories';
import { useSizesQuery } from '@/app/api/client/useSizes';
import { useMaterialsQuery } from '@/app/api/client/useMaterials';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface ProductFiltersProps {
  filters: {
    search: string;
    category_id: string;
    size_id: string;
    material_id: string;
    min_price: number;
    max_price: number;
  };
  onFilterChange: (key: string, value: string | number) => void;
  onClearFilters: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({ filters, onFilterChange, onClearFilters }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const { data: categories, isLoading: loadingCategories }: any = useCategoriesQuery();
  const { data: sizes, isLoading: loadingSizes }: any = useSizesQuery();
  const { data: materials, isLoading: loadingMaterials }: any = useMaterialsQuery();

  const [minPriceValue, setMinPriceValue] = React.useState(filters.min_price.toString());
  const [maxPriceValue, setMaxPriceValue] = React.useState(filters.max_price.toString());

  React.useEffect(() => {
    setMinPriceValue(filters.min_price.toString());
    setMaxPriceValue(filters.max_price.toString());
  }, [filters.min_price, filters.max_price]);

  const handlePriceInputBlur = (type: 'min' | 'max') => {
    let val = type === 'min' ? parseInt(minPriceValue) : parseInt(maxPriceValue);
    if (isNaN(val)) val = type === 'min' ? 0 : 1000;

    if (type === 'min' && val > filters.max_price) val = filters.max_price;
    if (type === 'max' && val < filters.min_price) val = filters.min_price;

    if (type === 'min') {
      setMinPriceValue(val.toString());
      onFilterChange('min_price', val);
    } else {
      setMaxPriceValue(val.toString());
      onFilterChange('max_price', val);
    }
  };

  const handlePriceInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, type: 'min' | 'max') => {
    if (e.key === 'Enter') {
      handlePriceInputBlur(type);
    }
  };

  const handlePriceChange = (value: number[]) => {
    setMinPriceValue(value[0].toString());
    setMaxPriceValue(value[1].toString());
    onFilterChange('min_price', value[0]);
    onFilterChange('max_price', value[1]);
  };

  return (
    <div className="bg-background p-6 rounded-[2rem] shadow-sm border border-border/60">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
          <Filter size={20} className="text-primary" />
          {t('filters.title', 'Filters')}
        </h3>
        <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-muted-foreground hover:text-destructive h-8 px-2 transition-colors">
          <X size={16} className="me-1" /> {t('filters.clear', 'Clear')}
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={['search', 'category', 'size', 'material', 'price']} className="space-y-4">

        {/* Search Filter */}
        <AccordionItem value="search" className="border-none">
          <AccordionTrigger className="py-2 hover:no-underline rounded-lg px-2 hover:bg-muted/50 data-[state=open]:bg-muted/30 transition-colors">
            <h4 className="font-semibold text-sm text-foreground">{t('filters.search', 'Search')}</h4>
          </AccordionTrigger>
          <AccordionContent className="pt-4 px-2 pb-2">
            <div className="relative">
              <Search className={cn("absolute top-1/2 -translate-y-1/2 text-muted-foreground", isRtl ? "right-3" : "left-3")} size={16} />
              <Input
                type="text"
                placeholder={t('filters.search_placeholder', 'Search products...')}
                value={filters.search}
                onChange={(e) => onFilterChange('search', e.target.value)}
                className={cn("bg-background rounded-xl border-border/60 focus-visible:ring-primary/20", isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4')}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Category Filter */}
        <AccordionItem value="category" className="border-none">
          <AccordionTrigger className="py-2 hover:no-underline rounded-lg px-2 hover:bg-muted/50 data-[state=open]:bg-muted/30 transition-colors">
            <h4 className="font-semibold text-sm text-foreground">{t('filters.categories', 'Categories')}</h4>
          </AccordionTrigger>
          <AccordionContent className="pt-4 px-2 pb-2">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filters.category_id === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFilterChange('category_id', 'all')}
                className={cn("rounded-xl transition-all h-8 shadow-sm", filters.category_id === 'all' ? '' : 'border-border/60 text-muted-foreground hover:border-primary/50')}
              >
                {t('filters.all', 'All')}
              </Button>
              {loadingCategories ? (
                <div className="text-muted-foreground text-sm flex items-center h-8 px-2">{t('common.loading', 'Loading...')}</div>
              ) : (
                categories?.map((cat: any) => (
                  <Button
                    key={cat.id}
                    variant={filters.category_id === cat.id.toString() ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onFilterChange('category_id', cat.id.toString())}
                    className={cn("rounded-xl transition-all h-8 shadow-sm", filters.category_id === cat.id.toString() ? '' : 'border-border/60 text-muted-foreground hover:border-primary/50')}
                  >
                    {cat.name}
                  </Button>
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Size Filter */}
        <AccordionItem value="size" className="border-none">
          <AccordionTrigger className="py-2 hover:no-underline rounded-lg px-2 hover:bg-muted/50 data-[state=open]:bg-muted/30 transition-colors">
            <h4 className="font-semibold text-sm text-foreground">{t('filters.sizes', 'Sizes')}</h4>
          </AccordionTrigger>
          <AccordionContent className="pt-4 px-2 pb-2">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filters.size_id === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFilterChange('size_id', 'all')}
                className={cn("rounded-xl transition-all h-8 shadow-sm", filters.size_id === 'all' ? '' : 'border-border/60 text-muted-foreground hover:border-primary/50')}
              >
                {t('filters.all', 'All')}
              </Button>
              {loadingSizes ? (
                <div className="text-muted-foreground text-sm flex items-center h-8 px-2">{t('common.loading', 'Loading...')}</div>
              ) : (
                sizes?.map((size: any) => (
                  <Button
                    key={size.id}
                    variant={filters.size_id === size.id.toString() ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onFilterChange('size_id', size.id.toString())}
                    className={cn("rounded-xl transition-all h-8 shadow-sm", filters.size_id === size.id.toString() ? '' : 'border-border/60 text-muted-foreground hover:border-primary/50')}
                  >
                    {size.name || size.size}
                  </Button>
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Material Filter */}
        <AccordionItem value="material" className="border-none">
          <AccordionTrigger className="py-2 hover:no-underline rounded-lg px-2 hover:bg-muted/50 data-[state=open]:bg-muted/30 transition-colors">
            <h4 className="font-semibold text-sm text-foreground">{t('filters.materials', 'Materials')}</h4>
          </AccordionTrigger>
          <AccordionContent className="pt-4 px-2 pb-2">
            <Select value={filters.material_id === 'all' ? 'all' : filters.material_id} onValueChange={(val) => onFilterChange('material_id', val)}>
              <SelectTrigger className="w-full rounded-xl bg-background border-border/60">
                <SelectValue placeholder={t('filters.select_material', 'Select material')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.all', 'All')}</SelectItem>
                {!loadingMaterials && materials?.map((mat: any) => (
                  <SelectItem key={mat.id} value={mat.id.toString()}>
                    {mat.material_image && <img src={mat.material_image} alt={mat.material || mat.name} width={24} height={24} />}
                    {mat.material || mat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        {/* Price Filter */}
        <AccordionItem value="price" className="border-none">
          <AccordionTrigger className="py-2 hover:no-underline rounded-lg px-2 hover:bg-muted/50 data-[state=open]:bg-muted/30 transition-colors">
            <h4 className="font-semibold text-sm text-foreground">{t('filters.price', 'Price')}</h4>
          </AccordionTrigger>
          <AccordionContent className="pt-4 px-2 pb-4">
            <div className="flex items-center justify-between mb-6 gap-2">
              <div className="relative flex-1">
                <Input
                  type="number"
                  min={0}
                  max={filters.max_price}
                  value={minPriceValue}
                  onChange={(e) => setMinPriceValue(e.target.value)}
                  onBlur={() => handlePriceInputBlur('min')}
                  onKeyDown={(e) => handlePriceInputKeyDown(e, 'min')}
                  className={cn("h-8 text-xs font-bold", isRtl ? "pl-8 pr-2" : "pr-8 pl-2")}
                />
                <span className={cn("absolute top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground", isRtl ? "left-2" : "right-2")}>{t('common.currency', 'SAR')}</span>
              </div>
              <span className="text-xs text-muted-foreground font-bold">-</span>
              <div className="relative flex-1">
                <Input
                  type="number"
                  min={filters.min_price}
                  value={maxPriceValue}
                  onChange={(e) => setMaxPriceValue(e.target.value)}
                  onBlur={() => handlePriceInputBlur('max')}
                  onKeyDown={(e) => handlePriceInputKeyDown(e, 'max')}
                  className={cn("h-8 text-xs font-bold", isRtl ? "pl-8 pr-2" : "pr-8 pl-2")}
                />
                <span className={cn("absolute top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground", isRtl ? "left-2" : "right-2")}>{t('common.currency', 'SAR')}</span>
              </div>
            </div>
            <div className="px-1 mt-2">
              <Slider
                defaultValue={[filters.min_price, filters.max_price]}
                max={1000}
                step={10}
                value={[filters.min_price, filters.max_price]}
                onValueChange={handlePriceChange}
                className="[&_[data-slot=slider-range]]:bg-primary [&_[data-slot=slider-thumb]]:border-primary hover:cursor-grab active:cursor-grabbing"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
};
