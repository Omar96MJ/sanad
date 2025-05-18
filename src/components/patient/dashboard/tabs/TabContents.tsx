
import { useLanguage } from "@/hooks/useLanguage";
import { TabsContent } from "@/components/ui/tabs";
import MessagingLayout from "@/components/messaging/MessagingLayout";
import { DashboardOverview } from "@/components/patient/dashboard/DashboardOverview";
import { AppointmentsTab } from "@/components/patient/dashboard/AppointmentsTab";
import { ResourcesTab } from "@/components/patient/dashboard/ResourcesTab";
import { BlogPost, Doctor } from "@/lib/types";

interface TabContentsProps {
  activeTab: string;
  isVisible: boolean;
  progress: number;
  mockDoctor: Doctor;
  mockAppointments: any[];
  mockArticles: BlogPost[];
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  handleBookAppointment: () => void;
  handleStartTherapy: () => void;
  formatAppointmentDate: (dateString: string) => string;
  formatAppointmentTime: (dateString: string) => string;
  calendarLocale: any;
}

export const TabContents = ({
  activeTab,
  isVisible,
  progress,
  mockDoctor,
  mockAppointments,
  mockArticles,
  date,
  setDate,
  handleBookAppointment,
  handleStartTherapy,
  formatAppointmentDate,
  formatAppointmentTime,
  calendarLocale
}: TabContentsProps) => {
  const { t } = useLanguage();

  return (
    <>
      <TabsContent value="overview">
        <DashboardOverview 
          isVisible={isVisible}
          progress={progress}
          doctor={mockDoctor}
          upcomingAppointments={mockAppointments}
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
          appointments={mockAppointments}
          onBookAppointment={handleBookAppointment}
          formatAppointmentDate={formatAppointmentDate}
          formatAppointmentTime={formatAppointmentTime}
        />
      </TabsContent>
      
      <TabsContent value="resources">
        <ResourcesTab articles={mockArticles} />
      </TabsContent>
      
      <TabsContent value="messaging">
        <div className="mt-4">
          <MessagingLayout isTherapist={false} />
        </div>
      </TabsContent>
    </>
  );
};
