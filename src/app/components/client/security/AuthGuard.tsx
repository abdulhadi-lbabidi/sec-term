import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/app/store/useAppStore';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAdmin = false }) => {
  const { user } = useAppStore();
  const location = useLocation();

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    // If route requires admin but user is not admin, redirect to home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
