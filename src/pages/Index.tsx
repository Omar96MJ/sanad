
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedContent from "@/components/FeaturedContent";
import Footer from "@/components/Footer";
import MentalHealthInfo from "@/components/MentalHealthInfo";
import QuoteSection from "@/components/QuoteSection";
import { useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";

const Index = () => {
  const { language } = useLanguage();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <MentalHealthInfo />
        <QuoteSection />
        <FeaturedContent />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
