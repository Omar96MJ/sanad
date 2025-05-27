
import { UserRole } from './types';

export interface DoctorProfile {
  id: string;
  user_id: string;
  name: string;
  specialization?: string;
  bio?: string;
  profile_image?: string;
  status?: 'pending' | 'approved' | 'rejected';
  years_of_experience?: number;
  weekly_available_hours?: number;
  patients_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PatientListItem {
  id: string;
  name: string;
  email: string;
  lastSession: string;
  nextSession: string;
  medicalRecordNumber?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

export interface CurrentDoctorProp {
  id: string;
  user_id: string;
  name: string;
}

export interface PatientNote {
  id: string;
  patient_id: string;
  doctor_id: string;
  content: string;
  note_date: string;
  created_at: string;
  updated_at: string;
  doctor_name: string;
  patient_name: string;
}

export interface PatientDiagnosis {
  id: string;
  patient_id: string;
  doctor_id?: string;
  condition_tag: string;
  notes?: string;
  diagnosis_date: string;
  created_at: string;
  updated_at: string;
}

export interface PatientDetails {
  id: string;
  user_id: string;
  profile_id: string;
  medical_record_number?: string;
  date_of_birth?: string;
  phone_number?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  insurance_provider?: string;
  insurance_policy_number?: string;
  allergies?: string;
  current_medications?: string;
  medical_history?: string;
  assigned_doctor_id?: string;
  registration_date: string;
  last_appointment_date?: string;
  next_appointment_date?: string;
  status: 'active' | 'inactive' | 'discharged';
  created_at: string;
  updated_at: string;
  profile?: {
    name: string;
    email: string;
    role: UserRole;
    profile_image?: string;
  };
}
