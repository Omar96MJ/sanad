
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { Bell, MessageCircle } from "lucide-react";

type DashboardHeaderProps = {
  doctorName: string;
  notificationsCount: number;
  onMessageClick: () => void;
  onNotificationClick: () => void;
};

export const DashboardHeader = ({ 
  doctorName, 
  notificationsCount, 
  onMessageClick, 
  onNotificationClick 
}: DashboardHeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold">{t('therapist_dashboard')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('welcome_back')}, {doctorName}
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" className="relative" onClick={onMessageClick}>
          <MessageCircle className="h-5 w-5" />
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
            2
          </span>
        </Button>
        <Button variant="outline" className="relative" onClick={onNotificationClick}>
          <Bell className="h-5 w-5" />
          {notificationsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notificationsCount}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};
