
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
