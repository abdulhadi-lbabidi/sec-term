import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Clock, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/app/components/ui/button';
import { toast } from 'sonner';
import { useContactUsMutation } from '@/app/api/client/useContact';

export const Contact = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { mutateAsync: sendContactMail, isPending: isLoading } = useContactUsMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error(t('contact.error_fill_all', 'الرجاء تعبئة جميع الحقول'));
      return;
    }
    
    try {
      await sendContactMail({ name, email, message });
      toast.success(t('contact.success_message', 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.'));
      setName('');
      setEmail('');
      setMessage('');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t('contact.error_send', 'حدث خطأ أثناء إرسال الرسالة. الرجاء المحاولة مرة أخرى.'));
    }
  };

  return (
    <div className="w-full bg-white text-gray-900 pb-20 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="px-4 md:px-6 pt-6">
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-lg flex flex-col justify-center items-center text-center p-8 md:p-12 min-h-[350px] md:min-h-[400px]">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-[15s] hover:scale-110"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=1920')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 z-0"></div>

          <div className="relative z-10 text-white w-full max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 drop-shadow-md"
            >
              {t('nav.contact')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto drop-shadow"
            >
              {t('contact.subtitle', 'نسعد بتواصلكم معنا. نحن هنا للإجابة على جميع استفساراتكم وتلبية طلباتكم.')}
            </motion.p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <a href="tel:+963960000" className="bg-white p-6 rounded-3xl border border-[#EAE5DF] shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#111111] text-[#C5A880] rounded-xl flex items-center justify-center mb-4">
                  <Phone size={24} />
                </div>
                <h4 className="font-bold text-[#1C1A17] mb-2">{t('contact.call_us', 'اتصل بنا')}</h4>
                <a href="tel:+963960000" className="text-[#C5A880] font-bold hover:underline transition-colors block" dir="ltr">+963 960 000</a>
              </a>

              <a href="mailto:hello@nouh-carting.com" className="bg-white p-6 rounded-3xl border border-[#EAE5DF] shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#111111] text-[#C5A880] rounded-xl flex items-center justify-center mb-4">
                  <Mail size={24} />
                </div>
                <h4 className="font-bold text-[#1C1A17] mb-2">{t('contact.email_us', 'البريد الإلكتروني')}</h4>
                <a href="mailto:hello@nouh-carting.com" className="text-gray-600 font-medium hover:text-[#C5A880] transition-colors block">hello@nouh-carting.com</a>
              </a>

              <a href="https://maps.app.goo.gl/uKp1R82xuEV1CPAX6" className="bg-white p-6 rounded-3xl border border-[#EAE5DF] shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#111111] text-[#C5A880] rounded-xl flex items-center justify-center mb-4">
                  <MapPin size={24} />
                </div>
                <h4 className="font-bold text-[#1C1A17] mb-2">{t('contact.visit_us', 'تفضل بزيارتنا')}</h4>
                <a href="https://maps.app.goo.gl/uKp1R82xuEV1CPAX6" target="_blank" rel="noreferrer" className="text-gray-600 font-medium hover:text-[#C5A880] transition-colors block">{t('contact.address', 'حلب، حي السبيل')}</a>
              </a>

              <div className="bg-white p-6 rounded-3xl border border-[#EAE5DF] shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#111111] text-[#C5A880] rounded-xl flex items-center justify-center mb-4">
                  <Clock size={24} />
                </div>
                <h4 className="font-bold text-[#1C1A17] mb-2">{t('contact.open_hours', 'أوقات العمل')}</h4>
                <p className="text-gray-600 font-medium" >8:00 {t("AM")} - 11:00 {t("PM")}</p>
              </div>
            </div>

            {/* Form Placeholder */}
            <div className="bg-[#FCFAF7] p-8 rounded-3xl border border-[#EAE5DF]">
              <h3 className="text-2xl font-black text-[#1C1A17] mb-6">{t('contact.send_message', 'أرسل لنا رسالة')}</h3>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">{t('contact.name', 'الاسم')}</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white border border-[#EAE5DF] focus:border-[#C5A880] outline-none px-4 py-3 rounded-xl transition-colors" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">{t('contact.email', 'البريد الإلكتروني')}</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-[#EAE5DF] focus:border-[#C5A880] outline-none px-4 py-3 rounded-xl transition-colors" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">{t('contact.message', 'الرسالة')}</label>
                  <textarea 
                    rows={4} 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white border border-[#EAE5DF] focus:border-[#C5A880] outline-none px-4 py-3 rounded-xl transition-colors resize-none" 
                  />
                </div>
                <Button 
                  disabled={isLoading}
                  className="w-full bg-[#111111] text-white hover:bg-[#C5A880] h-12 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {t('contact.submit', 'إرسال')}
                </Button>
              </form>
            </div>
          </div>

          <div className="h-[600px] rounded-3xl overflow-hidden shadow-sm border border-[#EAE5DF] lg:sticky lg:top-32 relative">
            <div className="absolute inset-0 bg-black/5 pointer-events-none z-10"></div>
            <iframe
              title="Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3209.6897241318436!2d37.13524671485641!3d36.22325988007271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x152ff813b9c4501b%3A0xc35dfd974f2603!2sAleppo%2C%20Syria!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
              className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-500"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
