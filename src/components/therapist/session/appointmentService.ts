
import { supabase } from "@/integrations/supabase/client";
import { AppointmentFormValues } from "./types";
import { toast } from "sonner";

export const createAppointment = async (doctorId: string, values: AppointmentFormValues) => {
  // Combine date and time for session_date
  const dateObj = values.session_date;
  const timeString = values.session_time;
  
  if (!dateObj || !timeString) {
    throw new Error("Invalid date or time");
  }
  
  // Parse time string (format: HH:MM) and set it on the date object
  const [hours, minutes] = timeString.split(':').map(Number);
  const sessionDateTime = new Date(dateObj);
  sessionDateTime.setHours(hours, minutes, 0);
  
  const patientId = values.patient_id || null;
  
  try {
    // Create the appointment
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        doctor_id: doctorId,
        patient_id: patientId,
        patient_name: values.patient_name,
        session_date: sessionDateTime.toISOString(),
        session_type: values.session_type,
        notes: values.notes || null,
        status: 'scheduled'
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
    
    // If we have a patient ID, also create a record in patient_appointments
    if (patientId) {
      let doctorName = "Doctor"; // Default name
      
      // Try to get doctor name from profiles
      const { data: doctorProfile } = await supabase
        .from('doctors')
        .select('name')
        .eq('user_id', doctorId)
        .single();
        
      if (doctorProfile) {
        doctorName = doctorProfile.name;
      }
      
      const { error: patientApptError } = await supabase
        .from('patient_appointments')
        .insert({
          patient_id: patientId,
          doctor_id: doctorId,
          doctor_name: doctorName,
          session_date: sessionDateTime.toISOString(),
          session_type: values.session_type,
          status: 'upcoming'
        });
        
      if (patientApptError) {
        console.error("Error creating patient appointment:", patientApptError);
        // We don't throw here as the main appointment was created successfully
      }
    }
    
    return data;
  } catch (error) {
    console.error("Error in appointment creation:", error);
    throw error;
  }
};

export const updateAppointment = async (id: string, status: string, sessionDate?: string) => {
  try {
    const updateData: any = { status };
    if (sessionDate) {
      updateData.session_date = sessionDate;
    }
    
    const { data, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating appointment:", error);
      throw error;
    }
    
    // Also update the corresponding patient appointment if applicable
    if (data.patient_id) {
      const patientStatus = status === "scheduled" ? "upcoming" : 
                          status === "completed" ? "completed" : "cancelled";
      
      const { error: patientApptError } = await supabase
        .from('patient_appointments')
        .update({ 
          status: patientStatus,
          ...(sessionDate ? { session_date: sessionDate } : {})
        })
        .eq('patient_id', data.patient_id)
        .eq('doctor_id', data.doctor_id);
      
      if (patientApptError) {
        console.error("Error updating patient appointment:", patientApptError);
      }
    }
    
    return data;
  } catch (error) {
    console.error("Error in appointment update:", error);
    throw error;
  }
};
