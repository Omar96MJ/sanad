import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";
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

interface SupabaseDoctorRecord { // يمثل الكائن المدمج للطبيب
  id: string;
  name: string;
  specialization?: string | null;
  profile_image?: string | null;
  bio?: string | null;
  // أي حقول أخرى اخترتها من جدول doctors
}

interface SupabaseAppointmentRecord {
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

// دالة جلب اسم المريض
async function fetchPatientName(patientId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("profiles") // تأكد من أن اسم الجدول "profile" وليس "profiles"
    .select("name")
    .eq("id", patientId)
    .single();

  if (error) {
    console.error("Error fetching patient name:", error);
    return null;
  }

  return data?.name ?? null;
}

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

 type CreateAppointmentPayload = Omit<PatientAppointment, 'id' | 'created_at' | 'updated_at' | 'doctor'>;

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
