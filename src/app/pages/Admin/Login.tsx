import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export const Login = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('nouh_carting_roken');
  if (token) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(isRtl ? 'الرجاء ملء جميع الحقول' : 'Please fill in all fields');
      return;
    }
    localStorage.setItem('nouh_carting_roken', 'mock-admin-token-value-12345');
    navigate('/admin/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fcfaf7] px-4 text-black">
      <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tight">
            {isRtl ? 'تسجيل الدخول للمشرف' : 'Admin Login'}
          </h2>
          <p className="mt-2 text-sm text-black/60">
            {isRtl ? 'أدخل بيانات الاعتماد الخاصة بك للوصول' : 'Enter your credentials to access the workspace'}
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">
              {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {isRtl ? 'كلمة المرور' : 'Password'}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            {isRtl ? 'تسجيل الدخول' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
};
