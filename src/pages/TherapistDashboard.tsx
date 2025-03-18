
import { useState } from "react";
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
import { Bell, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const TherapistDashboard = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === 'ar';
  const [notificationsCount] = useState(3); // Mock notification count
  
  // Redirect if not logged in or not a doctor
  if (!user || user.role !== 'doctor') {
    navigate("/login");
    return null;
  }

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
              <Button variant="outline" className="relative">
                <MessageCircle className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </Button>
              <Button variant="outline" className="relative">
                <Bell className="h-5 w-5" />
                {notificationsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationsCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-8">
              <TabsTrigger value="profile">{t('profile')}</TabsTrigger>
              <TabsTrigger value="patients">{t('patients')}</TabsTrigger>
              <TabsTrigger value="sessions">{t('sessions')}</TabsTrigger>
              <TabsTrigger value="evaluations">{t('evaluations')}</TabsTrigger>
              <TabsTrigger value="availability">{t('availability')}</TabsTrigger>
              <TabsTrigger value="messaging">{t('messaging')}</TabsTrigger>
            </TabsList>
            
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
