import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/useAppStore';
import { Button } from '../../ui/button';
import { Skeleton } from '../../ui/skeleton';
import { useCartQuery, useUpdateCartItemMutation, useRemoveCartItemMutation, useClearCartMutation } from '@/app/api/client/useCart';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { language } = useAppStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: cart, isLoading } = useCartQuery();
  const { mutate: updateQty, isPending: isUpdating } = useUpdateCartItemMutation();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveCartItemMutation();
  const { mutate: clearCart, isPending: isClearing } = useClearCartMutation();

  const items = cart?.items || [];
  const total = cart?.total_price || 0;
  const totalItemsCount = items.reduce((acc: any, c: any) => acc + c.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />
      <div className="fixed top-0 bottom-0 end-0 w-full max-w-md bg-[#FCFAF7] z-50 shadow-2xl flex flex-col transition-transform duration-300 transform translate-x-0">

        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
          <h2 className="text-xl font-black flex items-center gap-2">
            <ShoppingBag className="text-[#C5A880]" />
            {t('cart.title')}
            <span className="bg-[#111111] text-white text-xs px-2 py-1 rounded-full ms-2">
              {totalItemsCount}
            </span>
          </h2>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <Button variant="ghost" size="icon" onClick={() => clearCart()} disabled={isClearing} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full bg-gray-50 hover:bg-gray-100">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 bg-white p-4 rounded-2xl border border-gray-50 shadow-sm">
                  <Skeleton className="w-24 h-24 rounded-xl shrink-0" />
                  <div className="flex flex-col justify-between flex-1">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-24 rounded-full mt-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-60">
              <ShoppingBag size={80} className="text-gray-300" />
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{t('cart.empty_title')}</h3>
                <p className="text-gray-500 max-w-xs">{t('cart.empty_message')}</p>
              </div>
              <Button onClick={() => { onClose(); navigate('/shop'); }} variant="outline" className="mt-4 border-[#C5A880] text-[#C5A880] hover:bg-[#C5A880] hover:text-white">
                {t('cart.continue_shopping')}
              </Button>
            </div>
          ) : (
            items.map((item: any) => {
              const productName = item.product?.name || '';
              const variantLabel = [item.variant?.size?.size, item.variant?.material?.material].filter(Boolean).join(' - ');
              const displayName = variantLabel ? `${productName} (${variantLabel})` : productName;
              const productImage = item.variant?.image || item.product?.image || '/placeholder-food.jpg';
              const price = item.variant?.final_price || item.variant?.price || 0;

              return (
                <div key={item.id} className="flex gap-4 bg-white p-4 rounded-2xl border border-gray-50 shadow-sm relative group">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                    <img src={productImage} alt={displayName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="font-bold text-[#1C1A17] text-sm line-clamp-2 pe-6">{displayName}</h4>
                      <div className="text-[#C5A880] font-black mt-1">{price.toFixed(2)} {t('products.currency', 'SAR')}</div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-full px-1 border border-gray-100">
                        <button
                          disabled={item.quantity <= 1 || isUpdating}
                          onClick={() => updateQty({ id: item.id, quantity: item.quantity - 1 })}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-50 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                        <button
                          disabled={isUpdating}
                          onClick={() => updateQty({ id: item.id, quantity: item.quantity + 1 })}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-50 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    disabled={isRemoving}
                    onClick={() => removeItem(item.id)}
                    className="absolute top-4 start-4 w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white disabled:opacity-50"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500 font-medium">{t('cart.subtotal')}</span>
              <span className="text-2xl font-black text-[#1C1A17]">{total.toFixed(2)} {t('products.currency', 'SAR')}</span>
            </div>
            <Button
              onClick={() => {
                onClose();
                navigate('/checkout');
              }}
              className="w-full h-14 bg-[#111111] hover:bg-[#C5A880] hover:text-[#111] text-white rounded-xl text-lg font-bold flex items-center justify-center gap-2 transition-all"
            >
              {t('cart.checkout_button')}
              {language === 'ar' ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
