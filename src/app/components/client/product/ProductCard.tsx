import React, { useState } from 'react';
import { ShoppingBag, Heart, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/app/store/useAppStore';
import { Button } from '@/app/components/ui/button';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useAddToCartMutation } from '@/app/api/client/useCart';
import { Loader2 } from 'lucide-react';

interface ProductCardProps {
  product: any;
  triggerToast?: (msg: string) => void;
  layout?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, triggerToast, layout = 'grid' }) => {
  const { language, toggleWishlist, wishlist, cart } = useAppStore();
  const { mutate: addToCartApi, isPending: isAdding } = useAddToCartMutation();
  const { t } = useTranslation();

  if (!product) return null;

  const isFav = wishlist.some(p => p.id === product?.id);
  const isInCart = cart.some(c => c.product.id === product.id && !c.isPackage);
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    // Find the default variant ID
    let variantId = product?.variants?.[0]?.id;
    if (!variantId && product?.available_options?.length > 0) {
      const firstOption = product.available_options[0];
      if (firstOption?.available_sizes?.length > 0) {
        variantId = firstOption.available_sizes[0].variant_id;
      }
    }

    if (!variantId) {
      toast.error(t('productCard.noVariant', 'Product variant not available'));
      return;
    }

    addToCartApi({ product_variant_id: variantId, quantity: 1 }, {
      onSuccess: () => {
        const msg = t('productCard.itemAdded', 'Added to cart');
        if (triggerToast) triggerToast(msg);
        else toast.success(msg);
      },
      onError: (err: any) => {
        toast.error(err?.message || t('productCard.addFailed', 'Failed to add to cart'));
      }
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product);
    if (isFav) toast.success(t('productCard.removedFromWishlist', 'Removed from wishlist'));
    else toast.success(t('productCard.addedToWishlist', 'Added to wishlist'));
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className={`group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex ${layout === 'list' ? 'flex-row h-48' : 'flex-col h-full'} relative`}
    >
      <div className={`relative ${layout === 'list' ? 'w-1/3 min-w-[150px] shrink-0' : 'aspect-[4/3] w-full'} overflow-hidden bg-primary/5 flex items-center justify-center`}>
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
        <div className={`absolute top-3 ${layout === 'list' ? 'ltr:left-3 rtl:right-3' : 'ltr:right-3 rtl:left-3'} flex flex-col gap-2 z-10`}>
          <Button
            type="button"
            variant={"ghost"}
            onClick={handleToggleWishlist}
            className={`w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center transition-all ${isFav ? 'text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-white'}`}
          >
            <Heart size={18} fill={isFav ? "currentColor" : "none"} />
          </Button>
        </div>
        {stock <= 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
            <span className="bg-[#111111] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
              {t('productCard.outOfStock', 'Out of Stock')}
            </span>
          </div>
        )}
      </div>

      <div className={`p-5 flex flex-col flex-grow ${layout === 'list' ? 'justify-center' : ''}`}>
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-bold text-[#1C1A17] text-base md:text-lg leading-tight group-hover:text-[#C5A880] transition-colors line-clamp-2">{name}</h3>
          <span className="font-black text-[#C5A880] whitespace-nowrap bg-[#FCFAF7] px-2 py-1 rounded-lg border border-[#EAE5DF] text-sm md:text-base">
            {Number(price).toFixed(2)} {t('productCard.currency', 'SAR')}
          </span>
        </div>
        <p className={`text-gray-500 text-xs md:text-sm mb-4 leading-relaxed flex-grow ${layout === 'list' ? 'line-clamp-3' : 'line-clamp-2'}`}>{desc}</p>

        <div className={`flex items-center w-full justify-between pt-4 border-t border-gray-100 mt-auto ${layout === 'list' ? 'md:w-1/2' : ''}`}>
          <Button
            onClick={handleAddToCart}
            disabled={stock <= 0 || isAdding}
            className={`rounded-full w-full h-10 p-0 transition-all shadow-md group-hover:shadow-lg disabled:opacity-50 disabled:hover:text-white ${isInCart
              ? 'bg-green-600 hover:bg-green-700 text-white disabled:hover:bg-green-600'
              : 'bg-[#111111] hover:bg-[#C5A880] text-white hover:text-[#111111] disabled:hover:bg-[#111111]'
              }`}
          >
            {isAdding ? <Loader2 className="animate-spin" size={18} /> : (isInCart ? <CheckCircle2 size={18} /> : <ShoppingBag size={18} />)}
            {isAdding ? t('productCard.adding', 'Adding...') : (isInCart
              ? t('productCard.inCart', 'In Cart')
              : t('productCard.addToCart', 'Add to cart'))
            }
          </Button>
        </div>
      </div>
    </Link>
  );
};
