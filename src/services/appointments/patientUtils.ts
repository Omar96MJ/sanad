
import { supabase } from "@/integrations/supabase/client";

// دالة جلب اسم المريض
export async function fetchPatientName(patientId: string): Promise<string | null> {
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
