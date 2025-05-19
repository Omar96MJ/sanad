
import { supabase } from "@/integrations/supabase/client";
import { AppointmentFormValues } from "./types";

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
    const { error: patientApptError } = await supabase
      .from('patient_appointments')
      .insert({
        patient_id: patientId,
        doctor_id: doctorId,
        doctor_name: "Doctor", // This should be replaced with the actual doctor name
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
};
