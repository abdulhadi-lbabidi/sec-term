import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

export const About = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-20 bg-[#fefcfa]">
      {/* Hero */}
      <section className="py-24 px-4 bg-black text-[#fefcfa]">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-bold tracking-tighter mb-8"
          >
            {t('about.heritage')}
          </motion.h1>
          <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto leading-relaxed italic">
            "A legacy of flour, water, and passion."
          </p>
        </div>
      </section>

      {/* History */}
      <section className="py-32 px-4">
        <div className="max-w-5xl mx-auto space-y-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1587241321921-91a834d6d191?auto=format&fit=crop&q=80&w=1000"
              className="aspect-[4/5] object-cover grayscale"
            />
            <div className="space-y-8">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-black/40">Our Beginnings</span>
              <h2 className="text-4xl font-bold tracking-tighter text-black">A Journey Through Time</h2>
              <p className="text-lg text-black/60 leading-relaxed">
                Our bakery started in a small kitchen in 1985. What began as a local passion for authentic sourdough has grown into a city-wide heritage. We believe that true quality takes time, and we still use the same starter culture from forty years ago.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="order-2 md:order-1 space-y-8">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-black/40">Our Process</span>
              <h2 className="text-4xl font-bold tracking-tighter text-black">{t('about.expertise')}</h2>
              <p className="text-lg text-black/60 leading-relaxed">
                Every loaf is shaped by hand. Every pastry is laminated with care. Our master bakers bring decades of experience to the table, ensuring that the texture, crumb, and crust meet our exacting standards every single morning.
              </p>
            </div>
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1571942948809-74637bfc59b9?auto=format&fit=crop&q=80&w=1000"
              className="aspect-[4/5] object-cover order-1 md:order-2"
            />
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-32 px-4 bg-black/5 border-t border-black/5">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tighter mb-12">Our Physical Roots</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-sm uppercase tracking-widest font-bold">
            <div className="space-y-4">
              <p className="text-black/40">Flagship Store</p>
              <p>123 Baker St, Flour City</p>
            </div>
            <div className="space-y-4">
              <p className="text-black/40">Boutique Corner</p>
              <p>456 Pastry Ave, Sugar District</p>
            </div>
            <div className="space-y-4">
              <p className="text-black/40">Kitchen Lab</p>
              <p>789 Knead Rd, Dough Valley</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
