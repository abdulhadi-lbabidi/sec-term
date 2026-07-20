import { useTranslation } from 'react-i18next';

export default function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-white text-gray-900 pb-20 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="px-4 md:px-6 pt-6">
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-lg flex flex-col justify-center items-center text-center p-8 md:p-12 min-h-[350px] md:min-h-[400px]">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-[15s] hover:scale-110"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?auto=format&fit=crop&q=80&w=1920')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 z-0"></div>

          <div className="relative z-10 text-white w-full max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 drop-shadow-md">
              {t('privacy.title')}
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto drop-shadow">
              {t('privacy.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 max-w-4xl mx-auto mt-12 min-h-[40vh]">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#EAE5DF] space-y-10">

          <section>
            <h2 className="text-2xl font-black text-[#1C1A17] mb-4 flex items-center gap-3">
              <span className="text-[#C5A880] bg-[#111111] w-8 h-8 flex items-center justify-center rounded-lg text-sm">1</span> 
              {t('privacy.sections.sec1_title')}
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {t('privacy.sections.sec1_body')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-[#1C1A17] mb-4 flex items-center gap-3">
              <span className="text-[#C5A880] bg-[#111111] w-8 h-8 flex items-center justify-center rounded-lg text-sm">2</span> 
              {t('privacy.sections.sec2_title')}
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {t('privacy.sections.sec2_body')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-[#1C1A17] mb-4 flex items-center gap-3">
              <span className="text-[#C5A880] bg-[#111111] w-8 h-8 flex items-center justify-center rounded-lg text-sm">3</span> 
              {t('privacy.sections.sec3_title')}
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {t('privacy.sections.sec3_body')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-[#1C1A17] mb-4 flex items-center gap-3">
              <span className="text-[#C5A880] bg-[#111111] w-8 h-8 flex items-center justify-center rounded-lg text-sm">4</span> 
              {t('privacy.sections.sec4_title')}
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {t('privacy.sections.sec4_body')}
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
