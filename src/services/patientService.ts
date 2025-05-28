
import { supabase } from "@/integrations/supabase/client";
import { Patient } from "@/components/search/PatientSearch";

// Default patient names to show for quick selection (these will have temporary IDs)
export const defaultPatients: Patient[] = [
  { id: "temp-ahmed", name: "Ahmed", email: "ahmed@example.com", role: "patient" },
  { id: "temp-omar", name: "Omar", email: "omar@example.com", role: "patient" },
  { id: "temp-sara", name: "Sara", email: "sara@example.com", role: "patient" },
  { id: "temp-fatima", name: "Fatima", email: "fatima@example.com", role: "patient" }
];

/**
 * Fetch patients from the database with their profile information
 */
export async function fetchPatients(): Promise<Patient[]> {
  try {
    console.log("Fetching patients from patients table...");
    
    // Join patients table with profiles to get complete information
    const { data: patientsData, error: patientsError } = await supabase
      .from('patients')
      .select(`
        id,
        user_id,
        medical_record_number,
        profiles!inner (
          id,
          name,
          email,
          profile_image,
          role
        )
      `)
      .order('name', { ascending: true, referencedTable: 'profiles' });
    
    console.log("Patients query result:", { data: patientsData, error: patientsError });
    
    if (patientsError) {
      console.error("Error fetching patients:", patientsError);
      return [];
    }
    
    if (patientsData && patientsData.length > 0) {
      const formattedPatients: Patient[] = patientsData.map(patient => ({
        id: patient.user_id, // Use user_id for messaging compatibility
        name: patient.profiles?.name || 'Unknown Patient',
        email: patient.profiles?.email || 'No email',
        profile_image: patient.profiles?.profile_image || undefined,
        role: patient.profiles?.role || "patient",
        medical_record_number: patient.medical_record_number
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
 * Search for patients by name, email, or medical record number
 */
export async function searchPatients(query: string): Promise<Patient[]> {
  try {
    if (!query.trim()) {
      console.log("Empty query, returning empty results");
      return [];
    }

    console.log("Searching patients with query:", query);

    // Search in patients table with profile information
    const { data: patientsData, error: patientsError } = await supabase
      .from('patients')
      .select(`
        id,
        user_id,
        medical_record_number,
        profiles!inner (
          id,
          name,
          email,
          profile_image,
          role
        )
      `)
      .or(`profiles.name.ilike.%${query}%,profiles.email.ilike.%${query}%,medical_record_number.ilike.%${query}%`)
      .order('name', { ascending: true, referencedTable: 'profiles' })
      .limit(20);
    
    console.log("Patient search query result:", { data: patientsData, error: patientsError });
    
    if (patientsError) {
      console.error("Error searching patients:", patientsError);
      return [];
    }
    
    if (patientsData && patientsData.length > 0) {
      const formattedPatients: Patient[] = patientsData.map(patient => ({
        id: patient.user_id, // Use user_id for messaging compatibility
        name: patient.profiles?.name || 'Unknown Patient',
        email: patient.profiles?.email || 'No email',
        profile_image: patient.profiles?.profile_image || undefined,
        role: patient.profiles?.role || "patient",
        medical_record_number: patient.medical_record_number
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
      .from('patients')
      .select(`
        id,
        user_id,
        medical_record_number,
        profiles!inner (
          id,
          name,
          email,
          profile_image,
          role
        )
      `)
      .eq('user_id', patientId)
      .single();
    
    if (error) {
      console.error("Error fetching patient by ID:", error);
      return null;
    }
    
    if (data) {
      return {
        id: data.user_id,
        name: data.profiles?.name || 'Unknown Patient',
        email: data.profiles?.email || 'No email',
        profile_image: data.profiles?.profile_image || undefined,
        role: "patient",
        medical_record_number: data.medical_record_number
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error in getPatientById:", error);
    return null;
  }
}
