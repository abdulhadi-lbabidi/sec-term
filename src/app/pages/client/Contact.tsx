import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const Contact = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-20 bg-[#fefcfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <div className="space-y-16">
            <header>
              <h1 className="text-6xl font-bold tracking-tighter text-black mb-8">{t('nav.contact')}</h1>
              <p className="text-xl text-black/40 leading-relaxed max-w-md italic">
                We'd love to hear from you. Whether it's a bulk order or a simple hello.
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 rtl:space-x-reverse text-black/40">
                  <Phone size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Call Us</span>
                </div>
                <p className="text-lg font-bold">+1 (234) 567-890</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 rtl:space-x-reverse text-black/40">
                  <Mail size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Email Us</span>
                </div>
                <p className="text-lg font-bold">hello@bakery.com</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 rtl:space-x-reverse text-black/40">
                  <MapPin size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Visit Us</span>
                </div>
                <p className="text-lg font-bold">123 Baker St, Flour City</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 rtl:space-x-reverse text-black/40">
                  <Clock size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Open Hours</span>
                </div>
                <p className="text-lg font-bold">Mon - Sun: 7am - 8pm</p>
              </div>
            </div>

            {/* Form Placeholder */}
            <form className="space-y-8 pt-12 border-t border-black/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">Name</label>
                  <input type="text" className="w-full bg-transparent border-b border-black/20 focus:border-black outline-none py-2 text-sm transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">Email</label>
                  <input type="email" className="w-full bg-transparent border-b border-black/20 focus:border-black outline-none py-2 text-sm transition-colors" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">Message</label>
                <textarea rows={4} className="w-full bg-transparent border-b border-black/20 focus:border-black outline-none py-2 text-sm transition-colors" />
              </div>
              <button className="bg-black text-white px-12 py-5 text-xs font-bold uppercase tracking-widest hover:bg-black/80 transition-colors">Send Message</button>
            </form>
          </div>

          <div className="lg:sticky lg:top-32 aspect-[4/5] bg-gray-100 relative grayscale">
            <iframe
              title="Bakery Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215266940003!2d-73.9878436845942!3d40.75797877932688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1654876543210!5m2!1sen!2sus"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
