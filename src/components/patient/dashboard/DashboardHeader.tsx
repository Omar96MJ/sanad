
import { useLanguage } from "@/hooks/useLanguage";
import { User } from "@/lib/types";

interface DashboardHeaderProps {
  user: User;
  isVisible: boolean;
}

export const DashboardHeader = ({ user, isVisible }: DashboardHeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-muted/30 py-12">
      <div className="container-custom">
        <div 
          className={`transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h1 className="text-3xl font-bold mb-2">{t('welcome_back')}, {user.name}</h1>
          <p className="text-muted-foreground">
            {t('track_your_progress')}
          </p>
        </div>
      </div>
    </div>
  );
};
