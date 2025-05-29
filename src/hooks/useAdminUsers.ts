
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

      console.log('Fetching users from profiles table...');

      // First, let's check if we can access the profiles table at all
      const { data: profilesTest, error: testError } = await supabase
        .from('profiles')
        .select('count(*)')
        .limit(1);

      if (testError) {
        console.error('Error accessing profiles table:', testError);
        throw new Error(`Cannot access profiles table: ${testError.message}`);
      }

      console.log('Profiles table accessible, count test result:', profilesTest);

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

      console.log('Fetched profiles:', profiles);

      if (profiles && profiles.length > 0) {
        // For users with doctor role, fetch their doctor info
        const doctorUserIds = profiles
          .filter(profile => profile.role === 'doctor')
          .map(profile => profile.id);

        console.log('Doctor user IDs found:', doctorUserIds);

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
            console.log('Fetched doctors data:', doctorsData);
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

        console.log('Final formatted users:', formattedUsers);
        setUsers(formattedUsers);
      } else {
        console.log('No profiles found in database');
        setUsers([]);
        
        // Let's also check if there are users in auth but not in profiles
        console.log('Checking current user session...');
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error('Error getting current user:', userError);
        } else {
          console.log('Current user:', user);
        }
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
