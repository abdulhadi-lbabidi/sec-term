import React, { useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { translations } from '../../i18n/translations';
import { useProducts } from '../../api/client/useProducts';
import { useCategories } from '../../api/client/useCategories';
import { ProductCard } from '../../components/client/product/ProductCard';

export default function ShopPage() {
  const { language } = useAppStore();
  const t = translations[language];
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategoryId = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  const { data: products = [], isLoading: loadingProducts } = useProducts();
  const { data: categories = [], isLoading: loadingCategories } = useCategories();

  // Client-side filtering as a fallback/enhancement
  const filteredProducts = products.filter((p: any) => {
    const matchesCategory = activeCategoryId === 'all' || p.category === activeCategoryId;
    const searchString = language === 'ar' ? p.nameAr : p.nameEn;
    const matchesSearch = searchString.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a: any, b: any) => {
    if (sortBy === 'priceAsc') return a.price - b.price;
    if (sortBy === 'priceDesc') return b.price - a.price;
    return b.rating - a.rating;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-1/4 shrink-0 space-y-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#EAE5DF]">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Filter size={20} className="text-[#C5A880]" />
              {t.filterCategory}
            </h3>
            <div className="space-y-2">
              {loadingCategories ? (
                <div className="text-gray-500">{t.loading}</div>
              ) : (
                categories.map((cat: any) => (
                  <button
                    key={cat.id}
                    onClick={() => setSearchParams(prev => { prev.set('category', cat.id); return prev; })}
                    className={`w-full text-start px-4 py-3 rounded-xl transition-all ${
                      activeCategoryId === cat.id 
                      ? 'bg-[#1C1A17] text-white font-bold' 
                      : 'hover:bg-[#FCFAF7] text-gray-600'
                    }`}
                  >
                    {language === 'ar' ? cat.nameAr : cat.nameEn}
                  </button>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="relative w-full md:w-96">
              <Search className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400`} size={20} />
              <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-white border border-[#EAE5DF] rounded-2xl h-14 ${language === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all`}
              />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-gray-500 text-sm whitespace-nowrap">{t.sortBy}:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-[#EAE5DF] rounded-xl h-12 px-4 focus:outline-none focus:border-[#C5A880]"
              >
                <option value="rating">{t.sortRating}</option>
                <option value="priceAsc">{t.sortPriceAsc}</option>
                <option value="priceDesc">{t.sortPriceDesc}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loadingProducts ? (
              <div className="col-span-full py-12 text-center text-gray-500 font-bold">{t.loading}</div>
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-500 text-lg">لم نجد ما تبحث عنه، ربما نفد من الفرن!</p>
              </div>
            ) : (
              filteredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
