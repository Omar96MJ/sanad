
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
          assigned_doctor_id,
          doctors:assigned_doctor_id (
            specialization,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      if (profiles) {
        const formattedUsers: AdminUser[] = profiles.map(profile => ({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          created_at: profile.created_at,
          assigned_doctor_id: profile.assigned_doctor_id,
          doctor_info: profile.doctors ? {
            specialization: profile.doctors.specialization,
            status: profile.doctors.status
          } : undefined
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
