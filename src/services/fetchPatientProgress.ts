// services/fetchPatientProgress.ts

import { supabase } from "@/integrations/supabase/client";


export const fetchPatientProgress = async (userId: string): Promise<number | null> => {
  const { data, error } = await supabase
    .from("patient_dashboard")
    .select("progress")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching patient progress:", error.message);
    return null;
  }

  return data?.progress ?? null;
};
