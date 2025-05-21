
import { useLanguage } from "@/hooks/language";
import { useTheme } from "@/hooks/useTheme";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Activity,
  Settings,
} from "lucide-react";

interface OverviewTabProps {
  users: any[];
  appointments: any[];
  stats: {
    newUsers: string;
    activeSessions: string;
    completedTests: string;
  };
  onTabChange: (tab: string) => void;
  settings: any;
}

const OverviewTab = ({ users, appointments, stats, onTabChange, settings }: OverviewTabProps) => {
  const { t } = useLanguage();
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isRTL = language === 'ar';

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{t('new_users')}</p>
              <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                {users.length > 0 ? '+' + Math.floor(users.length / 3) + '%' : '0%'}
              </div>
            </div>
            <p className="text-3xl font-bold mt-2">{stats.newUsers}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{t('active_sessions')}</p>
              <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                +{Math.floor(Math.random() * 30)}%
              </div>
            </div>
            <p className="text-3xl font-bold mt-2">{stats.activeSessions}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{t('completed_tests')}</p>
              <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                +{Math.floor(Math.random() * 20)}%
              </div>
            </div>
            <p className="text-3xl font-bold mt-2">{stats.completedTests}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <Users className={`${isRTL ? 'ml-2' : 'mr-2'} h-5 w-5 text-primary`} />
              {t('users')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.length}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {users.filter(u => u.role === 'doctor').length} {t('doctors')}, {users.filter(u => u.role === 'patient').length} {t('patients')}, {users.filter(u => u.role === 'admin').length} {t('admin')}
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              className="mt-4"
              onClick={() => onTabChange("users")}
            >
              {t('manage_users')}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <Activity className={`${isRTL ? 'ml-2' : 'mr-2'} h-5 w-5 text-primary`} />
              {t('recent_activities')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointments.length > 0 ? (
              appointments.slice(0, 3).map((appointment, index) => (
                <div className="text-sm" key={index}>
                  <div className="font-medium">
                    {appointment.session_type} {t('appointment')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(appointment.created_at).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">
                {t('no_recent_activities')}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <Settings className={`${isRTL ? 'ml-2' : 'mr-2'} h-5 w-5 text-primary`} />
              {t('system_settings')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm">{t('theme_mode')}</p>
              <div className="text-sm text-primary">{theme === 'dark' ? t('dark_mode') : t('light_mode')}</div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm">{t('signup')}</p>
              <div className={`text-sm ${settings.enableRegistration ? 'text-primary' : 'text-destructive'}`}>
                {settings.enableRegistration ? t('enabled') : t('disabled')}
              </div>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full mt-2"
              onClick={() => onTabChange("settings")}
            >
              {t('manage_settings')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
