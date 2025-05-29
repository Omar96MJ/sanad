
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/hooks/useLanguage";
import { format, parseISO } from "date-fns";
import { ar, enUS } from 'date-fns/locale';
import { Appointment } from "./types";
import { User, Calendar, Clock, FileText } from "lucide-react";

type AppointmentCardProps = {
  appointment: Appointment;
  onUpdateStatus: (id: string, status: string) => void;
};

export const AppointmentCard = ({ appointment, onUpdateStatus }: AppointmentCardProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const dateLocale = isRTL ? ar : enUS;

  return (
    <Card className={`${appointment.status === "cancelled" ? "opacity-70" : ""} hover:shadow-md transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-3 flex-1">
            {/* Patient Info */}
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={""} alt={appointment.patient_name} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{appointment.patient_name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  appointment.status === "scheduled" ? "bg-blue-100 text-blue-800" :
                  appointment.status === "completed" ? "bg-green-100 text-green-800" :
                  appointment.status === "cancelled" ? "bg-red-100 text-red-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {t(appointment.status)}
                </span>
              </div>
            </div>
            
            {/* Session Details */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{format(parseISO(appointment.session_date), "PPP", { locale: dateLocale })}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{format(parseISO(appointment.session_date), "p", { locale: dateLocale })}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4" />
                <span className="font-medium">{t('session_type')}:</span> 
                <span>{
                  appointment.session_type === "initial" ? t('initial_consultation') :
                  appointment.session_type === "followup" ? t('follow_up') :
                  appointment.session_type === "therapy" ? t('therapy_session') :
                  appointment.session_type === "assessment" ? t('assessment') :
                  appointment.session_type
                }</span>
              </div>
              
              {appointment.notes && (
                <div className="flex items-start gap-2 text-sm">
                  <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">{t('notes')}:</span>
                    <p className="text-muted-foreground mt-1">{appointment.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-row sm:flex-col gap-2 justify-end sm:justify-start">
            {appointment.status === "scheduled" && (
              <>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => onUpdateStatus(appointment.id, "completed")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {t('mark_completed')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onUpdateStatus(appointment.id, "cancelled")}
                  className="border-red-300 text-red-600 hover:bg-red-50"
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
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
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
