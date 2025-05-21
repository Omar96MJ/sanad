
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppointmentList } from "./session/AppointmentList";
import { AppointmentFilter } from "./session/AppointmentFilter";
import { AppointmentDialog } from "./session/AppointmentDialog";
import { useAppointments } from "./session/useAppointments";
import { createAppointment } from "./session/appointmentService";
import { AppointmentFormValues } from "./session/types";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useState } from "react";
import { usePatients } from "./session/usePatients";

const SessionManagement = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const {
    isLoading,
    isSaving,
    setIsSaving,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    appointments,
    setAppointments,
    filteredAppointments,
    isDialogOpen,
    setIsDialogOpen,
    updateAppointmentStatus
  } = useAppointments();

  // Load patients for validation and selection
  const { patients } = usePatients();

  const onSubmit = async (values: AppointmentFormValues) => {
    if (!user) {
      toast.error(t('must_be_logged_in'));
      return;
    }
    
    try {
      setIsSaving(true);
      console.log("Creating appointment with user ID:", user.id, "and values:", values);
      
      // Create the appointment
      const newAppointment = await createAppointment(user.id, values);
      
      if (newAppointment) {
        // Add the new appointment to the list
        setAppointments([...appointments, newAppointment]);
        toast.success(t('appointment_created_success'));
        setIsDialogOpen(false);
      } else {
        toast.error(t('error_creating_appointment'));
      }
    } catch (error: any) {
      console.error("Error in appointment creation:", error);
      const errorMessage = error.message || t('error_creating_appointment');
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle>{t('session_management')}</CardTitle>
            <CardDescription>{t('manage_your_therapy_sessions')}</CardDescription>
          </div>
          <Button 
            onClick={() => setIsDialogOpen(true)} 
            className="whitespace-nowrap">
            {t('schedule_session')}
          </Button>
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

      <AppointmentDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={onSubmit}
        isSaving={isSaving}
      />
    </Card>
  );
};

export default SessionManagement;
