
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguage";
import TherapistProfile from "@/components/therapist/TherapistProfile";
import PatientManagement from "@/components/therapist/PatientManagement";
import SessionManagement from "@/components/therapist/SessionManagement";
import AvailabilityManagement from "@/components/therapist/AvailabilityManagement";
import MessagingLayout from "@/components/messaging/MessagingLayout";
import { DashboardOverview } from "@/components/therapist/dashboard/DashboardOverview";
import TherapistVideoSession from "@/components/therapist/TherapistVideoSession";
import {DoctorProfile as DoctorProfileType} from "@/lib/therapist-types";

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
  activeTab: string;
  setActiveTab: (tab: string) => void;
  doctorProfile: DoctorProfileType | null;
}

export const TherapistDashboardTabs = ({
  isLoading,
  doctorStats,
  upcomingAppointments,
  demographics,
  onViewSessionDetails,
  onScheduleSession,
  activeTab,
  setActiveTab,
  doctorProfile,
}: TherapistDashboardTabsProps) => {
  const { t } = useLanguage();

  // Handler to automatically switch to the sessions tab
  const handleSessionsTabClick = () => {
    setActiveTab("sessions");
  };

  // Handler to automatically switch to the video session tab
  const handleVideoTabClick = () => {
    setActiveTab("video_session");
  };

  // Handler to automatically switch to the messages tab
  const handleMessagesTabClick = () => {
    setActiveTab("messages");
  };
  const { language } = useLanguage();
  const isRTL = language === "ar";
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir={isRTL ? "rtl" : "ltr"}>
      <TabsList className="grid grid-cols-2 md:grid-cols-7 mb-8">
        <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
        <TabsTrigger value="profile">{t('profile')}</TabsTrigger>
        <TabsTrigger value="patients">{t('patients')}</TabsTrigger>
        <TabsTrigger value="sessions">{t('sessions')}</TabsTrigger>
        <TabsTrigger value="messages">{t('messages')}</TabsTrigger>
        <TabsTrigger value="video_session">{t('video_session')}</TabsTrigger>
        <TabsTrigger value="availability">{t('availability')}</TabsTrigger>
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
        <TherapistProfile initialDoctorProfile={doctorProfile} />
      </TabsContent>
      
      <TabsContent value="patients">
        <PatientManagement />
      </TabsContent>
      
      <TabsContent value="sessions">
        <SessionManagement />
      </TabsContent>
      
      <TabsContent value="messages">
        <MessagingLayout isTherapist={true} />
      </TabsContent>
      
      <TabsContent value="video_session">
        <TherapistVideoSession />
      </TabsContent>
      
      <TabsContent value="availability">
        <AvailabilityManagement />
      </TabsContent>
    </Tabs>
  );
};
