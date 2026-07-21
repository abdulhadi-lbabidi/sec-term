import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, LayoutGrid, List, SearchX } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/app/components/ui/sheet';
import { useAppStore } from '@/app/store/useAppStore';
import { useTranslation } from 'react-i18next';
import { useProductsQuery } from '@/app/api/client/useProducts';
import { ProductCard } from '@/app/components/client/product/ProductCard';
import { ProductSkeleton } from '@/app/components/client/product/ProductSkeleton';
import { ProductFilters } from '@/app/components/client/product/ProductFilters';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/app/components/ui/pagination';

export default function ShopPage() {
  const { language } = useAppStore();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    category_id: searchParams.get('category_id') || 'all',
    size_id: searchParams.get('size_id') || 'all',
    material_id: searchParams.get('material_id') || 'all',
    min_price: Number(searchParams.get('min_price')) || 0,
    max_price: Number(searchParams.get('max_price')) || 1000,
    search: searchParams.get('search') || '',
  });

  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [isDesktopFilterOpen, setIsDesktopFilterOpen] = useState(true);
  const perPage = 12;

  // Sync state when URL searchParams change externally (e.g., from Header search)
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category_id') || 'all';
    
    setFilters(prev => {
      if (prev.search !== urlSearch || prev.category_id !== urlCategory) {
        return {
          ...prev,
          search: urlSearch,
          category_id: urlCategory
        };
      }
      return prev;
    });
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category_id !== 'all') params.set('category_id', filters.category_id);
    if (filters.size_id !== 'all') params.set('size_id', filters.size_id);
    if (filters.material_id !== 'all') params.set('material_id', filters.material_id);
    if (filters.min_price > 0) params.set('min_price', filters.min_price.toString());
    if (filters.max_price < 1000) params.set('max_price', filters.max_price.toString());
    if (filters.search) params.set('search', filters.search);
    if (page > 1) params.set('page', page.toString());
    setSearchParams(params, { replace: true });
  }, [filters, page, setSearchParams]);

  // Handle server-side query payload format
  const queryPayload: Record<string, any> = {
    paginate: 1,
    per_page: perPage,
    page: page,
  };

  if (filters.search) queryPayload['filter[search]'] = filters.search;
  if (filters.category_id !== 'all') queryPayload['filter[category_id]'] = filters.category_id;
  if (filters.size_id !== 'all') queryPayload['filter[size_id]'] = filters.size_id;
  if (filters.material_id !== 'all') queryPayload['filter[material_id]'] = filters.material_id;
  if (filters.min_price > 0) queryPayload['filter[min_price]'] = filters.min_price;
  if (filters.max_price < 1000) queryPayload['filter[max_price]'] = filters.max_price;

  const { data: productsData, isLoading: loadingProducts, isFetching }: any = useProductsQuery(queryPayload);

  const products = productsData?.data || [];
  const meta = productsData?.meta;
  const totalPages = meta?.last_page || 1;

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset page on filter change
    if (key !== 'min_price' && key !== 'max_price') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClearFilters = () => {
    setFilters({
      category_id: 'all',
      size_id: 'all',
      material_id: 'all',
      min_price: 0,
      max_price: 1000,
      search: '',
    });
    setPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Mobile Filters Trigger */}
        <div className="md:hidden flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{t('shop.products', 'Products')}</h2>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter size={16} />
                {t('shop.filters', 'Filters')}
              </Button>
            </SheetTrigger>
            <SheetContent side={language === 'ar' ? 'right' : 'left'} className="w-[300px] sm:w-[400px] p-0 border-border/60">
              <SheetTitle className="sr-only">Filters</SheetTitle>
              <div className="h-full overflow-y-auto p-4">
                <ProductFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar Filters */}
        {isDesktopFilterOpen && (
          <aside className="hidden md:block w-full md:w-1/4 lg:w-1/4 shrink-0 transition-all duration-300">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          
          {/* Toolbar */}
          <div className="hidden md:flex items-center justify-between mb-6 bg-background p-2 rounded-2xl border border-border/60 shadow-sm">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsDesktopFilterOpen(!isDesktopFilterOpen)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Filter size={18} className="me-2" />
              {isDesktopFilterOpen ? t('shop.hide_filters', 'Hide Filters') : t('shop.show_filters', 'Show Filters')}
            </Button>

            <div className="flex items-center gap-1 bg-muted p-1 rounded-xl">
              <Button
                variant={layout === 'grid' ? 'default' : 'ghost'}
                size="icon"
                className={`w-8 h-8 rounded-lg ${layout === 'grid' ? 'shadow-sm' : 'text-muted-foreground'}`}
                onClick={() => setLayout('grid')}
              >
                <LayoutGrid size={16} />
              </Button>
              <Button
                variant={layout === 'list' ? 'default' : 'ghost'}
                size="icon"
                className={`w-8 h-8 rounded-lg ${layout === 'list' ? 'shadow-sm' : 'text-muted-foreground'}`}
                onClick={() => setLayout('list')}
              >
                <List size={16} />
              </Button>
            </div>
          </div>

          <div className={`grid gap-4 sm:gap-6 ${layout === 'list' ? 'grid-cols-1 lg:grid-cols-2' : (isDesktopFilterOpen ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4')}`}>
            {(loadingProducts || isFetching) ? (
              Array.from({ length: perPage }).map((_, i) => <ProductSkeleton key={i} layout={layout} />)
            ) : products.length === 0 ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-muted/20 rounded-3xl border border-dashed border-border/60">
                <div className="bg-muted p-4 rounded-full mb-4">
                  <SearchX size={48} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  {t('shop.no_products_found', 'No products found')}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  {t('shop.no_products_desc', 'Maybe it\'s out of the oven, or the selected filters don\'t match any product.')}
                </p>
                {(filters.search || filters.category_id !== 'all' || filters.size_id !== 'all' || filters.material_id !== 'all' || filters.min_price > 0 || filters.max_price < 1000) && (
                  <Button onClick={handleClearFilters} variant="default" className="rounded-xl">
                    {t('shop.clear_all_filters', 'Clear All Filters')}
                  </Button>
                )}
              </div>
            ) : products.map((product: any) => <ProductCard key={product.id} product={product} layout={layout} />)
            }
          </div>

          {/* Pagination */}
          {!loadingProducts && totalPages > 1 && (
            <div className="mt-12">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => { e.preventDefault(); setPage(p => Math.max(1, p - 1)); }}
                      className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>

                  {(() => {
                    const pages = [];
                    const maxVisible = 5;
                    
                    if (totalPages <= maxVisible) {
                      for (let i = 1; i <= totalPages; i++) pages.push(i);
                    } else {
                      if (page <= 3) {
                        pages.push(1, 2, 3, 4, 'ellipsis', totalPages);
                      } else if (page >= totalPages - 2) {
                        pages.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                      } else {
                        pages.push(1, 'ellipsis', page - 1, page, page + 1, 'ellipsis', totalPages);
                      }
                    }

                    return pages.map((p, index) => (
                      <PaginationItem key={index}>
                        {p === 'ellipsis' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            href="#"
                            isActive={page === p}
                            onClick={(e) => { e.preventDefault(); setPage(p as number); }}
                            className={page === p ? 'bg-[#C5A880] text-white border-[#C5A880] hover:bg-[#b09672]' : ''}
                          >
                            {p}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ));
                  })()}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => { e.preventDefault(); setPage(p => Math.min(totalPages, p + 1)); }}
                      className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
