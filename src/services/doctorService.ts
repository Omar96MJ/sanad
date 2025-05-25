
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
  
  // First try to get doctors from the doctors table
  const { data: doctorsData, error: doctorsError } = await supabase
    .from("doctors")
    .select("*")
    .order("name");

  if (doctorsError) {
    console.error("Error fetching from doctors table:", doctorsError);
  }

  console.log("Doctors from doctors table:", doctorsData || []);

  // If no doctors in the doctors table, try to get doctor profiles and create doctor records
  if (!doctorsData || doctorsData.length === 0) {
    console.log("No doctors found in doctors table, checking profiles table for users with doctor role");
    
    const { data: doctorProfiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "doctor");

    if (profilesError) {
      console.error("Error fetching doctor profiles:", profilesError);
      return [];
    }

    console.log("Doctor profiles found:", doctorProfiles || []);

    // Create doctor records for profiles that don't have them yet
    if (doctorProfiles && doctorProfiles.length > 0) {
      const doctorsToCreate = doctorProfiles.map(profile => ({
        user_id: profile.id,
        name: profile.name || "Doctor",
        specialization: "General Practice",
        bio: "Experienced healthcare professional",
        profile_image: profile.profile_image,
        patients_count: 0,
        years_of_experience: 5
      }));

      const { data: createdDoctors, error: createError } = await supabase
        .from("doctors")
        .upsert(doctorsToCreate, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        })
        .select();

      if (createError) {
        console.error("Error creating doctor records:", createError);
        return [];
      }

      console.log("Created/updated doctor records:", createdDoctors);
      return createdDoctors || [];
    }
  }

  return doctorsData || [];
};

// Function to ensure a doctor record exists for a user
export const ensureDoctorRecord = async (userId: string, userName: string): Promise<DoctorProfile | null> => {
  console.log("Ensuring doctor record exists for user:", userId, userName);
  
  // Check if doctor record already exists
  const existingDoctor = await fetchDoctorByUserId(userId);
  if (existingDoctor) {
    return existingDoctor;
  }

  // Create new doctor record
  const { data, error } = await supabase
    .from("doctors")
    .insert({
      user_id: userId,
      name: userName || "Doctor",
      specialization: "General Practice",
      bio: "Experienced healthcare professional",
      patients_count: 0,
      years_of_experience: 5
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating doctor record:", error);
    return null;
  }

  console.log("Created new doctor record:", data);
  return data;
};
