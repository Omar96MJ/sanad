
import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionBookingForm from "@/components/SessionBookingForm";
import { toast } from "sonner";

const SessionBooking = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Redirect to login if not authenticated
    if (!user) {
      toast.error(t('login_required_for_booking'));
      navigate('/login', { state: { returnTo: '/session-booking' } });
    }
  }, [user, navigate, t]);

  return (
    <div className="min-h-screen flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow container-custom mt-24 mb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{t('bookasession')}</h1>
          <p className="text-muted-foreground mb-8">
            {t('schedule_session_description')}
          </p>
          
          {user && <SessionBookingForm />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SessionBooking;
