
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
      <main className="flex-grow container-custom py-16 lg:py-20">
        <div className="max-w-4xl mx-auto py-10">
          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-3xl font-bold">{t('faq')}</CardTitle>
              <CardDescription className="text-lg">{t('commonquestions')}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>{t('faqwhatissanad')}</AccordionTrigger>
                  <AccordionContent>
                    {t('faqwhatissanadanswer')}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>{t('faqhowtherapyworks')}</AccordionTrigger>
                  <AccordionContent>
                    {t('faqhowtherapyworksanswer')}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>{t('faqcost')}</AccordionTrigger>
                  <AccordionContent>
                    {t('faqcostanswer')}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>{t('faqprivacy')}</AccordionTrigger>
                  <AccordionContent>
                    {t('faqprivacyanswer')}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>{t('faqsessionduration')}</AccordionTrigger>
                  <AccordionContent>
                    {t('faqsessiondurationanswer')}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                  <AccordionTrigger>{t('faqcancelsession')}</AccordionTrigger>
                  <AccordionContent>
                    {t('faqcancelsessionanswer')}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-7">
                  <AccordionTrigger>{t('faqemergency')}</AccordionTrigger>
                  <AccordionContent>
                    {t('faqemergencyanswer')}
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
