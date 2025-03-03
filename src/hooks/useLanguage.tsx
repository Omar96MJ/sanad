import { createContext, useContext } from 'react';
import { useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<'en' | 'ar'>((typeof window !== 'undefined' && localStorage.getItem('language')) === 'ar' ? 'ar' : 'en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
      document.documentElement.setAttribute('lang', language);
      document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    }
  }, [language]);

const translations = {
  en: {
    "Home": "Home",
    "Blog": "Blog",
    "Login": "Login",
    "Register": "Register",
    "Patient Dashboard": "Patient Dashboard",
    "Admin Dashboard": "Admin Dashboard",
    "Settings": "Settings",
    "Language": "Language",
    "Theme": "Theme",
    "english": "English",
    "arabic": "Arabic",
    "login": "Log in",
    "signup": "Sign up",
    "my_account": "My Account",
    "admin_panel": "Admin Panel",
    "profile": "Profile",
    "logout": "Log out",
    "dashboard": "Dashboard",
    "providing_mental_health_care": "Providing compassionate mental health care and resources to support your wellbeing journey.",
    "quick_links": "Quick Links",
    "resources": "Resources",
    "mental_health_guide": "Mental Health Guide",
    "crisis_support": "Crisis Support",
    "self_care_tips": "Self-Care Tips",
    "faq": "FAQ",
    "contact": "Contact",
    "address": "123 Wellness Street, Mindful City, MC 12345",
    "sanad_copyright": "Sanad. All rights reserved.",
    "privacy_policy": "Privacy Policy",
    "terms_of_service": "Terms of Service",
    "cookie_policy": "Cookie Policy",
    "mental_health_resources": "Mental Health Resources",
    "explore_mental_health_blog": "Explore Our Mental Health Blog",
    "discover_insights": "Discover insights, tips, and information to support your mental wellbeing journey",
    "search_articles": "Search articles...",
    "no_articles_found": "No articles found",
    "try_adjusting_search": "Try adjusting your search or removing filters"
  },
  ar: {
    "Home": "الرئيسية",
    "Blog": "مدونة",
    "Login": "تسجيل الدخول",
    "Register": "تسجيل",
    "Patient Dashboard": "لوحة معلومات المريض",
    "Admin Dashboard": "لوحة تحكم المسؤول",
    "Settings": "إعدادات",
    "Language": "لغة",
    "Theme": "مظهر",
    "english": "الإنجليزية",
    "arabic": "العربية",
    "login": "تسجيل الدخول",
    "signup": "تسجيل",
    "my_account": "حسابي",
    "admin_panel": "لوحة الإدارة",
    "profile": "الملف الشخصي",
    "logout": "تسجيل الخروج",
    "dashboard": "لوحة القيادة",
    "providing_mental_health_care": "تقديم رعاية صحية نفسية وموارد تدعم رحلة العافية الخاصة بك.",
    "quick_links": "روابط سريعة",
    "resources": "الموارد",
    "mental_health_guide": "دليل الصحة النفسية",
    "crisis_support": "دعم الأزمات",
    "self_care_tips": "نصائح للعناية الذاتية",
    "faq": "الأسئلة الشائعة",
    "contact": "اتصل بنا",
    "address": "123 شارع العافية، مدينة اليقظة، 12345",
    "sanad_copyright": "سند. جميع الحقوق محفوظة.",
    "privacy_policy": "سياسة الخصوصية",
    "terms_of_service": "شروط الخدمة",
    "cookie_policy": "سياسة ملفات تعريف الارتباط",
    "mental_health_resources": "موارد الصحة النفسية",
    "explore_mental_health_blog": "استكشف مدونة الصحة النفسية",
    "discover_insights": "اكتشف الرؤى والنصائح والمعلومات لدعم رحلة صحتك النفسية",
    "search_articles": "البحث في المقالات...",
    "no_articles_found": "لم يتم العثور على مقالات",
    "try_adjusting_search": "حاول تعديل البحث أو إزالة الفلاتر"
  },
};

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
