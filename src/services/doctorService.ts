
import { supabase } from "@/integrations/supabase/client";

export interface DoctorProfile {
  id: string;
  user_id: string;
  name: string;
  specialization: string | null;
  bio: string | null;
  profile_image: string | null;
  patients_count: number | null;
  years_of_experience: number | null;
}

export const fetchDoctorById = async (doctorId: string): Promise<DoctorProfile | null> => {
  console.log("Fetching doctor with ID:", doctorId);
  
  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .eq("id", doctorId)
    .single();

  if (error) {
    console.error("Error fetching doctor:", error);
    return null;
  }

  console.log("Doctor data fetched:", data);
  return data;
};

export const fetchDoctorByUserId = async (userId: string): Promise<DoctorProfile | null> => {
  console.log("Fetching doctor with user_id:", userId);
  
  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching doctor by user_id:", error);
    return null;
  }

  console.log("Doctor data fetched by user_id:", data);
  return data;
};

export const fetchAllDoctors = async (): Promise<DoctorProfile[]> => {
  console.log("Fetching all doctors");
  
  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }

  console.log("All doctors fetched:", data);
  return data || [];
};
