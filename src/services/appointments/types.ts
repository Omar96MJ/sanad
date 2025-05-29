
import {DoctorProfile} from "@/services/doctorService";

export interface PatientAppointment {
  id?: string;                 // من جدول public.appointments
  patient_id: string;         // من جدول public.appointments
  doctor_id: string;          // من جدول public.appointments
  session_date: string;       // تاريخ ووقت بتنسيق ISO String
  session_type: string;       // من جدول public.appointments
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no_show'; // مطابقة لقاعدة بيانات public.appointments
  notes?: string | null;       // من جدول public.appointments
  created_at?: string | null;  // من جدول public.appointments
  updated_at?: string | null;  // من جدول public.appointments
  doctor?: DoctorProfile | null; // هذا الكائن سيمتلئ بتفاصيل الطبيب بعد JOIN
  doctor_name?: string; // Helper property for easier access to doctor name
}

export interface SupabaseDoctorRecord { // يمثل الكائن المدمج للطبيب
  id: string;
  name: string;
  specialization?: string | null;
  profile_image?: string | null;
  bio?: string | null;
  // أي حقول أخرى اخترتها من جدول doctors
}

export interface SupabaseAppointmentRecord {
  id: string;
  patient_id: string;
  doctor_id: string;
  session_date: string;
  session_type: string;
  status: string; // Supabase قد يعيد status كنص عام، سنقوم بتخصيصه لاحقًا
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
  doctor: SupabaseDoctorRecord | null; // الكائن المدمج للطبيب
}

export type CreateAppointmentPayload = Omit<PatientAppointment, 'id' | 'created_at' | 'updated_at' | 'doctor'>;
