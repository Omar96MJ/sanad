
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, BookOpen, Brain, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Doctor, BlogPost } from "@/lib/types";
import AppointmentManager from "@/components/patient/AppointmentManager";
import { ProgressSection } from "./ProgressSection";
import { TherapistCard } from "./TherapistCard";

interface DashboardOverviewProps {
  isVisible: boolean;
  progress: number;
  doctor: Doctor;
  upcomingAppointments: any[];
  mockArticles: BlogPost[];
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  onStartTherapy: () => void;
  onBookAppointment: () => void;
  formatAppointmentDate: (dateString: string) => string;
  formatAppointmentTime: (dateString: string) => string;
  calendarLocale: any;
}

export function DashboardOverview({ 
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
}: DashboardOverviewProps) {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className={`space-y-6 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Progress Section */}
      <ProgressSection 
        isVisible={isVisible} 
        progress={progress} 
        onStartTherapy={onStartTherapy} 
        isRTL={isRTL} 
      />
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Appointments */}
        <div>
          <AppointmentManager />
        </div>
        
        {/* Right Column: Therapist + Quick Actions */}
        <div className="space-y-6">
          {/* Therapist Card */}
          <div>
            <h2 className="text-xl font-semibold mb-4">{t('my_therapist')}</h2>
            {doctor.id ? (
              <TherapistCard 
                isVisible={isVisible}
                doctor={doctor}
                onBookAppointment={onBookAppointment}
              />
            ) : (
              <Card className="text-center py-6">
                <CardContent>
                  <div className="flex flex-col items-center justify-center">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">{t('no_therapist_assigned')}</h3>
                    <p className="text-muted-foreground mb-4">{t('find_therapist_message')}</p>
                    <Button asChild>
                      <Link to="/therapist-search">{t('find_a_therapist')}</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Quick Actions Cards */}
          <div>
            <h2 className="text-xl font-semibold mb-4">{t('quick_actions')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Resource Library */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{t('resource_library')}</CardTitle>
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">{t('explore_resources')}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                    <Link to="/library" className="flex items-center justify-between w-full">
                      {t('view_library')}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Psychological Tests */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{t('psychological_tests')}</CardTitle>
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">{t('take_assessment')}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                    <Link to="/psychological-tests" className="flex items-center justify-between w-full">
                      {t('take_test')}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
