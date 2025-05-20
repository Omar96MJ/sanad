
import { TabsContent } from "@/components/ui/tabs";
import { DashboardOverview } from "../DashboardOverview";
import { AppointmentsTab } from "../AppointmentsTab";
import { SessionTab } from "../SessionTab";
import MessagingLayout from "@/components/messaging/MessagingLayout";  // Import MessagingLayout
import { BlogPost, Doctor } from "@/lib/types";
import { PatientAppointment } from "@/services/patientAppointmentService";

interface TabContentsProps {
  activeTab: string;
  isVisible: boolean;
  progress: number;
  mockDoctor: Doctor;
  appointments: PatientAppointment[];
  isLoadingAppointments?: boolean;
  mockArticles: BlogPost[];
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  handleBookAppointment: () => void;
  handleStartTherapy: () => void;
  formatAppointmentDate: (dateString: string) => string;
  formatAppointmentTime: (dateString: string) => string;
  calendarLocale: any;
  onAppointmentUpdated: () => void;
}

export const TabContents = ({
  activeTab,
  isVisible,
  progress,
  mockDoctor,
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
  // Get upcoming appointments for overview tab
  const upcomingAppointments = appointments.filter(apt => apt.status === 'upcoming');
  
  return (
    <>
      <TabsContent value="overview">
        <DashboardOverview
          isVisible={isVisible}
          progress={progress}
          doctor={mockDoctor}
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
        <SessionTab 
          appointments={appointments}
          formatAppointmentDate={formatAppointmentDate}
          formatAppointmentTime={formatAppointmentTime}
          isVisible={isVisible}
        />
      </TabsContent>

      <TabsContent value="messaging">
        <MessagingLayout isTherapist={false} />
      </TabsContent>
    </>
  );
};
