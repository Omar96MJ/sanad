
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Patient } from "@/components/search/PatientSearch";
import { fetchPatients, combineWithDefaultPatients, defaultPatients } from "@/services/patientService";

export function usePatients() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadPatients = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const realPatients = await fetchPatients();
        const combinedPatients = combineWithDefaultPatients(realPatients);
        
        setPatients(combinedPatients);
      } catch (error) {
        console.error("Error loading patients:", error);
        setPatients(defaultPatients); // Fallback to defaults on error
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPatients();
  }, [user]);
  
  return {
    patients,
    defaultPatients,
    isLoading
  };
}
