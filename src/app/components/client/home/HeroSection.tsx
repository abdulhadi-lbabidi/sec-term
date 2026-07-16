import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeroSection = () => {
  return (
    <section className="container mx-auto px-4 md:px-8 py-8">
      <div className="bg-[var(--color-primary)] rounded-[32px] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
        {/* Decorative background shape */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ffffff" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.3,-46.3C90.8,-33.5,96.8,-18.1,96.5,-3.1C96.2,11.9,89.5,26.5,79.9,38.8C70.3,51.1,57.7,61.1,43.7,68.1C29.7,75.1,14.8,79.1,-0.6,80.1C-16,81.1,-32,79.1,-46.3,72.2C-60.6,65.3,-73.2,53.5,-81.4,40C-89.6,26.5,-93.4,11.3,-92.3,-3.5C-91.2,-18.3,-85.2,-32.7,-76,-44.6C-66.8,-56.5,-54.4,-65.9,-40.8,-73.5C-27.2,-81.1,-13.6,-86.9,0.9,-88.4C15.4,-89.9,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>

        <div className="md:w-1/2 space-y-6 relative z-10">
          <span className="inline-flex items-center gap-2 bg-[#FFEB3B]/20 text-[#FFEB3B] px-4 py-1.5 rounded-full text-sm font-semibold border border-[#FFEB3B]/30">
            <span className="text-lg">🍅</span> Fresh & Healthy 100%
          </span>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] text-white">
            <span className="text-[#FFEB3B]">Fastest</span><br />
            Delivery <span className="text-[#FFEB3B]">&</span><br />
            <span className="text-[#FFEB3B]">Easy</span> Pickup.
          </h1>
          <Link to="/shop" className="inline-block bg-[var(--color-secondary)] hover:bg-[#e66a25] text-white px-8 py-3.5 rounded-full font-semibold transition-colors mt-4">
            Shop Now
          </Link>

          <div className="flex items-center gap-4 pt-6">
            <div className="flex -space-x-3">
              <img src="https://i.pravatar.cc/100?img=1" alt="User" className="w-10 h-10 rounded-full border-2 border-[var(--color-primary)]" />
              <img src="https://i.pravatar.cc/100?img=2" alt="User" className="w-10 h-10 rounded-full border-2 border-[var(--color-primary)]" />
              <img src="https://i.pravatar.cc/100?img=3" alt="User" className="w-10 h-10 rounded-full border-2 border-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Our Happy Customer</p>
              <div className="flex items-center gap-1 text-xs text-white/80">
                <Star className="w-3 h-3 fill-[#FFEB3B] text-[#FFEB3B]" />
                4.9 <span className="opacity-50">(1.5k Review)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 mt-12 md:mt-0 relative z-10 flex justify-end">
          <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800" alt="Fresh Vegetables Basket" className="w-full max-w-lg object-contain drop-shadow-2xl rounded-[40px]" />
        </div>
      </div>
    </section>
  );
};
