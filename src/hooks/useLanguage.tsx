
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

// English and Arabic translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    'home': 'Home',
    'blog': 'Blog',
    'login': 'Login',
    'signup': 'Sign Up',
    'dashboard': 'Dashboard',
    'profile': 'Profile',
    'logout': 'Logout',
    'my_account': 'My Account',
    // Auth pages
    'welcome_back': 'Welcome back',
    'sign_in_to_continue': 'Sign in to your account to continue',
    'email_address': 'Email address',
    'password': 'Password',
    'forgot_password': 'Forgot password?',
    'sign_in': 'Sign in',
    'signing_in': 'Signing in...',
    'dont_have_account': 'Don\'t have an account?',
    'create_account': 'Create an account',
    'join_us': 'Join us to begin your mental health journey',
    'full_name': 'Full name',
    'create_password': 'Create a password',
    'i_am_a': 'I am a',
    'patient_seeking_help': 'Patient seeking help',
    'mental_health_professional': 'Mental health professional',
    'creating_account': 'Creating account...',
    'already_have_account': 'Already have an account?',
    // Dashboard
    'patient_dashboard': 'Patient Dashboard',
    'overview': 'Overview',
    'appointments': 'Appointments',
    'resources': 'Resources',
    'upcoming_appointment': 'Upcoming Appointment',
    'recent_activities': 'Recent Activities',
    'wellbeing_score': 'Wellbeing Score',
    'doctor_appointments': 'Doctor Appointments',
    'book_appointment': 'Book Appointment',
    'view_all': 'View All',
    'no_appointments': 'No upcoming appointments',
    'recommended_resources': 'Recommended Resources',
    'view_resource': 'View Resource',
    // Theme
    'dark_mode': 'Dark Mode',
    'light_mode': 'Light Mode',
    // Language
    'english': 'English',
    'arabic': 'Arabic',
    // Admin
    'admin_panel': 'Admin Panel',
    'admin_dashboard': 'Admin Dashboard',
    'users': 'Users',
    'doctors': 'Doctors',
    'patients': 'Patients',
    'manage_users': 'Manage Users',
    'system_settings': 'System Settings'
  },
  ar: {
    // Navbar
    'home': 'الرئيسية',
    'blog': 'المدونة',
    'login': 'تسجيل الدخول',
    'signup': 'إنشاء حساب',
    'dashboard': 'لوحة التحكم',
    'profile': 'الملف الشخصي',
    'logout': 'تسجيل الخروج',
    'my_account': 'حسابي',
    // Auth pages
    'welcome_back': 'مرحبًا بعودتك',
    'sign_in_to_continue': 'سجل دخول إلى حسابك للمتابعة',
    'email_address': 'البريد الإلكتروني',
    'password': 'كلمة المرور',
    'forgot_password': 'نسيت كلمة المرور؟',
    'sign_in': 'تسجيل الدخول',
    'signing_in': 'جاري تسجيل الدخول...',
    'dont_have_account': 'ليس لديك حساب؟',
    'create_account': 'إنشاء حساب',
    'join_us': 'انضم إلينا لبدء رحلتك في الصحة النفسية',
    'full_name': 'الاسم الكامل',
    'create_password': 'إنشاء كلمة مرور',
    'i_am_a': 'أنا',
    'patient_seeking_help': 'مريض يبحث عن المساعدة',
    'mental_health_professional': 'متخصص في الصحة النفسية',
    'creating_account': 'جاري إنشاء الحساب...',
    'already_have_account': 'لديك حساب بالفعل؟',
    // Dashboard
    'patient_dashboard': 'لوحة تحكم المريض',
    'overview': 'نظرة عامة',
    'appointments': 'المواعيد',
    'resources': 'الموارد',
    'upcoming_appointment': 'الموعد القادم',
    'recent_activities': 'الأنشطة الأخيرة',
    'wellbeing_score': 'مؤشر العافية',
    'doctor_appointments': 'مواعيد الطبيب',
    'book_appointment': 'حجز موعد',
    'view_all': 'عرض الكل',
    'no_appointments': 'لا توجد مواعيد قادمة',
    'recommended_resources': 'موارد مقترحة',
    'view_resource': 'عرض المورد',
    // Theme
    'dark_mode': 'الوضع الداكن',
    'light_mode': 'الوضع الفاتح',
    // Language
    'english': 'الإنجليزية',
    'arabic': 'العربية',
    // Admin
    'admin_panel': 'لوحة الإدارة',
    'admin_dashboard': 'لوحة تحكم المسؤول',
    'users': 'المستخدمين',
    'doctors': 'الأطباء',
    'patients': 'المرضى',
    'manage_users': 'إدارة المستخدمين',
    'system_settings': 'إعدادات النظام'
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || 'ar'; // Changed default from 'en' to 'ar'
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
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
  if (context === null) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
