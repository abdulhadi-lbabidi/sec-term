import { Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImg from '@/imports/noughs-signe.png';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export interface FooterProps {
  className?: string;
}

export const Footer = ({ className }: FooterProps) => {
  const { t } = useTranslation();

  return (
    <footer className={cn("bg-muted/50 w-full pt-16 pb-8 border-t border-border", className)}>
      <div className=" mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-7xl lg:grid-cols-5 gap-8 mb-12">

          {/* Column 1: Brand & Contact */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img src={logoImg} alt="Logo" className="h-10 md:h-12 w-auto object-contain" />
            </Link>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <Phone className="w-4 h-4 text-muted-foreground/80" />
                <span dir="ltr">+1234 567 890</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <Mail className="w-4 h-4 text-muted-foreground/80" />
                <span>hello@bakery.com</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-secondary/80 transition-colors">
                <Facebook className="w-4 h-4 fill-current" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-primary/10 text-foreground flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Twitter className="w-4 h-4 fill-current" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-primary/10 text-foreground flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: About */}
          <div>
            <h4 className="font-bold text-foreground mb-6">{t('footer.about_title', 'About')}</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-secondary transition-colors">{t('footer.about_us', 'About Us')}</Link></li>
              <li><Link to="/careers" className="hover:text-secondary transition-colors">{t('footer.careers', 'Careers')}</Link></li>
              <li><Link to="/contact" className="hover:text-secondary transition-colors">{t('footer.contact_us', 'Contact Us')}</Link></li>
              <li><Link to="/categories" className="hover:text-secondary transition-colors">{t('footer.categories', 'Categories')}</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="font-bold text-foreground mb-6">{t('footer.company_title', 'Company')}</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link to="/account" className="hover:text-secondary transition-colors">{t('footer.my_account', 'My Account')}</Link></li>
              <li><Link to="/terms" className="hover:text-secondary transition-colors">{t('footer.terms', 'Terms of Use')}</Link></li>
              <li><Link to="/faq" className="hover:text-secondary transition-colors">{t('footer.faq', 'FAQ')}</Link></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h4 className="font-bold text-foreground mb-6">{t('footer.support_title', 'Support')}</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link to="/contact" className="hover:text-secondary transition-colors">{t('footer.contact', 'Contact')}</Link></li>
              <li><Link to="/support" className="hover:text-secondary transition-colors">{t('footer.support_center', 'Support Center')}</Link></li>
              <li><Link to="/feedback" className="hover:text-secondary transition-colors">{t('footer.feedback', 'Feedback')}</Link></li>
              <li><Link to="/accessibility" className="hover:text-secondary transition-colors">{t('footer.accessibility', 'Accessibility')}</Link></li>
            </ul>
          </div>

          {/* Column 5: Quick Touch */}
          <div>
            <h4 className="font-bold text-foreground mb-6">{t('footer.quick_touch', 'Quick Touch')}</h4>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              {t('footer.address', '4517 Washington Ave. Manchester, Kentucky 39495')}
            </p>
            <div>
              <h5 className="font-semibold text-foreground mb-3 text-sm">{t('footer.download_app', 'Download App')}</h5>
              <div className="flex gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-8 cursor-pointer hover:opacity-80 transition-opacity" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-8 cursor-pointer hover:opacity-80 transition-opacity" />
              </div>
            </div>
          </div>

        </div>

        <div className="text-center pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">{t('footer.copyright', '© 2024 Bakery. All rights reserved.')}</p>
        </div>
      </div>
    </footer>
  );
};
