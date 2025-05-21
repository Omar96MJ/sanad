
import { useLanguage } from "@/hooks/useLanguage";
import { Shield } from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
}

const DashboardHeader = ({ userName }: DashboardHeaderProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

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
      </div>
    </div>
  );
};

export default DashboardHeader;
