import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/app/components/ui/button';
import { Loader2, Package2 } from 'lucide-react';

interface OrderSummaryProps {
  items: any[];
  total: number;
  deliveryFee: number;
  isProcessing: boolean;
  onSubmit: () => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  total,
  deliveryFee,
  isProcessing,
  onSubmit
}) => {
  const { t } = useTranslation();

  const finalTotal = total + deliveryFee;

  return (
    <div className="bg-background border border-border/60 text-foreground p-8 rounded-3xl sticky top-24 shadow-sm relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary opacity-5 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
      
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-6 text-foreground">{t('cart.summary')}</h3>

        <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pe-2 custom-scrollbar">
          {items.map((item) => {
            const productName = item.product?.name || '';
            const variantLabel = [item.variant?.size?.size, item.variant?.material?.material].filter(Boolean).join(' - ');
            const price = item.variant?.final_price || item.variant?.price || 0;

            return (
              <div key={item.id} className="flex gap-4 items-start text-sm border-b border-border/60 pb-4">
                <div className="flex-1">
                  <div className="font-medium mb-1 text-foreground flex items-center gap-2">
                    <Package2 size={16} className="text-primary shrink-0" />
                    <span>{productName}</span>
                  </div>
                  <div className="text-muted-foreground text-xs flex items-center gap-2">
                    {variantLabel && <span>{variantLabel}</span>}
                    {variantLabel && <span>|</span>}
                    <span className="text-muted-foreground font-medium">x{item.quantity}</span>
                  </div>
                </div>
              <div className="font-bold whitespace-nowrap text-foreground">
                {(price * item.quantity).toFixed(2)} {t('products.currency', 'SAR')}
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3 pt-4 border-t border-border/60">
        <div className="flex justify-between text-muted-foreground">
          <span>{t('cart.subtotal')}</span>
          <span>{total.toFixed(2)} {t('products.currency', 'SAR')}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>{t('cart.shipping')}</span>
          <span>{deliveryFee === 0 ? t('free', 'Free') : `${deliveryFee.toFixed(2)} ${t('products.currency', 'SAR')}`}</span>
        </div>
        <div className="flex justify-between text-xl font-black mt-4 pt-4 border-t border-border text-foreground">
          <span>{t('total')}</span>
          <span className="text-primary">{finalTotal.toFixed(2)} {t('products.currency', 'SAR')}</span>
        </div>
      </div>

      <Button
        onClick={onSubmit}
        disabled={isProcessing || items.length === 0}
        className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground h-14 rounded-xl font-bold text-lg transition-colors shadow-sm disabled:opacity-50 disabled:hover:bg-primary"
      >
        {isProcessing ? <Loader2 className="w-6 h-6 animate-spin me-2" /> : null}
        {isProcessing ? t('processingOrder') : t('placeOrder')}
      </Button>
      </div>
    </div>
  );
};
