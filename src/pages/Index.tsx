
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedContent from "@/components/FeaturedContent";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";

const Index = () => {
  const { language } = useLanguage();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow mt-16 md:mt-20">
        <Hero />
        <FeaturedContent />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
