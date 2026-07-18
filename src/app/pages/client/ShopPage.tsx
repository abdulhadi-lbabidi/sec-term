import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { translations } from '../../i18n/translations';
import { useProducts } from '../../api/client/useProducts';
import { ProductCard } from '../../components/client/product/ProductCard';
import { ProductSkeleton } from '../../components/client/product/ProductSkeleton';
import { ProductFilters } from '../../components/client/product/ProductFilters';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/app/components/ui/pagination';

export default function ShopPage() {
  const { language } = useAppStore();
  const t = translations[language];
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    category_id: searchParams.get('category_id') || 'all',
    size_id: searchParams.get('size_id') || 'all',
    min_price: Number(searchParams.get('min_price')) || 0,
    max_price: Number(searchParams.get('max_price')) || 1000,
    search: searchParams.get('search') || '',
  });

  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const perPage = 12;

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category_id !== 'all') params.set('category_id', filters.category_id);
    if (filters.size_id !== 'all') params.set('size_id', filters.size_id);
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
  if (filters.min_price > 0) queryPayload['filter[min_price]'] = filters.min_price;
  if (filters.max_price < 1000) queryPayload['filter[max_price]'] = filters.max_price;

  const { data, isLoading: loadingProducts, isFetching } = useProducts(queryPayload);

  const products = data?.products || [];
  const meta = data?.meta;
  const totalPages = meta?.last_page || 1;

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset page on filter change
  };

  const handleClearFilters = () => {
    setFilters({
      category_id: 'all',
      size_id: 'all',
      min_price: 0,
      max_price: 1000,
      search: '',
    });
    setPage(1);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Sidebar Filters */}
        <aside className="w-full md:w-1/4 shrink-0">
          <ProductFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(loadingProducts || isFetching) ? (
              Array.from({ length: perPage }).map((_, i) => <ProductSkeleton key={i} />)
            ) : products.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-500 text-lg">{language === 'ar' ? 'لم نجد ما تبحث عنه، ربما نفد من الفرن!' : 'No products found!'}</p>
              </div>
            ) : products.map((product: any) => <ProductCard key={product.id} product={product} />)
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

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href="#"
                        isActive={page === p}
                        onClick={(e) => { e.preventDefault(); setPage(p); }}
                        className={page === p ? 'bg-[#C5A880] text-white border-[#C5A880] hover:bg-[#b09672]' : ''}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

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
