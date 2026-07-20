import { Package, Plus } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { translations } from '../../../i18n/translations';
import { Button } from '../../ui/button';
import { useAddToCartMutation } from '@/app/api/client/useCart';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface PackageCardProps {
  pkg: any;
  triggerToast?: (msg: string) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg, triggerToast }) => {
  const { language } = useAppStore();
  const t = translations[language];
  const { mutate: addToCartApi, isPending: isAdding } = useAddToCartMutation();

  const name = language === 'ar' ? pkg.nameAr : pkg.nameEn;
  const desc = language === 'ar' ? pkg.descAr : pkg.descEn;
  const itemsStr = language === 'ar' ? pkg.itemsAr : pkg.itemsEn;

  const handleBuy = () => {
    const variantId = pkg.product_variant_id || pkg.productVariantId || pkg.variant_id;
    if (!variantId) {
      toast.error(language === 'ar' ? 'عذراً، لا يمكن تحديد خيار الباقة' : 'Variant ID missing from package');
      return;
    }

    addToCartApi({ product_variant_id: variantId, product_variant_package_id: pkg.id, quantity: 1 }, {
      onSuccess: () => {
        if (triggerToast) triggerToast(t.itemAdded || 'Added to cart');
        else toast.success(language === 'ar' ? 'تمت إضافة الباقة للسلة' : 'Package added to cart');
      },
      onError: (err: any) => {
        toast.error(err?.message || (language === 'ar' ? 'فشل إضافة الباقة للسلة' : 'Failed to add package to cart'));
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#EAE5DF] flex flex-col md:flex-row hover:shadow-xl transition-shadow duration-300">
      <div className="md:w-2/5 relative aspect-square md:aspect-auto">
        <img src={pkg.image} alt={name} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 bg-[#C5A880] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
          <Package size={14} /> باقة مميزة
        </div>
      </div>
      <div className="p-8 md:w-3/5 flex flex-col justify-center">
        <h3 className="text-2xl font-black text-[#1C1A17] mb-3">{name}</h3>
        <p className="text-gray-500 mb-6 leading-relaxed">{desc}</p>

        <div className="bg-[#FCFAF7] p-4 rounded-2xl border border-[#EAE5DF] mb-6">
          <h4 className="text-sm font-bold text-[#C5A880] mb-2">محتويات الباقة:</h4>
          <p className="font-medium text-[#1C1A17]">{itemsStr}</p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4">
          <div>
            <span className="block text-sm text-gray-500 font-medium mb-1">السعر الخاص</span>
            <span className="text-3xl font-black text-[#1C1A17]">{pkg.price} <span className="text-lg text-[#C5A880]">{t.currency}</span></span>
          </div>
          <Button onClick={handleBuy} disabled={isAdding} className="bg-[#111111] hover:bg-[#C5A880] text-white hover:text-[#111] rounded-xl px-6 h-12 flex items-center gap-2 font-bold transition-colors disabled:opacity-50">
            {isAdding ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />} {isAdding ? (language === 'ar' ? 'جاري...' : 'Adding...') : t.buyPackage}
          </Button>
        </div>
      </div>
    </div>
  );
};
