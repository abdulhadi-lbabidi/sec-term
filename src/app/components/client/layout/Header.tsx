import { Search, ShoppingCart, Menu, ChevronDown, Globe, Heart, Grid, LucideLayoutGrid } from 'lucide-react';
import logoImg from '@/imports/noughs-signe.png';
import { Link, useNavigate } from 'react-router-dom';
import { useLocalization } from '@/app/hooks/useLocalization';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/app/store/useAppStore';
import { useCategoriesQuery } from '@/app/api/client/useCategories';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/app/components/ui/dropdown-menu';
import { Button } from '@/app/components/ui/button';

export interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  const { user, cart } = useAppStore();
  const navigate = useNavigate();
  const { t, i18n, toggleLanguage } = useLocalization();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<{ id: string, name: string, slug: string } | null>(null);
  const { data: categories }: any = useCategoriesQuery();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() || selectedCategory) {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.append('q', searchTerm.trim());
      if (selectedCategory) params.append('category', selectedCategory.id);
      navigate(`/shop?${params.toString()}`);
    }
  };

  return (
    <header className={cn("w-full bg-background border-b border-border py-4", className)}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logoImg} alt="Logo" className="h-10 md:h-10 w-auto object-contain" />
        </Link>

        {/* Desktop Navigation & Search */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-8">
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">{t('nav.home', 'Home')}</Link>
            <Link to="/shop" className="text-sm font-semibold text-foreground/90 hover:text-primary transition-colors">{t('header.products')}</Link>
            <Link to="/blog" className="text-sm font-semibold text-foreground/90 hover:text-primary transition-colors">{t('header.blog', 'Blog')}</Link>
            <Link to="/about" className="text-sm font-semibold text-foreground/90 hover:text-primary transition-colors">{t('header.pages', 'Pages')}</Link>
            <Link to="/contact" className="text-sm font-semibold text-foreground/90 hover:text-primary transition-colors">{t('nav.contact', 'Contact')}</Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md flex items-center bg-muted rounded-full px-4 py-2 border border-transparent focus-within:border-secondary transition-colors">

            <DropdownMenu>
              <DropdownMenuTrigger asChild >
                <div className="flex items-center gap-1 border-e border-gray-300 pe-3 me-3 cursor-pointer hover:text-foreground">
                  <span className="text-xs font-medium text-foreground/80 line-clamp-1 max-w-[100px]">
                    <LucideLayoutGrid size={16} className="me-2" />
                    {/* {selectedCategory ? selectedCategory.name : t('header.all_categories', 'All Categories')} */}
                  </span>
                  <ChevronDown className="w-3 h-3 text-foreground/80" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                <DropdownMenuItem onClick={() => setSelectedCategory(null)}>
                  {t('header.all_categories', 'All Categories')}
                </DropdownMenuItem>
                {categories?.map((cat: any) => (
                  <DropdownMenuItem key={cat.id} onClick={() => setSelectedCategory(cat)}>
                    {cat?.image && <img src={cat?.image} alt={cat.name} className="w-6 h-6 rounded-full" />}
                    {cat.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('header.search', 'Search...')}
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-foreground/60 text-foreground"
            />
            <button type="submit" className="flex items-center justify-center">
              <Search className="w-4 h-4 text-foreground/80 ms-2 shrink-0 hover:text-secondary transition-colors" />
            </button>
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">

          <Button onClick={toggleLanguage} variant="ghost" size="sm" className="hidden sm:flex text-foreground/80 transition-colors gap-2 rounded-full px-4 border border-border">
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">{i18n.language === 'ar' ? 'English' : 'عربي'}</span>
          </Button>

          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="relative text-primary rounded-full h-10 w-10 transition-colors ms-2">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>

          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative text-primary rounded-full h-10 w-10 transition-colors ms-2">
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
