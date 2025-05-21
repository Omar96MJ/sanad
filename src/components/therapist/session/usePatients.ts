
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Patient } from "@/components/search/PatientSearch";

export function usePatients() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
          const formattedPatients = data.map(patient => ({
            id: patient.id,
            name: patient.name || 'Unknown Patient',
            email: patient.email || 'No email',
            role: 'patient'
          }));
          
          setPatients(formattedPatients);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPatients();
  }, [user]);
  
  return {
    patients,
    isLoading
  };
}
