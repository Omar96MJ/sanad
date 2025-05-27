
export interface Appointment {
  id: string;
  doctor_id: string;
  patient_id: string;
  session_date: string;
  session_type: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // These will be fetched separately or computed
  patient_name?: string;
}

export interface AppointmentFormValues {
  patient_id: string;
  patient_name: string;
  session_date: Date;
  session_time: string;
  session_type: string;
  notes?: string;
}
