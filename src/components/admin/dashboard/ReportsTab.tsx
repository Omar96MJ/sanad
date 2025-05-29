
import { BarChart3, CalendarIcon, FileText, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/hooks/useLanguage";

interface AdminStats {
  totalUsers: number;
  totalAppointments: number;
  completedTests: number;
  activeSessions: number;
}

interface ReportsTabProps {
  stats: AdminStats;
  isLoadingStats: boolean;
  isRTL: boolean;
}

export const ReportsTab = ({ stats, isLoadingStats, isRTL }: ReportsTabProps) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'} text-primary`} />
          {t('usage_reports')}
        </CardTitle>
        <CardDescription>
          {t('view_system_usage_analytics')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-4">{t('user_growth')}</h3>
            <div className="h-[200px] w-full bg-muted/50 rounded-md flex items-end justify-between p-2">
              {[35, 45, 30, 65, 80, 70, 90].map((height, i) => (
                <div 
                  key={i} 
                  className="bg-primary/80 w-12 rounded-t-sm" 
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('total_sessions')}</p>
                    {isLoadingStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <p className="text-2xl font-bold">{stats.totalAppointments}</p>
                    )}
                  </div>
                  <CalendarIcon className="h-10 w-10 text-primary/60" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('test_completions')}</p>
                    {isLoadingStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <p className="text-2xl font-bold">{stats.completedTests}</p>
                    )}
                  </div>
                  <FileText className="h-10 w-10 text-primary/60" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('active_users')}</p>
                    {isLoadingStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <p className="text-2xl font-bold">{Math.round((stats.activeSessions / stats.totalUsers) * 100) || 0}%</p>
                    )}
                  </div>
                  <Users className="h-10 w-10 text-primary/60" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
