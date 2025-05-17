
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TherapistProfile from "@/components/therapist/TherapistProfile";
import PatientManagement from "@/components/therapist/PatientManagement";
import SessionManagement from "@/components/therapist/SessionManagement";
import EvaluationForms from "@/components/therapist/EvaluationForms";
import AvailabilityManagement from "@/components/therapist/AvailabilityManagement";
import MessagingLayout from "@/components/messaging/MessagingLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/therapist/dashboard/DashboardHeader";
import { DashboardOverview } from "@/components/therapist/dashboard/DashboardOverview";

type DoctorStats = {
  patients_count: number;
  upcoming_sessions: number;
  pending_evaluations: number;
  available_hours: number;
}

type DoctorProfile = {
  id: string;
  name: string;
  specialization: string;
  bio: string;
  years_of_experience: number;
  patients_count: number;
  profile_image: string;
}

const TherapistDashboard = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isRTL = language === 'ar';
  
  const [isLoading, setIsLoading] = useState(true);
  const [notificationsCount] = useState(3); // Mock notification count
  const [activeTab, setActiveTab] = useState("overview");
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [doctorStats, setDoctorStats] = useState<DoctorStats>({
    patients_count: 0,
    upcoming_sessions: 0,
    pending_evaluations: 0,
    available_hours: 0
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  
  useEffect(() => {
    // Redirect if not logged in or not a doctor
    if (!user || user.role !== 'doctor') {
      navigate("/login");
      toast.error(t('unauthorized_access'));
      return;
    }
    
    // Fetch doctor profile and stats
    const fetchDoctorData = async () => {
      try {
        setIsLoading(true);
        
        // Get doctor profile
        const { data: profileData, error: profileError } = await supabase
          .from('doctors')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching doctor profile:", profileError);
          toast.error(t('error_loading_profile'));
          
          // If no doctor profile exists, create one
          if (profileError.code === 'PGRST116') {
            const { error: insertError } = await supabase
              .from('doctors')
              .insert({
                user_id: user.id,
                name: user.name || '',
                specialization: '',
                bio: '',
                years_of_experience: 0,
                patients_count: 0,
                profile_image: user.profileImage || '',
              });
              
            if (insertError) {
              console.error("Error creating doctor profile:", insertError);
            } else {
              // Fetch again after creating
              const { data: newProfileData } = await supabase
                .from('doctors')
                .select('*')
                .eq('user_id', user.id)
                .single();
                
              if (newProfileData) {
                setDoctorProfile(newProfileData);
              }
            }
          }
        } else if (profileData) {
          setDoctorProfile(profileData);
          
          // Use the profile data for stats
          const stats: DoctorStats = {
            patients_count: profileData.patients_count || 0,
            upcoming_sessions: 0,
            pending_evaluations: 5, // Default value
            available_hours: 16, // Default value
          };
          
          // Get upcoming appointments count
          const { data: appointmentsData, error: appointmentsError } = await supabase
            .from('appointments')
            .select('*')
            .eq('doctor_id', user.id)
            .eq('status', 'scheduled')
            .order('session_date', { ascending: true });
          
          if (!appointmentsError && appointmentsData) {
            stats.upcoming_sessions = appointmentsData.length;
            setUpcomingAppointments(appointmentsData.slice(0, 2)); // Get the first 2 appointments
          }
          
          setDoctorStats(stats);
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        toast.error(t('error_loading_dashboard'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDoctorData();
    window.scrollTo(0, 0);
  }, [user, navigate, t, toast]);

  if (!user || user.role !== 'doctor') {
    return null;
  }

  // Demographics data for the dashboard charts
  const demographics = [
    { name: t('anxiety'), percentage: 45 },
    { name: t('depression'), percentage: 30 },
    { name: t('stress'), percentage: 15 },
    { name: t('other'), percentage: 10 },
  ];
  
  const handleNotificationClick = () => {
    toast.info(t("notifications_coming_soon"));
  };

  const handleViewSessionDetails = () => {
    setActiveTab("sessions");
  };

  const handleScheduleSession = () => {
    setActiveTab("sessions");
  };

  return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow mt-16 md:mt-20 py-8 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader 
            doctorName={doctorProfile?.name || user.name || ''}
            notificationsCount={notificationsCount}
            onMessageClick={() => setActiveTab("messaging")}
            onNotificationClick={handleNotificationClick}
          />
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-7 mb-8">
              <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
              <TabsTrigger value="profile">{t('profile')}</TabsTrigger>
              <TabsTrigger value="patients">{t('patients')}</TabsTrigger>
              <TabsTrigger value="sessions">{t('sessions')}</TabsTrigger>
              <TabsTrigger value="evaluations">{t('evaluations')}</TabsTrigger>
              <TabsTrigger value="availability">{t('availability')}</TabsTrigger>
              <TabsTrigger value="messaging">{t('messaging')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <DashboardOverview 
                isLoading={isLoading}
                doctorStats={doctorStats}
                upcomingAppointments={upcomingAppointments}
                demographics={demographics}
                onViewSessionDetails={handleViewSessionDetails}
                onScheduleSession={handleScheduleSession}
              />
            </TabsContent>
            
            <TabsContent value="profile">
              <TherapistProfile />
            </TabsContent>
            
            <TabsContent value="patients">
              <PatientManagement />
            </TabsContent>
            
            <TabsContent value="sessions">
              <SessionManagement />
            </TabsContent>
            
            <TabsContent value="evaluations">
              <EvaluationForms />
            </TabsContent>
            
            <TabsContent value="availability">
              <AvailabilityManagement />
            </TabsContent>
            
            <TabsContent value="messaging">
              <MessagingLayout isTherapist={true} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TherapistDashboard;
