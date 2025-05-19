
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguage";
import TherapistProfile from "@/components/therapist/TherapistProfile";
import PatientManagement from "@/components/therapist/PatientManagement";
import SessionManagement from "@/components/therapist/SessionManagement";
import EvaluationForms from "@/components/therapist/EvaluationForms";
import AvailabilityManagement from "@/components/therapist/AvailabilityManagement";
import MessagingLayout from "@/components/messaging/MessagingLayout";
import { DashboardOverview } from "@/components/therapist/dashboard/DashboardOverview";
import TherapistCapabilities from "@/components/therapist/TherapistCapabilities";
import BlogManagement from "@/components/therapist/BlogManagement";
import MedicalHistorySection from "@/components/therapist/MedicalHistorySection";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || "overview");

  // Update URL when tab changes
  useEffect(() => {
    if (tabFromUrl !== activeTab) {
      setSearchParams({ tab: activeTab });
    }
  }, [activeTab, tabFromUrl, setSearchParams]);
  
  // Update active tab when URL changes
  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl, activeTab]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-9 mb-8">
        <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
        <TabsTrigger value="capabilities">{t('capabilities')}</TabsTrigger>
        <TabsTrigger value="profile">{t('profile')}</TabsTrigger>
        <TabsTrigger value="patients">{t('patients')}</TabsTrigger>
        <TabsTrigger value="medical-records">{t('medical_records')}</TabsTrigger>
        <TabsTrigger value="sessions">{t('sessions')}</TabsTrigger>
        <TabsTrigger value="evaluations">{t('evaluations')}</TabsTrigger>
        <TabsTrigger value="availability">{t('availability')}</TabsTrigger>
        <TabsTrigger value="blog">{t('blog')}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <DashboardOverview 
          isLoading={isLoading}
          doctorStats={doctorStats}
          upcomingAppointments={upcomingAppointments}
          demographics={demographics}
          onViewSessionDetails={onViewSessionDetails}
          onScheduleSession={onScheduleSession}
        />
      </TabsContent>
      
      <TabsContent value="capabilities">
        <TherapistCapabilities />
      </TabsContent>
      
      <TabsContent value="profile">
        <TherapistProfile />
      </TabsContent>
      
      <TabsContent value="patients">
        <PatientManagement />
      </TabsContent>
      
      <TabsContent value="medical-records">
        <MedicalHistorySection />
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
      
      <TabsContent value="blog">
        <BlogManagement />
      </TabsContent>
      
      <TabsContent value="messaging">
        <MessagingLayout isTherapist={true} />
      </TabsContent>
    </Tabs>
  );
};
