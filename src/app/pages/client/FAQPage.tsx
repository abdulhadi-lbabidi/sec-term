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
    <div className="w-full bg-white text-gray-900 pb-20 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="px-4 md:px-6 pt-6">
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-lg flex flex-col justify-center items-center text-center p-8 md:p-12 min-h-[350px] md:min-h-[400px]">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-[15s] hover:scale-110"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1920')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 z-0"></div>

          <div className="relative z-10 text-white w-full max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 drop-shadow-md">
              {t('faq.title')}
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto drop-shadow">
              {t('faq.subtitle')}
            </p>
          </div>
        </div>
      </div>

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
