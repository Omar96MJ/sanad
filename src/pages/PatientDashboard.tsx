
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

const mockDoctor: Doctor = {
  id: '1',
  name: 'Dr. Sarah Johnson',
  email: 'doctor@example.com',
  role: 'doctor',
  profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256',
  specialization: 'Clinical Psychologist',
  bio: 'Specializing in anxiety disorders and cognitive behavioral therapy with over 10 years of experience.',
  patients: 42,
  yearsOfExperience: 10
};

const mockAppointments = [
  {
    id: 1,
    date: '2023-11-10T13:00:00',
    doctor: 'Dr. Sarah Johnson',
    type: 'Video Call',
    status: 'upcoming'
  },
  {
    id: 2,
    date: '2023-10-25T10:30:00',
    doctor: 'Dr. Sarah Johnson',
    type: 'In-Person',
    status: 'completed'
  },
  {
    id: 3,
    date: '2023-10-10T14:45:00',
    doctor: 'Dr. Sarah Johnson',
    type: 'Video Call',
    status: 'completed'
  }
];

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

const PatientDashboard = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [progress, setProgress] = useState(65);
  const [isVisible, setIsVisible] = useState(false);
  const isRTL = language === 'ar';
  
  // Set the correct locale object based on the selected language
  const calendarLocale = isRTL ? ar : enUS;

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Simulate data loading
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  if (!user) {
    return <Navigate to="/login" />;
  } else if (user.role !== 'patient') {
    return <Navigate to="/" />;
  }

  const handleBookAppointment = () => {
    toast.success(isRTL ? "سيتم إضافة ميزة حجز المواعيد قريبًا!" : "Appointment booking feature coming soon!");
  };

  const handleStartTherapy = () => {
    toast.success(isRTL ? "سيتم إ��افة ميزة جلسة العلاج عبر الإنترنت قريبًا!" : "Online therapy session feature coming soon!");
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
