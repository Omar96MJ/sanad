
import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface ProgressSectionProps {
  isVisible: boolean;
  progress: number;
  handleStartTherapy: () => void;
}

// Export as a named export to match the import in DashboardOverview.tsx
export const ProgressSection: React.FC<ProgressSectionProps> = ({ 
  isVisible, 
  progress, 
  handleStartTherapy 
}) => {
  const { t } = useLanguage();
  
  // Sample progress data
  const progressData = {
    mood: 60,
    anxiety: 40,
    sleep: 75,
    activity: 50
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{t('your_progress')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="week">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="week" className="flex-1">{t('week')}</TabsTrigger>
            <TabsTrigger value="month" className="flex-1">{t('month')}</TabsTrigger>
            <TabsTrigger value="year" className="flex-1">{t('year')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="week" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{t('mood')}</span>
                  <span className="text-sm text-muted-foreground">{progressData.mood}%</span>
                </div>
                <Progress value={progressData.mood} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{t('anxiety')}</span>
                  <span className="text-sm text-muted-foreground">{progressData.anxiety}%</span>
                </div>
                <Progress value={progressData.anxiety} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{t('sleep')}</span>
                  <span className="text-sm text-muted-foreground">{progressData.sleep}%</span>
                </div>
                <Progress value={progressData.sleep} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{t('activity')}</span>
                  <span className="text-sm text-muted-foreground">{progressData.activity}%</span>
                </div>
                <Progress value={progressData.activity} />
              </div>
            </div>
            
            <Button 
              onClick={handleStartTherapy} 
              className="w-full"
              disabled={progress >= 100}
            >
              {progress < 100 ? t('start_therapy_session') : t('therapy_complete')}
            </Button>
          </TabsContent>
          
          <TabsContent value="month">
            {/* Similar content structure for monthly view */}
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              {t('monthly_data_coming_soon')}
            </div>
          </TabsContent>
          
          <TabsContent value="year">
            {/* Similar content structure for yearly view */}
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              {t('yearly_data_coming_soon')}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Also export as default for backward compatibility
export default ProgressSection;
