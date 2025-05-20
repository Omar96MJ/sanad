
import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { BlogPost, Doctor } from "@/lib/types";
import { TabsList } from "./tabs/TabsList";
import { TabContents } from "./tabs/TabContents";
import { useAuth } from "@/hooks/useAuth";

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

export const PatientDashboardTabs: React.FC<PatientDashboardTabsProps> = ({
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
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
      <TabsList />
      
      <TabContents 
        isVisible={isVisible}
        progress={progress}
        mockAppointments={mockAppointments}
        mockArticles={mockArticles}
        date={date}
        setDate={setDate}
        handleBookAppointment={handleBookAppointment}
        handleStartTherapy={handleStartTherapy}
        formatAppointmentDate={formatAppointmentDate}
        formatAppointmentTime={formatAppointmentTime}
        calendarLocale={calendarLocale}
        userId={user?.id}
        userName={user?.name}
      />
    </Tabs>
  );
};

export default PatientDashboardTabs;
