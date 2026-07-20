import { Button } from '@/app/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCartQuery, useUpdateCartItemMutation, useRemoveCartItemMutation } from '@/app/api/client/useCart';
import { useProfile } from '@/app/api/client/useProfile';

export default function CartPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: cartData, isLoading } = useCartQuery();
  const { mutate: updateQty, isPending: isUpdating } = useUpdateCartItemMutation();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveCartItemMutation();
  console.log(cartData);
  const { data: profileData }: any = useProfile();

  const items = Array.isArray(cartData) ? cartData : (cartData?.items || []);
  const subtotal = items.reduce((sum: number, item: any) => sum + ((item.variant?.final_price || item.variant?.price || 0) * item.quantity), 0);
  const total = subtotal; // Assuming no logic for shipping or fixed discounts for now

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-[#C5A880] animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <ShoppingBag className="w-24 h-24 text-muted-foreground mb-6" />
        <h2 className="text-2xl font-bold text-foreground mb-4">{t('cart.empty_title')}</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          {t('cart.empty_message')}
        </p>
        <Button onClick={() => navigate('/shop')} className="rounded-full px-8">
          {t('cart.continue_shopping')}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:px-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">{t('cart.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item: any) => {
            const productName = item.product?.name || '';
            const variantLabel = [item.variant?.size?.size, item.variant?.material?.material].filter(Boolean).join(' - ');
            const displayName = variantLabel ? `${productName} (${variantLabel})` : productName;
            const productImage = item.variant?.image || item.product?.image || "https://placehold.co/400?text=Product";
            const price = item.variant?.final_price || item.variant?.price || 0;

            return (
              <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-border rounded-2xl bg-card">
                <div className="w-full sm:w-32 h-32 bg-muted rounded-xl flex-shrink-0 overflow-hidden relative">
                  <img
                    src={productImage}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col flex-grow justify-between py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{displayName}</h3>
                      {item.isPackage && <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-md">{t('cart.package')}</span>}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={isRemoving}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1 disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex justify-between items-end mt-4 sm:mt-0">
                    <div className="flex items-center gap-3 border border-border rounded-full p-1">
                      <button
                        onClick={() => updateQty({ id: item.id, quantity: item.quantity - 1 })}
                        disabled={item.quantity <= 1 || isUpdating}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-foreground transition-colors disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center font-medium text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQty({ id: item.id, quantity: item.quantity + 1 })}
                        disabled={isUpdating}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-foreground transition-colors disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-end">
                      <p className="font-bold text-lg text-foreground">{(price * item.quantity).toFixed(2)} {t('products.currency', 'SAR')}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-muted-foreground">{price.toFixed(2)} {t('products.currency', 'SAR')}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-foreground mb-6">{t('cart.summary')}</h2>

            <div className="space-y-4 mb-6">
              <div className="space-y-3 pb-4 border-b border-border">
                {items.map((item: any) => {
                  const productName = item.product?.name || '';
                  const variantLabel = [item.variant?.size?.size, item.variant?.material?.material].filter(Boolean).join(' - ');
                  const price = item.variant?.final_price || item.variant?.price || 0;

                  return (
                    <div key={item.id} className="flex justify-between items-start text-sm pb-3 border-b border-border/50 last:border-0 last:pb-0">
                      <div className="flex-1">
                        <div className="font-medium text-foreground mb-1">- {productName}</div>
                        <div className="text-muted-foreground text-xs flex items-center gap-2">
                          {variantLabel && <span>{variantLabel}</span>}
                          {variantLabel && <span>|</span>}
                          <span className="text-primary font-medium">x{item.quantity}</span>
                        </div>
                      </div>
                      <span className="text-foreground font-medium whitespace-nowrap mt-1">
                        {(price * item.quantity).toFixed(2)} {t('products.currency', 'SAR')}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between text-muted-foreground pt-2">
                <span>{t('cart.subtotal')}</span>
                <span className="font-medium text-foreground">{subtotal.toFixed(2)} {t('products.currency', 'SAR')}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{t('cart.shipping')}</span>
                <span className="font-medium text-foreground">...</span>
              </div>
              <div className="border-t border-border pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-foreground">{t('cart.total')}</span>
                  <span className="text-2xl font-bold text-primary">{total.toFixed(2)} {t('products.currency', 'SAR')}</span>
                </div>
              </div>
            </div>

            <Button onClick={() => navigate(`/checkout?id=${profileData.cart_id}`)} className="w-full rounded-full h-12 text-lg bg-[#111111] hover:bg-[#C5A880] text-white">
              {t('cart.checkout_button')}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              {t('cart.secure_checkout')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
