
import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { BlogPost } from "@/lib/types";
import { TabsList } from "./tabs/TabsList";
import { TabContents } from "./tabs/TabContents";
import { PatientAppointment } from "@/services/appointments"; // <-- ✅ استيراد محدث
import { DoctorProfile } from "@/lib/therapist-types";

interface PatientDashboardTabsProps {
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
  calendarLocale: any;
  onAppointmentUpdated: () => void;
}

export const PatientDashboardTabs = ({
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
}: PatientDashboardTabsProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
      <TabsList />
      
      <TabContents
        activeTab={activeTab}
        isVisible={isVisible}
        progress={progress}
        assignedDoctor={assignedDoctor}
        isLoadingDoctor={isLoadingDoctor}
        appointments={appointments}
        isLoadingAppointments={isLoadingAppointments}
        mockArticles={mockArticles}
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
