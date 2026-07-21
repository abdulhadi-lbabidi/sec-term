import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../api/client/useAuth';
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

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters / الاسم يجب أن يكون حرفين على الأقل" }),
  email: z.string().email({ message: "Invalid email address / بريد إلكتروني غير صالح" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters / كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
  password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match / كلمات المرور غير متطابقة",
  path: ["password_confirmation"],
});

export const RegisterForm = () => {
  const { t, i18n } = useTranslation();
  const { register, isRegistering, loginWithGoogle } = useAuth();
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
    <>
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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                {t('auth.or_continue_with')}
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 text-md font-bold rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] bg-white border border-gray-200"
            onClick={loginWithGoogle}
          >
            <svg className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>
        </form>
      </Form>

      <p className="mt-8 text-center text-sm font-medium text-muted-foreground">
        {t('auth.has_account', 'Already have an account?')} <Link to="/login" className="text-primary font-bold hover:underline ml-1 rtl:mr-1">{t('auth.login_link', 'Login')}</Link>
      </p>
    </>
  );
};
