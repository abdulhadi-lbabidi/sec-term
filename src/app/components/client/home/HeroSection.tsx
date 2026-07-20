import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/app/store/useAppStore';

export interface HeroSectionProps {
  className?: string;
}

export const HeroSection = ({ className }: HeroSectionProps) => {
  const { t } = useTranslation();
  const { language } = useAppStore();

  return (
    <section className={cn("container mx-auto px-4 md:px-8 py-8", className)}>
      <div className="bg-[#111111] rounded-[32px] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-2xl">
        {/* Decorative background shape */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-[0.03] pointer-events-none">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#C5A880" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.3,-46.3C90.8,-33.5,96.8,-18.1,96.5,-3.1C96.2,11.9,89.5,26.5,79.9,38.8C70.3,51.1,57.7,61.1,43.7,68.1C29.7,75.1,14.8,79.1,-0.6,80.1C-16,81.1,-32,79.1,-46.3,72.2C-60.6,65.3,-73.2,53.5,-81.4,40C-89.6,26.5,-93.4,11.3,-92.3,-3.5C-91.2,-18.3,-85.2,-32.7,-76,-44.6C-66.8,-56.5,-54.4,-65.9,-40.8,-73.5C-27.2,-81.1,-13.6,-86.9,0.9,-88.4C15.4,-89.9,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>

        <div className="md:w-1/2 space-y-6 relative z-10">
          <span className="inline-flex items-center gap-2 bg-[#C5A880]/10 text-[#C5A880] px-4 py-1.5 rounded-full text-sm font-semibold border border-[#C5A880]/20">
            <span className="text-lg">✨</span> {t('valueOrganic', language === 'ar' ? 'مكونات طبيعية 100%' : '100% Natural Ingredients')}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.2] text-white">
            {t('heroTitle', language === 'ar' ? 'جرعتك اليومية من الطزاجة' : 'Your Daily Dose of Freshness')}
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-md leading-relaxed">
            {t('heroSubtitle', language === 'ar' ? 'خبز وبسكويت فاخر طازج، يُصنع يدوياً من الصفر وبمكونات طبيعية.' : 'Premium bread and cookies, made fresh daily from scratch.')}
          </p>
          <div className="pt-2">
            <Link to="/shop" className="inline-block bg-[#C5A880] hover:bg-[#b09672] text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-[0_4px_14px_0_rgba(197,168,128,0.39)] hover:shadow-[0_6px_20px_rgba(197,168,128,0.23)] hover:-translate-y-0.5">
              {t('shopNow', language === 'ar' ? 'تسوق الآن' : 'Shop Now')}
            </Link>
          </div>

          <div className="flex items-center gap-4 pt-8 border-t border-white/10 mt-8">
            <div className="flex -space-x-3">
              <img src="https://i.pravatar.cc/100?img=33" alt="Customer 1" className="w-10 h-10 rounded-full border-2 border-[#111111]" />
              <img src="https://i.pravatar.cc/100?img=44" alt="Customer 2" className="w-10 h-10 rounded-full border-2 border-[#111111]" />
              <img src="https://i.pravatar.cc/100?img=12" alt="Customer 3" className="w-10 h-10 rounded-full border-2 border-[#111111]" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">{t('reviews', language === 'ar' ? 'آراء عشاقنا' : 'Reviews from Lovers')}</p>
              <div className="flex items-center gap-1 text-xs text-white/70 mt-0.5">
                <Star className="w-3.5 h-3.5 fill-[#C5A880] text-[#C5A880]" />
                <Star className="w-3.5 h-3.5 fill-[#C5A880] text-[#C5A880]" />
                <Star className="w-3.5 h-3.5 fill-[#C5A880] text-[#C5A880]" />
                <Star className="w-3.5 h-3.5 fill-[#C5A880] text-[#C5A880]" />
                <Star className="w-3.5 h-3.5 fill-[#C5A880] text-[#C5A880]" />
                <span className="text-white ml-1">4.9</span> <span className="opacity-50 mx-1">•</span> <span className="opacity-70">+2,000</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 mt-12 md:mt-0 relative z-10 flex justify-end">
          <div className="relative">
            <div className="absolute inset-0 bg-[#C5A880] rounded-full blur-[100px] opacity-20 transform translate-x-10 translate-y-10"></div>
            <img src="https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&q=80&w=800" alt="Fresh Bakery Croissants" className="w-full max-w-md object-cover aspect-square drop-shadow-2xl rounded-[40px] border border-white/10" />
            
            {/* Floating Badge */}
            <div className={`absolute ${language === 'ar' ? '-bottom-6 -left-6' : '-bottom-6 -right-6'} bg-white text-[#111111] p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce-slow`}>
              <div className="w-12 h-12 bg-[#C5A880]/10 rounded-full flex items-center justify-center text-2xl">
                🥐
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">{t('freshToday', language === 'ar' ? 'خبز اليوم طازج' : 'Freshly Baked Today')}</p>
                <p className="text-sm font-bold">{t('valueFresh', language === 'ar' ? 'الطزاجة أولاً ودائماً' : 'Freshness First & Always')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
