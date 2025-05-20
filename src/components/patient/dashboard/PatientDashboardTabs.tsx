
import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { BlogPost, Doctor } from "@/lib/types";
import { TabsList } from "./tabs/TabsList";
import { TabContents } from "./tabs/TabContents";

interface PatientDashboardTabsProps {
  isVisible: boolean;
  progress: number;
  mockDoctor: Doctor;
  mockAppointments: any[];
  mockArticles: BlogPost[]; // Keep this as mockArticles for now to minimize changes
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
  mockArticles, // Keep the prop name as is
  date,
  setDate,
  handleBookAppointment,
  handleStartTherapy,
  formatAppointmentDate,
  formatAppointmentTime,
  calendarLocale
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
        mockAppointments={mockAppointments}
        mockArticles={mockArticles} // Pass it through
        date={date}
        setDate={setDate}
        handleBookAppointment={handleBookAppointment}
        handleStartTherapy={handleStartTherapy}
        formatAppointmentDate={formatAppointmentDate}
        formatAppointmentTime={formatAppointmentTime}
        calendarLocale={calendarLocale}
      />
    </Tabs>
  );
};
