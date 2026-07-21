import React from 'react';
import { useTranslation } from 'react-i18next';
import { UseFormReturn } from 'react-hook-form';
import { CreditCard, Wallet } from 'lucide-react';

interface PaymentMethodSelectorProps {
  form: UseFormReturn<any>;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ form }) => {
  const { t } = useTranslation();

  const currentMethod = form.watch('method');

  return (
    <div className="space-y-6 mt-8">
      <h3 className="text-xl font-black text-foreground mb-4 pb-2 border-b border-border">
        {t('paymentMethod') || 'Payment Method'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label
          className={`relative border-2 rounded-2xl p-6 flex flex-col items-center gap-3 cursor-pointer transition-all duration-300 hover:shadow-lg ${currentMethod === 'cod' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-background hover:border-primary/50'}`}
        >
          <input
            type="radio"
            value="cod"
            checked={currentMethod === 'cod'}
            onChange={() => form.setValue('method', 'cod', { shouldValidate: true })}
            className="absolute top-4 end-4 accent-primary w-5 h-5"
          />
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors duration-300 ${currentMethod === 'cod' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            <Wallet size={24} />
          </div>
          <span className={`font-bold text-lg ${currentMethod === 'cod' ? 'text-primary' : 'text-muted-foreground'}`}>
            {t('cashOnDelivery')}
          </span>
          <span className="text-sm text-gray-400 text-center">
            {t('codDesc')}
          </span>
        </label>

     
        <div 
          className="relative border-2 border-dashed border-border bg-background rounded-2xl p-6 flex flex-col items-center gap-3 cursor-not-allowed opacity-60"
        >
          <div className="w-12 h-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center mb-2">
            <CreditCard size={24} />
          </div>
          <span className="font-bold text-lg text-gray-500">
            {t('creditCardMethod')}
          </span>
          <span className="text-sm text-gray-400 text-center">
            {t('comingSoon')}
          </span>
        </div>
      </div>
    </div>
  );
};
