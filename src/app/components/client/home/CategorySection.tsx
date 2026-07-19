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
  const { t } = useTranslation();

  return (
    <section className={cn("container mx-auto px-4 md:px-8 py-12", className)}>
      <h2 className="text-2xl font-bold text-primary mb-8">{t('categories.title')}</h2>
      <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth">
        {categories?.map((cat, idx) => {
          return (
            <Link key={cat.id || idx} to={`/shop?category_id=${cat.id}`} className="flex flex-col items-center gap-3 group shrink-0 min-w-[90px] md:min-w-[110px] snap-start md:snap-center">
              {cat.image
                ? <img src={cat.image} alt={cat.name} className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-border/40 shadow-sm bg-muted group-hover:bg-primary/10 group-hover:scale-105 group-hover:shadow-md transition-all flex items-center justify-center text-4xl object-cover" />
                : <div className='w-20 h-20 md:w-24 md:h-24 rounded-full border border-border/40 shadow-sm bg-muted group-hover:bg-primary/10 group-hover:scale-105 group-hover:shadow-md transition-all flex items-center justify-center text-4xl'>🛒</div>}
              <span className="text-sm md:text-base font-semibold text-foreground group-hover:text-primary transition-colors text-center">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
