
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { useLanguage } from "@/hooks/useLanguage";
import { PatientAppointment } from "@/services/patientAppointmentService";
import { parseISO } from "date-fns";

interface CalendarAndArticlesProps {
  isVisible: boolean;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  calendarLocale: any;
  upcomingAppointments: PatientAppointment[];
  formatAppointmentDate: (dateString: string) => string;
  formatAppointmentTime: (dateString: string) => string;
  mockArticles: any[];
}

export const CalendarAndArticles = ({
  isVisible,
  date,
  setDate,
  calendarLocale,
  upcomingAppointments,
  formatAppointmentDate,
  formatAppointmentTime,
  mockArticles
}: CalendarAndArticlesProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
  // Function to create date objects from appointment date strings
  const appointmentDates = upcomingAppointments.map(apt => {
    const date = parseISO(apt.session_date);
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  });
  
  // Function to check if a day has an appointment
  const isDayWithAppointment = (day: Date) => {
    return appointmentDates.some(aptDate => 
      aptDate.getFullYear() === day.getFullYear() &&
      aptDate.getMonth() === day.getMonth() &&
      aptDate.getDate() === day.getDate()
    );
  };
  
  // Custom modifier for days with appointments
  const modifiers = {
    hasAppointment: (day: Date) => isDayWithAppointment(day)
  };

  // Custom styles for modifiers
  const modifiersStyles = {
    hasAppointment: {
      position: 'relative',
      '::after': {
        content: '""',
        position: 'absolute',
        bottom: '2px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '4px',
        height: '4px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary)'
      }
    }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500 delay-200 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="col-span-1 md:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <h3 className="text-lg font-medium">
              {t('calendar')}
            </h3>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Calendar 
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                locale={calendarLocale}
                modifiers={{
                  hasAppointment: (date) => isDayWithAppointment(date)
                }}
              />
            </div>
            
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-sm text-muted-foreground">
                  {isRTL ? 'أيام بها مواعيد' : 'Days with appointments'}
                </span>
              </div>
              <h4 className="font-medium mb-2">{t('upcoming_sessions')}</h4>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-2">
                  {upcomingAppointments.map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="p-3 border border-border/40 rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{formatAppointmentDate(appointment.session_date)}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatAppointmentTime(appointment.session_date)} {isRTL ? 'مع' : 'with'} {appointment.doctor_name}
                          </p>
                        </div>
                        <Badge className="bg-primary/20 text-primary border-0">
                          {isRTL ? 'قادم' : 'Upcoming'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  {isRTL ? 'لا توجد جلسات قادمة' : 'No upcoming sessions'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="h-full">
        <CardHeader>
          <h3 className="text-lg font-medium">
            {t('recent_articles')}
          </h3>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {mockArticles.map((article) => (
                <div key={article.id} className="group">
                  <img 
                    src={article.coverImage} 
                    alt={article.title}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <h4 className="font-medium group-hover:text-primary transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {article.excerpt.substring(0, 60)}...
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
