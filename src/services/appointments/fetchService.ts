import { supabase } from "@/integrations/supabase/client";
import { PatientAppointment, SupabaseAppointmentRecord } from "./types";
import { DoctorProfile } from "@/lib/therapist-types";

// جلب مواعيد المريض
export async function fetchPatientAppointments(patientId: string): Promise<PatientAppointment[]> {
  try {
    // هنا نفترض أن 'data' سيكون من نوع SupabaseAppointmentRecord[] | null
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        id,
        patient_id,
        doctor_id,
        session_date,
        session_type,
        status,
        notes,
        created_at,
        updated_at,
        doctor: doctors (
          id,
          name,
          specialization,
          profile_image,
          bio
        )
      `)
      .eq('patient_id', patientId)
      .order('session_date', { ascending: true });

    if (error) {
      console.error("خطأ في جلب المواعيد مع تفاصيل الطبيب:", error.message);
      throw error;
    }

    if (!data) {
      return [];
    }

    // نقوم بعمل Type Assertion للـ data القادمة من Supabase
    const fetchedData = data as SupabaseAppointmentRecord[];

    return fetchedData.map((itemFromSupabase: SupabaseAppointmentRecord) => { // تحديد نوع itemFromSupabase بشكل صريح
      // الآن TypeScript يعرف أن itemFromSupabase هو كائن من نوع SupabaseAppointmentRecord
      // وبالتالي فإن معامل التوزيع '...' آمن للاستخدام
      return {
        ...itemFromSupabase, // هذا السطر يجب أن يعمل الآن بأمان
        status: itemFromSupabase.status as PatientAppointment['status'], // تخصيص نوع status
        // خاصية 'doctor' موجودة، و DoctorProfile يجب أن تكون متوافقة مع SupabaseDoctorRecord
        doctor: itemFromSupabase.doctor as DoctorProfile | null,
        doctor_name: itemFromSupabase.doctor?.name || 'Unknown Doctor', // Add helper property
      } as PatientAppointment;
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير معروف";
    console.error("استثناء عند جلب المواعيد:", errorMessage);
    throw new Error(`فشل جلب مواعيد المريض: ${errorMessage}`);
  }
}
