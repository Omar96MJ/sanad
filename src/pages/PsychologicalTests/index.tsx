import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TestContent from './components/TestContent'; // Path might be different based on your structure

const PsychologicalTests = () => { // Renamed for clarity if it's a page component
  const { language, t } = useLanguage(); // 't' might be used for page-specific titles
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      setIsVisible(true);
    }, 100); // Animation delay
  }, []);

  return (
    <div className="min-h-screen flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16 md:mt-20">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 slide-in-bottom animation-delay-200">
            {t('psychological_tests_title')}
          </h1>
          <p className="text-muted-foreground slide-in-bottom animation-delay-400">
            {t('psychological_tests_description')}
          </p>
        </div>

        <div 
          className={`transition-opacity duration-700 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          <TestContent />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PsychologicalTests;
