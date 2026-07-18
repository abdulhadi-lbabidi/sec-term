import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../api/client/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '../../components/ui/input-otp';

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

export default function PasswordRecovery() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { forgotPassword, isForgotLoading, verifyOTP, isVerifyLoading, resetPassword, isResetLoading } = useAuth();

  const [step, setStep] = useState<'forgot' | 'otp' | 'reset'>('forgot');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isRTL = i18n.language === 'ar';

  const forgotForm = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onForgotSubmit = async (values: z.infer<typeof forgotSchema>) => {
    try {
      await forgotPassword({ email: values.email });
      setEmail(values.email);
      setStep('otp');
      toast.success(t('recovery.otp_sent', 'OTP sent to your email'));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onOtpSubmit = async (values: z.infer<typeof otpSchema>) => {
    try {
      await verifyOTP({ email, otp: values.otp });
      setStep('reset');
      toast.success(t('recovery.otp_verified', 'OTP Verified'));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

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
    <div className="max-w-md mx-auto py-16 px-4 min-h-[60vh]">
      {step === 'forgot' && (
        <>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-3">{t('recovery.forgot_title', 'Forgot Password?')}</h1>
            <p className="text-muted-foreground">{t('recovery.forgot_desc', 'Enter your email address and we will send you an OTP to reset your password.')}</p>
          </div>
          <div className="bg-card shadow-sm p-8 rounded-2xl border border-border">
            <Form {...forgotForm}>
              <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} className="space-y-6">
                <FormField
                  control={forgotForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.email', 'Email Address')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('auth.email_placeholder', 'you@example.com')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full h-12 text-md font-bold rounded-xl" disabled={isForgotLoading}>
                  {isForgotLoading ? '...' : t('recovery.send_otp', 'Send OTP')}
                </Button>
              </form>
            </Form>
          </div>
          <Link to="/login" className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft size={16} className={isRTL ? 'rotate-180' : ''} />
            {t('recovery.back_to_login', 'Back to Login')}
          </Link>
        </>
      )}

      {step === 'otp' && (
        <>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-3">{t('recovery.otp_title', 'Verify OTP')}</h1>
            <p className="text-muted-foreground">{t('recovery.otp_desc', 'Enter the 6-digit code sent to your email.')}</p>
          </div>
          <div className="bg-card shadow-sm p-8 rounded-2xl border border-border flex flex-col items-center">
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-8 w-full max-w-sm flex flex-col items-center">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center">
                      <FormControl>
                        <InputOTP maxLength={6} {...field} dir="ltr">
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full h-12 text-md font-bold rounded-xl" disabled={isVerifyLoading}>
                  {isVerifyLoading ? '...' : t('recovery.verify', 'Verify')}
                </Button>
              </form>
            </Form>
          </div>
          <button onClick={() => setStep('forgot')} className="mt-6 w-full text-center text-sm text-primary font-semibold hover:underline">
            {t('recovery.resend', 'Resend Code')}
          </button>
        </>
      )}

      {step === 'reset' && (
        <>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-3">{t('recovery.reset_title', 'Reset Password')}</h1>
            <p className="text-muted-foreground">{t('recovery.reset_desc', 'Enter your new password below.')}</p>
          </div>
          <div className="bg-card shadow-sm p-8 rounded-2xl border border-border">
            <Form {...resetForm}>
              <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-6">
                <FormField
                  control={resetForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('recovery.new_password', 'New Password')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} />
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
                  control={resetForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('recovery.confirm_password', 'Confirm Password')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground ${isRTL ? 'left-3' : 'right-3'}`}>
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full h-12 text-md font-bold rounded-xl" disabled={isResetLoading}>
                  {isResetLoading ? '...' : t('recovery.reset_btn', 'Reset Password')}
                </Button>
              </form>
            </Form>
          </div>
        </>
      )}
    </div>
  );
}
