import { useState, useEffect } from "react";
import { fetchPatients } from "@/services/patientService";

export const useUsers = (isTherapist: boolean) => {
  const [patients, setPatients] = useState<any[]>([]);

  const fetchUsers = async () => {
    try {
      if (isTherapist) {
        // Fetch real patients from the patients table
        const realPatients = await fetchPatients();
        console.log("Fetched patients for messaging:", realPatients);
        
        setPatients(realPatients.map(patient => ({
          id: patient.id,
          name: patient.name || "Unknown Patient",
          medical_record_number: patient.medical_record_number
        })));
      } else {
        // For patients, fetch doctors (keep existing logic for now)
        // This would need similar updates if we want to fetch real doctors
        setPatients([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setPatients([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [isTherapist]);

  return { patients };
};
