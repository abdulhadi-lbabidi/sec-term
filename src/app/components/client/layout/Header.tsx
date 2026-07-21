import { Search, ShoppingCart, Menu, ChevronDown, Heart, LucideLayoutGrid, User, ShieldCheck, LogOut, Package, Home, ShoppingBag, Info, PhoneCall } from 'lucide-react';
import logoImg from '@/imports/noughs-signe.png';
import { Link, useNavigate } from 'react-router-dom';
import { useLocalization } from '@/app/hooks/useLocalization';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/app/store/useAppStore';
import { useCategoriesQuery } from '@/app/api/client/useCategories';
import { useCartQuery } from '@/app/api/client/useCart';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/app/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/app/components/ui/sheet';
import { Button } from '@/app/components/ui/button';
import ArFlag from '@/imports/AR.svg'
import EnFlag from '@/imports/US.svg'

export interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  const { user, logoutUser } = useAppStore();
  const navigate = useNavigate();
  const { t, i18n, toggleLanguage } = useLocalization();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const { data: categories, isLoading: isLoadingCategories }: any = useCategoriesQuery();

  const selectedCategory = categories?.find((c: any) => c.id === selectedCategoryId) || null;

  const { data: cartData } = useCartQuery();
  const cartItems = Array.isArray(cartData) ? cartData : (cartData?.items || []);
  const cartCount = cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() || selectedCategory) {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      if (selectedCategory) params.append('category_id', selectedCategory.id);
      navigate(`/shop?${params.toString()}`);
    }
  };

  return (
    <header className={cn("sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/40 transition-all duration-300", className)}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0 transition-transform hover:scale-105 active:scale-95 min-w-[40px]">
          <div className="bg-primary/5 rounded-full p-1.5 block shrink-0">
            <img src={logoImg} alt="Logo" className="h-8 md:h-9 w-auto object-contain" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-foreground hidden sm:block truncate max-w-[150px] md:max-w-none">{t('brand.name', 'Nouh carting')}</span>
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
                  <span className="text-xs font-semibold whitespace-nowrap max-w-[60px] sm:max-w-[80px] truncate">
                    {selectedCategory ? selectedCategory.name : t('header.all_categories', 'All')}
                  </span>
                  <ChevronDown size={13} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 sm:w-[200px] rounded-2xl shadow-lg border-border/40 p-2">
                <DropdownMenuItem onClick={() => setSelectedCategoryId(null)} className="rounded-xl cursor-pointer text-sm font-medium">
                  {t('header.all_categories', 'All Categories')}
                </DropdownMenuItem>
                {isLoadingCategories ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <DropdownMenuItem key={i} disabled className="rounded-xl flex items-center gap-3 mt-1">
                      <div className="w-6 h-6 rounded-full bg-border/40 animate-pulse shrink-0"></div>
                      <div className="h-4 w-16 bg-border/40 animate-pulse rounded"></div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  categories?.map((cat: any) => (
                    <DropdownMenuItem key={cat.id} onClick={() => setSelectedCategoryId(cat.id)} className="rounded-xl cursor-pointer text-sm font-medium flex items-center gap-3 mt-1">
                      {cat?.image && <img src={cat?.image} alt={cat.name} className="w-6 h-6 rounded-full shadow-sm object-cover" />}
                      {cat.name}
                    </DropdownMenuItem>
                  ))
                )}
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

          {/* <Link to="/admin" className="hidden sm:block">
            <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-full w-9 h-9 transition-colors" title="Admin Panel">
              <ShieldCheck size={20} />
            </Button>
          </Link> */}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" className="hidden sm:flex bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5 text-sm h-9 font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer">
                  <User size={16} className="me-2" />
                  {t('header.profile', 'Profile')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 sm:w-[200px] rounded-2xl shadow-lg border-border/40 p-2">
                <DropdownMenuItem asChild className="rounded-xl cursor-pointer text-sm font-medium">
                  <Link to="/profile" className="flex items-center gap-2 w-full">
                    <User size={15} />
                    {t('nav.my_profile')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl cursor-pointer text-sm font-medium">
                  <Link to="/wishlist" className="flex items-center gap-2 w-full">
                    <Heart size={15} />
                    {t('nav.wishlist')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl cursor-pointer text-sm font-medium">
                  <Link to="/orders" className="flex items-center gap-2 w-full">
                    <Package size={15} />
                    {t('nav.my_orders')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { logoutUser(); navigate('/'); }} className="rounded-xl cursor-pointer text-sm font-medium text-destructive focus:text-destructive flex items-center gap-2 mt-1 border-t border-border/50 pt-2">
                  <LogOut size={15} />
                  {t('nav.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="default" className="hidden sm:flex bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 text-sm h-9 font-semibold shadow-sm hover:shadow-md transition-all">
                {t('login_title')}
              </Button>
            </Link>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-foreground/70 hover:text-primary rounded-full w-9 h-9 ms-1">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side={i18n.language === 'ar' ? 'right' : 'left'} className="w-[85vw] sm:w-[400px] flex flex-col p-0 border-none">
              <div className="p-6 pb-4 border-b border-border/50 bg-muted/20">
                <SheetHeader>
                  <SheetTitle className="text-start">
                    <Link to="/" className="flex items-center gap-3 shrink-0">
                      <div className="bg-primary/10 rounded-xl p-2 shrink-0">
                        <img src={logoImg} alt="Logo" className="h-8 w-auto object-contain" />
                      </div>
                      <span className="font-bold text-2xl tracking-tight text-foreground truncate">{t('brand.name', 'Nouh carting')}</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                {/* Main Navigation */}
                <div className="space-y-1 mb-4">
                  <Link to="/" className="flex items-center gap-4 px-4 py-3 rounded-2xl text-base font-semibold text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all">
                    <Home size={22} className="text-primary/70 shrink-0" />
                    {t('nav.home', 'Home')}
                  </Link>
                  <Link to="/shop" className="flex items-center gap-4 px-4 py-3 rounded-2xl text-base font-semibold text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all">
                    <ShoppingBag size={22} className="text-primary/70 shrink-0" />
                    {t('header.products', 'Products')}
                  </Link>
                  <Link to="/about" className="flex items-center gap-4 px-4 py-3 rounded-2xl text-base font-semibold text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all">
                    <Info size={22} className="text-primary/70 shrink-0" />
                    {t('header.about', 'About')}
                  </Link>
                  <Link to="/contact" className="flex items-center gap-4 px-4 py-3 rounded-2xl text-base font-semibold text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all">
                    <PhoneCall size={22} className="text-primary/70 shrink-0" />
                    {t('nav.contact', 'Contact')}
                  </Link>
                </div>

                <div className="h-px w-full bg-border/50 my-2"></div>

                {/* Account Section */}
                {user ? (
                  <div className="space-y-1 mt-2">
                    <div className="px-4 py-2 mb-2">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('nav.account', 'My Account')}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-4 px-4 py-3 rounded-2xl text-base font-semibold text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all">
                      <User size={22} className="text-primary/70 shrink-0" />
                      {t('nav.my_profile', 'My Profile')}
                    </Link>
                    <Link to="/wishlist" className="flex items-center gap-4 px-4 py-3 rounded-2xl text-base font-semibold text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all">
                      <Heart size={22} className="text-primary/70 shrink-0" />
                      {t('nav.wishlist', 'Wishlist')}
                    </Link>
                    <Link to="/orders" className="flex items-center gap-4 px-4 py-3 rounded-2xl text-base font-semibold text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all">
                      <Package size={22} className="text-primary/70 shrink-0" />
                      {t('nav.my_orders', 'My Orders')}
                    </Link>
                    <button onClick={() => { logoutUser(); navigate('/'); }} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-base font-semibold text-destructive hover:bg-destructive/10 transition-all mt-4">
                      <LogOut size={22} className="shrink-0" />
                      {t('nav.logout', 'Logout')}
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 px-2">
                    <Link to="/login" className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3.5 rounded-2xl font-bold transition-all shadow-sm">
                      <User size={20} className="shrink-0" />
                      {t('login_title', 'Login')}
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
