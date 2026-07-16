import { Star, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductSectionProps {
  products: any[];
}

export const ProductSection = ({ products }: ProductSectionProps) => {
  return (
    <section className="container mx-auto px-4 md:px-8 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">Our All Products</h2>
        <Link to="/products" className="text-sm font-medium text-gray-500 hover:text-[var(--color-secondary)]">View All</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products?.map((product: any) => (
          <div key={product.id} className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all group">
            <div className="bg-[#F8F9FA] rounded-xl aspect-[4/3] mb-4 flex items-center justify-center p-4 relative overflow-hidden">
              <img src={product.image || 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&q=80&w=500'} alt={product.name || product.nameEn} className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300 mix-blend-multiply" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 h-10">{product.name || product.nameEn || 'Product'}</h3>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">{product.weight || '500gm'}</span>
                <span className="flex items-center text-orange-400 font-bold"><Star className="w-3 h-3 fill-current mr-0.5" /> {product.rating || 4.9}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-lg text-gray-900">${product.price || product.basePrice || 24}</span>
                <button className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center hover:bg-[#0f4a28] transition-colors shadow-md">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
