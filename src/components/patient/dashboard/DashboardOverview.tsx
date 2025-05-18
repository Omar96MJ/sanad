
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/hooks/useLanguage";
import { Doctor } from "@/lib/types";
import { DoctorCard } from "@/components/UserCard";

interface DashboardOverviewProps {
  isVisible: boolean;
  progress: number;
  doctor: Doctor;
  upcomingAppointments: any[];
  mockArticles: any[];
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
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className={`md:col-span-2 card-hover border border-border/50 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <CardHeader>
            <CardTitle>{t('your_progress')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t('therapy_program')}</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-accent rounded-lg p-4">
                  <div className="text-sm font-medium mb-1">{t('completed_sessions')}</div>
                  <div className="text-2xl font-bold">7 {t('of')} 12</div>
                  <div className="text-xs text-muted-foreground mt-1">{t('next_session')}: {isRTL ? '١٠ نوفمبر' : 'Nov 10'}</div>
                </div>
                <div className="bg-accent rounded-lg p-4">
                  <div className="text-sm font-medium mb-1">{t('mood_tracker')}</div>
                  <div className="text-2xl font-bold">{t('improving')}</div>
                  <div className="text-xs text-muted-foreground mt-1">12% {t('up_this_month')}</div>
                </div>
                <div className="bg-accent rounded-lg p-4">
                  <div className="text-sm font-medium mb-1">{t('weekly_goals')}</div>
                  <div className="text-2xl font-bold">3 {t('of')} 5</div>
                  <div className="text-xs text-muted-foreground mt-1">2 {t('days_remaining')}</div>
                </div>
                <div className="bg-accent rounded-lg p-4">
                  <div className="text-sm font-medium mb-1">{t('exercises_completed')}</div>
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-xs text-muted-foreground mt-1">+3 {t('from_last_week')}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button onClick={onStartTherapy} className="btn-primary">
                  {t('start_todays_session')}
                </Button>
                <Button variant="outline" className="rounded-full">
                  {t('view_detailed_progress')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`border border-border/50 card-hover transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <CardHeader>
            <CardTitle>{t('your_therapist')}</CardTitle>
          </CardHeader>
          <CardContent>
            <DoctorCard doctor={doctor} />
            <Button 
              onClick={onBookAppointment} 
              className="w-full mt-6 btn-primary"
            >
              {t('schedule_session')}
            </Button>
          </CardContent>
        </Card>
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

const CalendarAndArticles = ({
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
