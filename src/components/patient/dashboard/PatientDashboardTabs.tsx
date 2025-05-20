
import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { BlogPost, Doctor } from "@/lib/types";
import { TabsList } from "./tabs/TabsList";
import { TabContents } from "./tabs/TabContents";
import { PatientAppointment } from "@/services/patientAppointmentService";

interface PatientDashboardTabsProps {
  isVisible: boolean;
  progress: number;
  mockDoctor: Doctor;
  appointments: PatientAppointment[];
  isLoadingAppointments?: boolean;
  mockArticles: BlogPost[]; // Keep this as mockArticles for now to minimize changes
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  handleBookAppointment: () => void;
  handleStartTherapy: () => void;
  formatAppointmentDate: (dateString: string) => string;
  formatAppointmentTime: (dateString: string) => string;
  calendarLocale: any;
  onAppointmentUpdated: () => void;
}

export const PatientDashboardTabs = ({
  isVisible,
  progress,
  mockDoctor,
  appointments,
  isLoadingAppointments = false,
  mockArticles, // Keep the prop name as is
  date,
  setDate,
  handleBookAppointment,
  handleStartTherapy,
  formatAppointmentDate,
  formatAppointmentTime,
  calendarLocale,
  onAppointmentUpdated
}: PatientDashboardTabsProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
      <TabsList />
      
      <TabContents
        activeTab={activeTab}
        isVisible={isVisible}
        progress={progress}
        mockDoctor={mockDoctor}
        appointments={appointments}
        isLoadingAppointments={isLoadingAppointments}
        mockArticles={mockArticles} // Pass it through
        date={date}
        setDate={setDate}
        handleBookAppointment={handleBookAppointment}
        handleStartTherapy={handleStartTherapy}
        formatAppointmentDate={formatAppointmentDate}
        formatAppointmentTime={formatAppointmentTime}
        calendarLocale={calendarLocale}
        onAppointmentUpdated={onAppointmentUpdated}
      />
    </Tabs>
  );
};
