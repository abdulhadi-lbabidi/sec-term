import { lazy, useEffect, useState } from 'react';
import { Route, Outlet } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

import { Header } from '../components/client/layout/Header';
import { Footer } from '../components/client/layout/Footer';
import { CartDrawer } from '../components/client/cart/CartDrawer';
import { AuthGuard } from '../components/client/security/AuthGuard';
import { CookieConsent } from '../components/client/layout/CookieConsent';

// Lazy loading our new components
const Home = lazy(() => import('../pages/client/HomePage'));
const Shop = lazy(() => import('../pages/client/ShopPage'));
const Product = lazy(() => import('../pages/client/ProductPage'));
const Checkout = lazy(() => import('../pages/client/CheckoutPage'));
const Orders = lazy(() => import('../pages/client/OrdersPage'));

const Login = lazy(() => import('../pages/client/LoginPage'));
const Register = lazy(() => import('../pages/client/RegisterPage'));
const ForgotPassword = lazy(() => import('../pages/client/ForgotPasswordPage'));
const ResetPassword = lazy(() => import('../pages/client/ResetPasswordPage'));
const AuthCallback = lazy(() => import('../pages/client/AuthCallbackPage'));
const Cart = lazy(() => import('../pages/client/CartPage'));
const About = lazy(() => import('../pages/client/About').then(m => ({ default: m.About })));
const Contact = lazy(() => import('../pages/client/Contact').then(m => ({ default: m.Contact })));
const Profile = lazy(() => import('../pages/client/ProfilePage'));
const Wishlist = lazy(() => import('../pages/client/WishlistPage'));
const FAQPage = lazy(() => import('../pages/client/FAQPage'));
const TermsPage = lazy(() => import('../pages/client/TermsPage'));
const PrivacyPage = lazy(() => import('../pages/client/PrivacyPage'));

const ClientLayout = () => {
  const { language } = useAppStore();
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.documentElement.style.fontFamily = '';
  }, [language]);

  return (
    <div className="flex min-h-screen justify-center items-center flex-col bg-background text-black antialiased font-sans">
      <Header />
      <main className="left-0 right-0 max-w-7xl w-full">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <CookieConsent />
      {/* Exposing globally for easy access, in real app this could be triggered via store or context */}
      <div id="cart-trigger" style={{ display: 'none' }} onClick={() => setIsCartOpen(true)}></div>
    </div>
  );
};

export const ClientRoutes = (
  <Route path="/" element={<ClientLayout />}>
    <Route index element={<Home />} />
    <Route path="shop" element={<Shop />} />
    <Route path="product/:id" element={<Product />} />

    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
    <Route path="forgot-password" element={<ForgotPassword />} />
    <Route path="reset-password" element={<ResetPassword />} />
    <Route path="auth/callback" element={<AuthCallback />} />

    <Route path="cart" element={<Cart />} />
    <Route path="wishlist" element={<Wishlist />} />
    <Route path="about" element={<About />} />
    <Route path="contact" element={<Contact />} />
    <Route path="faq" element={<FAQPage />} />
    <Route path="terms" element={<TermsPage />} />
    <Route path="privacy" element={<PrivacyPage />} />

    {/* Protected Routes */}
    <Route path="orders" element={
      <AuthGuard>
        <Orders />
      </AuthGuard>
    } />
    <Route path="profile" element={
      <AuthGuard>
        <Profile />
      </AuthGuard>
    } />
    <Route path="checkout" element={
      <AuthGuard>
        <Checkout />
      </AuthGuard>
    } />
  </Route>
);
