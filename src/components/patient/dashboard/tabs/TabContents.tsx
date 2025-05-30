
import { TabsContent } from "@/components/ui/tabs";
import { DashboardOverview } from "../DashboardOverview";
import { AppointmentsTab } from "../AppointmentsTab";
import TherapistVideoSession from "../SessionTab";
import MessagingLayout from "@/components/messaging/MessagingLayout";
import { BlogPost } from "@/lib/types";
import { PatientAppointment } from "@/services/appointments";;
import { useLanguage } from "@/hooks/useLanguage";
import { DoctorProfile } from "@/lib/therapist-types";

interface TabContentsProps {
  activeTab: string;
  isVisible: boolean;
  progress: number;
  assignedDoctor: DoctorProfile | null;
  isLoadingDoctor?: boolean;
  appointments: PatientAppointment[];
  isLoadingAppointments?: boolean;
  mockArticles: BlogPost[];
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  handleBookAppointment: () => void;
  handleStartTherapy: () => void;
  formatAppointmentDate: (dateString: string) => string;
  formatAppointmentTime: (dateString: string) => string;
  calendarLocale: string;
  onAppointmentUpdated: () => void;
}

export const TabContents = ({
  activeTab,
  isVisible,
  progress,
  assignedDoctor,
  isLoadingDoctor = false,
  appointments,
  isLoadingAppointments = false,
  mockArticles,
  date,
  setDate,
  handleBookAppointment,
  handleStartTherapy,
  formatAppointmentDate,
  formatAppointmentTime,
  calendarLocale,
  onAppointmentUpdated
}: TabContentsProps) => {
  const { t } = useLanguage();
  
  // Get upcoming appointments for overview tab
const upcomingAppointments = appointments.filter(apt => apt.status === 'scheduled');
  
  return (
    <>
      <TabsContent value="overview">
        <DashboardOverview
          isVisible={isVisible}
          progress={progress}
          doctor={assignedDoctor}
          isLoadingDoctor={isLoadingDoctor}
          upcomingAppointments={upcomingAppointments}
          mockArticles={mockArticles}
          date={date}
          setDate={setDate}
          onStartTherapy={handleStartTherapy}
          onBookAppointment={handleBookAppointment}
          formatAppointmentDate={formatAppointmentDate}
          formatAppointmentTime={formatAppointmentTime}
          calendarLocale={calendarLocale}
        />
      </TabsContent>
      
      <TabsContent value="appointments">
        <AppointmentsTab 
          appointments={appointments}
          onBookAppointment={handleBookAppointment}
          formatAppointmentDate={formatAppointmentDate}
          formatAppointmentTime={formatAppointmentTime}
          onAppointmentUpdated={onAppointmentUpdated}
          isLoading={isLoadingAppointments}
        />
      </TabsContent>
      
      <TabsContent value="session">
        <TherapistVideoSession isVisible={isVisible} />
      </TabsContent>

      <TabsContent value="messaging">
        <MessagingLayout isTherapist={false} />
      </TabsContent>
    </>
  );
};
