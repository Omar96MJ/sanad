
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PatientAppointment, CreateAppointmentPayload, SupabaseAppointmentRecord } from "./types";

export async function createAppointment(appointment: CreateAppointmentPayload): Promise<PatientAppointment> {
  try {
    if (!appointment.patient_id || !appointment.doctor_id || !appointment.session_date || !appointment.session_type || !appointment.status) {
      throw new Error("Missing required appointment data for creation");
    }

    console.log("📥 Creating appointment with (new schema - simplified select):", appointment);

    const { data, error } = await supabase
      .from("appointments")
      .insert([
        {
          patient_id: appointment.patient_id,
          doctor_id: appointment.doctor_id,
          session_date: appointment.session_date,
          session_type: appointment.session_type,
          status: appointment.status,
          notes: appointment.notes,
        },
      ])
      .select() // <-- قم بإزالة جملة select المعقدة، .select() وحدها ستجلب أعمدة السجل المُضاف
      .single();

    if (error) {
      console.error("❌ Error creating appointment (simplified select):", error.message);
      toast.error("فشل إنشاء الموعد");
      throw error;
    }

    if (!data) {
        throw new Error("Failed to create appointment or retrieve created data (simplified select).");
    }

    // 'data' الآن يحتوي على الحقول المباشرة للموعد المُضاف، بما في ذلك doctor_id
    // لكنه لا يحتوي على كائن 'doctor' المدمج.
    // لن نحتاج للنوع SupabaseAppointmentRecord هنا إذا كان select() بسيطًا، data سيكون جزئيًا
    const newAppointmentDirectData = data as Omit<SupabaseAppointmentRecord, 'doctor'>; // أو نوع أبسط يمثل الأعمدة المباشرة فقط

    console.log("✅ Appointment created (simplified select):", newAppointmentDirectData);
    toast.success("تم حجز الموعد بنجاح");

    // نقوم بإنشاء كائن PatientAppointment، وسيكون حقل 'doctor' فارغًا (null)
    const createdAppointment: PatientAppointment = {
      id: newAppointmentDirectData.id, // افترض أن 'id' يُرجع بواسطة .select()
      patient_id: newAppointmentDirectData.patient_id,
      doctor_id: newAppointmentDirectData.doctor_id,
      session_date: newAppointmentDirectData.session_date,
      session_type: newAppointmentDirectData.session_type,
      status: newAppointmentDirectData.status as PatientAppointment['status'],
      notes: newAppointmentDirectData.notes,
      created_at: newAppointmentDirectData.created_at,
      updated_at: newAppointmentDirectData.updated_at,
      doctor: null, // نضع 'doctor' كـ null لأننا لم نقم بـ JOIN هنا
    };

    return createdAppointment;

  } catch (error) {
   const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❗ استثناء في دالة createAppointment:", errorMessage, error); // سجل الخطأ كاملاً
     throw error;
  }
}
