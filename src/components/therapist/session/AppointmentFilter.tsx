
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/useLanguage";
import { Search } from "lucide-react";

type AppointmentFilterProps = {
  activeTab: string;
  setActiveTab: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
};

export const AppointmentFilter = ({ 
  activeTab, 
  setActiveTab, 
  searchQuery, 
  setSearchQuery
}: AppointmentFilterProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
        <TabsList>
          <TabsTrigger value="upcoming">{t('upcoming')}</TabsTrigger>
          <TabsTrigger value="completed">{t('completed')}</TabsTrigger>
          <TabsTrigger value="cancelled">{t('cancelled')}</TabsTrigger>
          <TabsTrigger value="all">{t('all')}</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="relative w-full sm:w-64">
        <Search className={`absolute top-2.5 ${isRTL ? 'right-3' : 'left-3'} h-4 w-4 text-muted-foreground`} />
        <Input
          placeholder={t('search_sessions')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`pl-9 ${isRTL ? 'text-right pr-9 pl-4' : 'text-left pl-9 pr-4'}`}
        />
      </div>
    </div>
  );
};
