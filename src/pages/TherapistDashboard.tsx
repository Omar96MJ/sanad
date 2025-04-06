
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
import { Bell, MessageCircle, Users, Calendar, ClipboardList, Clock, PieChart } from "lucide-react";
import { toast } from "sonner";

const TherapistDashboard = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === 'ar';
  const [notificationsCount] = useState(3); // Mock notification count
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    // Redirect if not logged in or not a doctor
    if (!user || user.role !== 'doctor') {
      navigate("/login");
      toast.error(t('unauthorized_access'));
    }
    
    window.scrollTo(0, 0);
  }, [user, navigate, t]);

  if (!user || user.role !== 'doctor') {
    return null;
  }

  // Mock data for the overview dashboard
  const stats = [
    { title: t('total_patients'), value: '24', icon: Users, color: 'bg-blue-100 text-blue-700' },
    { title: t('upcoming_sessions'), value: '8', icon: Calendar, color: 'bg-green-100 text-green-700' },
    { title: t('pending_evaluations'), value: '5', icon: ClipboardList, color: 'bg-amber-100 text-amber-700' },
    { title: t('available_hours'), value: '16', icon: Clock, color: 'bg-violet-100 text-violet-700' },
  ];

  return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow mt-16 md:mt-20 py-8 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">{t('therapist_dashboard')}</h1>
              <p className="text-muted-foreground mt-1">{t('welcome_back')}, {user.name}</p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="relative" onClick={() => setActiveTab("messaging")}>
                <MessageCircle className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </Button>
              <Button variant="outline" className="relative" onClick={() => toast.info("Notifications will be implemented soon")}>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                          <p className="text-3xl font-bold mt-1">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-full ${stat.color}`}>
                          <stat.icon className="h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
                    <div className="space-y-4">
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">Michael Chen</div>
                          <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">10:00 AM</div>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">Initial Consultation</div>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">Emily Johnson</div>
                          <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">2:30 PM</div>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">Follow-up Session</div>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
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
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{t('anxiety')}</span>
                        <div className="w-2/3 bg-muted rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{t('depression')}</span>
                        <div className="w-2/3 bg-muted rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                        <span className="text-sm font-medium">30%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{t('stress')}</span>
                        <div className="w-2/3 bg-muted rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                        <span className="text-sm font-medium">15%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{t('other')}</span>
                        <div className="w-2/3 bg-muted rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '10%' }}></div>
                        </div>
                        <span className="text-sm font-medium">10%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
