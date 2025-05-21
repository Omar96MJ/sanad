
import { supabase } from "@/integrations/supabase/client";
import { Patient } from "@/components/search/PatientSearch";

// Default patient names to show for quick selection
export const defaultPatients: Patient[] = [
  { id: "default-1", name: "Ahmed", email: "ahmed@example.com", role: "patient" },
  { id: "default-2", name: "Omar", email: "omar@example.com", role: "patient" },
  { id: "default-3", name: "Sara", email: "sara@example.com", role: "patient" },
  { id: "default-4", name: "Fatima", email: "fatima@example.com", role: "patient" }
];

/**
 * Fetch patients from the database
 */
export async function fetchPatients(): Promise<Patient[]> {
  try {
    // Fetch all patients from profiles where role is patient
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email')
      .eq('role', 'patient');
    
    if (error) {
      console.error("Error fetching patients:", error);
      return [];
    }
    
    if (data) {
      // Ensure role is always defined as a non-optional string for each patient
      const formattedPatients: Patient[] = data.map(patient => ({
        id: patient.id,
        name: patient.name || 'Unknown Patient',
        email: patient.email || 'No email',
        role: "patient" // Always provide the role property
      }));
      
      return formattedPatients;
    }
    
    return [];
  } catch (error) {
    console.error("Error in fetchPatients:", error);
    return [];
  }
}

/**
 * Combine real patients with default ones, avoiding duplicates
 */
export function combineWithDefaultPatients(
  realPatients: Patient[], 
  defaultPatientsList: Patient[] = defaultPatients
): Patient[] {
  const combinedPatients = [...realPatients];
  const existingNames = new Set(realPatients.map(p => p.name.toLowerCase()));
  
  for (const defaultPatient of defaultPatientsList) {
    if (!existingNames.has(defaultPatient.name.toLowerCase())) {
      combinedPatients.push({
        ...defaultPatient,
        role: defaultPatient.role || "patient" // Ensure role is defined
      });
    }
  }
  
  return combinedPatients;
}
