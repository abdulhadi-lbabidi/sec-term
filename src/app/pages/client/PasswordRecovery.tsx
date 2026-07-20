import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/api/client/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';

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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/app/components/ui/input-otp';
import { AuthLayout } from '@/app/components/client/auth/AuthLayout';
import { cn } from '@/lib/utils';

const forgotSchema = z.object({
  email: z.string().email({ message: "Invalid email address / بريد إلكتروني غير صالح" }),
});

const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits / الرمز يجب أن يكون 6 أرقام" }),
});

const resetSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters / كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match / كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

// --- Forgot Password Page ---
export const ForgotPassword = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { forgotPassword, isForgotLoading } = useAuth();
  const isRTL = i18n.language === 'ar';

  const forgotForm = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  const onForgotSubmit = async (values: z.infer<typeof forgotSchema>) => {
    try {
      await forgotPassword({ email: values.email });
      toast.success(t('recovery.otp_sent', 'OTP sent to your email'));
      navigate(`/verify-otp?email=${encodeURIComponent(values.email)}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <AuthLayout
      title={isRTL ? 'استعادة الوصول لحسابك' : 'Recover your account'}
      subtitle={isRTL ? 'سنقوم بمساعدتك في استعادة كلمة المرور لتتمكن من العودة لتسوق ألذ المخبوزات.' : 'We will help you recover your password so you can return to shopping the most delicious baked goods.'}
      image="https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&q=80&w=1200"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-foreground mb-3">{t('recovery.forgot_title', 'Forgot Password?')}</h1>
        <p className="text-muted-foreground">{t('recovery.forgot_desc', 'Enter your email address and we will send you an OTP to reset your password.')}</p>
      </div>

      <Form {...forgotForm}>
        <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} className="space-y-6">
          <FormField
            control={forgotForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">{t('auth.email', 'Email Address')}</FormLabel>
                <FormControl>
                  <Input className="h-12 rounded-xl bg-muted/50 border-transparent focus-visible:bg-transparent" placeholder={t('auth.email_placeholder', 'you@example.com')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full h-12 text-md font-bold rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={isForgotLoading}>
            {isForgotLoading ? '...' : t('recovery.send_otp', 'Send OTP')}
          </Button>
        </form>
      </Form>

      <Link to="/login" className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
        {t('recovery.back_to_login', 'Back to Login')}
      </Link>
    </AuthLayout>
  );
};

// --- Verify OTP Page ---
export const VerifyOTP = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const { verifyOTP, isVerifyLoading } = useAuth();
  const isRTL = i18n.language === 'ar';

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  if (!email) {
    navigate('/forgot-password');
    return null;
  }

  const onOtpSubmit = async (values: z.infer<typeof otpSchema>) => {
    try {
      await verifyOTP({ email, otp: values.otp });
      toast.success(t('recovery.otp_verified', 'OTP Verified'));
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <AuthLayout
      title={isRTL ? 'التحقق من الرمز' : 'Verify the Code'}
      subtitle={isRTL ? 'خطوة واحدة تفصلك عن استعادة حسابك والمزيد من الخبز الطازج.' : 'One step away from recovering your account and more fresh bread.'}
      image="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200"
      reverse
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-foreground mb-3">{t('recovery.otp_title', 'Verify OTP')}</h1>
        <p className="text-muted-foreground">{t('recovery.otp_desc', 'Enter the 6-digit code sent to your email.')}</p>
        <p className="text-sm font-semibold text-primary mt-2" dir="ltr">{email}</p>
      </div>

      <div className="flex flex-col items-center">
        <Form {...otpForm}>
          <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-8 w-full flex flex-col items-center">
            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormControl>
                    <InputOTP maxLength={6} {...field} dir="ltr">
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="w-10 h-12 md:w-12 md:h-14 text-lg rounded-xl border-border/60 bg-muted/30" />
                        <InputOTPSlot index={1} className="w-10 h-12 md:w-12 md:h-14 text-lg rounded-xl border-border/60 bg-muted/30" />
                        <InputOTPSlot index={2} className="w-10 h-12 md:w-12 md:h-14 text-lg rounded-xl border-border/60 bg-muted/30" />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} className="w-10 h-12 md:w-12 md:h-14 text-lg rounded-xl border-border/60 bg-muted/30" />
                        <InputOTPSlot index={4} className="w-10 h-12 md:w-12 md:h-14 text-lg rounded-xl border-border/60 bg-muted/30" />
                        <InputOTPSlot index={5} className="w-10 h-12 md:w-12 md:h-14 text-lg rounded-xl border-border/60 bg-muted/30" />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-12 text-md font-bold rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={isVerifyLoading}>
              {isVerifyLoading ? '...' : t('recovery.verify', 'Verify')}
            </Button>
          </form>
        </Form>

        <Link to="/forgot-password" className="mt-8 text-sm font-semibold text-primary hover:underline">
          {t('recovery.resend', 'Resend Code')}
        </Link>
      </div>
    </AuthLayout>
  );
};

// --- Reset Password Page ---
export const ResetPassword = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const { resetPassword, isResetLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isRTL = i18n.language === 'ar';

  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  if (!email) {
    navigate('/forgot-password');
    return null;
  }

  const onResetSubmit = async (values: z.infer<typeof resetSchema>) => {
    try {
      await resetPassword({ email, password: values.password });
      toast.success(t('recovery.success', 'Password reset successfully!'));
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <AuthLayout
      title={isRTL ? 'تأمين حسابك' : 'Secure your account'}
      subtitle={isRTL ? 'قم بإنشاء كلمة مرور جديدة وقوية للحفاظ على أمان حسابك.' : 'Create a new and strong password to keep your account safe.'}
      image="https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=1200"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-foreground mb-3">{t('recovery.reset_title', 'Reset Password')}</h1>
        <p className="text-muted-foreground">{t('recovery.reset_desc', 'Enter your new password below.')}</p>
      </div>

      <Form {...resetForm}>
        <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-6">
          <FormField
            control={resetForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">{t('recovery.new_password', 'New Password')}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input className="h-12 rounded-xl bg-muted/50 border-transparent focus-visible:bg-transparent" type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} />
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
            control={resetForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">{t('recovery.confirm_password', 'Confirm Password')}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input className="h-12 rounded-xl bg-muted/50 border-transparent focus-visible:bg-transparent" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" {...field} />
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
          <Button type="submit" className="w-full h-12 text-md font-bold rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] mt-4" disabled={isResetLoading}>
            {isResetLoading ? '...' : t('recovery.reset_btn', 'Reset Password')}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
};

