import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';

export default function FAQPage() {
  const { t } = useTranslation();

  const faqs = [
    {
      q: t('faq.questions.q1_title'),
      a: t('faq.questions.q1_ans')
    },
    {
      q: t('faq.questions.q2_title'),
      a: t('faq.questions.q2_ans')
    },
    {
      q: t('faq.questions.q3_title'),
      a: t('faq.questions.q3_ans')
    }
  ];

  return (
    <div className="w-full bg-background min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 bg-[#111111] overflow-hidden rounded-b-[3rem] shadow-sm border-b border-[#C5A880]/20 text-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A880] opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C5A880] opacity-5 rounded-full blur-3xl -ml-20 -mb-20"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            {t('faq.title')}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </div>
      </section>

      <div className="px-4 md:px-8 max-w-3xl mx-auto mt-12 min-h-[40vh]">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="bg-gray-50 border-gray-100 border px-6 rounded-2xl data-[state=open]:shadow-sm">
              <AccordionTrigger className="text-lg font-bold text-gray-800 hover:no-underline py-5 text-start">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed text-base pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
