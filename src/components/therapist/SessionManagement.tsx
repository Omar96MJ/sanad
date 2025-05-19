
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AppointmentList } from "./session/AppointmentList";
import { AppointmentFilter } from "./session/AppointmentFilter";
import { AppointmentDialog } from "./session/AppointmentDialog";
import * as z from "zod";

type Appointment = {
  id: string;
  patient_name: string;
  session_date: string;
  session_type: string;
  status: string;
  notes?: string;
}

const formSchema = z.object({
  patient_name: z.string().min(2),
  session_date: z.date(),
  session_time: z.string(),
  session_type: z.string(),
  notes: z.string().optional(),
});

const SessionManagement = () => {
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      // Combine date and time to create ISO date string
      const dateTimeValue = new Date(values.session_date);
      const [hours, minutes] = values.session_time.split(':').map(Number);
      dateTimeValue.setHours(hours, minutes);
      
      // Create new appointment in Supabase
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          doctor_id: user.id,
          patient_id: user.id, // This should be replaced with actual patient ID
          patient_name: values.patient_name,
          session_date: dateTimeValue.toISOString(),
          session_type: values.session_type,
          notes: values.notes,
          status: "scheduled",
        })
        .select();
      
      if (error) {
        console.error("Error creating appointment:", error);
        toast.error(t('error_creating_appointment'));
        return;
      }
      
      // Add the new appointment to the list
      if (data && data.length > 0) {
        setAppointments([...appointments, data[0]]);
        
        // Also create an entry in patient_appointments table
        const { error: patientApptError } = await supabase
          .from('patient_appointments')
          .insert({
            patient_id: user.id, // This should be replaced with actual patient ID
            doctor_id: user.id,
            doctor_name: user.name || 'Dr.',
            session_date: dateTimeValue.toISOString(),
            session_type: values.session_type,
            status: "upcoming"
          });
          
        if (patientApptError) {
          console.error("Error creating patient appointment:", patientApptError);
        }
      }
      
      toast.success(t('appointment_created'));
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error in appointment creation:", error);
      toast.error(t('error_creating_appointment'));
    } finally {
      setIsSaving(false);
    }
  };

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
