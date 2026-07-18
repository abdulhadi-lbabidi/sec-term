import React from 'react';
import { ShoppingBag, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../../store/useAppStore';
import { translations } from '../../../i18n/translations';
import { Button } from '../../ui/button';

interface ProductCardProps {
  product: any;
  triggerToast?: (msg: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, triggerToast }) => {
  const { language, addToCart, toggleWishlist, wishlist } = useAppStore();
  const t = translations[language];
  
  const isFav = wishlist.some(p => p.id === product.id);
  const name = language === 'ar' ? product.nameAr : product.nameEn;
  const desc = language === 'ar' ? product.descAr : product.descEn;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    if (triggerToast) triggerToast(t.itemAdded);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full relative">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <img 
          src={product.image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button 
            onClick={handleToggleWishlist}
            className={`w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center transition-all ${isFav ? 'text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-white'}`}
          >
            <Heart size={18} fill={isFav ? "currentColor" : "none"} />
          </button>
        </div>
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
            <span className="bg-[#111111] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
              {t.outOfStock}
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-bold text-[#1C1A17] text-lg leading-tight group-hover:text-[#C5A880] transition-colors">{name}</h3>
          <span className="font-black text-[#C5A880] whitespace-nowrap bg-[#FCFAF7] px-2 py-1 rounded-lg border border-[#EAE5DF]">
            {product.price} {t.currency}
          </span>
        </div>
        
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed flex-grow">{desc}</p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div className="text-xs text-gray-400 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> {t.inStock}
          </div>
          
          <Button 
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="rounded-full w-10 h-10 p-0 bg-[#111111] hover:bg-[#C5A880] text-white hover:text-[#111111] transition-all shadow-md group-hover:shadow-lg disabled:opacity-50 disabled:hover:bg-[#111111] disabled:hover:text-white"
          >
            <ShoppingBag size={18} />
          </Button>
        </div>
      </div>
    </Link>
  );
};
