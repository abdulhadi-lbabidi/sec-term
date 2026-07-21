import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/api/client/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

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

const resetSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters / 6 أحرف على الأقل" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match / كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

export const ResetPasswordForm = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  const { resetPassword, isResetLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isRTL = i18n.language === 'ar';

  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  if (!email || !token) {
    setTimeout(() => navigate('/forgot-password'), 0);
    return null;
  }

  const onResetSubmit = async (values: z.infer<typeof resetSchema>) => {
    try {
      await resetPassword({ 
        email, 
        token, 
        password: values.password, 
        password_confirmation: values.confirmPassword 
      });
      toast.success(t('recovery.success', 'Password reset successfully!'));
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
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
    </>
  );
};
