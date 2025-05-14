
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { format, parseISO } from "date-fns";
import { ar, enUS } from 'date-fns/locale';

type AppointmentCardProps = {
  appointment: {
    id: string;
    patient_name: string;
    session_date: string;
    session_type: string;
    status: string;
    notes?: string;
  };
  onUpdateStatus: (id: string, status: string) => void;
};

export const AppointmentCard = ({ appointment, onUpdateStatus }: AppointmentCardProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const dateLocale = isRTL ? ar : enUS;

  return (
    <Card className={appointment.status === "cancelled" ? "opacity-70" : ""}>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{appointment.patient_name}</h3>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                appointment.status === "scheduled" ? "bg-blue-100 text-blue-800" :
                appointment.status === "completed" ? "bg-green-100 text-green-800" :
                "bg-gray-100 text-gray-800"
              }`}>
                {appointment.status}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              {format(parseISO(appointment.session_date), "PPpp", { locale: dateLocale })}
            </p>
            <p className="text-sm">
              <span className="font-medium">{t('session_type')}:</span> {
                appointment.session_type === "initial" ? t('initial_consultation') :
                appointment.session_type === "followup" ? t('follow_up') :
                appointment.session_type === "therapy" ? t('therapy_session') :
                appointment.session_type === "assessment" ? t('assessment') :
                appointment.session_type
              }
            </p>
            {appointment.notes && (
              <p className="text-sm">
                <span className="font-medium">{t('notes')}:</span> {appointment.notes}
              </p>
            )}
          </div>
          
          <div className="flex flex-row sm:flex-col gap-2 justify-end">
            {appointment.status === "scheduled" && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onUpdateStatus(appointment.id, "completed")}
                >
                  {t('mark_completed')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onUpdateStatus(appointment.id, "cancelled")}
                >
                  {t('cancel')}
                </Button>
              </>
            )}
            {appointment.status === "cancelled" && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onUpdateStatus(appointment.id, "scheduled")}
              >
                {t('reschedule')}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
