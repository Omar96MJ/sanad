
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminUser {
  id: string;
  name: string;
  email: string | null;
  role: string;
  created_at: string;
  assigned_doctor_id?: string | null;
  doctor_info?: {
    specialization?: string;
    status?: string;
    doctor_id?: string;
  };
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all profiles with doctor information if available
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          role,
          created_at,
          assigned_doctor_id
        `)
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      if (profiles) {
        // For users with doctor role, fetch their doctor info
        const doctorUserIds = profiles
          .filter(profile => profile.role === 'doctor')
          .map(profile => profile.id);

        let doctorsData: any[] = [];
        if (doctorUserIds.length > 0) {
          const { data: doctors, error: doctorsError } = await supabase
            .from('doctors')
            .select('id, user_id, specialization, status')
            .in('user_id', doctorUserIds);

          if (doctorsError) {
            console.error('Error fetching doctors data:', doctorsError);
          } else {
            doctorsData = doctors || [];
          }
        }

        // Create a map of user_id to doctor info
        const doctorInfoMap = new Map(
          doctorsData.map(doctor => [
            doctor.user_id,
            {
              specialization: doctor.specialization,
              status: doctor.status,
              doctor_id: doctor.id
            }
          ])
        );

        const formattedUsers: AdminUser[] = profiles.map(profile => ({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          created_at: profile.created_at,
          assigned_doctor_id: profile.assigned_doctor_id,
          doctor_info: profile.role === 'doctor' ? doctorInfoMap.get(profile.id) : undefined
        }));

        setUsers(formattedUsers);
      } else {
        setUsers([]);
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to fetch users');
      toast.error('Failed to load users data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const refreshUsers = () => {
    fetchUsers();
  };

  const getUsersByRole = (role: string) => {
    return users.filter(user => user.role === role);
  };

  const getTotalUsers = () => users.length;

  return {
    users,
    isLoading,
    error,
    refreshUsers,
    getUsersByRole,
    getTotalUsers
  };
};
