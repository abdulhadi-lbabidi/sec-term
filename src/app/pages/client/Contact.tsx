import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Clock, Instagram, Facebook } from 'lucide-react';
import { motion } from 'motion/react';

const WhatsappIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

export const Contact = () => {
  const { t } = useTranslation();

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

            {/* Social Media Links */}
            <div className="bg-[#FCFAF7] p-8 rounded-3xl border border-[#EAE5DF]">
              <h3 className="text-2xl font-black text-[#1C1A17] mb-6">{t('contact.social_media')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <a href="https://instagram.com/nouhcarting" target="_blank" rel="noreferrer" className="flex flex-col items-center text-center gap-3 bg-white p-6 rounded-2xl border border-[#EAE5DF] hover:border-[#111] hover:shadow-md transition-all group">
                  <div className="w-14 h-14 bg-[#111] text-[#fff] border border-[#EAE5DF] group-hover:bg-[#fff] group-hover:text-[#111] group-hover:border-[#111] rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                    <Instagram size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1C1A17] mb-1">Instagram</h4>
                    <p className="text-gray-500 text-xs" dir="ltr">@nouhcarting</p>
                  </div>
                </a>

                <a href="https://fb.com/nouhcarting" target="_blank" rel="noreferrer" className="flex flex-col items-center text-center gap-3 bg-white p-6 rounded-2xl border border-[#EAE5DF] hover:border-[#111] hover:shadow-md transition-all group">
                  <div className="w-14 h-14 bg-[#111] text-[#fff] border border-[#EAE5DF] group-hover:bg-[#fff] group-hover:text-[#111] group-hover:border-[#111] rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                    <Facebook size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1C1A17] mb-1">Facebook</h4>
                    <p className="text-gray-500 text-xs" dir="ltr">nouhcarting</p>
                  </div>
                </a>

                <a href="https://wa.me/963945036513" target="_blank" rel="noreferrer" className="flex flex-col items-center text-center gap-3 bg-white p-6 rounded-2xl border border-[#EAE5DF] hover:border-[#111] hover:shadow-md transition-all group">
                  <div className="w-14 h-14 bg-[#111] text-[#fff] border border-[#EAE5DF] group-hover:bg-[#fff] group-hover:text-[#111] group-hover:border-[#111] rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                    <WhatsappIcon className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1C1A17] mb-1">WhatsApp</h4>
                    <p className="text-gray-500 text-xs truncate max-w-[120px]" dir="ltr">+963 945 036 513</p>
                  </div>
                </a>
              </div>
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
