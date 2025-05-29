
import { supabase } from "@/integrations/supabase/client";
import { Patient } from "@/components/search/PatientSearch";
import { toast } from "sonner";
import { useLanguage } from '@/hooks/useLanguage';

export interface ProfileData {
  id: string;
  name: string;
  email?: string | null; // البريد الإلكتروني قد يأتي من auth.user لكن يمكن جلبه من هنا أيضًا
  role: string;
  profile_image?: string | null;
  about_me?: string | null; 
}

//دالة لجلب بيانات الملف الشخصي:
export const fetchUserProfile = async (userId: string): Promise<ProfileData | null> => {
  if (!userId) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, role, profile_image, about_me') // <-- أضف about_me
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      // يمكنك إظهار toast هنا أو ترك المعالجة للمكون
      return null;
    }
    return data;
  } catch (err) {
    console.error("Exception fetching user profile:", err);
    return null;
  }
};

//دالة لتحديث بيانات الملف الشخصي (الاسم، النبذة)
export const updateUserProfileData = async (
  userId: string,
  updates: {
    name?: string;
    about_me?: string;
    
  }
): Promise<{ data: ProfileData | null; error: any | null }> => {

  if (!userId) return { data: null, error: new Error("User ID is required") };
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select('id, name, email, role, profile_image, about_me') // أرجع البيانات المحدثة
      .single();

    if (error) {
      const { t } = useLanguage();

      console.error("Error updating user profile data:", error);
      toast.error(t('Failed to update profile'));
    } else {
      const { t } = useLanguage();

      toast.success(t('Profile updated successfully!')); 
    }
    return { data, error };
  } catch (err) {
    console.error("Exception updating user profile data:", err);
    toast.error("An unexpected error occurred.");
    return { data: null, error: err };
  }
};

// 1. دالة رفع الصورة إلى Storage
export const uploadProfileImage = async (userId: string, file: File): Promise<string | null> => {
  if (!file || !userId) return null;
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`; // اسم ملف فريد
    const filePath = `patient-profile-image/${fileName}`; // مسار التخزين (patient-profile-image هو اسم الـ bucket)

    // تأكد من أن لديك bucket باسم 'avatars' في Supabase Storage ومُعد بشكل صحيح (للقراءة العامة مثلاً)
    const { error: uploadError } = await supabase.storage
      .from('patient-profile-image') // اسم الـ Bucket
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading profile image:", uploadError);
      toast.error("Failed to upload image.");
      return null;
    }

    // جلب URL العام للصورة المرفوعة
    const { data } = supabase.storage
      .from('patient-profile-image')
      .getPublicUrl(filePath);

    console.log("Uploaded image public URL:", data.publicUrl);
    return data.publicUrl;

  } catch (err) {
    console.error("Exception uploading profile image:", err);
    toast.error("Error during image upload.");
    return null;
  }
};

// 2. دالة لتحديث رابط الصورة في جدول profiles (يمكن دمجها مع updateUserProfileData أو استدعاؤها بشكل منفصل)
export const updateUserProfileImage = async (userId: string, profileImageUrl: string): Promise<boolean> => {
  if (!userId || !profileImageUrl) return false;
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ profile_image: profileImageUrl })
      .eq('id', userId);

    if (error) {
      console.error("Error updating profile image URL in DB:", error);
      toast.error("Failed to update profile image link.");
      return false;
    }
    toast.success("Profile image updated!");
    return true;
  } catch (err) {
    console.error("Exception updating profile image URL:", err);
    toast.error("Error updating profile image link.");
    return false;
  }
};

// Default patient names to show for quick selection (these will have temporary IDs)
export const defaultPatients: Patient[] = [
  { id: "temp-ahmed", name: "Ahmed", email: "ahmed@example.com", role: "patient" },
  { id: "temp-omar", name: "Omar", email: "omar@example.com", role: "patient" },
  { id: "temp-sara", name: "Sara", email: "sara@example.com", role: "patient" },
  { id: "temp-fatima", name: "Fatima", email: "fatima@example.com", role: "patient" }
];

/**
 * Fetch patients from the database
 */
export async function fetchPatients(): Promise<Patient[]> {
  try {
    console.log("Fetching all patients from database...");
    
    const { data: patientData, error: patientError } = await supabase
      .from('profiles')
      .select('id, name, email, profile_image, role')
      .eq('role', 'patient')
      .order('name', { ascending: true });
    
    console.log("Patient query result:", { data: patientData, error: patientError });
    
    if (patientError) {
      console.error("Error fetching patients:", patientError);
      return [];
    }
    
    if (patientData && patientData.length > 0) {
      const formattedPatients: Patient[] = patientData.map(patient => ({
        id: patient.id,
        name: patient.name || 'Unknown Patient',
        email: patient.email || 'No email',
        profile_image: patient.profile_image || undefined,
        role: patient.role || "patient"
      }));
      
      console.log("Formatted patients from database:", formattedPatients);
      return formattedPatients;
    }
    
    console.log("No patients found in database, returning empty array");
    return [];
  } catch (error) {
    console.error("Error in fetchPatients:", error);
    return [];
  }
}

/**
 * Search for patients by name or email
 */
export async function searchPatients(query: string): Promise<Patient[]> {
  try {
    if (!query.trim()) {
      console.log("Empty query, returning empty results");
      return [];
    }

    console.log("Searching patients with query:", query);

    const { data: patientData, error: patientError } = await supabase
      .from('profiles')
      .select('id, name, email, profile_image, role')
      .eq('role', 'patient')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
      .order('name', { ascending: true })
      .limit(20);
    
    console.log("Patient search query result:", { data: patientData, error: patientError });
    
    if (patientError) {
      console.error("Error searching patients:", patientError);
      return [];
    }
    
    if (patientData && patientData.length > 0) {
      const formattedPatients: Patient[] = patientData.map(patient => ({
        id: patient.id,
        name: patient.name || 'Unknown Patient',
        email: patient.email || 'No email',
        profile_image: patient.profile_image || undefined,
        role: patient.role || "patient"
      }));
      
      console.log("Search results formatted:", formattedPatients);
      return formattedPatients;
    }
    
    return [];
  } catch (error) {
    console.error("Error in searchPatients:", error);
    return [];
  }
}

/**
 * Combine real patients with default ones, avoiding duplicates
 * Real patients from database take precedence over default ones
 */
export function combineWithDefaultPatients(
  realPatients: Patient[], 
  defaultPatientsList: Patient[] = defaultPatients
): Patient[] {
  const combinedPatients = [...realPatients];
  const existingNames = new Set(realPatients.map(p => p.name.toLowerCase()));
  const existingEmails = new Set(realPatients.map(p => p.email.toLowerCase()));
  
  // Only add default patients if they don't conflict with real patients
  for (const defaultPatient of defaultPatientsList) {
    if (!existingNames.has(defaultPatient.name.toLowerCase()) && 
        !existingEmails.has(defaultPatient.email.toLowerCase())) {
      combinedPatients.push({
        ...defaultPatient,
        role: defaultPatient.role || "patient"
      });
    }
  }
  
  return combinedPatients;
}

/**
 * Get a patient by ID from the database
 */
export async function getPatientById(patientId: string): Promise<Patient | null> {
  try {
    // Check if it's a temporary/default patient ID
    if (patientId.startsWith('temp-')) {
      const defaultPatient = defaultPatients.find(p => p.id === patientId);
      return defaultPatient || null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, profile_image')
      .eq('id', patientId)
      .eq('role', 'patient')
      .single();
    
    if (error) {
      console.error("Error fetching patient by ID:", error);
      return null;
    }
    
    if (data) {
      return {
        id: data.id,
        name: data.name || 'Unknown Patient',
        email: data.email || 'No email',
        profile_image: data.profile_image || undefined,
        role: "patient"
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error in getPatientById:", error);
    return null;
  }
}
