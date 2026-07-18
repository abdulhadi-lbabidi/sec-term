import { Search, ShoppingCart, Menu, ChevronDown, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useAppStore } from '../../../store/useAppStore';
import { Button } from '../../ui/button';

export interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  const { user, cart } = useAppStore();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const toggleLanguage = () => {
    const currentLang = i18n.language;
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(/^\/(en|ar)/, `/${newLang}`);
    window.location.href = newPath + window.location.search;
  };

  return (
    <header className={cn("w-full bg-background border-b border-border py-4", className)}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 text-secondary">
            {/* Simple logo approximation with Lucide */}
            <ShoppingCart className="w-full h-full fill-current" />
          </div>
          <span className="text-2xl font-serif font-bold text-secondary">{t('header.brand', 'EasyMart')}</span>
        </Link>

        {/* Desktop Navigation & Search */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-8">
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-primary hover:text-secondary transition-colors">{t('nav.home', 'Home')}</Link>
            <Link to="/catalog" className="text-sm font-medium text-muted-foreground hover:text-secondary transition-colors">{t('header.catalog', 'Catalog')}</Link>
            <Link to="/blog" className="text-sm font-medium text-muted-foreground hover:text-secondary transition-colors">{t('header.blog', 'Blog')}</Link>
            <Link to="/pages" className="text-sm font-medium text-muted-foreground hover:text-secondary transition-colors">{t('header.pages', 'Pages')}</Link>
            <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-secondary transition-colors">{t('nav.contact', 'Contact')}</Link>
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-md flex items-center bg-muted rounded-full px-4 py-2 border border-transparent focus-within:border-secondary transition-colors">
            <div className="flex items-center gap-1 border-e border-gray-300 pe-3 me-3 cursor-pointer">
              <span className="text-xs font-medium text-muted-foreground">{t('header.all_categories', 'All Categories')}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder={t('header.search', 'Search...')}
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground"
            />
            <Search className="w-4 h-4 text-muted-foreground ms-2 shrink-0" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          
          <Button onClick={toggleLanguage} variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-colors gap-2 rounded-full px-4 border border-border">
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">{i18n.language === 'ar' ? 'English' : 'عربي'}</span>
          </Button>

          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative bg-secondary/10 text-secondary hover:bg-secondary hover:text-secondary-foreground rounded-full h-10 w-10 transition-colors ms-2">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 end-0 -mt-1 -me-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {user ? (
            <Button onClick={() => navigate('/profile')} className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 text-sm h-10 ms-2">
              {t('header.profile', 'Profile')}
            </Button>
          ) : (
            <Button onClick={() => navigate('/login')} className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 text-sm h-10 font-medium ms-2">
              {t('header.signup', 'Sign Up')}
            </Button>
          )}

          <Button variant="ghost" size="icon" className="md:hidden text-foreground">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};
