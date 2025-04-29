
import { createContext, useState, useEffect, ReactNode } from 'react';
import { translations, LanguageCode } from '@/translations';

export interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const storedLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') : null;
  const initialLanguage: LanguageCode = (storedLanguage === 'en' || storedLanguage === 'ar') 
    ? storedLanguage as LanguageCode 
    : 'ar';
  
  const [language, setLanguage] = useState<LanguageCode>(initialLanguage);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
      document.documentElement.setAttribute('lang', language);
      document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    }
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
