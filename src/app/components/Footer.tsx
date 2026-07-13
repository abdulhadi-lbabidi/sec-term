import React from 'react';
import { useTranslation } from 'react-i18next';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-black text-[#fefcfa] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold tracking-tighter">BAKERY.</h3>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              {t('about.summary')}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <Instagram size={20} className="hover:text-white transition-colors cursor-pointer" />
              <Facebook size={20} className="hover:text-white transition-colors cursor-pointer" />
              <Twitter size={20} className="hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">{t('nav.shop')}</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li className="hover:text-white cursor-pointer transition-colors">{t('shop.categories.bread')}</li>
              <li className="hover:text-white cursor-pointer transition-colors">{t('shop.categories.pastry')}</li>
              <li className="hover:text-white cursor-pointer transition-colors">{t('shop.categories.cake')}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li className="hover:text-white cursor-pointer transition-colors">Shipping Policy</li>
              <li className="hover:text-white cursor-pointer transition-colors">Returns & Refunds</li>
              <li className="hover:text-white cursor-pointer transition-colors">FAQs</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">{t('nav.contact')}</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li className="flex items-center space-x-3 rtl:space-x-reverse">
                <Phone size={16} />
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex items-center space-x-3 rtl:space-x-reverse">
                <Mail size={16} />
                <span>hello@bakery.com</span>
              </li>
              <li className="flex items-center space-x-3 rtl:space-x-reverse">
                <MapPin size={16} />
                <span>123 Baker St, Flour City</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/40 space-y-4 md:space-y-0 uppercase tracking-widest">
          <p>{t('footer.copyright')}</p>
          <div className="flex space-x-8 rtl:space-x-reverse">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
