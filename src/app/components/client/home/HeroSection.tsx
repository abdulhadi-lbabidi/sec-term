import { Link } from 'react-router-dom';
import { useAppStore } from '@/app/store/useAppStore';
import { ArrowRight, ArrowLeft, Croissant, Coffee, Cake, ShoppingBag } from 'lucide-react';
import { Category } from '@/lib/types/api.types';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export interface HeroSectionProps {
  className?: string;
  topCategories?: Category[];
  topProducts?: any[];
}

export const HeroSection = ({ className, topCategories, topProducts }: HeroSectionProps) => {
  const { language } = useAppStore();
  const { t } = useTranslation();

  const cat1 = topCategories?.[0];
  const cat2 = topCategories?.[1];

  return (
    <section className={cn("w-full min-h-[85vh] py-6 px-4 md:px-6 flex flex-col justify-center", className)}>
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-6 max-w-[2400px] mx-auto min-h-[80vh]">

 
        <div className="md:col-span-2 md:row-span-2 relative rounded-[2.5rem] overflow-hidden group shadow-lg flex flex-col justify-end p-8 md:p-12 min-h-[350px] md:min-h-[450px]">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-[15s] group-hover:scale-110"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&q=80&w=1920')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-0"></div>

          <div className="relative z-10 text-white w-full max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-4 md:mb-6 drop-shadow-md">
              {t('heroTitle')}
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed font-light mb-8 drop-shadow">
              {t('heroSubtitle')}
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 active:scale-95 shadow-xl w-fit backdrop-blur-md border border-primary/50"
            >
              <ShoppingBag className="w-5 h-5" />
              {t('shopNow')}
            </Link>
          </div>
        </div>

    
        <Link to={`/shop?category_id=${cat1?.id || ''}`} className="md:col-span-1 md:row-span-1 relative rounded-[2.5rem] overflow-hidden group shadow-md min-h-[250px] flex flex-col justify-end p-6 cursor-pointer">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-[10s] group-hover:scale-110"
            style={{ backgroundImage: `url('${cat1?.image || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800'}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10 z-0"></div>

          <div className="relative z-10 text-white flex items-center justify-between">
            <div>
              <div className="bg-background/80 p-3 rounded-2xl w-fit mb-3 shadow-sm backdrop-blur-md inline-block">
                <Croissant className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">{(language === 'ar' ? ((cat1 as any)?.nameAr || cat1?.name) : ((cat1 as any)?.nameEn || cat1?.name)) || t('hotPastries')}</h3>
              <p className="text-sm text-white/80 font-light">{(language === 'ar' ? ((cat1 as any)?.descAr || cat1?.description) : ((cat1 as any)?.descEn || cat1?.description)) || t('freshFromOven')}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <ArrowLeft className={`w-5 h-5 ltr:rotate-180`} />
            </div>
          </div>
        </Link>

  
        <Link to={`/shop?category_id=${cat2?.id || ''}`} className="md:col-span-1 md:row-span-1 relative rounded-[2.5rem] overflow-hidden group shadow-md min-h-[250px] flex flex-col justify-end p-6 cursor-pointer">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-[10s] group-hover:scale-110"
            style={{ backgroundImage: `url('${cat2?.image || 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=800'}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10 z-0"></div>

          <div className="relative z-10 text-white flex items-center justify-between">
            <div>
              <div className="bg-background/80 p-3 rounded-2xl w-fit mb-3 shadow-sm backdrop-blur-md inline-block">
                <Cake className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">{(language === 'ar' ? ((cat2 as any)?.nameAr || cat2?.name) : ((cat2 as any)?.nameEn || cat2?.name)) || t('cakesSweets')}</h3>
              <p className="text-sm text-white/80 font-light">{(language === 'ar' ? ((cat2 as any)?.descAr || cat2?.description) : ((cat2 as any)?.descEn || cat2?.description)) || t('happyMoments')}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <ArrowLeft className={`w-5 h-5 ltr:rotate-180`} />
            </div>
          </div>
        </Link>

   
        <div className="md:col-span-2 md:row-span-1 relative rounded-[2.5rem] overflow-hidden group shadow-md bg-primary/10 flex items-center p-6 md:p-10 min-h-[250px]">
   
          <div className="absolute top-0 end-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2"></div>
          <div className="absolute bottom-0 start-0 w-64 h-64 bg-secondary/20 rounded-full blur-[80px] translate-y-1/2"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-6">
            <div className="max-w-sm">
              <Coffee className="w-10 h-10 mb-4 text-primary" />
              <h3 className="text-3xl font-bold text-foreground mb-2">
                {t('morningRight')}
              </h3>
              <p className="text-muted-foreground font-light">
                {t('morningRightDesc')}
              </p>
            </div>

            <div className="flex -space-x-4 rtl:space-x-reverse relative z-20">
              <Link to={topProducts?.[0]?.id ? `/product/${topProducts[0].id}` : '/shop'} className="hover:-translate-y-2 transition-transform cursor-pointer">
                <img className="w-16 h-16 rounded-full border-4 border-background shadow-sm object-cover" src={topProducts?.[0]?.image || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=200"} alt={topProducts?.[0]?.name || "Product 1"} />
              </Link>
              <Link to={topProducts?.[1]?.id ? `/product/${topProducts[1].id}` : '/shop'} className="hover:-translate-y-2 transition-transform cursor-pointer">
                <img className="w-16 h-16 rounded-full border-4 border-background shadow-sm object-cover" src={topProducts?.[1]?.image || "https://images.unsplash.com/photo-1495147466023-2ce6c9b4b32b?auto=format&fit=crop&q=80&w=200"} alt={topProducts?.[1]?.name || "Product 2"} />
              </Link>
              <Link to={topProducts?.[2]?.id ? `/product/${topProducts[2].id}` : '/shop'} className="hover:-translate-y-2 transition-transform cursor-pointer">
                <img className="w-16 h-16 rounded-full border-4 border-background shadow-sm object-cover" src={topProducts?.[2]?.image || "https://images.unsplash.com/photo-1600056781444-55f3b64235e3?auto=format&fit=crop&q=80&w=200"} alt={topProducts?.[2]?.name || "Product 3"} />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
