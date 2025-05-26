
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { VideoIcon, VideoOffIcon, PhoneCallIcon } from "lucide-react";
import { PatientAppointment } from "@/services/patientAppointmentService";

interface SessionTabProps {
  appointments: PatientAppointment[];
  formatAppointmentDate: (dateString: string) => string;
  formatAppointmentTime: (dateString: string) => string;
  isVisible: boolean;
}

export const SessionTab = ({ 
  appointments,
  formatAppointmentDate,
  formatAppointmentTime,
  isVisible
}: SessionTabProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [inSession, setInSession] = useState(false);
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  // Find the next upcoming appointment
  const upcomingAppointment = appointments.find(apt => apt.status === 'upcoming');
  
  // Handle join session
  const handleJoinSession = () => {
    if (!upcomingAppointment) {
      toast({
        title: t('no_scheduled_session'),
        description: t('please_schedule_session_first'),
        variant: "destructive"
      });
      return;
    }
    
    setInSession(true);
    toast({
      title: t('session_joined'),
      description: t('waiting_for_therapist')
    });
  };
  
  // Handle end session
  const handleEndSession = () => {
    setInSession(false);
    toast({
      title: t('session_ended'),
      description: t('session_summary_email')
    });
  };
  
  // Toggle video
  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    toast({
      title: videoEnabled ? t('video_disabled') : t('video_enabled'),
    });
  };

  return (
    <div className="space-y-8">
      {inSession ? (
        <Card className="border border-border/50" dir={isRTL ? "rtl" : "ltr"}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>{t('live_session')}</div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleVideo}
                >
                  {videoEnabled ? 
                    <VideoIcon className="h-4 w-4 mr-2" /> : 
                    <VideoOffIcon className="h-4 w-4 mr-2" />
                  }
                  {videoEnabled ? t('disable_video') : t('enable_video')}
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleEndSession}
                >
                  {t('end_session')}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent >
            <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
              {videoEnabled ? (
                <div className="text-center p-8">
                  <div className="w-32 h-32 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-4">
                    <VideoIcon className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">{t('connecting')}</h3>
                  <p className="text-muted-foreground">{t('waiting_for_therapist')}</p>
                </div>
              ) : (
                <div className="text-center p-8">
                  <div className="w-32 h-32 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-4">
                    <VideoOffIcon className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">{t('video_disabled')}</h3>
                  <p className="text-muted-foreground">{t('audio_only_mode')}</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex items-center justify-center">
              <Button 
                size="lg" 
                variant="destructive"
                className="rounded-full px-8"
                onClick={handleEndSession}
              >
                <PhoneCallIcon className="h-5 w-5 mr-2" />
                {t('end_call')}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-border/50" dir={isRTL ? "rtl" : "ltr"}>
          <CardHeader>
            <CardTitle>{t('video_session')}</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointment ? (
              <div className="text-center py-8">
                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-4">
                  <VideoIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">
                  {t('upcoming_session')}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {formatAppointmentDate(upcomingAppointment.session_date)} {t('at')} {formatAppointmentTime(upcomingAppointment.session_date)}
                </p>
                <Button onClick={handleJoinSession} className="px-8">
                  {t('join_session')}
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-24 h-24 bg-muted rounded-full mx-auto flex items-center justify-center mb-4">
                  <VideoOffIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">
                  {t('no_scheduled_sessions')}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {t('schedule_session_to_start')}
                </p>
                <Button variant="outline">
                  {t('schedule_session')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="border border-border/50" dir={isRTL ? "rtl" : "ltr"}>
        <CardHeader>
          <CardTitle>{t('session_tips')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-accent rounded-lg p-4">
              <h3 className="font-medium mb-1">{t('quiet_environment')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('find_quiet_space_tip')}
              </p>
            </div>
            <div className="bg-accent rounded-lg p-4">
              <h3 className="font-medium mb-1">{t('test_equipment')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('test_equipment_tip')}
              </p>
            </div>
            <div className="bg-accent rounded-lg p-4">
              <h3 className="font-medium mb-1">{t('be_prepared')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('be_prepared_tip')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
