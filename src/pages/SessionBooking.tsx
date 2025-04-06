
import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionBookingForm from "@/components/SessionBookingForm";
import { toast } from "sonner";

const SessionBooking = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow container-custom mt-24 mb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{language === 'ar' ? 'حجز جلسة' : 'Book a Session'}</h1>
          <p className="text-muted-foreground mb-8">
            {language === 'ar' 
              ? 'احجز جلسة مع أحد معالجينا المؤهلين وابدأ رحلة الشفاء الخاصة بك.'
              : 'Schedule a session with one of our qualified therapists and start your healing journey.'}
          </p>
          
          <SessionBookingForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SessionBooking;
