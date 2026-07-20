import { Suspense, useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });

import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import i18n from './i18n/config';
import { useAppStore } from './store/useAppStore';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ClientRoutes } from './Routes/routes_client';
import { AdminRoutes } from './Routes/routes_admin';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { Toaster } from './components/ui/sonner';
import { HelmetProvider } from 'react-helmet-async';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const PageFallback = () => {
  useEffect(() => {
    NProgress.start();
    return () => {
      NProgress.done();
    };
  }, []);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-black/15 border-t-black" />
    </div>
  );
};

function RouteFallbacks() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {ClientRoutes}
        {AdminRoutes}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

// ------------------------------------------------------------------
// Routing & Language Initialization
// ------------------------------------------------------------------
const VALID_LANGS = ['en', 'ar'];
const DEFAULT_LANG = localStorage.getItem('lang') || 'ar';

function initializeLang(): string {
  const lang = VALID_LANGS.includes(DEFAULT_LANG) ? DEFAULT_LANG : 'ar';
  
  // Persist language preference
  localStorage.setItem('lang', lang);
  return lang;
}

export default function App() {
  const lang = initializeLang();

  // Sync i18n and global store with URL language immediately
  if (i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }

  // Set RTL direction and language for the document
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Safe to call synchronously to ensure early setup before rendering layouts
  const { language: storeLang, setLanguage } = useAppStore.getState();
  if (storeLang !== lang) {
    setLanguage(lang as 'ar' | 'en');
  }

  const queryClient = new QueryClient();
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <Router>
              <ScrollToTop />
              <RouteFallbacks />
            </Router>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
