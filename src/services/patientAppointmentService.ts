
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
  created_at?: string | null;
  updated_at?: string | null;
  doctor?: any;
}

// دالة لجلب اسم المريض الحقيقي من جدول patients
async function fetchPatientName(patientId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('profiles')  // غيّر هذا إلى اسم جدول المرضى الحقيقي
    .select('name') // غيّر هذا إلى اسم عمود الاسم الحقيقي
    .eq('id', patientId)
    .single();

  if (error) {
    console.error("Error fetching patient name:", error);
    return null;
  }

  return data?.name || null;
}

// جلب مواعيد المريض
export async function fetchPatientAppointments(patientId: string): Promise<PatientAppointment[]> {
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

// إنشاء موعد جديد مع جلب اسم المريض الحقيقي
export async function createAppointment(appointment: Omit<PatientAppointment, 'id' | 'created_at' | 'updated_at'>) {
  try {
    if (!appointment.patient_id || !appointment.doctor_id || !appointment.session_date) {
      throw new Error("Missing required appointment data");
    }

    // جلب اسم المريض الحقيقي
    const patientName = await fetchPatientName(appointment.patient_id) || "Patient";

    // إنشاء موعد المريض
    const { data, error } = await supabase
      .from('patient_appointments')
      .insert(appointment)
      .select()
      .single();

    if (error) {
      console.error("Error creating patient appointment:", error);
      throw error;
    }

    // إنشاء موعد للطبيب مع اسم المريض الحقيقي
    const { error: doctorApptError } = await supabase
      .from('appointments')
      .insert({
        doctor_id: appointment.doctor_id,
        patient_id: appointment.patient_id,
        patient_name: patientName,
        session_date: appointment.session_date,
        session_type: appointment.session_type,
        status: 'scheduled'
      });

    if (doctorApptError) {
      console.error("Error creating doctor appointment:", doctorApptError);
    } else {
      console.log("Doctor appointment created successfully");
    }

    return data as PatientAppointment;

  } catch (error) {
    console.error("Exception creating appointment:", error);
    throw error;
  }
}

// تحديث حالة الموعد (والتاريخ عند إعادة الجدولة)
export async function updateAppointmentStatus(
  appointmentId: string,
  status: 'upcoming' | 'completed' | 'cancelled',
  sessionDate?: string
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
