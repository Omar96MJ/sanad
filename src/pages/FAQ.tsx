
import React, { useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/hooks/useLanguage";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FAQ = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-3xl font-bold">{t('faq')}</CardTitle>
              <CardDescription className="text-lg">{t('common_questions')}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>{t('faq_what_is_sanad')}</AccordionTrigger>
                  <AccordionContent>
                    {t('faq_what_is_sanad_answer')}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>{t('faq_how_therapy_works')}</AccordionTrigger>
                  <AccordionContent>
                    {t('faq_how_therapy_works_answer')}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>{t('faq_cost')}</AccordionTrigger>
                  <AccordionContent>
                    {t('faq_cost_answer')}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>{t('faq_privacy')}</AccordionTrigger>
                  <AccordionContent>
                    {t('faq_privacy_answer')}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>{t('faq_session_duration')}</AccordionTrigger>
                  <AccordionContent>
                    {t('faq_session_duration_answer')}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                  <AccordionTrigger>{t('faq_cancel_session')}</AccordionTrigger>
                  <AccordionContent>
                    {t('faq_cancel_session_answer')}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-7">
                  <AccordionTrigger>{t('faq_emergency')}</AccordionTrigger>
                  <AccordionContent>
                    {t('faq_emergency_answer')}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
