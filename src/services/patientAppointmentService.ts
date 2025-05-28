
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

// جلب مواعيد المريض - we'll use the main appointments table
export async function fetchPatientAppointments(patientId: string): Promise<PatientAppointment[]> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        id,
        patient_id,
        doctor_id,
        session_date,
        session_type,
        status,
        created_at,
        updated_at,
        notes
      `)
      .eq('patient_id', patientId)
      .order('session_date', { ascending: true });

    if (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }

    // Get doctor names separately
    const doctorIds = Array.from(new Set(data?.map(apt => apt.doctor_id) || []));
    const { data: doctorProfiles, error: doctorError } = await supabase
      .from('profiles')
      .select('id, name')
      .in('id', doctorIds);

    if (doctorError) {
      console.error("Error fetching doctor profiles:", doctorError);
    }

    const doctorMap = Object.fromEntries(
      (doctorProfiles || []).map(doc => [doc.id, doc.name || "Doctor"])
    );

    const typedAppointments = (data || []).map(appointment => ({
      id: appointment.id,
      patient_id: appointment.patient_id,
      doctor_id: appointment.doctor_id,
      doctor_name: doctorMap[appointment.doctor_id] || "Doctor",
      session_date: appointment.session_date,
      session_type: appointment.session_type,
      status: appointment.status === 'scheduled' ? 'upcoming' as const : 
              appointment.status === 'completed' ? 'completed' as const : 'cancelled' as const,
      created_at: appointment.created_at,
      updated_at: appointment.updated_at
    }));

    return typedAppointments;

  } catch (error) {
    console.error("Exception fetching appointments:", error);
    throw error;
  }
}

export async function createAppointment(appointment: Omit<PatientAppointment, 'id' | 'created_at' | 'updated_at'>) {
  try {
    if (!appointment.patient_id || !appointment.doctor_id || !appointment.session_date) {
      throw new Error("Missing required appointment data");
    }

    console.log("📥 Creating appointment with:", appointment);

    // إنشاء موعد في جدول appointments الرئيسي
    const { data, error } = await supabase
      .from("appointments")
      .insert([{
        doctor_id: appointment.doctor_id,
        patient_id: appointment.patient_id,
        session_date: appointment.session_date,
        session_type: appointment.session_type,
        status: appointment.status === 'upcoming' ? 'scheduled' : appointment.status
      }])
      .select()
      .single();

    if (error) {
      console.error("❌ Error creating appointment:", error);
      toast.error("فشل إنشاء الموعد");
      throw error;
    }

    console.log("✅ Appointment created:", data);
    toast.success("تم حجز الموعد بنجاح");
    
    // Return the appointment in the expected format
    return {
      id: data.id,
      patient_id: data.patient_id,
      doctor_id: data.doctor_id,
      doctor_name: appointment.doctor_name,
      session_date: data.session_date,
      session_type: data.session_type,
      status: data.status === 'scheduled' ? 'upcoming' as const : 
              data.status === 'completed' ? 'completed' as const : 'cancelled' as const,
      created_at: data.created_at,
      updated_at: data.updated_at
    } as PatientAppointment;

  } catch (error) {
    console.error("❗ Exception creating appointment:", error);
    toast.error("حدث خطأ أثناء حجز الموعد");
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
    const dbStatus = status === 'upcoming' ? 'scheduled' : status;
    const updateData: any = { status: dbStatus };
    if (sessionDate) {
      updateData.session_date = sessionDate;
    }

    const { data, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', appointmentId)
      .select(`
        id,
        patient_id,
        doctor_id,
        session_date,
        session_type,
        status,
        created_at,
        updated_at
      `)
      .single();

    if (error) {
      console.error("Error updating appointment:", error);
      throw error;
    }

    // Get doctor name separately
    const { data: doctorProfile, error: doctorError } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', data.doctor_id)
      .single();

    const doctorName = doctorProfile?.name || "Doctor";

    return {
      id: data.id,
      patient_id: data.patient_id,
      doctor_id: data.doctor_id,
      doctor_name: doctorName,
      session_date: data.session_date,
      session_type: data.session_type,
      status: data.status === 'scheduled' ? 'upcoming' as const : 
              data.status === 'completed' ? 'completed' as const : 'cancelled' as const,
      created_at: data.created_at,
      updated_at: data.updated_at
    } as PatientAppointment;

  } catch (error) {
    console.error("Exception updating appointment:", error);
    throw error;
  }
}
