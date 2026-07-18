import { Link } from 'react-router-dom';

interface CategorySectionProps {
  categories: any[];
}

export const CategorySection = ({ categories }: CategorySectionProps) => {
  return (
    <section className="container mx-auto px-4 md:px-8 py-12">
      <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-8">Shop By Category</h2>
      <div className="flex flex-wrap gap-4 justify-between">
        {categories?.map((cat: any, idx: number) => (
          <Link key={idx} to={`/category/${(cat.name || cat.nameEn || '').toLowerCase()}`} className="flex flex-col items-center gap-3 group">
            <div className="w-20 h-20 rounded-2xl bg-[#FDF0F3] group-hover:bg-[var(--color-primary)]/10 transition-colors flex items-center justify-center text-4xl">
              {cat.image || '🛒'}
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-[var(--color-primary)] transition-colors">{cat.name || cat.nameEn || 'Category'}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};
