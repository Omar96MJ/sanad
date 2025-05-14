
import { useLanguage } from "@/hooks/useLanguage";
import { AppointmentCard } from "./AppointmentCard";

type Appointment = {
  id: string;
  patient_name: string;
  session_date: string;
  session_type: string;
  status: string;
  notes?: string;
}

type AppointmentListProps = {
  appointments: Appointment[];
  onUpdateStatus: (id: string, status: string) => void;
};

export const AppointmentList = ({ appointments, onUpdateStatus }: AppointmentListProps) => {
  const { t } = useLanguage();

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t('no_sessions_found')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      {appointments.map((appointment) => (
        <AppointmentCard 
          key={appointment.id} 
          appointment={appointment}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
  );
};
