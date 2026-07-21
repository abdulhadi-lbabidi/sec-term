import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Package, Star, ShieldCheck } from 'lucide-react';

export const About = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-white text-gray-900 pb-20 max-w-7xl mx-auto">
      {/* Hero Section matching HomePage identity */}
      <div className="px-4 md:px-6 pt-6">
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-lg flex flex-col justify-center items-center text-center p-8 md:p-12 min-h-[350px] md:min-h-[400px]">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-[15s] hover:scale-110"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1920')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 z-0"></div>

          <div className="relative z-10 text-white w-full max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 drop-shadow-md"
            >
              {t('about.title', 'من نحن')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-white/90 leading-relaxed font-light drop-shadow"
            >
              {t('about.subtitle', 'نقدم لكم أفضل المنتجات بجودة عالية وتجربة تسوق لا تُنسى.')}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-20 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground flex items-center gap-3">
              <Star className="text-primary w-8 h-8" />
              {t('about.story_title', 'قصتنا')}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg font-light">
              {t('about.story_desc', 'انطلقنا برؤية تهدف إلى إعادة تعريف مفهوم التسوق الإلكتروني وتوفير منتجات مختارة بعناية تلبي تطلعات عملائنا. نضع الابتكار والجودة والموثوقية في صميم عملنا لضمان تجربة سلسة واستثنائية تبدأ من اختيار المنتج وحتى وصوله إليك.')}
            </p>
          </div>
          <div className="order-1 md:order-2">
            <div className="rounded-[2.5rem] overflow-hidden shadow-md relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1587241321921-91a834d6d191?auto=format&fit=crop&q=80&w=1000"
                className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">{t('about.values_title', 'قيمنا')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <ShieldCheck className="w-10 h-10" />, title: t('about.value1_title', 'الموثوقية العالية'), desc: t('about.value1_desc', 'نضمن لكم تجربة تسوق آمنة ومنتجات مطابقة لأعلى المعايير.') },
            { icon: <Star className="w-10 h-10" />, title: t('about.value2_title', 'خيارات واسعة'), desc: t('about.value2_desc', 'مجموعة متنوعة من المنتجات المختارة بعناية لتناسب جميع احتياجاتكم.') },
            { icon: <Package className="w-10 h-10" />, title: t('about.value3_title', 'خدمة ممتازة'), desc: t('about.value3_desc', 'تغليف آمن وتوصيل سريع يضمن وصول المنتج بأفضل حالة.') }
          ].map((item, idx) => (
            <div key={idx} className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-20 h-20 mx-auto bg-white text-primary rounded-full shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
              <p className="text-muted-foreground font-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
