import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocalization } from '../hooks/useLocalization';

export const Navbar = () => {
  const { t, i18n, toggleLanguage } = useLocalization();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { name: t('nav.home'), path: '/client' },
    { name: t('nav.shop'), path: '/client/shop' },
    { name: t('nav.about'), path: '/client/about' },
    { name: t('nav.contact'), path: '/client/contact' },
  ];

  const isDark = location.pathname === '/'; // Hero might need transparency or contrast

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 bg-[#fefcfa]/90 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/client" className="text-2xl font-bold tracking-tighter text-black">
              BAKERY<span className="text-[#000000]/40">.</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium uppercase tracking-widest hover:text-black/60 transition-colors ${
                  location.pathname === link.path ? 'text-black' : 'text-black/40'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <button
              onClick={toggleLanguage}
              className="p-2 hover:bg-black/5 rounded-full transition-colors flex items-center space-x-2 rtl:space-x-reverse"
            >
              <Globe size={18} />
              <span className="text-xs font-bold uppercase">{i18n.language === 'en' ? 'AR' : 'EN'}</span>
            </button>
            
            <button className="p-2 hover:bg-black/5 rounded-full transition-colors relative">
              <ShoppingBag size={18} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-black rounded-full"></span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4 rtl:space-x-reverse">
             <button
              onClick={toggleLanguage}
              className="p-2 flex items-center space-x-1"
            >
              <span className="text-xs font-bold uppercase">{i18n.language === 'en' ? 'AR' : 'EN'}</span>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-black"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#fefcfa] border-b border-black/5 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-black border-b border-black/5"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
