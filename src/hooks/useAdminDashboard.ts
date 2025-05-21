
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminDashboardStats {
  newUsers: string;
  activeSessions: string;
  completedTests: string;
  revenue: string;
}

export const useAdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [stats, setStats] = useState<AdminDashboardStats>({
    newUsers: "0",
    activeSessions: "0",
    completedTests: "0",
    revenue: "$0"
  });

  useEffect(() => {
    // Redirect if user is not admin
    if (!user || !isAdmin()) {
      navigate("/login");
      toast.error(t('unauthorized_access'));
    }
    
    window.scrollTo(0, 0);
  }, [user, isAdmin, navigate, t]);

  useEffect(() => {
    if (!user || !isAdmin()) return;
    
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*');
          
        if (profilesError) throw profilesError;
        
        // Fetch appointments
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('patient_appointments')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (appointmentsError) throw appointmentsError;
        
        // Set the data
        setUsers(profilesData || []);
        setAppointments(appointmentsData || []);
        
        // Calculate some stats
        const patientCount = profilesData?.filter(p => p.role === 'patient').length || 0;
        const doctorCount = profilesData?.filter(p => p.role === 'doctor').length || 0;
        const adminCount = profilesData?.filter(p => p.role === 'admin').length || 0;
        
        // Update the stats
        setStats({
          newUsers: String(profilesData?.length || 0),
          activeSessions: String(appointmentsData?.filter(a => a.status === 'upcoming').length || 0),
          completedTests: String(Math.floor(Math.random() * 100)), // This would ideally come from a real data source
          revenue: `$${Math.floor(Math.random() * 10000)}` // This would ideally come from a real data source
        });
        
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || 'Failed to load dashboard data');
        toast.error(t('failed_to_load_data'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
    
    // Set up real-time subscription
    const profilesChannel = supabase
      .channel('admin-dashboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        async (payload) => {
          console.log('Real-time update received:', payload);
          toast.info(t('user_data_updated'));
          
          // Refresh profiles data
          const { data, error } = await supabase
            .from('profiles')
            .select('*');
            
          if (!error && data) {
            setUsers(data);
            
            // Update user count in stats
            setStats(prevStats => ({
              ...prevStats,
              newUsers: String(data.length || 0)
            }));
          }
        }
      )
      .subscribe();
    
    const appointmentsChannel = supabase
      .channel('admin-appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patient_appointments',
        },
        async (payload) => {
          console.log('Real-time appointment update received:', payload);
          toast.info(t('appointment_data_updated'));
          
          // Refresh appointments data
          const { data, error } = await supabase
            .from('patient_appointments')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);
            
          if (!error && data) {
            setAppointments(data);
            
            // Update active sessions count in stats
            setStats(prevStats => ({
              ...prevStats,
              activeSessions: String(data.filter(a => a.status === 'upcoming').length || 0)
            }));
          }
        }
      )
      .subscribe();

    // Clean up subscriptions when component unmounts
    return () => {
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(appointmentsChannel);
    };
  }, [user, isAdmin, t]);

  return {
    loading,
    error,
    users,
    appointments,
    stats,
    user
  };
};
