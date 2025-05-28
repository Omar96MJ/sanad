
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
  
  // Check if patient_id is a valid UUID, if not set it to null
  // This handles cases where we have a patient name but no valid patient ID
  let patientId = null;
  if (values.patient_id && 
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(values.patient_id)) {
    patientId = values.patient_id;
  }
  
  try {
    console.log("Creating appointment with:", {
      doctor_id: doctorId,
      patient_id: patientId,
      session_date: sessionDateTime.toISOString(),
      session_type: values.session_type
    });
    
    // Create the appointment
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        doctor_id: doctorId,
        patient_id: patientId,
        session_date: sessionDateTime.toISOString(),
        session_type: values.session_type,
        notes: values.notes || null,
        status: 'scheduled'
      })
      .select(`
        *,
        profiles!appointments_patient_id_fkey (
          name
        )
      `)
      .single();
    
    if (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
    
    // Add patient_name to the returned data
    const appointmentWithPatientName = {
      ...data,
      patient_name: data.profiles?.name || values.patient_name || 'Unknown Patient'
    };
    
    return appointmentWithPatientName;
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
    
    return data;
  } catch (error) {
    console.error("Error in appointment update:", error);
    throw error;
  }
};
