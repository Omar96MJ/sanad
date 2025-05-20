
import { useLanguage } from "@/hooks/useLanguage";
import { Doctor } from "@/lib/types";
import { ProgressSection } from "./ProgressSection";
import { TherapistCard } from "./TherapistCard";
import { CalendarAndArticles } from "./CalendarAndArticles";

interface DashboardOverviewProps {
  isVisible: boolean;
  progress: number;
  doctor: Doctor;
  upcomingAppointments: any[];
  mockArticles: any[];
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  onStartTherapy: () => void;
  onBookAppointment: () => void;
  formatAppointmentDate: (dateString: string) => string;
  formatAppointmentTime: (dateString: string) => string;
  calendarLocale: any;
}

export const DashboardOverview = ({
  isVisible,
  progress,
  doctor,
  upcomingAppointments,
  mockArticles,
  date,
  setDate,
  onStartTherapy,
  onBookAppointment,
  formatAppointmentDate,
  formatAppointmentTime,
  calendarLocale
}: DashboardOverviewProps) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProgressSection 
          isVisible={isVisible}
          progress={progress}
          onStartTherapy={onStartTherapy}
          isRTL={isRTL}
        />

        <TherapistCard 
          isVisible={isVisible}
          doctor={doctor}
          onBookAppointment={onBookAppointment}
        />
      </div>

      <CalendarAndArticles 
        isVisible={isVisible}
        date={date}
        setDate={setDate}
        calendarLocale={calendarLocale}
        upcomingAppointments={upcomingAppointments}
        formatAppointmentDate={formatAppointmentDate}
        formatAppointmentTime={formatAppointmentTime}
        mockArticles={mockArticles}
      />
    </div>
  );
};
