
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
// Import specific locales from date-fns
import { ar, enUS } from 'date-fns/locale';
import { Doctor, BlogPost } from "@/lib/types";
import { DashboardHeader } from "@/components/patient/dashboard/DashboardHeader";
import { PatientDashboardTabs } from "@/components/patient/dashboard/PatientDashboardTabs";
import { supabase } from "@/integrations/supabase/client";

// Mock data for blog posts that doesn't change with user
const mockArticles: BlogPost[] = [
  {
    id: '1',
    title: 'Understanding Anxiety: Causes, Symptoms, and Treatments',
    excerpt: 'Anxiety disorders are the most common mental health concern in the United States. Learn about the causes, symptoms, and effective treatments.',
    content: '',
    author: 'Dr. Sarah Johnson',
    authorId: '1',
    authorRole: 'doctor',
    publishedDate: '2023-10-15',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9',
    tags: ['Anxiety', 'Mental Health', 'Therapy']
  },
  {
    id: '2',
    title: 'The Power of Mindfulness in Daily Life',
    excerpt: 'Discover how practicing mindfulness can reduce stress, improve focus, and enhance your overall mental wellbeing.',
    content: '',
    author: 'Dr. Michael Lee',
    authorId: '3',
    authorRole: 'doctor',
    publishedDate: '2023-10-10',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    tags: ['Mindfulness', 'Meditation', 'Stress Management']
  }
];

// Default doctor data
const defaultDoctor: Doctor = {
  id: '',
  name: '',
  email: '',
  role: 'doctor',
  profileImage: '',
  specialization: '',
  bio: '',
  patients: 0,
  yearsOfExperience: 0
};

const PatientDashboard = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mockDoctor, setMockDoctor] = useState<Doctor>(defaultDoctor);
  const [mockAppointments, setMockAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isRTL = language === 'ar';
  
  // Set the correct locale object based on the selected language
  const calendarLocale = isRTL ? ar : enUS;

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Show loading state
    setIsLoading(true);
    
    if (!user) return;
    
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard progress
        const { data: dashboardData, error: dashboardError } = await supabase
          .from('patient_dashboard')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (dashboardError) {
          if (dashboardError.code === 'PGRST116') {
            // No dashboard data exists yet, create it
            const { error: insertError } = await supabase
              .from('patient_dashboard')
              .insert({ user_id: user.id, progress: 0 });
              
            if (insertError) {
              console.error('Error creating dashboard:', insertError);
            } else {
              setProgress(0);
            }
          } else {
            console.error('Error fetching dashboard:', dashboardError);
          }
        } else if (dashboardData) {
          setProgress(dashboardData.progress || 0);
        }
        
        // Fetch appointments
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('patient_appointments')
          .select('*')
          .eq('patient_id', user.id)
          .order('session_date', { ascending: true });
          
        if (appointmentsError) {
          console.error('Error fetching appointments:', appointmentsError);
        } else if (appointmentsData) {
          setMockAppointments(appointmentsData.map(apt => ({
            id: apt.id,
            date: apt.session_date,
            doctor: apt.doctor_name,
            type: apt.session_type,
            status: apt.status
          })));
        }
        
        // Fetch assigned doctor (if any)
        // For now we'll just set a default doctor
        setMockDoctor({
          id: '1',
          name: 'Dr. Sarah Johnson',
          email: 'doctor@example.com',
          role: 'doctor',
          profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256',
          specialization: 'Clinical Psychologist',
          bio: 'Specializing in anxiety disorders and cognitive behavioral therapy with over 10 years of experience.',
          patients: 42,
          yearsOfExperience: 10
        });
        
        // Make the dashboard visible after data is loaded
        setIsVisible(true);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error(t('error_loading_dashboard'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user, t, isRTL]);

  if (!user) {
    return <Navigate to="/login" />;
  } else if (user.role !== 'patient') {
    return <Navigate to="/" />;
  }

  const handleBookAppointment = async () => {
    try {
      // For now just show a toast, but in the future this would create an appointment
      toast.success(isRTL ? "سيتم إضافة ميزة حجز المواعيد قريبًا!" : "Appointment booking feature coming soon!");
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error(t('error_booking_appointment'));
    }
  };

  const handleStartTherapy = async () => {
    try {
      // Update progress in database
      const newProgress = Math.min(progress + 10, 100);
      
      const { error } = await supabase
        .from('patient_dashboard')
        .update({ progress: newProgress })
        .eq('user_id', user.id);
        
      if (error) {
        throw error;
      }
      
      setProgress(newProgress);
      toast.success(isRTL ? "سيتم إضافة ميزة جلسة العلاج عبر الإنترنت قريبًا!" : "Online therapy session feature coming soon!");
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error(t('error_updating_progress'));
    }
  };

  const formatAppointmentDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatAppointmentTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(isRTL ? 'ar-SA' : 'en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow mt-16 md:mt-20 pb-16">
        <DashboardHeader user={user} isVisible={isVisible} />

        <div className="container-custom mt-8">
          <PatientDashboardTabs 
            isVisible={isVisible}
            progress={progress}
            mockDoctor={mockDoctor}
            mockAppointments={mockAppointments}
            mockArticles={mockArticles}
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
      <Footer />
    </div>
  );
};

export default PatientDashboard;
