import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { translations } from '../../i18n/translations';
import { useProduct } from '../../api/client/useProducts';
import { Button } from '../../components/ui/button';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { language, addToCart, wishlist, toggleWishlist } = useAppStore();
  const t = translations[language];
  const [qty, setQty] = useState(1);
  
  const { data: product, isLoading } = useProduct(id!);

  if (isLoading) return <div className="py-32 text-center">{t.loading}</div>;
  if (!product) return <div className="py-32 text-center text-red-500">Product not found.</div>;

  const name = language === 'ar' ? product.nameAr : product.nameEn;
  const desc = language === 'ar' ? product.descAr : product.descEn;
  const ingredients = language === 'ar' ? product.ingredientsAr : product.ingredientsEn;
  const isFav = wishlist.some(p => p.id === product.id);

  return (
    <div className="container mx-auto px-4 py-12">
      <Link to="/shop" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#C5A880] mb-8 transition-colors">
        {language === 'ar' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />} العودة للمتجر
      </Link>
      
      <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-[#EAE5DF] flex flex-col lg:flex-row gap-12">
        {/* Image Gallery Mock */}
        <div className="lg:w-1/2 relative">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-[#EAE5DF] sticky top-24">
            <img src={product.image} alt={name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            <button 
              onClick={() => toggleWishlist(product)}
              className={`absolute top-6 right-6 w-12 h-12 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center transition-all ${isFav ? 'text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-white'}`}
            >
              <Heart size={24} fill={isFav ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:w-1/2 flex flex-col">
          <div className="mb-8 border-b border-gray-100 pb-8">
            <h1 className="text-4xl font-black text-[#1C1A17] mb-4 leading-tight">{name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-black text-[#C5A880]">{product.price} {t.currency}</span>
              <div className="flex items-center gap-1 bg-[#FCFAF7] px-3 py-1 rounded-full border border-[#EAE5DF]">
                <Star className="text-yellow-400 fill-yellow-400" size={16} />
                <span className="font-bold">{product.rating}</span>
              </div>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">{desc}</p>
          </div>

          <div className="space-y-6 mb-10">
            <div>
              <h3 className="font-bold text-[#1C1A17] mb-2">{t.ingredients}</h3>
              <p className="text-gray-600 leading-relaxed bg-[#FCFAF7] p-4 rounded-2xl border border-[#EAE5DF]">
                {ingredients}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-auto bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center bg-white rounded-full border border-gray-200 p-1 w-full sm:w-auto shrink-0 justify-between">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-[#111] hover:bg-gray-50 rounded-full transition-colors">
                <Minus size={20} />
              </button>
              <span className="font-black text-xl w-12 text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)} disabled={qty >= product.stock} className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-[#111] hover:bg-gray-50 rounded-full transition-colors disabled:opacity-50">
                <Plus size={20} />
              </button>
            </div>
            
            <Button 
              onClick={() => addToCart(product, qty)}
              disabled={product.stock <= 0}
              className="w-full h-14 bg-[#111111] hover:bg-[#C5A880] text-white rounded-full text-lg font-bold flex items-center justify-center gap-3 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <ShoppingBag size={22} />
              {product.stock > 0 ? t.addToCart : t.outOfStock}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
