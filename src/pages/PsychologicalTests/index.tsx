
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TestContent from './components/TestContent';

const PsychologicalTests = () => {
  const { language, t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Trigger animation after component mounts
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16 md:mt-20">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">{t('psychological_tests')}</h1>
          <p className="text-muted-foreground">
            {t('take_test_description')}
          </p>
        </div>

        <div className={`flex flex-col items-center justify-center w-full transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <TestContent />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PsychologicalTests;
