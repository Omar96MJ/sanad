
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

      // Fetch all auth users (requires admin access)
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

      if (authError) {
        throw authError;
      }

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
        // Continue without profiles data
      }

      // Create a map of profiles for easy lookup
      const profilesMap = new Map();
      if (profiles) {
        profiles.forEach(profile => {
          profilesMap.set(profile.id, profile);
        });
      }

      // Merge auth users with profile data
      const formattedUsers: AdminUser[] = authUsers.users.map(authUser => {
        const profile = profilesMap.get(authUser.id);
        
        return {
          id: authUser.id,
          name: profile?.name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Unknown User',
          email: authUser.email || profile?.email || null,
          role: profile?.role || authUser.user_metadata?.role || 'patient',
          created_at: authUser.created_at,
          assigned_doctor_id: profile?.assigned_doctor_id || null,
          doctor_info: profile?.doctors ? {
            specialization: profile.doctors.specialization,
            status: profile.doctors.status
          } : undefined
        };
      });

      // Sort by creation date (newest first)
      formattedUsers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setUsers(formattedUsers);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      
      // If admin.listUsers fails, fall back to profiles only
      if (err.message?.includes('admin') || err.message?.includes('permission')) {
        console.log('Admin access not available, falling back to profiles only');
        
        try {
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
          }
        } catch (fallbackErr: any) {
          console.error('Fallback error:', fallbackErr);
          setError(fallbackErr.message || 'Failed to fetch users');
          toast.error('Failed to load users data');
        }
      } else {
        setError(err.message || 'Failed to fetch users');
        toast.error('Failed to load users data');
      }
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
