
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
        
        // Fetch real patients from the database
        const realPatients = await fetchPatients();
        console.log("Fetched real patients:", realPatients);
        
        // Combine with default patients, ensuring real patients take precedence
        const combinedPatients = combineWithDefaultPatients(realPatients);
        console.log("Combined patients:", combinedPatients);
        
        setPatients(combinedPatients);
      } catch (error) {
        console.error("Error loading patients:", error);
        // Fallback to default patients on error
        setPatients(defaultPatients);
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
