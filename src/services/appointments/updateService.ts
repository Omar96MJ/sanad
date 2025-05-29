
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PatientAppointment } from "./types";

// تحديث حالة الموعد (والتاريخ عند إعادة الجدولة)
export async function updateAppointmentStatus(
  appointmentId: string,
  // استخدم أنواع الحالة (status) من واجهة PatientAppointment المحدثة
  status: PatientAppointment['status'],
  sessionDate?: string // تاريخ الجلسة الجديد إذا كانت الحالة 'rescheduled' مثلاً (ISO string)
): Promise<PatientAppointment> { // سترجع الدالة كائن PatientAppointment المحدث
  try {
    const updateData: { status: PatientAppointment['status']; session_date?: string } = { status };
    if (sessionDate) {
      // تأكد من أن sessionDate المُمرر هو بالتنسيق الصحيح (ISO string)
      updateData.session_date = sessionDate;
    }

    console.log(`🔄 Updating appointment ${appointmentId} with:`, updateData);

    const { data, error } = await supabase
      .from('appointments') // <-- اسم الجدول الصحيح: public.appointments
      .update(updateData)
      .eq('id', appointmentId)
      .select() // <-- .select() بسيط لجلب الأعمدة المباشرة للسجل المحدث
      .single();

    if (error) {
      console.error("❌ Error updating appointment (new schema):", error.message);
      toast.error("فشل تحديث حالة الموعد");
      throw error;
    }

    if (!data) {
      throw new Error("Failed to update appointment or retrieve updated data.");
    }

    console.log("✅ Appointment status updated (new schema):", data);
    toast.success("تم تحديث حالة الموعد بنجاح");

    // 'data' يحتوي على الحقول المباشرة للموعد المُحدث.
    // كائن 'doctor' سيكون null لأننا لم نقم بـ JOIN هنا.
    const updatedAppointment: PatientAppointment = {
      // نقوم بعمل Type Assertion للـ data القادمة للتأكد من تطابقها
      // مع PatientAppointment قدر الإمكان.
      id: data.id,
      patient_id: data.patient_id,
      doctor_id: data.doctor_id,
      session_date: data.session_date,
      session_type: data.session_type,
      status: data.status as PatientAppointment['status'], // التأكد من نوع status
      notes: data.notes,
      created_at: data.created_at,
      updated_at: data.updated_at, // يفترض أن .select() تُرجع هذا أيضًا
      doctor: null, // نضع 'doctor' كـ null لأننا لم نقم بـ JOIN هنا
    };

    return updatedAppointment;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير معروف";
    console.error("❗ Exception updating appointment status (new schema):", errorMessage);
    if (!(error.message.includes("Failed to update appointment"))) {
        toast.error("حدث خطأ أثناء تحديث حالة الموعد");
    }
    throw error;
  }
}
