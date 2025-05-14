import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TherapistProfile from "@/components/therapist/TherapistProfile";
import PatientManagement from "@/components/therapist/PatientManagement";
import SessionManagement from "@/components/therapist/SessionManagement";
import EvaluationForms from "@/components/therapist/EvaluationForms";
import AvailabilityManagement from "@/components/therapist/AvailabilityManagement";
import MessagingLayout from "@/components/messaging/MessagingLayout";
import { Bell, MessageCircle, Users, Calendar, ClipboardList, Clock, PieChart, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
        } else if (profileData) {
          setDoctorProfile(profileData);
          
          // Use the profile data for stats
          const stats: DoctorStats = {
            patients_count: profileData.patients_count || 0,
            upcoming_sessions: 0,
            pending_evaluations: 5, // Mock data for now
            available_hours: 16, // Mock data for now
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

  return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow mt-16 md:mt-20 py-8 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">{t('therapist_dashboard')}</h1>
              <p className="text-muted-foreground mt-1">
                {t('welcome_back')}, {doctorProfile?.name || user.name}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="relative" onClick={() => setActiveTab("messaging")}>
                <MessageCircle className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </Button>
              <Button variant="outline" className="relative" onClick={() => toast.info(t("notifications_coming_soon"))}>
                <Bell className="h-5 w-5" />
                {notificationsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationsCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
          
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
              {isLoading ? (
                <div className="flex justify-center items-center p-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('total_patients')}</p>
                            <p className="text-3xl font-bold mt-1">{doctorStats.patients_count}</p>
                          </div>
                          <div className="p-3 rounded-full bg-blue-100 text-blue-700">
                            <Users className="h-6 w-6" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('upcoming_sessions')}</p>
                            <p className="text-3xl font-bold mt-1">{doctorStats.upcoming_sessions}</p>
                          </div>
                          <div className="p-3 rounded-full bg-green-100 text-green-700">
                            <Calendar className="h-6 w-6" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('pending_evaluations')}</p>
                            <p className="text-3xl font-bold mt-1">{doctorStats.pending_evaluations}</p>
                          </div>
                          <div className="p-3 rounded-full bg-amber-100 text-amber-700">
                            <ClipboardList className="h-6 w-6" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('available_hours')}</p>
                            <p className="text-3xl font-bold mt-1">{doctorStats.available_hours}</p>
                          </div>
                          <div className="p-3 rounded-full bg-violet-100 text-violet-700">
                            <Clock className="h-6 w-6" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl flex items-center">
                          <Calendar className="mr-2 h-5 w-5 text-primary" />
                          {t('todays_schedule')}
                        </CardTitle>
                        <CardDescription>{t('your_upcoming_sessions')}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {upcomingAppointments.length > 0 ? (
                          <div className="space-y-4">
                            {upcomingAppointments.map((appointment) => (
                              <div key={appointment.id} className="border rounded-md p-4">
                                <div className="flex justify-between items-center mb-2">
                                  <div className="font-medium">{appointment.patient_name}</div>
                                  <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    {new Date(appointment.session_date).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </div>
                                </div>
                                <div className="text-sm text-muted-foreground mb-2">
                                  {appointment.session_type === "initial" ? t('initial_consultation') :
                                   appointment.session_type === "followup" ? t('follow_up') :
                                   appointment.session_type === "therapy" ? t('therapy_session') :
                                   appointment.session_type === "assessment" ? t('assessment') :
                                   appointment.session_type}
                                </div>
                                <Button variant="outline" size="sm" onClick={() => setActiveTab("sessions")}>
                                  {t('view_details')}
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <p className="text-muted-foreground">{t('no_upcoming_sessions')}</p>
                            <Button className="mt-4" variant="outline" onClick={() => setActiveTab("sessions")}>
                              {t('schedule_session')}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl flex items-center">
                          <PieChart className="mr-2 h-5 w-5 text-primary" />
                          {t('patient_demographics')}
                        </CardTitle>
                        <CardDescription>{t('patient_overview')}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {demographics.map((item, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-sm">{item.name}</span>
                              <div className="w-2/3 bg-muted rounded-full h-2.5">
                                <div 
                                  className="bg-blue-600 h-2.5 rounded-full" 
                                  style={{ width: `${item.percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{item.percentage}%</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
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
