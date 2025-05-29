
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useAdminStats } from "@/hooks/useAdminStats";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import AdminProfile from "@/components/admin/AdminProfile";
import { AdminDashboardHeader } from "@/components/admin/dashboard/AdminDashboardHeader";
import { OverviewTab } from "@/components/admin/dashboard/OverviewTab";
import { UsersTab } from "@/components/admin/dashboard/UsersTab";
import { SettingsTab } from "@/components/admin/dashboard/SettingsTab";
import { ReportsTab } from "@/components/admin/dashboard/ReportsTab";

interface AnalyticsData {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { users, isLoading: isLoadingUsers, error, refreshUsers, getUsersByRole, getTotalUsers } = useAdminUsers();
  const { stats, isLoading: isLoadingStats, refreshStats } = useAdminStats();
  const isRTL = language === 'ar';

  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Redirect if user is not admin
    if (!user || !isAdmin()) {
      navigate("/login");
      toast.error(t('unauthorized_access'));
    }
    
    window.scrollTo(0, 0);
  }, [user, isAdmin, navigate, t]);

  if (!user || !isAdmin()) {
    return null;
  }

  const handleRefresh = () => {
    refreshStats();
    refreshUsers();
  };

  // Get user counts by role
  const doctorUsers = getUsersByRole('doctor');
  const patientUsers = getUsersByRole('patient');
  const adminUsers = getUsersByRole('admin');
  const totalUsers = getTotalUsers();

  // Real analytics data from Supabase
  const analyticsData: AnalyticsData[] = [
    { 
      label: t('new_users'), 
      value: isLoadingStats ? '...' : stats.newUsersThisMonth.toString(), 
      change: stats.newUsersChange, 
      trend: stats.newUsersChange.startsWith('-') ? 'down' : 'up' 
    },
    { 
      label: t('active_sessions'), 
      value: isLoadingStats ? '...' : stats.activeSessions.toString(), 
      change: stats.activeSessionsChange, 
      trend: stats.activeSessionsChange.startsWith('-') ? 'down' : 'up' 
    },
    { 
      label: t('completed_tests'), 
      value: isLoadingStats ? '...' : stats.completedTests.toString(), 
      change: stats.completedTestsChange, 
      trend: stats.completedTestsChange.startsWith('-') ? 'down' : 'up' 
    },
  ];

  return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className={`flex-grow mt-16 md:mt-20 py-8 px-4 sm:px-6 lg:px-8 bg-muted/30 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className="max-w-7xl mx-auto">
          <AdminDashboardHeader 
            userName={user.name}
            onRefresh={handleRefresh}
            isRTL={isRTL}
          />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
              <TabsTrigger value="users">{t('users')}</TabsTrigger>
              <TabsTrigger value="settings">{t('system_settings')}</TabsTrigger>
              <TabsTrigger value="reports">{t('reports')}</TabsTrigger>
              <TabsTrigger value="profile">{t('profile')}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <OverviewTab
                analyticsData={analyticsData}
                totalUsers={totalUsers}
                doctorCount={doctorUsers.length}
                patientCount={patientUsers.length}
                adminCount={adminUsers.length}
                totalAppointments={stats.totalAppointments}
                activeSessions={stats.activeSessions}
                isLoadingUsers={isLoadingUsers}
                isLoadingStats={isLoadingStats}
                isRTL={isRTL}
                onTabChange={setActiveTab}
              />
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <UsersTab
                users={users}
                isLoading={isLoadingUsers}
                error={error}
                totalUsers={totalUsers}
                onRefresh={refreshUsers}
                isRTL={isRTL}
                language={language}
              />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <SettingsTab />
            </TabsContent>
            
            <TabsContent value="reports" className="space-y-6">
              <ReportsTab
                stats={stats}
                isLoadingStats={isLoadingStats}
                isRTL={isRTL}
              />
            </TabsContent>
            
            <TabsContent value="profile">
              <AdminProfile />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
