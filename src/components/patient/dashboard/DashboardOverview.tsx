
import { useLanguage } from "@/hooks/useLanguage";
import { ProgressSection } from "./ProgressSection";
import { TherapistCard } from "./TherapistCard";
import { CalendarAndArticles } from "./CalendarAndArticles";
import { DoctorProfile } from "@/lib/therapist-types";
import { PatientAppointment } from "@/services/appointments"; // <-- ✅ استيراد محدث
import { BlogPost } from "@/lib/types"; // <-- ✅ استيراد للتحسين

interface DashboardOverviewProps {
  isVisible: boolean;
  progress: number;
  doctor: DoctorProfile | null;
  isLoadingDoctor?: boolean;
  upcomingAppointments: PatientAppointment[];
  mockArticles: BlogPost[];
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
  isLoadingDoctor = false,
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
          isLoadingDoctor={isLoadingDoctor}
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
