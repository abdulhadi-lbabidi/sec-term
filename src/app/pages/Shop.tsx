import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, X, ChevronDown, ShoppingBag } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface Variant {
  size: string;
  material: string;
  image: string;
}

interface Product {
  id: string;
  code: string;
  name: string;
  basePrice: number;
  category: string;
  variants: Variant[];
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    code: 'BK-001',
    name: 'Artisanal Sourdough',
    basePrice: 8,
    category: 'bread',
    variants: [
      { size: 'Small', material: 'Whole Wheat', image: 'https://images.unsplash.com/photo-1585478259715-876a6a81b67c?auto=format&fit=crop&q=80&w=800' },
      { size: 'Medium', material: 'Whole Wheat', image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=800' },
      { size: 'Large', material: 'Whole Wheat', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800' },
      { size: 'Small', material: 'Rye', image: 'https://images.unsplash.com/photo-1597072689227-8882273e8f6a?auto=format&fit=crop&q=80&w=800' },
      { size: 'Medium', material: 'Rye', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800' },
    ]
  },
  {
    id: '2',
    code: 'BK-002',
    name: 'Glazed Croissant',
    basePrice: 4.5,
    category: 'pastry',
    variants: [
      { size: 'Standard', material: 'Butter', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800' },
      { size: 'Jumbo', material: 'Butter', image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&q=80&w=800' },
      { size: 'Standard', material: 'Chocolate', image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&q=80&w=800' },
    ]
  },
  {
    id: '3',
    code: 'BK-003',
    name: 'Morning Muffin',
    basePrice: 3.5,
    category: 'pastry',
    variants: [
      { size: 'Small', material: 'Blueberry', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&q=80&w=800' },
      { size: 'Large', material: 'Blueberry', image: 'https://images.unsplash.com/photo-1587241321921-91a834d6d191?auto=format&fit=crop&q=80&w=800' },
    ]
  }
];

const ProductCard = ({ product }: { product: Product }) => {
  const { t } = useTranslation();
  const [selectedSize, setSelectedSize] = useState(product.variants[0].size);
  const [selectedMaterial, setSelectedMaterial] = useState(product.variants[0].material);

  // Dynamic Logic: The product image changes based on the selected size or ingredient combination.
  const currentVariant = useMemo(() => {
    return product.variants.find(v => v.size === selectedSize && v.material === selectedMaterial) || product.variants[0];
  }, [selectedSize, selectedMaterial, product.variants]);

  const sizes = Array.from(new Set(product.variants.map(v => v.size)));
  const materials = Array.from(new Set(product.variants.map(v => v.material)));

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white border border-black/5 group flex flex-col h-full"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#fefcfa]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentVariant.image}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <ImageWithFallback
              src={currentVariant.image}
              alt={product.name}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1">
          {product.code}
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-black">{product.name}</h3>
            <p className="text-sm text-black/40 font-medium">${product.basePrice.toFixed(2)}</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">{t('shop.product.size')}</span>
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 border transition-all ${
                    selectedSize === size ? 'bg-black text-white border-black' : 'bg-transparent text-black border-black/10 hover:border-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">{t('shop.product.material')}</span>
            <div className="flex flex-wrap gap-2">
              {materials.map(material => (
                <button
                  key={material}
                  onClick={() => setSelectedMaterial(material)}
                  className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 border transition-all ${
                    selectedMaterial === material ? 'bg-black text-white border-black' : 'bg-transparent text-black border-black/10 hover:border-black'
                  }`}
                >
                  {material}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button className="mt-auto w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-black/80 transition-colors flex items-center justify-center space-x-2 rtl:space-x-reverse">
          <ShoppingBag size={14} />
          <span>Add to Cart</span>
        </button>
      </div>
    </motion.div>
  );
};

export const Shop = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['all', 'bread', 'pastry', 'cake'];

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return PRODUCTS;
    return PRODUCTS.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="pt-20 bg-[#fefcfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-16">
          <h1 className="text-5xl font-bold tracking-tighter text-black mb-4">{t('shop.title')}</h1>
          <p className="text-black/40 max-w-xl italic">Crafting moments of joy, one batch at a time.</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 space-y-12 h-fit lg:sticky lg:top-32">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-black mb-6">{t('shop.filter_category')}</h4>
              <div className="space-y-3">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`block w-full text-left text-sm uppercase tracking-widest font-medium transition-colors ${
                      activeCategory === cat ? 'text-black font-bold' : 'text-black/40 hover:text-black'
                    }`}
                  >
                    {t(`shop.categories.${cat}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-black/5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-black mb-6">Material</h4>
              <div className="flex flex-wrap gap-2">
                {['Gluten Free', 'Vegan', 'Organic', 'Traditional'].map(m => (
                  <button key={m} className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 border border-black/10 hover:border-black transition-colors">
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-black/5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-black mb-6">{t('shop.filter_price')}</h4>
              <div className="space-y-4">
                <input type="range" className="w-full accent-black" min="0" max="50" />
                <div className="flex justify-between text-[10px] font-bold tracking-widest text-black/40">
                  <span>$0</span>
                  <span>$50</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-grow">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-black/5">
              <span className="text-xs font-bold uppercase tracking-widest text-black/40">
                {filteredProducts.length} Items Found
              </span>
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <span className="text-xs font-bold uppercase tracking-widest text-black/40">Sort By:</span>
                <select className="bg-transparent text-xs font-bold uppercase tracking-widest focus:outline-none">
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
