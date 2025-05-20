
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressSectionProps {
  isVisible: boolean;
  progress: number;
  onStartTherapy: () => void;
  isRTL: boolean;
}

export const ProgressSection = ({
  isVisible,
  progress,
  onStartTherapy,
  isRTL
}: ProgressSectionProps) => {
  const { t } = useLanguage();
  
  return (
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
  );
};
