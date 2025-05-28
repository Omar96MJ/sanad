
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useUsers = (isTherapist: boolean) => {
  const [patients, setPatients] = useState<any[]>([]);

  const fetchUsers = async () => {
    try {
      const userRole = isTherapist ? 'patient' : 'doctor';
      
      // Fetch users based on role
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name')
        .eq('role', userRole)
        .order('name');
        
      if (error) {
        console.error(`Error fetching ${userRole}s:`, error);
        return;
      }
      
      if (data) {
        setPatients(data.map(user => ({
          id: user.id,
          name: user.name || `Unknown ${userRole}`
        })));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [isTherapist]);

  return { patients };
};
