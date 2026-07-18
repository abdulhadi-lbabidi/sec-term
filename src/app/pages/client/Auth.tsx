import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../api/client/useAuth';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';

import { Button } from '../../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address / بريد إلكتروني غير صالح" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters / كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
});

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
    <div className="max-w-md mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">{t('auth.login_title', 'Login')}</h1>
      <div className="bg-white shadow-sm p-8 rounded-2xl border border-border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.email', 'Email')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('auth.email_placeholder', 'you@example.com')} {...field} />
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
                  <FormLabel>{t('auth.password', 'Password')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={showPassword ? "text" : "password"} placeholder={t('auth.password_placeholder', '••••••••')} {...field} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground ${isRTL ? 'left-3' : 'right-3'}`}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm font-semibold text-primary hover:underline">
                {t('auth.forgot_password', 'Forgot Password?')}
              </Link>
            </div>

            <Button type="submit" className="w-full h-12 text-md font-bold rounded-xl" disabled={isLoggingIn}>
              {isLoggingIn ? t('auth.logging_in', 'Signing In...') : t('auth.signin', 'Sign In')}
            </Button>
          </form>
        </Form>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t('auth.no_account', "Don't have an account?")} <Link to="/register" className="text-primary font-semibold underline">{t('auth.register_link', 'Register')}</Link>
      </p>
    </div>
  );
};

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters / الاسم يجب أن يكون حرفين على الأقل" }),
  email: z.string().email({ message: "Invalid email address / بريد إلكتروني غير صالح" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters / كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
  password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match / كلمات المرور غير متطابقة",
  path: ["password_confirmation"],
});

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
    <div className="max-w-md mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">{t('auth.register_title', 'Register')}</h1>
      <div className="bg-white shadow-sm p-8 rounded-2xl border border-border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.name', 'Full Name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('auth.name_placeholder', 'John Doe')} {...field} />
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
                  <FormLabel>{t('auth.email', 'Email')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('auth.email_placeholder', 'you@example.com')} {...field} />
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
                  <FormLabel>{t('auth.password', 'Password')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={showPassword ? "text" : "password"} placeholder={t('auth.password_placeholder', '••••••••')} {...field} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground ${isRTL ? 'left-3' : 'right-3'}`}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                  <FormLabel>{t('auth.confirm_password', 'Confirm Password')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={showConfirmPassword ? "text" : "password"} placeholder={t('auth.password_placeholder', '••••••••')} {...field} />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground ${isRTL ? 'left-3' : 'right-3'}`}>
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-12 text-md font-bold rounded-xl" disabled={isRegistering}>
              {isRegistering ? t('auth.registering', 'Creating account...') : t('auth.signup', 'Sign Up')}
            </Button>
          </form>
        </Form>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t('auth.has_account', 'Already have an account?')} <Link to="/login" className="text-primary font-semibold underline">{t('auth.login_link', 'Login')}</Link>
      </p>
    </div>
  );
};
