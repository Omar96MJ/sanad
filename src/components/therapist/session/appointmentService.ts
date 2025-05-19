
import { supabase } from "@/integrations/supabase/client";
import { AppointmentFormValues } from "./types";

export const createAppointment = async (
  userId: string, 
  values: AppointmentFormValues
) => {
  // Combine date and time to create ISO date string
  const dateTimeValue = new Date(values.session_date);
  const [hours, minutes] = values.session_time.split(':').map(Number);
  dateTimeValue.setHours(hours, minutes);
  
  // Create new appointment in Supabase
  const { data, error } = await supabase
    .from('appointments')
    .insert({
      doctor_id: userId,
      patient_id: userId, // This should be replaced with actual patient ID
      patient_name: values.patient_name,
      session_date: dateTimeValue.toISOString(),
      session_type: values.session_type,
      notes: values.notes,
      status: "scheduled",
    })
    .select();
  
  if (error) {
    throw error;
  }
  
  // Also create an entry in patient_appointments table
  if (data && data.length > 0) {
    const { error: patientApptError } = await supabase
      .from('patient_appointments')
      .insert({
        patient_id: userId, // This should be replaced with actual patient ID
        doctor_id: userId,
        doctor_name: "Dr.", // This should be replaced with actual doctor name
        session_date: dateTimeValue.toISOString(),
        session_type: values.session_type,
        status: "upcoming"
      });
      
    if (patientApptError) {
      console.error("Error creating patient appointment:", patientApptError);
    }
    
    return data[0];
  }
  
  throw new Error("Failed to create appointment");
};
