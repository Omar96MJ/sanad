
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TherapistDashboardTabs } from "@/components/therapist/dashboard/TherapistDashboardTabs";
import { DashboardHeader } from "@/components/therapist/dashboard/DashboardHeader";
import { useTherapistDashboard } from "@/hooks/useTherapistDashboard";

const TherapistDashboardContent = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const isRTL = language === 'ar';
  const [activeTab, setActiveTab] = useState("overview");

  const {
    isLoading,
    doctorProfile,
    notificationsCount,
    unreadMessagesCount,
    doctorStats,
    upcomingAppointments,
    demographics,
  } = useTherapistDashboard();

  if (isLoading && (!user || user.role !== 'doctor')) {
    return null;
  }
  
  if (!user || user.role !== 'doctor') {
    return null; 
  }

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "Notifications feature coming soon!",
    });
  };

  const handleViewSessionDetails = () => {
    setActiveTab("sessions");
  };

  const handleMessageClick = () => {
    setActiveTab("messages");
  };

  return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow mt-16 md:mt-20 py-8 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader 
            doctorName={doctorProfile?.name || user.name || ''}
            notificationsCount={notificationsCount}
            unreadMessagesCount={unreadMessagesCount} 
            onMessageClick={handleMessageClick}
            onNotificationClick={handleNotificationClick}
          />
          
          <TherapistDashboardTabs 
            isLoading={isLoading}
            doctorStats={doctorStats}
            upcomingAppointments={upcomingAppointments}
            demographics={demographics}
            onViewSessionDetails={handleViewSessionDetails}
            onScheduleSession={handleViewSessionDetails}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            doctorProfile={doctorProfile}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TherapistDashboardContent;
