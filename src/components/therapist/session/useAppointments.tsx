
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "./types";
import { updateAppointment } from "./appointmentService";

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

  // Fetch doctor's appointments from Supabase
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            profiles!appointments_patient_id_fkey (
              name
            )
          `)
          .eq('doctor_id', user.id)
          .order('session_date', { ascending: true });
        
        if (error) {
          console.error("Error fetching appointments:", error);
          toast({
            title: t('error_loading_appointments'),
            variant: "destructive",
          });
          return;
        }
        
        if (data) {
          // Map the data to include patient_name
          const mappedAppointments: Appointment[] = data.map(apt => ({
            ...apt,
            patient_name: apt.profiles?.name || 'Unknown Patient'
          }));
          setAppointments(mappedAppointments);
        }
      } catch (error) {
        console.error("Error in appointments fetch:", error);
        toast({
          title: t('error_loading_appointments'),
          variant: "destructive",
        });
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
        (apt.patient_name && apt.patient_name.toLowerCase().includes(query)) || 
        apt.session_type.toLowerCase().includes(query)
      );
    }
    
    setFilteredAppointments(filtered);
  }, [appointments, searchQuery, activeTab]);

  // Update appointment status
  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      setIsSaving(true);
      await updateAppointment(id, status);
      
      // Update local state
      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, status } : apt
      ));
      
      toast({
        title: t('appointment_updated'),
        variant: "default",
      });
      
      setIsSaving(false);
    } catch (error) {
      console.error("Error in appointment update:", error);
      toast({
        title: t('error_updating_appointment'),
        variant: "destructive",
      });
      setIsSaving(false);
      throw error;
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
    updateAppointmentStatus
  };
}
