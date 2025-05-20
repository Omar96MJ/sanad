
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";

export interface PatientAppointment {
  id?: string;
  patient_id: string;
  doctor_id: string;
  doctor_name: string;
  session_date: string;
  session_type: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
}

export async function fetchPatientAppointments(patientId: string) {
  try {
    const { data, error } = await supabase
      .from('patient_appointments')
      .select('*')
      .eq('patient_id', patientId)
      .order('session_date', { ascending: true });
    
    if (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
    
    // Convert the status to the correct type
    const typedAppointments = (data || []).map(appointment => ({
      ...appointment,
      status: appointment.status as 'upcoming' | 'completed' | 'cancelled'
    }));
    
    return typedAppointments as PatientAppointment[];
  } catch (error) {
    console.error("Exception fetching appointments:", error);
    throw error;
  }
}

export async function createAppointment(appointment: Omit<PatientAppointment, 'id' | 'created_at' | 'updated_at'>) {
  try {
    console.log("Creating appointment with data:", appointment);
    
    // Validate input
    if (!appointment.patient_id || !appointment.doctor_id || !appointment.session_date) {
      throw new Error("Missing required appointment data");
    }
    
    const { data, error } = await supabase
      .from('patient_appointments')
      .insert(appointment)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
    
    console.log("Patient appointment created successfully:", data);
    
    // Also create entry in appointments table for the doctor's side
    const { error: doctorApptError } = await supabase
      .from('appointments')
      .insert({
        doctor_id: appointment.doctor_id,
        patient_id: appointment.patient_id,
        patient_name: "Patient", // This should be replaced with the actual patient name
        session_date: appointment.session_date,
        session_type: appointment.session_type,
        status: 'scheduled'
      });
    
    if (doctorApptError) {
      console.error("Error creating doctor appointment:", doctorApptError);
      // We don't throw here as the main appointment was created successfully
    } else {
      console.log("Doctor appointment created successfully");
    }
    
    return data as PatientAppointment;
  } catch (error) {
    console.error("Exception creating appointment:", error);
    throw error;
  }
}

export async function updateAppointmentStatus(
  appointmentId: string, 
  status: 'upcoming' | 'completed' | 'cancelled',
  sessionDate?: string // Used for rescheduling
) {
  try {
    const updateData: any = { status };
    if (sessionDate) {
      updateData.session_date = sessionDate;
    }

    const { data, error } = await supabase
      .from('patient_appointments')
      .update(updateData)
      .eq('id', appointmentId)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating appointment:", error);
      throw error;
    }
    
    // Also update the corresponding doctor appointment
    if (data) {
      const doctorStatus = status === 'upcoming' ? 'scheduled' : 
                          status === 'completed' ? 'completed' : 'cancelled';
      
      const doctorUpdateData: any = { status: doctorStatus };
      if (sessionDate) {
        doctorUpdateData.session_date = sessionDate;
      }
      
      const { error: doctorApptError } = await supabase
        .from('appointments')
        .update(doctorUpdateData)
        .eq('doctor_id', data.doctor_id)
        .eq('patient_id', data.patient_id)
        .eq('session_date', data.session_date);
      
      if (doctorApptError) {
        console.error("Error updating doctor appointment:", doctorApptError);
      }
    }
    
    return data as PatientAppointment;
  } catch (error) {
    console.error("Exception updating appointment:", error);
    throw error;
  }
}
