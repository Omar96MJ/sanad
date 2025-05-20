
import { useLanguage } from "@/hooks/useLanguage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionBookingForm from "@/components/session-booking/SessionBookingForm";

const SessionBooking = () => {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      
      <main className="flex-grow py-16 md:py-20 bg-muted/30">
        <div className="container-custom max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              {isRTL ? "حجز جلسة جديدة" : "Book a Session"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isRTL 
                ? "احجز موعدًا مع أحد معالجينا المؤهلين للحصول على الدعم الذي تحتاجه"
                : "Schedule an appointment with one of our qualified therapists to get the support you need"
              }
            </p>
          </div>
          
          <SessionBookingForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SessionBooking;
