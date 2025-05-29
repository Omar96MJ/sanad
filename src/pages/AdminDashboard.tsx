import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/hooks/useSettings";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { 
  Users, 
  Settings, 
  Activity, 
  Shield, 
  BarChart3, 
  UserCog, 
  Database, 
  FileText, 
  Calendar as CalendarIcon,
  RefreshCw
} from "lucide-react";
import AdminProfile from "@/components/admin/AdminProfile";

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const { users, isLoading, error, refreshUsers, getUsersByRole, getTotalUsers } = useAdminUsers();
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

  const handleSettingToggle = (setting: keyof typeof settings) => {
    if (typeof settings[setting] === 'boolean') {
      updateSettings({ [setting]: !settings[setting] });
      toast.success(t('setting_updated'));
    }
  };

  // Get user counts by role
  const doctorUsers = getUsersByRole('doctor');
  const patientUsers = getUsersByRole('patient');
  const adminUsers = getUsersByRole('admin');
  const totalUsers = getTotalUsers();

  // Mock data for analytics (keeping these as they're not user-specific)
  const analyticsData = [
    { label: t('new_users'), value: '38', change: '+12%', trend: 'up' },
    { label: t('active_sessions'), value: '156', change: '+24%', trend: 'up' },
    { label: t('completed_tests'), value: '89', change: '+5%', trend: 'up' },
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'doctor':
        return 'bg-blue-100 text-blue-800';
      case 'patient':
        return 'bg-green-100 text-green-800';
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US');
  };

  return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className={`flex-grow mt-16 md:mt-20 py-8 px-4 sm:px-6 lg:px-8 bg-muted/30 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">{t('admin_dashboard')}</h1>
              <p className="text-muted-foreground">
                {t('manage_users')} {t('system_settings')}
              </p>
            </div>
            <div className={`flex items-center mt-4 md:mt-0 ${isRTL ? 'md:mr-4' : 'md:ml-4'}`}>
              <Shield className={`text-primary ${isRTL ? 'ml-2' : 'mr-2'} h-5 w-5`} />
              <span className="text-sm font-medium">{user.name} - {t('admin_panel')}</span>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
              <TabsTrigger value="users">{t('users')}</TabsTrigger>
              <TabsTrigger value="settings">{t('system_settings')}</TabsTrigger>
              <TabsTrigger value="reports">{t('reports')}</TabsTrigger>
              <TabsTrigger value="profile">{t('profile')}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {analyticsData.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          item.trend === 'up' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.change}
                        </div>
                      </div>
                      <p className="text-3xl font-bold mt-2">{item.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center">
                      <Users className={`${isRTL ? 'ml-2' : 'mr-2'} h-5 w-5 text-primary`} />
                      {t('users')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <div className="text-3xl font-bold">{totalUsers}</div>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">
                      {doctorUsers.length} {t('doctors')}, {patientUsers.length} {t('patients')}, {adminUsers.length} {t('admin')}
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setActiveTab("users")}
                    >
                      {t('manage_users')}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center">
                      <Activity className={`${isRTL ? 'ml-2' : 'mr-2'} h-5 w-5 text-primary`} />
                      {t('recent_activities')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm">
                      <div className="font-medium">{t('system_update')}</div>
                      <div className="text-xs text-muted-foreground">2 {t('hours_ago')}</div>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">{t('new_user_registration')}</div>
                      <div className="text-xs text-muted-foreground">{t('yesterday')}</div>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">{t('payment_received')}</div>
                      <div className="text-xs text-muted-foreground">2 {t('days_ago')}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center">
                      <Settings className={`${isRTL ? 'ml-2' : 'mr-2'} h-5 w-5 text-primary`} />
                      {t('system_settings')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="theme-mode">{theme === 'dark' ? t('dark_mode') : t('light_mode')}</Label>
                      <div className="text-sm text-primary">{theme === 'dark' ? t('enabled') : t('enabled')}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <Label htmlFor="reg-status">{t('signup')}</Label>
                      <div className={`text-sm ${settings.enableRegistration ? 'text-primary' : 'text-destructive'}`}>
                        {settings.enableRegistration ? t('enabled') : t('disabled')}
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full mt-2"
                      onClick={() => setActiveTab("settings")}
                    >
                      {t('manage_settings')}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{t('manage_users')}</CardTitle>
                      <CardDescription>
                        {t('view_and_manage_all_users')}
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={refreshUsers}
                      disabled={isLoading}
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''} ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('refresh') || 'Refresh'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {error && (
                    <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
                      {error}
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <div className="bg-primary/10 p-4 rounded-md flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{t('authenticated_users')}</h3>
                        <p className="text-sm text-muted-foreground">{t('total_registered_users')}</p>
                      </div>
                      {isLoading ? (
                        <Skeleton className="h-8 w-8" />
                      ) : (
                        <div className="text-3xl font-bold">{totalUsers}</div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {isLoading ? (
                      // Loading skeletons
                      Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="border rounded-md p-4">
                          <div className="flex justify-between items-center mb-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-6 w-16" />
                          </div>
                          <Skeleton className="h-4 w-48 mb-2" />
                          <div className="flex gap-2">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-8 w-32" />
                          </div>
                        </div>
                      ))
                    ) : users.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        {t('no_users_found') || 'No users found'}
                      </div>
                    ) : (
                      users.map((user) => (
                        <div key={user.id} className="border rounded-md p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-medium">{user.name}</div>
                            <div className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(user.role)}`}>
                              {t(user.role) || user.role}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {user.email || 'No email provided'}
                          </div>
                          <div className="text-xs text-muted-foreground mb-3">
                            {t('joined') || 'Joined'}: {formatDate(user.created_at)}
                          </div>
                          {user.role === 'doctor' && user.doctor_info && (
                            <div className="text-xs text-muted-foreground mb-2">
                              {t('specialization') || 'Specialization'}: {user.doctor_info.specialization || 'Not specified'} | 
                              {t('status') || 'Status'}: {user.doctor_info.status || 'pending'}
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">{t('view_resources')}</Button>
                            <Button variant="outline" size="sm">{t('manage_content')}</Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('system_settings')}</CardTitle>
                  <CardDescription>
                    {t('manage_system_wide_settings')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enable-registration">{t('signup')}</Label>
                        <p className="text-sm text-muted-foreground">
                          {t('allow_new_users')}
                        </p>
                      </div>
                      <Switch
                        id="enable-registration"
                        checked={settings.enableRegistration}
                        onCheckedChange={() => handleSettingToggle('enableRegistration')}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="maintenance-mode">{t('maintenance_mode')}</Label>
                        <p className="text-sm text-muted-foreground">
                          {t('put_site_in_maintenance')}
                        </p>
                      </div>
                      <Switch
                        id="maintenance-mode"
                        checked={settings.maintenanceMode}
                        onCheckedChange={() => handleSettingToggle('maintenanceMode')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">{t('email_notifications')}</Label>
                        <p className="text-sm text-muted-foreground">
                          {t('send_notification_emails')}
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={true}
                        onCheckedChange={() => toast.success(t('setting_updated'))}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button onClick={() => toast.success(t('settings_saved'))}>
                      {t('save_changes')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'} text-primary`} />
                    {t('usage_reports')}
                  </CardTitle>
                  <CardDescription>
                    {t('view_system_usage_analytics')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">{t('user_growth')}</h3>
                      <div className="h-[200px] w-full bg-muted/50 rounded-md flex items-end justify-between p-2">
                        {[35, 45, 30, 65, 80, 70, 90].map((height, i) => (
                          <div 
                            key={i} 
                            className="bg-primary/80 w-12 rounded-t-sm" 
                            style={{ height: `${height}%` }}
                          ></div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                        <span>Jul</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">{t('total_sessions')}</p>
                              <p className="text-2xl font-bold">342</p>
                            </div>
                            <CalendarIcon className="h-10 w-10 text-primary/60" />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">{t('test_completions')}</p>
                              <p className="text-2xl font-bold">128</p>
                            </div>
                            <FileText className="h-10 w-10 text-primary/60" />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">{t('active_users')}</p>
                              <p className="text-2xl font-bold">75%</p>
                            </div>
                            <Users className="h-10 w-10 text-primary/60" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
