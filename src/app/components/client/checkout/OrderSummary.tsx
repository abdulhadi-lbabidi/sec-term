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
    <div className="bg-[#1C1A17] text-white p-8 rounded-3xl sticky top-24 shadow-2xl">
      <h3 className="text-xl font-bold mb-6 text-[#C5A880]">{t('cart.summary')}</h3>

      <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pe-2 custom-scrollbar">
        {items.map((item) => {
          const productName = item.product?.name || '';
          const variantLabel = [item.variant?.size?.size, item.variant?.material?.material].filter(Boolean).join(' - ');
          const price = item.variant?.final_price || item.variant?.price || 0;

          return (
            <div key={item.id} className="flex gap-4 items-start text-sm border-b border-gray-800 pb-4">
              <div className="flex-1">
                <div className="font-medium mb-1 text-white"><Package2 />{productName}</div>
                <div className="text-gray-400 text-xs flex items-center gap-2">
                  {variantLabel && <span>{variantLabel}</span>}
                  {variantLabel && <span>|</span>}
                  <span className="text-[#C5A880] font-medium">x{item.quantity}</span>
                </div>
              </div>
              <div className="font-bold whitespace-nowrap text-[#C5A880]">
                {(price * item.quantity).toFixed(2)} {t('products.currency', 'SAR')}
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-800">
        <div className="flex justify-between text-gray-400">
          <span>{t('cart.subtotal')}</span>
          <span>{total.toFixed(2)} {t('products.currency', 'SAR')}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>{t('cart.shipping')}</span>
          <span>{deliveryFee === 0 ? t('free', 'Free') : `${deliveryFee.toFixed(2)} ${t('products.currency', 'SAR')}`}</span>
        </div>
        <div className="flex justify-between text-xl font-black mt-4 pt-4 border-t border-gray-800 text-white">
          <span>{t('total')}</span>
          <span className="text-[#C5A880]">{finalTotal} {t('currency')}</span>
        </div>
      </div>

      <Button
        onClick={onSubmit}
        disabled={isProcessing || items.length === 0}
        className="w-full mt-8 bg-[#C5A880] hover:bg-white text-[#111] h-14 rounded-xl font-bold text-lg transition-colors shadow-[0_0_20px_rgba(197,168,128,0.2)] disabled:opacity-50 disabled:hover:bg-[#C5A880]"
      >
        {isProcessing ? <Loader2 className="w-6 h-6 animate-spin me-2" /> : null}
        {isProcessing ? t('processingOrder') : t('placeOrder')}
      </Button>
    </div>
  );
};
