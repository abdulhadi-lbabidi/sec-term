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
    <div className="w-full bg-white text-gray-900 pb-20">
      {/* Hero Section */}
      <div className="bg-primary/5 py-16 md:py-24 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          {t('faq.title')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('faq.subtitle')}
        </p>
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
