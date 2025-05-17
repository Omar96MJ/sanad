
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { StatsOverview } from "./StatsOverview";
import { UpcomingAppointments } from "./UpcomingAppointments";
import { PatientDemographics } from "./PatientDemographics";

type DoctorStats = {
  patients_count: number;
  upcoming_sessions: number;
  pending_evaluations: number;
  available_hours: number;
};

type Appointment = {
  id: string;
  patient_name: string;
  session_date: string;
  session_type: string;
};

type DemographicItem = {
  name: string;
  percentage: number;
};

type DashboardOverviewProps = {
  isLoading: boolean;
  doctorStats: DoctorStats;
  upcomingAppointments: Appointment[];
  demographics: DemographicItem[];
  onViewSessionDetails: () => void;
  onScheduleSession: () => void;
};

export const DashboardOverview = ({ 
  isLoading, 
  doctorStats, 
  upcomingAppointments, 
  demographics,
  onViewSessionDetails,
  onScheduleSession
}: DashboardOverviewProps) => {
  const { t } = useLanguage();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <StatsOverview stats={doctorStats} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UpcomingAppointments 
          appointments={upcomingAppointments} 
          onViewDetails={onViewSessionDetails}
          onScheduleSession={onScheduleSession}
        />
        
        <PatientDemographics demographics={demographics} />
      </div>
    </>
  );
};
