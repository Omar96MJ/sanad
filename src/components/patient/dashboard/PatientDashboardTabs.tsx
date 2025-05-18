
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguage";
import { Calendar } from "@/components/ui/calendar";
import MessagingLayout from "@/components/messaging/MessagingLayout";
import { DashboardOverview } from "@/components/patient/dashboard/DashboardOverview";
import { AppointmentsTab } from "@/components/patient/dashboard/AppointmentsTab";
import { ResourcesTab } from "@/components/patient/dashboard/ResourcesTab";
import { BlogPost, Doctor } from "@/lib/types";

interface PatientDashboardTabsProps {
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

export const PatientDashboardTabs = ({
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
}: PatientDashboardTabsProps) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
      <TabsList className="grid grid-cols-1 sm:grid-cols-4 gap-2">
        <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
        <TabsTrigger value="appointments">{t('sessions')}</TabsTrigger>
        <TabsTrigger value="resources">{t('resources')}</TabsTrigger>
        <TabsTrigger value="messaging">{t('messaging')}</TabsTrigger>
      </TabsList>
      
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
    </Tabs>
  );
};
