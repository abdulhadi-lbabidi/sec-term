import { Link } from 'react-router-dom';

export const PromoBannersRow1 = () => {
  return (
    <section className="container mx-auto px-4 md:px-8 py-8 grid md:grid-cols-2 gap-8">
      <div className="bg-[#FFEFE5] rounded-3xl p-8 flex items-center justify-between overflow-hidden relative group">
        <div className="w-1/2 relative z-10 space-y-4">
          <h3 className="text-3xl font-bold text-gray-900 leading-tight">Everyday fresh & <br /> clean with our <br /> products</h3>
          <Link to="/shop" className="inline-block bg-[var(--color-secondary)] hover:bg-[#e66a25] text-white px-6 py-2.5 rounded-full font-medium text-sm transition-colors">Shop Now</Link>
        </div>
        <div className="w-1/2 flex justify-end">
          <img src="https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&q=80&w=500" alt="Shopper" className="h-48 object-contain rounded-2xl group-hover:scale-105 transition-transform duration-500" />
        </div>
      </div>
      <div className="bg-[#EAF3EB] rounded-3xl p-8 flex items-center justify-between overflow-hidden relative group">
        <div className="w-1/2 relative z-10 space-y-4">
          <h3 className="text-3xl font-bold text-gray-900 leading-tight">Make your <br /> breakfast healthy <br /> and easy</h3>
          <Link to="/shop" className="inline-block bg-[var(--color-secondary)] hover:bg-[#e66a25] text-white px-6 py-2.5 rounded-full font-medium text-sm transition-colors">Shop Now</Link>
        </div>
        <div className="w-1/2 flex justify-end">
          <img src="https://images.unsplash.com/photo-1512621820151-d50c826eae24?auto=format&fit=crop&q=80&w=500" alt="Salad" className="h-48 object-contain rounded-full group-hover:scale-105 transition-transform duration-500 shadow-xl" />
        </div>
      </div>
    </section>
  );
};
