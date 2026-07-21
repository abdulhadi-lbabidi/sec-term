import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/api/client/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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

const forgotSchema = z.object({
  email: z.string().email({ message: "Invalid email address / بريد إلكتروني غير صالح" }),
});

export const ForgotPasswordForm = () => {
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
      toast.success(t('recovery.email_sent', 'Reset link sent to your email.'));
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-foreground mb-3">{t('recovery.forgot_title', 'Forgot Password?')}</h1>
        <p className="text-muted-foreground">{t('recovery.forgot_desc', 'Enter your email address and we will send you a link to reset your password.')}</p>
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
            {isForgotLoading ? '...' : t('recovery.send_link', 'Send Reset Link')}
          </Button>
        </form>
      </Form>

      <Link to="/login" className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
        {t('recovery.back_to_login', 'Back to Login')}
      </Link>
    </>
  );
};
