
import { useLanguage } from "@/hooks/useLanguage";
import { TabsList as UITabsList, TabsTrigger } from "@/components/ui/tabs";

export const TabsList = () => {
  const { t } = useLanguage();
  
  return (
    <UITabsList className="grid grid-cols-1 sm:grid-cols-5 gap-2">
      <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
      <TabsTrigger value="appointments">{t('sessions')}</TabsTrigger>
      <TabsTrigger value="resources">{t('resources')}</TabsTrigger>
      <TabsTrigger value="messaging">{t('messaging')}</TabsTrigger>
      <TabsTrigger value="medical-records">{t('medical_records')}</TabsTrigger>
    </UITabsList>
  );
};
