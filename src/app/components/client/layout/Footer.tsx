import { ShoppingCart, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-[#F9FAFB] pt-16 pb-8 border-t border-gray-200">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">

          {/* Column 1: Brand & Contact */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 text-[var(--color-secondary)]">
                <ShoppingCart className="w-full h-full fill-current" />
              </div>
              <span className="text-xl font-serif font-bold text-[var(--color-secondary)]">EasyMart</span>
            </Link>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-600 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>+1234 567 890</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>hello@easymart.com</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-[var(--color-secondary)] text-white flex items-center justify-center hover:bg-orange-600 transition-colors">
                <Facebook className="w-4 h-4 fill-current" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 transition-colors">
                <Twitter className="w-4 h-4 fill-current" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: About */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6">About</h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li><Link to="/about" className="hover:text-[var(--color-secondary)] transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-[var(--color-secondary)] transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-[var(--color-secondary)] transition-colors">Contact Us</Link></li>
              <li><Link to="/categories" className="hover:text-[var(--color-secondary)] transition-colors">Categories</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li><Link to="/account" className="hover:text-[var(--color-secondary)] transition-colors">My Account</Link></li>
              <li><Link to="/terms" className="hover:text-[var(--color-secondary)] transition-colors">Terms of Use</Link></li>
              <li><Link to="/faq" className="hover:text-[var(--color-secondary)] transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li><Link to="/contact" className="hover:text-[var(--color-secondary)] transition-colors">Contact</Link></li>
              <li><Link to="/support" className="hover:text-[var(--color-secondary)] transition-colors">Support Center</Link></li>
              <li><Link to="/feedback" className="hover:text-[var(--color-secondary)] transition-colors">Feedback</Link></li>
              <li><Link to="/accessibility" className="hover:text-[var(--color-secondary)] transition-colors">Accessibility</Link></li>
            </ul>
          </div>

          {/* Column 5: Quick Touch */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Quick Touch</h4>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              4517 Washington Ave. Manchester, Kentucky 39495
            </p>
            <div>
              <h5 className="font-semibold text-gray-900 mb-3 text-sm">Download App</h5>
              <div className="flex gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-8 cursor-pointer hover:opacity-80 transition-opacity" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-8 cursor-pointer hover:opacity-80 transition-opacity" />
              </div>
            </div>
          </div>

        </div>

        <div className="text-center pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">© 2024 EasyMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
