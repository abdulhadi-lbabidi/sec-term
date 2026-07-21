import { useTranslation } from 'react-i18next';
import { AuthLayout } from '@/app/components/client/auth/AuthLayout';
import { RegisterForm } from '@/app/components/client/auth/RegisterForm';

export const RegisterPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <AuthLayout
      title={isRTL ? 'انضم لعائلتنا الكبيرة' : 'Join our big family'}
      subtitle={isRTL ? 'قم بإنشاء حسابك اليوم وابدأ رحلتك في تذوق ألذ أصناف المخبوزات المصنوعة بكل شغف.' : 'Create your account today and start your journey of tasting the most delicious bakery items made with passion.'}
      image="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200"
      reverse
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
