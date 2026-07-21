import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/app/store/useAppStore';
import { toast } from 'sonner';

export const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const loginUser = useAppStore(state => state.loginUser);

  useEffect(() => {
    const token = searchParams.get('token');
    const role = searchParams.get('role') || 'customer';
    const email = searchParams.get('email') || '';
    const error = searchParams.get('error');

    if (error) {
      toast.error(error || t('auth.login_failed', 'Login failed'));
      navigate('/login');
      return;
    }

    if (token) {
      localStorage.setItem('nouh_client_token', token);
      loginUser(email, role as any);
      toast.success(t('auth.login_success', 'Logged in successfully!'));
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, t, loginUser]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">{t('auth.authenticating', 'Authenticating...')}</h2>
        <p className="text-muted-foreground">{t('auth.please_wait', 'Please wait while we complete your sign in.')}</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
