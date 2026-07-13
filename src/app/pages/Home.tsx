import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { ArrowRight, Star, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const products = [
  { id: 1, name: 'Artisanal Sourdough', price: '$8.00', image: 'https://images.unsplash.com/photo-1585478259715-876a6a81b67c?auto=format&fit=crop&q=80&w=800' },
  { id: 2, name: 'Classic Croissant', price: '$4.50', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800' },
  { id: 3, name: 'Pain au Chocolat', price: '$5.00', image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&q=80&w=800' },
  { id: 4, name: 'Rye Bread', price: '$7.50', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800' },
];

const testimonials = [
  { name: 'Sarah J.', text: 'The best sourdough I have ever tasted outside of Paris. Absolutely divine.', role: 'Food Critic' },
  { name: 'Michael R.', text: 'Authentic flavors and beautiful presentation. My Sunday morning ritual.', role: 'Regular Customer' },
  { name: 'Elena W.', text: 'The texture and aroma are simply unmatched. A true gem in the city.', role: 'Chef' },
];

export const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-[#fefcfa]">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&q=80&w=2000"
            alt="Bakery Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mb-10 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center space-x-3 bg-[#fefcfa] text-black px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300"
            >
              <span>{t('hero.cta')}</span>
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Summary */}
      <section className="py-32 px-4 border-b border-black/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-black/40">Since 1985</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-black leading-tight">
              {t('about.title')}
            </h2>
            <p className="text-lg text-black/60 leading-relaxed">
              {t('about.summary')}
            </p>
            <Link to="/about" className="inline-flex items-center text-black border-b border-black pb-1 text-sm font-bold uppercase tracking-widest hover:text-black/60 transition-colors">
              Learn More
            </Link>
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
               <ImageWithFallback src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800" className="aspect-[3/4] object-cover grayscale" />
               <ImageWithFallback src="https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&q=80&w=800" className="aspect-square object-cover" />
            </div>
            <div className="space-y-4">
               <ImageWithFallback src="https://images.unsplash.com/photo-1585478259715-876a6a81b67c?auto=format&fit=crop&q=80&w=800" className="aspect-square object-cover" />
               <ImageWithFallback src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800" className="aspect-[3/4] object-cover grayscale" />
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl font-bold tracking-tighter text-black">Best Sellers</h2>
            <Link to="/shop" className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1">View All</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden mb-6 bg-gray-100">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale hover:grayscale-0"
                  />
                  <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                     <button className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest">Add to Cart</button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-black mb-1">{product.name}</h3>
                <p className="text-black/40 font-medium">{product.price}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-4 bg-black text-[#fefcfa] overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative">
          <Quote className="mx-auto mb-12 opacity-20" size={64} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <p className="text-xl md:text-2xl italic font-serif leading-relaxed">"{t.text}"</p>
                <div className="space-y-1">
                  <h4 className="font-bold tracking-widest uppercase text-sm">{t.name}</h4>
                  <p className="text-xs text-white/40 uppercase tracking-widest">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
