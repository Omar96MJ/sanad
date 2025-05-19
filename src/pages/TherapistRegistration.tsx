
import { useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TherapistRegistrationForm from "@/components/therapist/RegistrationForm";

const TherapistRegistration = () => {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow mt-16 md:mt-20 py-8 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">
            {t('therapist_registration')}
          </h1>
          <p className="mb-8 text-muted-foreground">
            {t('therapist_registration_description')}
          </p>
          
          <TherapistRegistrationForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TherapistRegistration;
