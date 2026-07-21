import React, { useState } from 'react';
import { ShoppingBag, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/app/store/useAppStore';
import { Button } from '@/app/components/ui/button';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { FavoriteButton } from './FavoriteButton';

interface ProductCardProps {
  product: any;
  triggerToast?: (msg: string) => void;
  layout?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid' }) => {
  const { language } = useAppStore();
  const { t } = useTranslation();

  if (!product) return null;

  const name = language === 'ar' ? (product.nameAr || product.name) : (product.nameEn || product.name);
  const desc = language === 'ar' ? (product.descAr || product.body) : (product.descEn || product.body);
  let displayPrice = product.price;
  let displayStock = product.stock;

  if ((displayPrice === null || displayPrice === undefined) && product.available_options?.length > 0) {
    const firstOption = product.available_options[0];
    if (firstOption.available_sizes?.length > 0) {
      displayPrice = firstOption.available_sizes[0].final_price ?? firstOption.available_sizes[0].price;
      displayStock = firstOption.available_sizes[0].stock_quantity;
    }
  }

  const stock = displayStock ?? 10; // Fallback stock
  const price = displayPrice ?? 0; // Fallback price
  const [imgError, setImgError] = useState(false);
  const imgSrc = product.image && !imgError ? product.image : null;

  return (
    <Link
      to={`/product/${product.id}`}
      className={`group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex ${layout === 'list' ? 'flex-row min-h-[140px] md:min-h-[160px] p-2 md:p-3 gap-3 md:gap-4' : 'flex-col h-full overflow-hidden'} relative`}
    >
      <div className={`relative ${layout === 'list' ? 'w-[120px] md:w-[160px] shrink-0 rounded-2xl' : 'aspect-[4/3] w-full'} overflow-hidden bg-[#FCFAF7] border border-[#EAE5DF]/50 flex items-center justify-center`}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        ) : (
          <img
            src="/images/placeholder.png"
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80"
            loading="lazy"
          />
        )}
        <div className={`absolute ${layout === 'list' ? 'top-2 start-2' : 'top-3 end-3'} flex flex-col gap-2 z-10`}>
          <FavoriteButton 
            product={product} 
            className="w-9 h-9 shadow-sm" 
            iconSize={18} 
          />
        </div>
        {stock <= 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
            <span className="bg-[#111111] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
              {t('productCard.outOfStock', 'Out of Stock')}
            </span>
          </div>
        )}
      </div>

      <div className={`${layout === 'list' ? 'py-1 pe-1 md:py-2 md:pe-2' : 'p-4 md:p-5'} flex flex-col flex-grow justify-between`}>
        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
            <h3 className="font-bold text-[#1C1A17] text-base md:text-lg leading-tight group-hover:text-[#C5A880] transition-colors line-clamp-2">{name}</h3>
            <span className="font-black text-[#C5A880] whitespace-nowrap bg-[#FCFAF7] px-2 py-1 rounded-lg border border-[#EAE5DF] text-sm md:text-base self-start sm:self-auto">
              {Number(price).toFixed(2)} {t('productCard.currency', 'SAR')}
            </span>
          </div>
          <p className={`text-gray-500 text-xs md:text-sm mb-4 leading-relaxed ${layout === 'list' ? 'line-clamp-2 sm:line-clamp-3' : 'line-clamp-2'}`}>{desc}</p>
        </div>

        <div className={`flex items-center w-full pt-3 border-t border-gray-100 mt-auto justify-end`}>
          <Button
            disabled={stock <= 0}
            className={`flex items-center justify-center gap-2 rounded-full h-10 px-4 transition-all shadow-md group-hover:shadow-lg disabled:opacity-50 disabled:hover:text-white bg-[#111111] hover:bg-[#C5A880] text-white hover:text-[#111111] disabled:hover:bg-[#111111] ${layout === 'list' ? 'w-full sm:w-auto min-w-[140px]' : 'w-full'}`}
          >
            <ShoppingBag size={18} />
            <span>{t('productCard.buyNow')}</span>
          </Button>
        </div>
      </div>
    </Link>
  );
};
