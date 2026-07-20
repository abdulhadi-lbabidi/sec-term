import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PartyPopper } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '@/app/store/useAppStore';
import { useCartQuery } from '@/app/api/client/useCart';
import { Button } from '@/app/components/ui/button';
import { CheckoutForm } from '@/app/components/client/checkout/CheckoutForm';
import { Skeleton } from '@/app/components/ui/skeleton';

export default function CheckoutPage() {
  const { language } = useAppStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: cartData, isLoading: isCartLoading } = useCartQuery();

  const items = Array.isArray(cartData) ? cartData : (cartData?.items || []);

  const handleSuccess = () => {
    toast.custom((t_id) => (
      <div className="bg-white border border-[#EAE5DF] p-4 sm:p-5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex items-center gap-4 w-full sm:w-[400px] max-w-[90vw] relative overflow-hidden pointer-events-auto">
        {/* Decorative Gold Glow */}
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#C5A880] opacity-[0.15] rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="bg-[#FCFAF7] border border-[#EAE5DF] text-[#C5A880] p-3 rounded-xl shrink-0 flex items-center justify-center">
          <PartyPopper size={24} strokeWidth={2.5} />
        </div>
        
        <div className="flex flex-col relative z-10">
          <h3 className="font-bold text-[#1C1A17] text-base mb-1 flex items-center gap-1.5">
            {t('orderSuccessTitle') || 'تم الطلب بنجاح!'}
            <span className="text-[#C5A880]">🎉</span>
          </h3>
          <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
            {t('orderSuccessDesc') || 'شكراً لك. سيتم تحويلك إلى صفحة طلباتي الآن...'}
          </p>
        </div>
      </div>
    ), { duration: 3000, position: 'top-center' });

    setTimeout(() => {
      navigate('/orders');
    }, 2500);
  };

  if (isCartLoading) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20 min-h-screen">
        <Skeleton className="h-10 w-48 mb-10 mx-auto lg:mx-0" />
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          <div className="w-full lg:w-2/3 space-y-8">
            <div className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm space-y-6">
              <Skeleton className="h-6 w-32 mb-6" />
              <Skeleton className="h-12 w-full rounded-2xl" />
              <Skeleton className="h-12 w-full rounded-2xl" />
              <Skeleton className="h-12 w-full rounded-2xl" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full rounded-2xl" />
                <Skeleton className="h-12 w-full rounded-2xl" />
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-gray-50 rounded-3xl p-6 md:p-8 border border-gray-100 sticky top-24">
              <Skeleton className="h-6 w-40 mb-6" />
              <div className="space-y-4 mb-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <Skeleton className="h-16 w-16 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-6 w-full mt-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-3xl font-black mb-4 text-[#1C1A17]">{t('emptyCartTitle') || 'سلتك فارغة'}</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          {language === 'ar' ? 'ليس لديك أي منتجات في السلة حالياً. استكشف منتجاتنا وأضف ما يعجبك!' : 'Your cart is currently empty. Explore our products and add what you love!'}
        </p>
        <Button onClick={() => navigate('/shop')} className="bg-[#111111] text-white hover:bg-[#C5A880] h-12 px-8 rounded-full font-bold transition-colors">
          {t('shopNow') || 'تسوق الآن'}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 min-h-screen">
      <h1 className="text-4xl font-black mb-10 text-[#1C1A17] text-center lg:text-start">
        {t('checkoutTitle') || 'إتمام الطلب'}
      </h1>

      <CheckoutForm cart={cartData} onSuccess={handleSuccess} />
    </div>
  );
}
