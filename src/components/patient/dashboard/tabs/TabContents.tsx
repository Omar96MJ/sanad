
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguage";
import DashboardOverview from "@/components/patient/dashboard/DashboardOverview";
import { AppointmentsTab } from "@/components/patient/dashboard/AppointmentsTab";
import { ResourcesTab } from "@/components/patient/dashboard/ResourcesTab";
import { MessagingTab } from "@/components/patient/dashboard/MessagingTab";
import { BlogPost } from "@/lib/types";

interface TabContentsProps {
  isVisible: boolean;
  progress: number;
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

export const TabContents: React.FC<TabContentsProps> = ({ 
  isVisible,
  progress,
  mockAppointments,
  mockArticles,
  date,
  setDate,
  handleBookAppointment,
  handleStartTherapy,
  formatAppointmentDate,
  formatAppointmentTime,
  calendarLocale
}) => {
  const { t } = useLanguage();
  
  return (
    <>
      <TabsContent value="overview" className="py-4">
        <DashboardOverview 
          isVisible={isVisible}
          progress={progress}
          date={date}
          setDate={setDate}
          handleBookAppointment={handleBookAppointment}
          handleStartTherapy={handleStartTherapy}
          calendarLocale={calendarLocale}
          mockArticles={mockArticles}
        />
      </TabsContent>
      
      <TabsContent value="appointments" className="py-4">
        <AppointmentsTab 
          appointments={mockAppointments}
          onBookAppointment={handleBookAppointment}
          formatAppointmentDate={formatAppointmentDate}
          formatAppointmentTime={formatAppointmentTime}
        />
      </TabsContent>
      
      <TabsContent value="resources" className="py-4">
        <ResourcesTab 
          articles={mockArticles} 
        />
      </TabsContent>
      
      <TabsContent value="messaging" className="py-4">
        <MessagingTab />
      </TabsContent>
    </>
  );
};

export default TabContents;
