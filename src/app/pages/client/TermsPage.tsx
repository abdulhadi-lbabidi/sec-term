import { useTranslation } from 'react-i18next';

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-background min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 bg-[#111111] overflow-hidden rounded-b-[3rem] shadow-sm border-b border-[#C5A880]/20 text-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A880] opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C5A880] opacity-5 rounded-full blur-3xl -ml-20 -mb-20"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            {t('terms.title')}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {t('terms.subtitle')}
          </p>
        </div>
      </section>

      <div className="px-4 md:px-8 max-w-4xl mx-auto mt-12 min-h-[40vh]">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#EAE5DF] space-y-10">

          <section>
            <h2 className="text-2xl font-black text-[#1C1A17] mb-4 flex items-center gap-3">
              <span className="text-[#C5A880] bg-[#111111] w-8 h-8 flex items-center justify-center rounded-lg text-sm">1</span> 
              {t('terms.sections.sec1_title')}
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {t('terms.sections.sec1_body')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-[#1C1A17] mb-4 flex items-center gap-3">
              <span className="text-[#C5A880] bg-[#111111] w-8 h-8 flex items-center justify-center rounded-lg text-sm">2</span> 
              {t('terms.sections.sec2_title')}
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {t('terms.sections.sec2_body')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-[#1C1A17] mb-4 flex items-center gap-3">
              <span className="text-[#C5A880] bg-[#111111] w-8 h-8 flex items-center justify-center rounded-lg text-sm">3</span> 
              {t('terms.sections.sec3_title')}
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {t('terms.sections.sec3_body')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-[#1C1A17] mb-4 flex items-center gap-3">
              <span className="text-[#C5A880] bg-[#111111] w-8 h-8 flex items-center justify-center rounded-lg text-sm">4</span> 
              {t('terms.sections.sec4_title')}
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {t('terms.sections.sec4_body')}
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
