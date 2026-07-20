import React from 'react';
import { toast } from 'sonner';
import { ShoppingBag, CheckCircle2 } from 'lucide-react';

export const showAddToCartSuccessToast = (t: any) => {
  toast.custom((t_id) => (
    <div className="bg-white border border-[#EAE5DF] p-4 sm:p-5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex items-center gap-4 w-full sm:w-[400px] max-w-[90vw] relative overflow-hidden pointer-events-auto">
      {/* Decorative Gold Glow */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#C5A880] opacity-[0.15] rounded-full blur-2xl pointer-events-none"></div>
      
      <div className="bg-[#FCFAF7] border border-[#EAE5DF] text-[#C5A880] p-3 rounded-xl shrink-0 flex items-center justify-center">
        <ShoppingBag size={24} strokeWidth={2.5} />
      </div>
      
      <div className="flex flex-col relative z-10">
        <h3 className="font-bold text-[#1C1A17] text-base mb-1 flex items-center gap-1.5">
          {t?.('itemAddedSuccessTitle') || 'تمت الإضافة بنجاح!'}
          <CheckCircle2 size={16} className="text-green-500 shrink-0" />
        </h3>
        <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
          {t?.('itemAddedSuccessDesc') || 'تمت إضافة المنتج إلى سلة المشتريات الخاصة بك.'}
        </p>
      </div>
    </div>
  ), { duration: 3000, position: 'top-center' });
};
