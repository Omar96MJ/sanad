
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminStats {
  totalUsers: number;
  newUsersThisMonth: number;
  activeSessions: number;
  completedTests: number;
  totalAppointments: number;
  totalDoctors: number;
  totalPatients: number;
  totalAdmins: number;
  newUsersChange: string;
  activeSessionsChange: string;
  completedTestsChange: string;
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    newUsersThisMonth: 0,
    activeSessions: 0,
    completedTests: 0,
    totalAppointments: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAdmins: 0,
    newUsersChange: '+0%',
    activeSessionsChange: '+0%',
    completedTestsChange: '+0%',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get current date boundaries
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, role, created_at');

      if (profilesError) throw profilesError;

      // Calculate user statistics
      const totalUsers = profiles?.length || 0;
      const doctorCount = profiles?.filter(p => p.role === 'doctor').length || 0;
      const patientCount = profiles?.filter(p => p.role === 'patient').length || 0;
      const adminCount = profiles?.filter(p => p.role === 'admin').length || 0;

      // New users this month
      const newUsersThisMonth = profiles?.filter(p => 
        new Date(p.created_at) >= startOfMonth
      ).length || 0;

      // New users last month for comparison
      const newUsersLastMonth = profiles?.filter(p => {
        const createdAt = new Date(p.created_at);
        return createdAt >= startOfLastMonth && createdAt <= endOfLastMonth;
      }).length || 0;

      // Calculate percentage change for new users
      const newUsersChange = newUsersLastMonth > 0 
        ? `${Math.round(((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100)}%`
        : newUsersThisMonth > 0 ? '+100%' : '+0%';

      // Fetch appointments for active sessions
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('id, status, session_date, created_at')
        .in('status', ['scheduled', 'rescheduled']);

      if (appointmentsError) {
        console.error('Error fetching appointments:', appointmentsError);
      }

      // Count active sessions (scheduled for future dates)
      const activeSessions = appointments?.filter(apt => 
        new Date(apt.session_date) > now
      ).length || 0;

      // Count completed appointments as "completed tests"
      const { data: completedAppointments, error: completedError } = await supabase
        .from('appointments')
        .select('id, created_at')
        .eq('status', 'completed');

      if (completedError) {
        console.error('Error fetching completed appointments:', completedError);
      }

      const completedTests = completedAppointments?.length || 0;
      const completedThisMonth = completedAppointments?.filter(apt =>
        new Date(apt.created_at) >= startOfMonth
      ).length || 0;

      const completedLastMonth = completedAppointments?.filter(apt => {
        const createdAt = new Date(apt.created_at);
        return createdAt >= startOfLastMonth && createdAt <= endOfLastMonth;
      }).length || 0;

      const completedTestsChange = completedLastMonth > 0
        ? `${Math.round(((completedThisMonth - completedLastMonth) / completedLastMonth) * 100)}%`
        : completedThisMonth > 0 ? '+100%' : '+0%';

      // Calculate active sessions change (appointments this month vs last month)
      const appointmentsThisMonth = appointments?.filter(apt =>
        new Date(apt.created_at) >= startOfMonth
      ).length || 0;

      const appointmentsLastMonth = appointments?.filter(apt => {
        const createdAt = new Date(apt.created_at);
        return createdAt >= startOfLastMonth && createdAt <= endOfLastMonth;
      }).length || 0;

      const activeSessionsChange = appointmentsLastMonth > 0
        ? `${Math.round(((appointmentsThisMonth - appointmentsLastMonth) / appointmentsLastMonth) * 100)}%`
        : appointmentsThisMonth > 0 ? '+100%' : '+0%';

      setStats({
        totalUsers,
        newUsersThisMonth,
        activeSessions,
        completedTests,
        totalAppointments: (appointments?.length || 0) + (completedAppointments?.length || 0),
        totalDoctors: doctorCount,
        totalPatients: patientCount,
        totalAdmins: adminCount,
        newUsersChange: newUsersChange.startsWith('-') ? newUsersChange : `+${newUsersChange}`,
        activeSessionsChange: activeSessionsChange.startsWith('-') ? activeSessionsChange : `+${activeSessionsChange}`,
        completedTestsChange: completedTestsChange.startsWith('-') ? completedTestsChange : `+${completedTestsChange}`,
      });

    } catch (err: any) {
      console.error('Error fetching admin stats:', err);
      setError(err.message || 'Failed to fetch statistics');
      toast.error('Failed to load admin statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const refreshStats = () => {
    fetchStats();
  };

  return {
    stats,
    isLoading,
    error,
    refreshStats
  };
};
