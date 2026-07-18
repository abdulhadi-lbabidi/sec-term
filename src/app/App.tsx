import React, { Suspense, useEffect } from 'react';
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

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const PageFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center px-4">
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-black/15 border-t-black" />
  </div>
);

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

function initializeLang(): string | null {
  const path = window.location.pathname;
  // Match the first URL segment, ignoring leading slash
  const match = path.match(/^\/([a-z]{2})(\/|$)/);
  let lang = match ? match[1] : null;

  if (!lang || !VALID_LANGS.includes(lang)) {
    // If no valid language is found in URL, redirect to default language prefix
    // For example: /shop -> /ar/shop
    lang = VALID_LANGS.includes(DEFAULT_LANG) ? DEFAULT_LANG : 'ar';
    const cleanPath = path === '/' ? '' : path;
    window.location.replace(`/${lang}${cleanPath}${window.location.search}`);
    return null; // Don't render until redirected
  }

  // Persist language preference
  localStorage.setItem('lang', lang);
  return lang;
}

export default function App() {
  const lang = initializeLang();
  
  if (!lang) return null; // Wait for redirect to complete

  // Sync i18n and global store with URL language immediately
  if (i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }
  
  // Safe to call synchronously to ensure early setup before rendering layouts
  const { language: storeLang, setLanguage } = useAppStore.getState();
  if (storeLang !== lang) {
    setLanguage(lang as 'ar' | 'en');
  }

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router basename={`/${lang}`}>
            <ScrollToTop />
            <RouteFallbacks />
          </Router>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
