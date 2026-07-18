import React, { lazy, useEffect, useState } from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

import { Header } from '../components/client/layout/Header';
import { Footer } from '../components/client/layout/Footer';
import { CartDrawer } from '../components/client/cart/CartDrawer';

// Lazy loading our new components
const Home = lazy(() => import('../pages/client/HomePage'));
const Shop = lazy(() => import('../pages/client/ShopPage'));
const Product = lazy(() => import('../pages/client/ProductPage'));
const Checkout = lazy(() => import('../pages/client/CheckoutPage'));
const Orders = lazy(() => import('../pages/client/OrdersPage'));
// Stubs for remaining ones that might be implemented later or use existing ones
const Login = lazy(() => import('../pages/Auth').then(m => ({ default: m.Login })).catch(() => ({ default: () => <div>Login</div> })));
const Register = lazy(() => import('../pages/Auth').then(m => ({ default: m.Register })).catch(() => ({ default: () => <div>Register</div> })));

const ClientLayout = () => {
  const { language } = useAppStore();
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    // Removed hardcoded font-family to allow tailwind CSS to handle it
    document.documentElement.style.fontFamily = ''; 
  }, [language]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-black antialiased font-sans">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      {/* Exposing globally for easy access, in real app this could be triggered via store or context */}
      <div id="cart-trigger" style={{display: 'none'}} onClick={() => setIsCartOpen(true)}></div>
    </div>
  );
};

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const ClientRoutes = (
  <Route path="/" element={<ClientLayout />}>
    <Route index element={<Home />} />
    <Route path="shop" element={<Shop />} />
    <Route path="product/:id" element={<Product />} />
    <Route path="orders" element={
      <RequireAuth>
        <Orders />
      </RequireAuth>
    } />
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
    <Route
      path="checkout"
      element={
        <RequireAuth>
          <Checkout />
        </RequireAuth>
      }
    />
  </Route>
);
