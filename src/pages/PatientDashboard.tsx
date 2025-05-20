
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { format, addDays } from "date-fns";
import { ar } from "date-fns/locale";
import { toast } from "sonner";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PatientDashboardTabs } from "@/components/patient/dashboard/PatientDashboardTabs";
import { DashboardHeader } from "@/components/patient/dashboard/DashboardHeader";
import { SessionModal } from "@/components/patient/dashboard/SessionModal";

// Import mockBlogs instead of mockArticles
import { mockBlogs } from "@/data/mockBlogs";
import { UserRole } from "@/lib/types";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isVisible, setIsVisible] = useState(false);
  
  // Animation on mount
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
    window.scrollTo(0, 0);
  }, []);
  
  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      toast.error(isRTL ? "يرجى تسجيل الدخول للوصول إلى لوحة التحكم" : "Please log in to access your dashboard");
    }
  }, [user, navigate, isRTL]);
  
  // If user is not available yet, show a loading state
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-xl">
            {isRTL ? "جاري التحميل..." : "Loading..."}
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Mock patient progress data
  const progress = 65;
  
  // Mock doctor data
  const mockDoctor = {
    id: "dr-smith",
    name: "Dr. Emily Smith",
    specialization: "Clinical Psychologist",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    rating: 4.9,
    reviewsCount: 124,
    bio: "Specialized in anxiety and depression treatment with 10+ years of experience.",
    patients: 245,
    yearsOfExperience: 10,
    email: "dr.smith@example.com",
    role: "doctor" as UserRole  // Fix: Cast string to UserRole type
  };
  
  // Mock appointment data
  const mockAppointments = [
    {
      id: "1",
      therapist: "Dr. Emily Smith",
      therapistImage: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      date: format(addDays(new Date(), 3), "yyyy-MM-dd'T'HH:mm:ss"),
      time: "10:00 AM",
      type: "Therapy Session",
      status: "upcoming",
      notes: "Follow-up on anxiety management techniques"
    },
    {
      id: "2",
      therapist: "Dr. Emily Smith",
      therapistImage: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      date: format(addDays(new Date(), -7), "yyyy-MM-dd'T'HH:mm:ss"),
      time: "2:30 PM",
      type: "Initial Consultation",
      status: "completed",
      notes: "Initial assessment and treatment planning"
    }
  ];
  
  // Format appointment date for display
  const formatAppointmentDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "PPPP", { locale: isRTL ? ar : undefined });
  };
  
  // Format appointment time for display
  const formatAppointmentTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "h:mm a");
  };
  
  // Calendar locale for Arabic
  const calendarLocale = isRTL ? ar : undefined;
  
  // Handler for booking appointment button
  const handleBookAppointment = () => {
    setIsSessionModalOpen(true);
  };
  
  // Handler for starting therapy session
  const handleStartTherapy = () => {
    toast.info(isRTL ? "سيتم إطلاق ميزة العلاج عن بعد قريبًا" : "Telehealth feature coming soon!");
  };

  return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      
      <main className="flex-grow pt-16 md:pt-20 pb-8 bg-muted/30">
        <div className="container-custom">
          <DashboardHeader 
            user={user} 
            isVisible={isVisible}
          />
          
          <PatientDashboardTabs
            isVisible={isVisible}
            progress={progress}
            mockDoctor={mockDoctor}
            mockAppointments={mockAppointments}
            mockArticles={mockBlogs.slice(0, 3)} // Use mockBlogs here instead of mockArticles
            date={date}
            setDate={setDate}
            handleBookAppointment={handleBookAppointment}
            handleStartTherapy={handleStartTherapy}
            formatAppointmentDate={formatAppointmentDate}
            formatAppointmentTime={formatAppointmentTime}
            calendarLocale={calendarLocale}
          />
        </div>
      </main>
      
      <SessionModal 
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
      />
      
      <Footer />
    </div>
  );
};

export default PatientDashboard;
