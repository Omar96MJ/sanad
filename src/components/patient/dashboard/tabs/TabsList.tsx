
import { useLanguage } from "@/hooks/useLanguage";
import { TabsList as UITabsList, TabsTrigger } from "@/components/ui/tabs";

export const TabsList = () => {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";
  
  return (
    <UITabsList className="grid grid-cols-1 sm:grid-cols-4 gap-2" dir={isRTL ? "rtl" : "ltr"} >
      <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
      <TabsTrigger value="appointments">{t('sessions')}</TabsTrigger>
      <TabsTrigger value="session">{t('video_session')}</TabsTrigger>
      <TabsTrigger value="messaging">{t('messaging')}</TabsTrigger>
    </UITabsList>
  );
};
