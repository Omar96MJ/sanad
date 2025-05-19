
import { useLanguage } from "@/hooks/useLanguage";
import { AppointmentCard } from "./AppointmentCard";
import { Loader2 } from "lucide-react";
import { Appointment } from "./types";

type AppointmentListProps = {
  appointments: Appointment[];
  onUpdateStatus: (id: string, status: string) => void;
  isLoading?: boolean;
};

export const AppointmentList = ({ appointments, onUpdateStatus, isLoading = false }: AppointmentListProps) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
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
