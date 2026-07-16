import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export interface Category {
  id?: string | number;
  name?: string;
  nameEn?: string;
  image?: string;
}

export interface CategorySectionProps {
  categories: Category[];
  className?: string;
}

export const CategorySection = ({ categories, className }: CategorySectionProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  console.log(i18n);

  return (
    <section className={cn("container mx-auto px-4 md:px-8 py-12", className)}>
      <h2 className="text-2xl font-bold text-primary mb-8">{t('categories.title')}</h2>
      <div className="flex flex-wrap gap-4 justify-between">
        {categories?.map((cat, idx) => {
          const catName = isRTL ? (cat.name || cat.nameEn) : (cat.nameEn || cat.name);
          const slug = (cat.nameEn || cat.name || '').toLowerCase();
          return (
            <Link key={cat.id || idx} to={`/category/${slug}`} className="flex flex-col items-center gap-3 group">
              <div className="w-20 h-20 rounded-2xl bg-muted group-hover:bg-primary/10 transition-colors flex items-center justify-center text-4xl">
                {cat.image || '🛒'}
              </div>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {catName || t('shop.filter_category')}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
