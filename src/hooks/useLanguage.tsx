
/**
 * This file exists for backward compatibility.
 * It re-exports the language hook and provider from the language directory.
 */
import { useLanguage } from './language/useLanguage';
import { LanguageProvider } from './language/languageContext';

export { useLanguage, LanguageProvider };
