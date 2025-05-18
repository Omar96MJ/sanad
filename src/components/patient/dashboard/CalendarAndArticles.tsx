
import { useLanguage } from "@/hooks/useLanguage";
import { Calendar } from "@/components/ui/calendar";
import BlogCard from "@/components/BlogCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CalendarAndArticlesProps {
  isVisible: boolean;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  calendarLocale: any;
  upcomingAppointments: any[];
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
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card 
        className={`border border-border/50 card-hover transition-all duration-700 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <CardHeader>
          <CardTitle>{t('calendar')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            locale={calendarLocale}
          />
          <div className="mt-4">
            <h4 className="font-medium mb-2">{t('upcoming')}</h4>
            {upcomingAppointments.filter(apt => apt.status === 'upcoming').length > 0 ? (
              upcomingAppointments
                .filter(apt => apt.status === 'upcoming')
                .slice(0, 1)
                .map(apt => (
                  <div key={apt.id} className="bg-primary/10 p-3 rounded-lg">
                    <p className="font-medium text-sm">{formatAppointmentDate(apt.date)}</p>
                    <p className="text-xs text-muted-foreground">{formatAppointmentTime(apt.date)} • {isRTL ? (apt.type === 'Video Call' ? 'مكالمة فيديو' : 'شخصيًا') : apt.type}</p>
                    <p className="text-xs mt-1">{apt.doctor}</p>
                  </div>
                ))
            ) : (
              <p className="text-sm text-muted-foreground">{t('no_upcoming_sessions')}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card 
        className={`md:col-span-2 border border-border/50 card-hover transition-all duration-700 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <CardHeader>
          <CardTitle>{t('recommended_articles')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockArticles.map(article => (
              <BlogCard key={article.id} blog={article} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
