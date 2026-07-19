import { Search, ShoppingCart, Menu, ChevronDown, Heart, LucideLayoutGrid, User, ShieldCheck } from 'lucide-react';
import logoImg from '@/imports/noughs-signe.png';
import { Link, useNavigate } from 'react-router-dom';
import { useLocalization } from '@/app/hooks/useLocalization';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/app/store/useAppStore';
import { useCategoriesQuery } from '@/app/api/client/useCategories';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/app/components/ui/dropdown-menu';
import { Button } from '@/app/components/ui/button';
import ArFlag from '@/imports/AR.svg'
import EnFlag from '@/imports/US.svg'

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
    <header className={cn("sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/40 transition-all duration-300", className)}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0 transition-transform hover:scale-105 active:scale-95">
          <div className="bg-primary/5 rounded-full p-1.5 hidden sm:block">
            <img src={logoImg} alt="Logo" className="h-8 md:h-9 w-auto object-contain" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-foreground">{t('brand.name', 'Nouh carting')}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 mx-6">
          <Link to="/" className="text-sm font-semibold text-foreground/70 hover:text-primary transition-colors">{t('nav.home', 'Home')}</Link>
          <Link to="/shop" className="text-sm font-semibold text-foreground/70 hover:text-primary transition-colors">{t('header.products', 'Products')}</Link>
          <Link to="/about" className="text-sm font-semibold text-foreground/70 hover:text-primary transition-colors">{t('header.about', 'About')}</Link>
          <Link to="/contact" className="text-sm font-semibold text-foreground/70 hover:text-primary transition-colors">{t('nav.contact', 'Contact')}</Link>
        </nav>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md items-center">
          <form onSubmit={handleSearch} className="flex flex-1 items-center bg-muted/40 hover:bg-muted/60 focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/20 focus-within:shadow-sm rounded-full px-2 py-1.5 transition-all duration-300 border border-border/50">

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 border-e border-border/60 pe-3 ms-2 me-3 cursor-pointer text-foreground/60 hover:text-primary transition-colors select-none">
                  <LucideLayoutGrid size={15} />
                  <span className="text-xs font-semibold whitespace-nowrap max-w-[80px] truncate">
                    {selectedCategory ? selectedCategory.name : t('header.all_categories', 'All')}
                  </span>
                  <ChevronDown size={13} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px] rounded-2xl shadow-lg border-border/40 p-2">
                <DropdownMenuItem onClick={() => setSelectedCategory(null)} className="rounded-xl cursor-pointer text-sm font-medium">
                  {t('header.all_categories', 'All Categories')}
                </DropdownMenuItem>
                {categories?.map((cat: any) => (
                  <DropdownMenuItem key={cat.id} onClick={() => setSelectedCategory(cat)} className="rounded-xl cursor-pointer text-sm font-medium flex items-center gap-3 mt-1">
                    {cat?.image && <img src={cat?.image} alt={cat.name} className="w-6 h-6 rounded-full shadow-sm object-cover" />}
                    {cat.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('header.search', 'Search products...')}
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-foreground/40 text-foreground font-medium"
            />

            <button type="submit" className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors shrink-0 me-1">
              <Search size={15} />
            </button>
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">

          <Button onClick={toggleLanguage} variant="ghost" size="icon" className="text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-full w-9 h-9 transition-colors">
            {i18n.language !== 'ar'
              ? <img src={ArFlag} alt="AR" className="w-8 h-6 rounded-[4px] object-cover shadow-sm" />
              : <img src={EnFlag} alt="EN" className="w-8 h-6 rounded-[4px] object-cover shadow-sm" />
            }
          </Button>

          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="relative text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-full w-9 h-9 transition-colors">
              <Heart size={20} />
            </Button>
          </Link>

          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-full w-9 h-9 transition-colors">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 end-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm ring-2 ring-background animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          <div className="hidden sm:block w-px h-6 bg-border/60 mx-1"></div>

          <Link to="/admin" className="hidden sm:block">
            <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-full w-9 h-9 transition-colors" title="Admin Panel">
              <ShieldCheck size={20} />
            </Button>
          </Link>

          {user ? (
            <Link to="/profile">
              <Button variant="default" className="hidden sm:flex bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5 text-sm h-9 font-semibold shadow-sm hover:shadow-md transition-all">
                <User size={16} className="me-2" />
                {t('header.profile', 'Profile')}
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="default" className="hidden sm:flex bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 text-sm h-9 font-semibold shadow-sm hover:shadow-md transition-all">
                {t('header.signup', 'Sign Up')}
              </Button>
            </Link>
          )}

          <Button variant="ghost" size="icon" className="lg:hidden text-foreground/70 hover:text-primary rounded-full w-9 h-9 ms-1">
            <Menu size={24} />
          </Button>
        </div>
      </div>
    </header>
  );
};
