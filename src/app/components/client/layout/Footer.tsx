import { Facebook, Twitter, Instagram, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImg from '@/imports/noughs-signe.png';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useCategoriesQuery } from '@/app/api/client/useCategories';
export interface FooterProps {
  className?: string;
}

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
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary shrink-0" /> {t('footer.address', '4517 Washington Ave. Manchester, Kentucky 39495')}</span>
              <p className="flex items-center gap-2" >
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span className="flex items-center gap-2" dir="ltr">                  +963 960 000</span>
              </p>
              <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary shrink-0" /> hello@nouh-carting.com</span>
            </div>

            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                <Facebook className="w-5 h-5" />
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
            {t('footer.copyright', '© 2024 Nouh carting. All rights reserved.')}
          </p>
        </div>

      </div>
    </footer>
  );
};
