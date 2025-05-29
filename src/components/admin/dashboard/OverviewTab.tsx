
import { Users, Settings, CalendarIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import { useSettings } from "@/hooks/useSettings";

interface AnalyticsData {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

interface OverviewTabProps {
  analyticsData: AnalyticsData[];
  totalUsers: number;
  doctorCount: number;
  patientCount: number;
  adminCount: number;
  totalAppointments: number;
  activeSessions: number;
  isLoadingUsers: boolean;
  isLoadingStats: boolean;
  isRTL: boolean;
  onTabChange: (tab: string) => void;
}

export const OverviewTab = ({ 
  analyticsData, 
  totalUsers, 
  doctorCount, 
  patientCount, 
  adminCount,
  totalAppointments,
  activeSessions,
  isLoadingUsers, 
  isLoadingStats,
  isRTL,
  onTabChange 
}: OverviewTabProps) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { settings } = useSettings();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {analyticsData.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  item.trend === 'up' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.change}
                </div>
              </div>
              <p className="text-3xl font-bold mt-2">{item.value}</p>
            </CardContent>
          </Card>
        ))}
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
            {isLoadingUsers ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold">{totalUsers}</div>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              {doctorCount} {t('doctors')}, {patientCount} {t('patients')}, {adminCount} {t('admin')}
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
              <CalendarIcon className={`${isRTL ? 'ml-2' : 'mr-2'} h-5 w-5 text-primary`} />
              {t('total_sessions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold">{totalAppointments}</div>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              {activeSessions} {t('active_sessions')}
            </p>
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
              <label htmlFor="theme-mode">{theme === 'dark' ? t('dark_mode') : t('light_mode')}</label>
              <div className="text-sm text-primary">{theme === 'dark' ? t('enabled') : t('enabled')}</div>
            </div>
            <div className="flex justify-between items-center">
              <label htmlFor="reg-status">{t('signup')}</label>
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
