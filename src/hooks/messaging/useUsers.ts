import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const useUsers = (isTherapist: boolean) => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);

  const fetchUsers = async () => {
    try {
      if (isTherapist) {
        // For therapists, fetch only patients who have appointments with them
        if (!user?.id) return;

        // First get the doctor profile to get the doctor ID
        const { data: doctorData, error: doctorError } = await supabase
          .from('doctors')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (doctorError) {
          console.error("Error fetching doctor profile:", doctorError);
          return;
        }

        // Get unique patient IDs who have appointments with this doctor
        const { data: appointmentData, error: appointmentError } = await supabase
          .from('appointments')
          .select('patient_id')
          .eq('doctor_id', doctorData.id);

        if (appointmentError) {
          console.error("Error fetching appointments:", appointmentError);
          return;
        }

        if (!appointmentData || appointmentData.length === 0) {
          setPatients([]);
          return;
        }

        // Get unique patient IDs
        const uniquePatientIds = [...new Set(appointmentData.map(apt => apt.patient_id))];

        // Fetch patient profiles for these IDs
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', uniquePatientIds)
          .order('name');

        if (profileError) {
          console.error("Error fetching patient profiles:", profileError);
          return;
        }

        if (profileData) {
          setPatients(profileData.map(patient => ({
            id: patient.id,
            name: patient.name || 'Unknown Patient'
          })));
        }
      } else {
        // For patients, fetch doctors (keep existing logic)
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name')
          .eq('role', 'doctor')
          .order('name');
          
        if (error) {
          console.error("Error fetching doctors:", error);
          return;
        }
        
        if (data) {
          setPatients(data.map(user => ({
            id: user.id,
            name: user.name || "Unknown doctor"
          })));
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [isTherapist, user?.id]);

  return { patients };
};
