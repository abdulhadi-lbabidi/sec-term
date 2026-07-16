import React, { Suspense, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import './i18n/config';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ClientRoutes } from './Routes/routes_client';
import { AdminRoutes } from './Routes/routes_admin';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
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

export default function App() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <RouteFallbacks />
          </Router>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

