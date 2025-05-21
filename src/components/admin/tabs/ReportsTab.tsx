
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart3, Users, Activity, CalendarIcon } from "lucide-react";

interface ReportsTabProps {
  users: any[];
  appointments: any[];
  stats: {
    completedTests: string;
  };
}

const ReportsTab = ({ users, appointments, stats }: ReportsTabProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

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
                    <p className="text-2xl font-bold">{appointments.length}</p>
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
                    <p className="text-2xl font-bold">{stats.completedTests}</p>
                  </div>
                  <Activity className="h-10 w-10 text-primary/60" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('active_users')}</p>
                    <p className="text-2xl font-bold">{users.length > 0 ? Math.round(users.filter(u => u.role === 'patient').length / users.length * 100) : 0}%</p>
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

export default ReportsTab;
