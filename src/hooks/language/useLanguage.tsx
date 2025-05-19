
import { useContext } from 'react';
import { LanguageContext, LanguageContextType } from './languageContext';

/**
 * Custom hook to access the language context
 * @returns LanguageContextType object with language, setLanguage, and t functions
 */
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
