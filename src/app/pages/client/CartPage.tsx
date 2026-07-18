import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/app/store/useAppStore';
import { Button } from '@/app/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart, updateCartQty, removeFromCart } = useAppStore();

  const subtotal = cart.reduce((sum, item) => sum + ((item.product.price || 0) * item.quantity), 0);
  const total = subtotal; // Assuming no logic for shipping or fixed discounts for now

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <ShoppingBag className="w-24 h-24 text-muted-foreground mb-6" />
        <h2 className="text-2xl font-bold text-foreground mb-4">{t('cart.empty_title', 'Your cart is empty')}</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          {t('cart.empty_message', "Looks like you haven't added any delicious baked goods to your cart yet.")}
        </p>
        <Button onClick={() => navigate('/shop')} className="rounded-full px-8">
          {t('cart.continue_shopping', 'Continue Shopping')}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:px-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">{t('cart.title', 'Shopping Cart')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={`${item.product.id}-${item.isPackage}`} className="flex flex-col sm:flex-row gap-4 p-4 border border-border rounded-2xl bg-card">
              <div className="w-full sm:w-32 h-32 bg-muted rounded-xl flex-shrink-0 overflow-hidden relative">
                <img
                  src={item.product.image || "https://placehold.co/400?text=Product"}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col flex-grow justify-between py-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{item.product.name}</h3>
                    {item.isPackage && <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-md">{t('cart.package', 'Package')}</span>}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id, item.isPackage)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex justify-between items-end mt-4 sm:mt-0">
                  <div className="flex items-center gap-3 border border-border rounded-full p-1">
                    <button
                      onClick={() => updateCartQty(item.product.id, item.quantity - 1, item.isPackage)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-foreground transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center font-medium text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQty(item.product.id, item.quantity + 1, item.isPackage)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-foreground transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-lg text-foreground">${((item.product.price || 0) * item.quantity).toFixed(2)}</p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-muted-foreground">${(item.product.price || 0).toFixed(2)} {t('cart.each', 'each')}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-foreground mb-6">{t('cart.summary', 'Order Summary')}</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-muted-foreground">
                <span>{t('cart.subtotal', 'Subtotal')}</span>
                <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{t('cart.shipping', 'Shipping')}</span>
                <span className="font-medium text-foreground">{t('cart.calculated_at_checkout', 'Calculated at checkout')}</span>
              </div>
              <div className="border-t border-border pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-foreground">{t('cart.total', 'Total')}</span>
                  <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Button onClick={() => navigate('/checkout')} className="w-full rounded-full h-12 text-lg">
              {t('cart.checkout_button', 'Proceed to Checkout')}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              {t('cart.secure_checkout', 'Secure encrypted checkout')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
