
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppointmentList } from "./session/AppointmentList";
import { AppointmentFilter } from "./session/AppointmentFilter";
import { useAppointments } from "./session/useAppointments";
import { useAuth } from "@/hooks/useAuth";

const SessionManagement = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const {
    isLoading,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    filteredAppointments,
    updateAppointmentStatus
  } = useAppointments();

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle>{t('session_management')}</CardTitle>
            <CardDescription>{t('manage_your_therapy_sessions')}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <AppointmentFilter
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          
          <AppointmentList 
            appointments={filteredAppointments}
            onUpdateStatus={updateAppointmentStatus}
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionManagement;
