
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Patient } from "@/components/search/PatientSearch";

export function usePatients() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Default patient names to show for quick selection
  const defaultPatients: Patient[] = [
    { id: "default-1", name: "Ahmed", email: "ahmed@example.com", role: "patient" },
    { id: "default-2", name: "Omar", email: "omar@example.com", role: "patient" },
    { id: "default-3", name: "Sara", email: "sara@example.com", role: "patient" },
    { id: "default-4", name: "Fatima", email: "fatima@example.com", role: "patient" }
  ];

  useEffect(() => {
    const fetchPatients = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch all patients from profiles where role is patient
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, email')
          .eq('role', 'patient');
        
        if (error) {
          console.error("Error fetching patients:", error);
          return;
        }
        
        if (data) {
          // Ensure role is always defined as a non-optional string for each patient
          const formattedPatients: Patient[] = data.map(patient => ({
            id: patient.id,
            name: patient.name || 'Unknown Patient',
            email: patient.email || 'No email',
            role: "patient" // Always provide the role property
          }));
          
          // Combine real patients with default ones
          // Only add default patients if no real patients with the same name exist
          const combinedPatients = [...formattedPatients];
          const existingNames = new Set(formattedPatients.map(p => p.name.toLowerCase()));
          
          for (const defaultPatient of defaultPatients) {
            if (!existingNames.has(defaultPatient.name.toLowerCase())) {
              // Ensure defaultPatient has the role property defined
              combinedPatients.push({
                ...defaultPatient,
                role: defaultPatient.role || "patient" // Provide a fallback if role is not defined
              });
            }
          }
          
          setPatients(combinedPatients);
        } else {
          // If no patients in database, use defaults
          setPatients(defaultPatients);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
        setPatients(defaultPatients); // Fallback to defaults on error
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPatients();
  }, [user]);
  
  return {
    patients,
    defaultPatients,
    isLoading
  };
}
