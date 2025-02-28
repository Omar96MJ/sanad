
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedContent from "@/components/FeaturedContent";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
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
