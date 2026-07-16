import React, { Suspense, lazy, useEffect } from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const Home = lazy(() => import('../pages/Home').then((mod) => ({ default: mod.Home })));
const Shop = lazy(() => import('../pages/Shop').then((mod) => ({ default: mod.Shop })));
const About = lazy(() => import('../pages/About').then((mod) => ({ default: mod.About })));
const Contact = lazy(() => import('../pages/Contact').then((mod) => ({ default: mod.Contact })));
const Login = lazy(() => import('../pages/Auth').then((mod) => ({ default: mod.Login })));
const Register = lazy(() => import('../pages/Auth').then((mod) => ({ default: mod.Register })));
const Checkout = lazy(() => import('../pages/Checkout').then((mod) => ({ default: mod.Checkout })));

const ClientLayout = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const ClientRoutes = (
  <Route path="/" element={<ClientLayout />}>
    <Route index element={<Home />} />
    <Route path="shop" element={<Shop />} />
    <Route path="about" element={<About />} />
    <Route path="contact" element={<Contact />} />
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
