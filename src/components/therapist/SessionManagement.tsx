
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppointmentList } from "./session/AppointmentList";
import { AppointmentFilter } from "./session/AppointmentFilter";
import { AppointmentDialog } from "./session/AppointmentDialog";
import { useAppointments } from "./session/useAppointments";
import { createAppointment } from "./session/appointmentService";
import { AppointmentFormValues } from "./session/types";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { usePatients } from "./session/usePatients";

const SessionManagement = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
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
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      // Validate patient name exists if needed
      if (!values.patient_name.trim()) {
        toast({
          title: t('error'),
          description: t('patient_name_required'),
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }
      
      // Create the appointment
      const newAppointment = await createAppointment(user.id, values);
      
      // Add the new appointment to the list
      setAppointments([...appointments, newAppointment]);
      toast({
        title: t('appointment_created'),
        description: t('appointment_created_success'),
        variant: "default",
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error in appointment creation:", error);
      toast({
        title: t('error_creating_appointment'),
        description: String(error),
        variant: "destructive",
      });
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
          <AppointmentDialog 
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSubmit={onSubmit}
            isSaving={isSaving}
          />
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
