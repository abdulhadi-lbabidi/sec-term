import { useTranslation } from 'react-i18next';

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-white text-gray-900 pb-20">
      {/* Hero Section */}
      <div className="bg-primary/5 py-16 md:py-24 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          {t('terms.title')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('terms.subtitle')}
        </p>
      </div>

      <div className="px-4 md:px-8 max-w-4xl mx-auto mt-12 min-h-[40vh]">
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-primary">1.</span> {t('terms.sections.sec1_title')}
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {t('terms.sections.sec1_body')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-primary">2.</span> {t('terms.sections.sec2_title')}
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {t('terms.sections.sec2_body')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-primary">3.</span> {t('terms.sections.sec3_title')}
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {t('terms.sections.sec3_body')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-primary">4.</span> {t('terms.sections.sec4_title')}
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
