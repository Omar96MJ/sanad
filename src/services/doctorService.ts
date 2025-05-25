
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
  console.log("Fetching all doctors from database...");
  
  try {
    // First, get all existing doctors from the doctors table
    const { data: existingDoctors, error: doctorsError } = await supabase
      .from("doctors")
      .select("*")
      .order("name");

    if (doctorsError) {
      console.error("Error fetching from doctors table:", doctorsError);
    }

    console.log("Existing doctors from doctors table:", existingDoctors || []);

    // Get all users with doctor role from profiles
    const { data: doctorProfiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "doctor");

    if (profilesError) {
      console.error("Error fetching doctor profiles:", profilesError);
      return existingDoctors || [];
    }

    console.log("Doctor profiles found:", doctorProfiles || []);

    // Create a map of existing doctors by user_id for quick lookup
    const existingDoctorsMap = new Map();
    if (existingDoctors) {
      existingDoctors.forEach(doctor => {
        existingDoctorsMap.set(doctor.user_id, doctor);
      });
    }

    // Prepare doctors to create/update
    const doctorsToUpsert = [];
    
    if (doctorProfiles && doctorProfiles.length > 0) {
      for (const profile of doctorProfiles) {
        const existingDoctor = existingDoctorsMap.get(profile.id);
        
        const doctorData = {
          user_id: profile.id,
          name: profile.name || "Dr. " + (profile.email?.split('@')[0] || "Unknown"),
          specialization: existingDoctor?.specialization || "Mental Health Specialist",
          bio: existingDoctor?.bio || "Experienced mental health professional dedicated to helping patients achieve their wellness goals.",
          profile_image: profile.profile_image || existingDoctor?.profile_image,
          patients_count: existingDoctor?.patients_count || 0,
          years_of_experience: existingDoctor?.years_of_experience || 5
        };

        // If doctor already exists, include the ID for update
        if (existingDoctor) {
          doctorData.id = existingDoctor.id;
        }

        doctorsToUpsert.push(doctorData);
      }

      console.log("Upserting doctors:", doctorsToUpsert);

      // Upsert all doctors
      const { data: upsertedDoctors, error: upsertError } = await supabase
        .from("doctors")
        .upsert(doctorsToUpsert, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        })
        .select();

      if (upsertError) {
        console.error("Error upserting doctor records:", upsertError);
        return existingDoctors || [];
      }

      console.log("Successfully upserted doctors:", upsertedDoctors);
      return upsertedDoctors || [];
    }

    // If no doctor profiles found, return existing doctors
    return existingDoctors || [];
  } catch (error) {
    console.error("Error in fetchAllDoctors:", error);
    return [];
  }
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
      specialization: "Mental Health Specialist",
      bio: "Experienced mental health professional",
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
