
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

type Appointment = {
  id: string;
  patient_name: string;
  session_date: string;
  session_type: string;
};

type UpcomingAppointmentsProps = {
  appointments: Appointment[];
  onViewDetails: () => void;
  onScheduleSession: () => void;
};

export const UpcomingAppointments = ({ 
  appointments, 
  onViewDetails,
  onScheduleSession 
}: UpcomingAppointmentsProps) => {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-primary" />
          {t('todays_schedule')}
        </CardTitle>
        <CardDescription>{t('your_upcoming_sessions')}</CardDescription>
      </CardHeader>
      <CardContent>
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">{appointment.patient_name}</div>
                  <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {new Date(appointment.session_date).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {appointment.session_type === "initial" ? t('initial_consultation') :
                   appointment.session_type === "followup" ? t('follow_up') :
                   appointment.session_type === "therapy" ? t('therapy_session') :
                   appointment.session_type === "assessment" ? t('assessment') :
                   appointment.session_type}
                </div>
                <Button variant="outline" size="sm" onClick={onViewDetails}>
                  {t('view_details')}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">{t('no_upcoming_sessions')}</p>
            <Button className="mt-4" variant="outline" onClick={onScheduleSession}>
              {t('schedule_session')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
