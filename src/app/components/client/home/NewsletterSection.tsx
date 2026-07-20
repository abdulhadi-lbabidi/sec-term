import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export interface NewsletterSectionProps {
  className?: string;
}

export const NewsletterSection = ({ className }: NewsletterSectionProps) => {
  const { t } = useTranslation();

  return (
    <section className={cn("container mx-auto px-4 md:px-8 py-12", className)}>
      <div className="bg-primary rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>

        <div className="md:w-1/2 relative z-10 space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            {t('newsletter.title_part1', 'Get update regularly and best')}<br />
            {t('newsletter.title_part2', 'offer subscribe us')}
          </h2>
          <div className="flex items-center bg-white rounded-full p-1.5 max-w-md w-full focus-within:ring-2 ring-secondary transition-shadow shadow-xl">
            <input
              type="email"
              placeholder={t('newsletter.placeholder', 'hello@bakery.com')}
              className="flex-1 bg-transparent border-none outline-none px-4 text-sm text-gray-700 placeholder:text-gray-400"
            />
            <button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-3 rounded-full text-sm font-semibold transition-colors">
              {t('newsletter.button', 'Subscribe')}
            </button>
          </div>
        </div>

        <div className="md:w-1/2 mt-8 md:mt-0 relative z-10 flex justify-center md:justify-end">
          <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=500" alt="Chef" className="w-48 h-48 md:w-64 md:h-64 lg:w-[300px] lg:h-[300px] object-cover rounded-full border-4 border-white/20 shadow-2xl" />
        </div>
      </div>
    </section>
  );
};
