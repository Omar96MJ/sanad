
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguage";
import TherapistProfile from "@/components/therapist/TherapistProfile";
import PatientManagement from "@/components/therapist/PatientManagement";
import SessionManagement from "@/components/therapist/SessionManagement";
import EvaluationForms from "@/components/therapist/EvaluationForms";
import AvailabilityManagement from "@/components/therapist/AvailabilityManagement";
import MessagingLayout from "@/components/messaging/MessagingLayout";
import { DashboardOverview } from "@/components/therapist/dashboard/DashboardOverview";

interface TherapistDashboardTabsProps {
  isLoading: boolean;
  doctorStats: {
    patients_count: number;
    upcoming_sessions: number;
    pending_evaluations: number;
    available_hours: number;
  };
  upcomingAppointments: any[];
  demographics: { name: string; percentage: number }[];
  onViewSessionDetails: () => void;
  onScheduleSession: () => void;
}

export const TherapistDashboardTabs = ({
  isLoading,
  doctorStats,
  upcomingAppointments,
  demographics,
  onViewSessionDetails,
  onScheduleSession,
}: TherapistDashboardTabsProps) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");

  // Handler to automatically switch to the sessions tab
  const handleSessionsTabClick = () => {
    setActiveTab("sessions");
  };

  return (
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
          onViewSessionDetails={handleSessionsTabClick}
          onScheduleSession={handleSessionsTabClick}
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
  );
};
