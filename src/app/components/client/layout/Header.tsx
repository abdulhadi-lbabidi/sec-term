import { Search, ShoppingCart, Menu, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/useAppStore';
import { Button } from '../../ui/button';

export const Header = () => {
  const { user, cart } = useAppStore();
  const navigate = useNavigate();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="w-full bg-white border-b border-gray-100 py-4">
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between gap-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 text-[var(--color-secondary)]">
            {/* Simple logo approximation with Lucide */}
            <ShoppingCart className="w-full h-full fill-current" />
          </div>
          <span className="text-2xl font-serif font-bold text-[var(--color-secondary)]">EasyMart</span>
        </Link>

        {/* Desktop Navigation & Search */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-8">
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors">Home</Link>
            <Link to="/catalog" className="text-sm font-medium text-gray-500 hover:text-[var(--color-secondary)] transition-colors">Catalog</Link>
            <Link to="/blog" className="text-sm font-medium text-gray-500 hover:text-[var(--color-secondary)] transition-colors">Blog</Link>
            <Link to="/pages" className="text-sm font-medium text-gray-500 hover:text-[var(--color-secondary)] transition-colors">Pages</Link>
            <Link to="/contact" className="text-sm font-medium text-gray-500 hover:text-[var(--color-secondary)] transition-colors">Contact</Link>
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-md flex items-center bg-[#F3F4F6] rounded-full px-4 py-2 border border-transparent focus-within:border-[var(--color-secondary)] transition-colors">
            <div className="flex items-center gap-1 border-e border-gray-300 pe-3 me-3 cursor-pointer">
              <span className="text-xs font-medium text-gray-600">All Categories</span>
              <ChevronDown className="w-3 h-3 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400"
            />
            <Search className="w-4 h-4 text-gray-400 ms-2 shrink-0" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative bg-[#FFF1EB] text-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:text-white rounded-full h-10 w-10 transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 end-0 -mt-1 -me-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {user ? (
            <Button onClick={() => navigate('/profile')} className="hidden md:flex bg-[var(--color-primary)] hover:bg-[#0f4a28] text-white rounded-full px-6 text-sm h-10">
              Profile
            </Button>
          ) : (
            <Button onClick={() => navigate('/login')} className="hidden md:flex bg-[var(--color-primary)] hover:bg-[#0f4a28] text-white rounded-full px-6 text-sm h-10 font-medium">
              Sign Up
            </Button>
          )}

          <Button variant="ghost" size="icon" className="md:hidden text-gray-600">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};
