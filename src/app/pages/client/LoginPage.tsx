import { useTranslation } from 'react-i18next';
import { AuthLayout } from '@/app/components/client/auth/AuthLayout';
import { LoginForm } from '@/app/components/client/auth/LoginForm';

export const LoginPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <AuthLayout
      title={isRTL ? 'أهلاً بك مجدداً في عالمنا' : 'Welcome back to our world'}
      subtitle={isRTL ? 'سجل دخولك الآن واستمتع بتجربة تسوق فريدة لأشهى المخبوزات والحلويات الطازجة التي تُصنع بحب.' : 'Sign in now and enjoy a unique shopping experience for the most delicious fresh baked goods.'}
      image="https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=1200"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
