
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedContent from "@/components/FeaturedContent";
import Footer from "@/components/Footer";
import MentalHealthInfo from "@/components/MentalHealthInfo";
import QuoteSection from "@/components/QuoteSection";
import TherapyTypes from "@/components/TherapyTypes";
import { useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // If user is logged in as a doctor, redirect them to the dashboard
    if (user && user.role === 'doctor') {
      navigate('/therapist-dashboard');
    } else if (user && user.role === 'admin') {
      navigate('/admin-dashboard');
    }
    // For patients, we'll let them see the homepage
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <TherapyTypes />
        <MentalHealthInfo />
        <QuoteSection />
        <FeaturedContent />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
