import React from 'react';
import { useTranslation } from 'react-i18next';
import { UseFormReturn } from 'react-hook-form';
import { CreditCard, Banknote } from 'lucide-react';

interface PaymentMethodSelectorProps {
  form: UseFormReturn<any>;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ form }) => {
  const { t } = useTranslation();

  const currentMethod = form.watch('method');

  return (
    <div className="space-y-6 mt-8">
      <h3 className="text-xl font-bold text-[#1C1A17] mb-4 pb-2 border-b border-gray-100">
        {t('paymentMethod') || 'Payment Method'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label
          className={`relative border-2 rounded-2xl p-6 flex flex-col items-center gap-3 cursor-pointer transition-all duration-300 hover:shadow-md
            ${currentMethod === 'cod' ? 'border-[#C5A880] bg-[#FCFAF7] shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}
        >
          <input
            type="radio"
            value="cod"
            {...form.register('method')}
            className="absolute top-4 end-4 accent-[#C5A880] w-5 h-5"
          />
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors duration-300 ${currentMethod === 'cod' ? 'bg-[#C5A880] text-white' : 'bg-gray-100 text-gray-500'}`}>
            <Banknote size={24} />
          </div>
          <span className={`font-bold text-lg ${currentMethod === 'cod' ? 'text-[#C5A880]' : 'text-gray-700'}`}>
            {t('cashOnDelivery')}
          </span>
          <span className="text-sm text-gray-400 text-center">
            {t('codDesc')}
          </span>
        </label>

        {/* Placeholder for future payment methods like Credit Card */}
        <label
          className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center gap-3 cursor-not-allowed opacity-60"
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-2">
            <CreditCard size={24} />
          </div>
          <span className="font-bold text-lg text-gray-500">
            {t('creditCardMethod')}
          </span>
          <span className="text-sm text-gray-400 text-center">
            {t('comingSoon')}
          </span>
        </label>
      </div>
    </div>
  );
};
