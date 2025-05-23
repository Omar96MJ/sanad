
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguage";
import { DashboardOverview } from "./DashboardOverview";
import SessionManagement from "../SessionManagement";
import PatientManagement from "../PatientManagement";
import AvailabilityManagement from "../AvailabilityManagement";
import EvaluationForms from "../EvaluationForms";
import MessagingLayout from "@/components/messaging/MessagingLayout";

type TherapistDashboardTabsProps = {
  isLoading: boolean;
  doctorStats: {
    patients_count: number;
    upcoming_sessions: number;
    pending_evaluations: number;
    available_hours: number;
  };
  upcomingAppointments: any[];
  demographics: Array<{ name: string; percentage: number }>;
  onViewSessionDetails: () => void;
  onScheduleSession: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export const TherapistDashboardTabs = ({
  isLoading,
  doctorStats,
  upcomingAppointments,
  demographics,
  onViewSessionDetails,
  onScheduleSession,
  activeTab,
  setActiveTab,
}: TherapistDashboardTabsProps) => {
  const { t } = useLanguage();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
        <TabsTrigger value="sessions">{t('sessions')}</TabsTrigger>
        <TabsTrigger value="messages">{t('messages')}</TabsTrigger>
        <TabsTrigger value="patients">{t('patients')}</TabsTrigger>
        <TabsTrigger value="availability">{t('availability')}</TabsTrigger>
        <TabsTrigger value="evaluations">{t('evaluations')}</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <DashboardOverview
          isLoading={isLoading}
          doctorStats={doctorStats}
          upcomingAppointments={upcomingAppointments}
          demographics={demographics}
          onViewSessionDetails={onViewSessionDetails}
          onScheduleSession={onScheduleSession}
        />
      </TabsContent>

      <TabsContent value="sessions" className="space-y-6">
        <SessionManagement />
      </TabsContent>

      <TabsContent value="messages" className="space-y-6">
        <MessagingLayout isTherapist={true} />
      </TabsContent>

      <TabsContent value="patients" className="space-y-6">
        <PatientManagement />
      </TabsContent>

      <TabsContent value="availability" className="space-y-6">
        <AvailabilityManagement />
      </TabsContent>

      <TabsContent value="evaluations" className="space-y-6">
        <EvaluationForms />
      </TabsContent>
    </Tabs>
  );
};
