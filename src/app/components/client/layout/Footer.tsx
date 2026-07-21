import { Facebook, Instagram, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImg from '@/imports/noughs-signe.png';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useCategoriesQuery } from '@/app/api/client/useCategories';
export interface FooterProps {
  className?: string;
}

const WhatsappIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);
export const Footer = ({ className }: FooterProps) => {
  const { t } = useTranslation();
  const { data: categories }: any = useCategoriesQuery();

  return (
    <footer className={cn("w-full px-4 md:px-8 pb-8 pt-20", className)}>
      <div className="bg-primary/5 border border-primary/10 rounded-[3rem] p-8 md:p-12 lg:p-16 max-w-7xl mx-auto flex flex-col shadow-sm">

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Brand Column */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <Link to="/" className="flex items-center gap-3 mb-6 transition-transform hover:scale-105 active:scale-95">
              <img src={logoImg} alt="Nouh carting" className="h-10 md:h-12 w-auto object-contain" />
              <span className="font-bold text-3xl tracking-tight text-primary">{t('brand.name', 'Nouh carting')}</span>
            </Link>

            <p className="text-muted-foreground text-lg leading-relaxed max-w-sm mb-6">
              {t('footer.description', 'مخبوزات بحب، من أجل لحظاتك السعيدة. طعم يجمع بين الأصالة والجودة العالية.')}
            </p>

            <div className="flex flex-col gap-3 text-sm text-muted-foreground font-medium mb-8">
              <a href="https://maps.app.goo.gl/uKp1R82xuEV1CPAX6" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                <MapPin className="w-4 h-4 text-primary shrink-0" /> {t('footer.address', '4517 Washington Ave. Manchester, Kentucky 39495')}
              </a>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href="tel:+963945036513" className="flex items-center gap-2 hover:text-primary transition-colors" dir="ltr">+963 945 036 513</a>
              </p>
              <a href="mailto:info@nouh-carting.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="w-4 h-4 text-primary shrink-0" /> info@nouh-carting.com
              </a>
            </div>

            <div className="flex gap-4">
              <a href="https://instagram.com/nouhcarting" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://fb.com/nouhcarting" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://wa.me/963945036513" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                <WhatsappIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="space-y-6">
              <h4 className="text-foreground font-bold text-lg">{t('footer.about_title', 'About')}</h4>
              <ul className="space-y-4">
                <li><Link to="/about" className="text-muted-foreground hover:text-primary font-medium transition-colors">{t('footer.our_story', 'قصتنا')}</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-primary font-medium transition-colors">{t('footer.contact_us', 'Contact Us')}</Link></li>
                <li><Link to="/faq" className="text-muted-foreground hover:text-primary font-medium transition-colors">{t('footer.faq', 'FAQ')}</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-foreground font-bold text-lg">{t('footer.legal_title', 'الشروط')}</h4>
              <ul className="space-y-4">
                <li><Link to="/terms" className="text-muted-foreground hover:text-primary font-medium transition-colors">{t('footer.terms', 'Terms of Use')}</Link></li>
                <li><Link to="/privacy" className="text-muted-foreground hover:text-primary font-medium transition-colors">{t('footer.privacy', 'سياسة الخصوصية')}</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-foreground font-bold text-lg">{t('footer.popular_categories', 'التصنيفات')}</h4>
              <ul className="space-y-4">
                {categories?.slice(0, 4).map((cat: any) => (
                  <li key={cat.id}>
                    <Link
                      to={`/shop?category_id=${cat.id}`}
                      className="text-muted-foreground hover:text-primary font-medium transition-colors capitalize"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col xl:flex-row justify-between items-center pt-8 border-t border-primary/10 gap-6">
          <p className="text-sm text-muted-foreground font-medium">
            {t('footer.developedBy', 'تم التطوير بواسطة')} <a href="https://nouh-agency.com" target="_blank" rel="noreferrer" className="text-primary hover:underline font-bold">{t('footer.developer', 'Nouh Agency')}</a>
          </p>

          <p className="text-muted-foreground font-medium text-sm text-center">
            {t('footer.copyright')}
          </p>
        </div>

      </div>
    </footer>
  );
};
