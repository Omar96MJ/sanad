
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";

interface AppointmentsTabProps {
  appointments: any[];
  onBookAppointment: () => void;
  formatAppointmentDate: (dateString: string) => string;
  formatAppointmentTime: (dateString: string) => string;
}

export const AppointmentsTab = ({
  appointments,
  onBookAppointment,
  formatAppointmentDate,
  formatAppointmentTime
}: AppointmentsTabProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
  return (
    <Card className="border border-border/50">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>{t('your_appointments')}</CardTitle>
          <Button onClick={onBookAppointment} className="btn-primary">
            {t('schedule_new_session')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">{t('upcoming')}</h3>
            {appointments.filter(apt => apt.status === 'upcoming').length > 0 ? (
              <div className="space-y-3">
                {appointments
                  .filter(apt => apt.status === 'upcoming')
                  .map(apt => (
                    <div 
                      key={apt.id} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border/50 rounded-lg p-4"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium">
                            {isRTL ? (apt.type === 'Video Call' ? 'مكالمة فيديو' : 'شخصيًا') : apt.type}
                          </div>
                          <Badge variant="outline">{t(apt.status)}</Badge>
                        </div>
                        <p className="font-medium">{formatAppointmentDate(apt.date)}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatAppointmentTime(apt.date)} {isRTL ? 'مع' : 'with'} {apt.doctor}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-full">
                          {t('reschedule')}
                        </Button>
                        <Button variant="destructive" size="sm" className="rounded-full">
                          {t('cancel')}
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-muted-foreground">{t('no_upcoming_sessions')}</p>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">{t('past_appointments')}</h3>
            <div className="space-y-3">
              {appointments
                .filter(apt => apt.status === 'completed')
                .map(apt => (
                  <div 
                    key={apt.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border/50 rounded-lg p-4"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs font-medium">
                          {isRTL ? (apt.type === 'Video Call' ? 'مكالمة فيديو' : 'شخصيًا') : apt.type}
                        </div>
                        <Badge variant="outline" className="bg-muted">{t('completed')}</Badge>
                      </div>
                      <p className="font-medium">{formatAppointmentDate(apt.date)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatAppointmentTime(apt.date)} {isRTL ? 'مع' : 'with'} {apt.doctor}
                      </p>
                    </div>
                    <div>
                      <Button variant="outline" size="sm" className="rounded-full">
                        {t('view_notes')}
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
