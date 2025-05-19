
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "./types";

export function useAppointments() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch doctor's appointments from Supabase
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('doctor_id', user.id)
          .order('session_date', { ascending: true });
        
        if (error) {
          console.error("Error fetching appointments:", error);
          toast.error(t('error_loading_appointments'));
          return;
        }
        
        if (data) {
          setAppointments(data);
        }
      } catch (error) {
        console.error("Error in appointments fetch:", error);
        toast.error(t('error_loading_appointments'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [user, t, toast]);

  // Filter appointments based on search query and active tab
  useEffect(() => {
    let filtered = appointments;
    
    // Filter by status
    if (activeTab === "upcoming") {
      filtered = filtered.filter((apt) => apt.status === "scheduled");
    } else if (activeTab === "completed") {
      filtered = filtered.filter((apt) => apt.status === "completed");
    } else if (activeTab === "cancelled") {
      filtered = filtered.filter((apt) => apt.status === "cancelled");
    }
    
    // Filter by search
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((apt) => 
        apt.patient_name.toLowerCase().includes(query) || 
        apt.session_type.toLowerCase().includes(query)
      );
    }
    
    setFilteredAppointments(filtered);
  }, [appointments, searchQuery, activeTab]);

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);
      
      if (error) {
        console.error("Error updating appointment:", error);
        toast.error(t('error_updating_appointment'));
        return;
      }
      
      // Update local state
      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, status } : apt
      ));
      
      // Also update the corresponding patient appointment
      const appointmentToUpdate = appointments.find(apt => apt.id === id);
      if (appointmentToUpdate) {
        const patientStatus = status === "scheduled" ? "upcoming" : 
                             status === "completed" ? "completed" : "cancelled";
                             
        const { error: patientApptError } = await supabase
          .from('patient_appointments')
          .update({ status: patientStatus })
          .eq('patient_id', appointmentToUpdate.patient_id)
          .eq('session_date', appointmentToUpdate.session_date);
          
        if (patientApptError) {
          console.error("Error updating patient appointment:", patientApptError);
        }
      }
      
      toast.success(t('appointment_updated'));
    } catch (error) {
      console.error("Error in appointment update:", error);
      toast.error(t('error_updating_appointment'));
    }
  };

  return {
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
  };
}
