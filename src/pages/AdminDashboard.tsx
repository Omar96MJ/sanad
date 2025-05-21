
import { useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import { useLanguage } from "@/hooks/useLanguage";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import AdminProfile from "@/components/admin/AdminProfile";
import DashboardHeader from "@/components/admin/DashboardHeader";
import LoadingState from "@/components/admin/LoadingState";
import ErrorState from "@/components/admin/ErrorState";
import OverviewTab from "@/components/admin/tabs/OverviewTab";
import UsersTab from "@/components/admin/tabs/UsersTab";
import SettingsTab from "@/components/admin/tabs/SettingsTab";
import ReportsTab from "@/components/admin/tabs/ReportsTab";

const AdminDashboard = () => {
  const { settings, updateSettings } = useSettings();
  const { language } = useLanguage();
  const { t } = useLanguage();
  const isRTL = language === 'ar';

  const [activeTab, setActiveTab] = useState("overview");
  
  const { 
    loading, 
    error, 
    users, 
    appointments, 
    stats,
    user
  } = useAdminDashboard();

  // Early return if not authenticated or not admin
  if (!user) {
    return null;
  }

  const handleSettingToggle = (setting: keyof typeof settings) => {
    if (typeof settings[setting] === 'boolean') {
      updateSettings({ [setting]: !settings[setting] });
      toast.success(t('setting_updated'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className={`flex-grow mt-16 md:mt-20 py-8 px-4 sm:px-6 lg:px-8 bg-muted/30 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className="max-w-7xl mx-auto">
          <DashboardHeader userName={user.name} />

          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState error={error} />
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-2 md:grid-cols-5">
                <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
                <TabsTrigger value="users">{t('users')}</TabsTrigger>
                <TabsTrigger value="settings">{t('system_settings')}</TabsTrigger>
                <TabsTrigger value="reports">{t('reports')}</TabsTrigger>
                <TabsTrigger value="profile">{t('profile')}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <OverviewTab 
                  users={users} 
                  appointments={appointments} 
                  stats={stats}
                  onTabChange={setActiveTab}
                  settings={settings}
                />
              </TabsContent>

              <TabsContent value="users">
                <UsersTab users={users} />
              </TabsContent>

              <TabsContent value="settings">
                <SettingsTab 
                  settings={settings}
                  onSettingToggle={handleSettingToggle}
                />
              </TabsContent>
              
              <TabsContent value="reports">
                <ReportsTab 
                  users={users}
                  appointments={appointments}
                  stats={stats}
                />
              </TabsContent>
              
              <TabsContent value="profile">
                <AdminProfile />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
