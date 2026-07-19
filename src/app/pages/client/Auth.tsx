import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../api/client/useAuth';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';

import { Button } from '@/app/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import { cn } from '@/lib/utils';
import { AuthLayout } from '@/app/components/client/auth/AuthLayout';

// --- Validation Schemas ---
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address / بريد إلكتروني غير صالح" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters / كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
});

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters / الاسم يجب أن يكون حرفين على الأقل" }),
  email: z.string().email({ message: "Invalid email address / بريد إلكتروني غير صالح" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters / كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
  password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match / كلمات المرور غير متطابقة",
  path: ["password_confirmation"],
});

// --- Login Page ---
export const Login = () => {
  const { t, i18n } = useTranslation();
  const { login, isLoggingIn } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const isRTL = i18n.language === 'ar';

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    login(values, {
      onSuccess: () => {
        toast.success(t('auth.login_success', 'Logged in successfully!'));
        navigate('/');
      },
      onError: (error) => {
        toast.error(error.message);
      }
    });
  };

  return (
    <AuthLayout
      title={isRTL ? 'أهلاً بك مجدداً في عالمنا' : 'Welcome back to our world'}
      subtitle={isRTL ? 'سجل دخولك الآن واستمتع بتجربة تسوق فريدة لأشهى المخبوزات والحلويات الطازجة التي تُصنع بحب.' : 'Sign in now and enjoy a unique shopping experience for the most delicious fresh baked goods.'}
      image="https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=1200"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-foreground mb-2">{t('auth.login_title', 'Login')}</h1>
        <p className="text-muted-foreground">{t('auth.login_subtitle', isRTL ? 'سجل دخولك للمتابعة' : 'Sign in to continue')}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">{t('auth.email', 'Email')}</FormLabel>
                <FormControl>
                  <Input className="h-12 rounded-xl bg-muted/50 border-transparent focus-visible:bg-transparent" placeholder={t('auth.email_placeholder', 'you@example.com')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">{t('auth.password', 'Password')}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input className="h-12 rounded-xl bg-muted/50 border-transparent focus-visible:bg-transparent" type={showPassword ? "text" : "password"} placeholder={t('auth.password_placeholder', '••••••••')} {...field} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className={cn(
                      "absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
                      isRTL ? 'left-4' : 'right-4'
                    )}>
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-1">
            <Link to="/forgot-password" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
              {t('auth.forgot_password')}
            </Link>
          </div>

          <Button type="submit" className="w-full h-12 text-md font-bold rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={isLoggingIn}>
            {isLoggingIn ? t('auth.logging_in', 'Signing In...') : t('auth.signin', 'Sign In')}
          </Button>
        </form>
      </Form>

      <p className="mt-8 text-center text-sm font-medium text-muted-foreground">
        {t('auth.no_account', "Don't have an account?")} <Link to="/register" className="text-primary font-bold hover:underline ml-1 rtl:mr-1">{t('auth.register_link', 'Register')}</Link>
      </p>
    </AuthLayout>
  );
};

// --- Register Page ---
export const Register = () => {
  const { t, i18n } = useTranslation();
  const { register, isRegistering } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isRTL = i18n.language === 'ar';

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    register(values, {
      onSuccess: () => {
        toast.success(t('auth.register_success', 'Account created successfully!'));
        navigate('/');
      },
      onError: (error) => {
        toast.error(error.message);
      }
    });
  };

  return (
    <AuthLayout
      title={isRTL ? 'انضم لعائلتنا الكبيرة' : 'Join our big family'}
      subtitle={isRTL ? 'قم بإنشاء حسابك اليوم وابدأ رحلتك في تذوق ألذ أصناف المخبوزات المصنوعة بكل شغف.' : 'Create your account today and start your journey of tasting the most delicious bakery items made with passion.'}
      image="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200"
      reverse
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-foreground mb-2">{t('auth.register_title', 'Register')}</h1>
        <p className="text-muted-foreground">{t('auth.register_subtitle', isRTL ? 'املأ البيانات لإنشاء حسابك' : 'Fill in your details to create an account')}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">{t('auth.name', 'Full Name')}</FormLabel>
                <FormControl>
                  <Input className="h-12 rounded-xl bg-muted/50 border-transparent focus-visible:bg-transparent" placeholder={t('auth.name_placeholder', 'John Doe')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">{t('auth.email', 'Email')}</FormLabel>
                <FormControl>
                  <Input className="h-12 rounded-xl bg-muted/50 border-transparent focus-visible:bg-transparent" placeholder={t('auth.email_placeholder', 'you@example.com')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">{t('auth.password', 'Password')}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input className="h-12 rounded-xl bg-muted/50 border-transparent focus-visible:bg-transparent" type={showPassword ? "text" : "password"} placeholder={t('auth.password_placeholder', '••••••••')} {...field} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className={cn(
                      "absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
                      isRTL ? 'left-4' : 'right-4'
                    )}>
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">{t('auth.confirm_password', 'Confirm Password')}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input className="h-12 rounded-xl bg-muted/50 border-transparent focus-visible:bg-transparent" type={showConfirmPassword ? "text" : "password"} placeholder={t('auth.password_placeholder', '••••••••')} {...field} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={cn(
                      "absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
                      isRTL ? 'left-4' : 'right-4'
                    )}>
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full h-12 text-md font-bold rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] mt-6" disabled={isRegistering}>
            {isRegistering ? t('auth.registering', 'Creating account...') : t('auth.signup', 'Sign Up')}
          </Button>
        </form>
      </Form>

      <p className="mt-8 text-center text-sm font-medium text-muted-foreground">
        {t('auth.has_account', 'Already have an account?')} <Link to="/login" className="text-primary font-bold hover:underline ml-1 rtl:mr-1">{t('auth.login_link', 'Login')}</Link>
      </p>
    </AuthLayout>
  );
};

