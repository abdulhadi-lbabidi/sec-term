
export const BrandLogosSection = () => {
  return (
    <section className="container mx-auto px-4 md:px-8 py-12">
      <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
        {/* Mock Brand Logos */}
        <div className="flex items-center gap-2 text-xl font-bold text-green-700">🌱 ORGANIC</div>
        <div className="flex items-center gap-2 text-xl font-bold text-green-600">🌿 Re:Nu</div>
        <div className="flex items-center gap-2 text-xl font-bold text-green-800">🥦 Vegetables</div>
        <div className="flex items-center gap-2 text-xl font-bold text-green-900">🍃 Garden Lite</div>
        <div className="flex items-center gap-2 text-xl font-bold text-yellow-500">🍋 Lemon</div>
      </div>
    </section>
  );
};
