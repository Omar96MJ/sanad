
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { toast } from "sonner";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PatientDashboardTabs } from "@/components/patient/dashboard/PatientDashboardTabs";
import { DashboardHeader } from "@/components/patient/dashboard/DashboardHeader";
import { SessionModal } from "@/components/patient/dashboard/session-modal/SessionModal";
import { fetchPatientAppointments, PatientAppointment } from "@/services/appointments";
import { fetchPatientProgress } from "@/services/fetchPatientProgress";
import { fetchAllDoctors } from "@/services/doctorService";
import { DoctorProfile } from "@/lib/therapist-types";

// Import mockBlogs instead of mockArticles
import { mockBlogs } from "@/data/mockBlogs";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isVisible, setIsVisible] = useState(false);
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<number | null>(null);
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
  
  useEffect(() => {
    const loadProgress = async () => {
      if (!user) return;

      try {
        const progressValue = await fetchPatientProgress(user.id);
        setProgress(progressValue);
      } catch (error) {
        console.error("Error loading progress:", error);
        toast.error(isRTL ? "حدث خطأ أثناء تحميل التقدم" : "Error loading progress");
      }
    };

    loadProgress();
  }, [user, isRTL]);

  // Load doctors data
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setIsLoadingDoctors(true);
        const doctorsData = await fetchAllDoctors();
        console.log("Loaded doctors:", doctorsData);
        setDoctors(doctorsData);
      } catch (error) {
        console.error("Error loading doctors:", error);
        toast.error(isRTL ? "حدث خطأ أثناء تحميل بيانات الأطباء" : "Error loading doctors data");
      } finally {
        setIsLoadingDoctors(false);
      }
    };

    loadDoctors();
  }, [isRTL]);

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
  
  // Fetch appointments data
  useEffect(() => {
    const loadAppointments = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const data = await fetchPatientAppointments(user.id);
        setAppointments(data);
      } catch (error) {
        console.error("Error loading appointments:", error);
        toast.error(isRTL ? "حدث خطأ أثناء تحميل المواعيد" : "Error loading appointments");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAppointments();
  }, [user, isRTL]);
  
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

  const upcomingAppointment = appointments.find(app => app.status === 'scheduled');

  const assignedDoctor = upcomingAppointment?.doctor ?? null;

  
  // Format appointment date for display
  const formatAppointmentDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "PPPP", { locale: isRTL ? ar : undefined });
  };
  
  // Format appointment time for display
  const formatAppointmentTime = (dateString: string) => {
    const date = parseISO(dateString);
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
  
  // Handler for appointment updates
  const handleAppointmentUpdated = async () => {
    try {
      setIsLoading(true);
      const data = await fetchPatientAppointments(user.id);
      setAppointments(data);
    } catch (error) {
      console.error("Error refreshing appointments:", error);
    } finally {
      setIsLoading(false);
    }
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
            progress={progress ?? 0}
            assignedDoctor={assignedDoctor}
            isLoadingDoctor={isLoading}
            appointments={appointments}
            isLoadingAppointments={isLoading}
            mockArticles={mockBlogs.slice(0, 3)}
            date={date}
            setDate={setDate}
            handleBookAppointment={handleBookAppointment}
            handleStartTherapy={handleStartTherapy}
            formatAppointmentDate={formatAppointmentDate}
            formatAppointmentTime={formatAppointmentTime}
            calendarLocale={calendarLocale}
            onAppointmentUpdated={handleAppointmentUpdated}
          />
        </div>
      </main>
      
      <SessionModal 
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        onSessionBooked={handleAppointmentUpdated}
      />
      
      <Footer />
    </div>
  );
};

export default PatientDashboard;
