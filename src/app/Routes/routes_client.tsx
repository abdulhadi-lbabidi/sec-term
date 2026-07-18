import { lazy, useEffect, useState } from 'react';
import { Route, Outlet } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

import { Header } from '../components/client/layout/Header';
import { Footer } from '../components/client/layout/Footer';
import { CartDrawer } from '../components/client/cart/CartDrawer';
import { AuthGuard } from '../components/client/security/AuthGuard';

// Lazy loading our new components
const Home = lazy(() => import('../pages/client/HomePage'));
const Shop = lazy(() => import('../pages/client/ShopPage'));
const Product = lazy(() => import('../pages/client/ProductPage'));
const Checkout = lazy(() => import('../pages/client/CheckoutPage'));
const Orders = lazy(() => import('../pages/client/OrdersPage'));

const Login = lazy(() => import('../pages/client/Auth').then(m => ({ default: m.Login })).catch(() => ({ default: () => <div>Login</div> })));
const Register = lazy(() => import('../pages/client/Auth').then(m => ({ default: m.Register })).catch(() => ({ default: () => <div>Register</div> })));
const PasswordRecovery = lazy(() => import('../pages/client/PasswordRecovery')); // Force TS re-check

const Cart = lazy(() => import('../pages/client/CartPage'));
const About = lazy(() => import('../pages/client/About').then(m => ({ default: m.About })));
const Contact = lazy(() => import('../pages/client/Contact').then(m => ({ default: m.Contact })));
const Blog = lazy(() => import('../pages/client/BlogPage'));
const Profile = lazy(() => import('../pages/client/ProfilePage'));
const Wishlist = lazy(() => import('../pages/client/WishlistPage'));

const ClientLayout = () => {
  const { language } = useAppStore();
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
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
    <Route path="forgot-password" element={<PasswordRecovery />} />

    <Route path="cart" element={<Cart />} />
    <Route path="wishlist" element={<Wishlist />} />
    <Route path="about" element={<About />} />
    <Route path="contact" element={<Contact />} />
    <Route path="blog" element={<Blog />} />

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
