import { useTranslation } from 'react-i18next';
import { AuthLayout } from '@/app/components/client/auth/AuthLayout';
import { ForgotPasswordForm } from '@/app/components/client/auth/ForgotPasswordForm';

export const ForgotPasswordPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <AuthLayout
      title={isRTL ? 'استعادة الوصول لحسابك' : 'Recover your account'}
      subtitle={isRTL ? 'سنساعدك في استعادة كلمة المرور لتتمكن من العودة لتسوق ألذ المخبوزات.' : 'We will help you recover your password so you can return to shopping the most delicious baked goods.'}
      image="https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&q=80&w=1200"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
