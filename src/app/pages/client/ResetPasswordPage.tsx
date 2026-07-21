import { useTranslation } from 'react-i18next';
import { AuthLayout } from '@/app/components/client/auth/AuthLayout';
import { ResetPasswordForm } from '@/app/components/client/auth/ResetPasswordForm';

export const ResetPasswordPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <AuthLayout
      title={isRTL ? 'تأمين حسابك' : 'Secure your account'}
      subtitle={isRTL ? 'أنشئ كلمة مرور جديدة وقوية للحفاظ على أمان حسابك.' : 'Create a new and strong password to keep your account safe.'}
      image="https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=1200"
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
};

export default ResetPasswordPage;
