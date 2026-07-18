import { Link } from 'react-router-dom';

export const PromoBannersRow2 = () => {
  return (
    <section className="container mx-auto px-4 md:px-8 py-8 grid md:grid-cols-2 gap-8">
      <div className="bg-[#FFF4EE] border border-orange-100 rounded-3xl p-8 flex items-center justify-between overflow-hidden relative group">
        <div className="w-3/5 relative z-10 space-y-3">
          <span className="text-[var(--color-secondary)] text-xs font-bold uppercase tracking-wider">Organic Products</span>
          <h3 className="text-3xl font-bold text-gray-900 leading-tight">Exclusive Brands <br /> 30%off</h3>
          <Link to="/shop" className="inline-block bg-[var(--color-secondary)] hover:bg-[#e66a25] text-white px-6 py-2.5 rounded-full font-medium text-sm transition-colors mt-2">Shop Now</Link>
        </div>
        <div className="w-2/5 flex justify-end">
          <img src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=500" alt="Juice" className="h-40 object-contain group-hover:scale-105 transition-transform duration-500" />
        </div>
      </div>
      <div className="bg-[#E4F2E7] border border-green-100 rounded-3xl p-8 flex items-center justify-between overflow-hidden relative group">
        <div className="w-3/5 relative z-10 space-y-3">
          <span className="text-[var(--color-secondary)] text-xs font-bold uppercase tracking-wider">New Products</span>
          <h3 className="text-3xl font-bold text-[var(--color-primary)] leading-tight">Super Sales <br /> Vegetables Organic</h3>
          <Link to="/shop" className="inline-block bg-[var(--color-secondary)] hover:bg-[#e66a25] text-white px-6 py-2.5 rounded-full font-medium text-sm transition-colors mt-2">Shop Now</Link>
        </div>
        <div className="w-2/5 flex justify-end">
          <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=500" alt="Vegetables" className="h-40 object-cover rounded-full shadow-lg group-hover:scale-105 transition-transform duration-500" />
        </div>
      </div>
    </section>
  );
};
