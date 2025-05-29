
import { Shield, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

interface AdminDashboardHeaderProps {
  userName: string;
  onRefresh: () => void;
  isRTL: boolean;
}

export const AdminDashboardHeader = ({ userName, onRefresh, isRTL }: AdminDashboardHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('admin_dashboard')}</h1>
        <p className="text-muted-foreground">
          {t('manage_users')} {t('system_settings')}
        </p>
      </div>
      <div className={`flex items-center mt-4 md:mt-0 ${isRTL ? 'md:mr-4' : 'md:ml-4'}`}>
        <Shield className={`text-primary ${isRTL ? 'ml-2' : 'mr-2'} h-5 w-5`} />
        <span className="text-sm font-medium">{userName} - {t('admin_panel')}</span>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
          className={`${isRTL ? 'mr-4' : 'ml-4'}`}
        >
          <RefreshCw className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('refresh') || 'Refresh'}
        </Button>
      </div>
    </div>
  );
};
