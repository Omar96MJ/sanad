
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/hooks/useSettings";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Users, 
  Settings, 
  Activity, 
  Shield, 
  BarChart3, 
  CalendarIcon 
} from "lucide-react";
import AdminProfile from "@/components/admin/AdminProfile";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const isRTL = language === 'ar';

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for dashboard data
  const [users, setUsers] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [stats, setStats] = useState({
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
  }, [user, isAdmin, t]);

  if (!user || !isAdmin()) {
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

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="text-center text-destructive">
                  <p>{error}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => window.location.reload()}
                  >
                    {t('retry')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-2 md:grid-cols-5">
                <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
                <TabsTrigger value="users">{t('users')}</TabsTrigger>
                <TabsTrigger value="settings">{t('system_settings')}</TabsTrigger>
                <TabsTrigger value="reports">{t('reports')}</TabsTrigger>
                <TabsTrigger value="profile">{t('profile')}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">{t('new_users')}</p>
                        <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                          {users.length > 0 ? '+' + Math.floor(users.length / 3) + '%' : '0%'}
                        </div>
                      </div>
                      <p className="text-3xl font-bold mt-2">{stats.newUsers}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">{t('active_sessions')}</p>
                        <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                          +{Math.floor(Math.random() * 30)}%
                        </div>
                      </div>
                      <p className="text-3xl font-bold mt-2">{stats.activeSessions}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">{t('completed_tests')}</p>
                        <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                          +{Math.floor(Math.random() * 20)}%
                        </div>
                      </div>
                      <p className="text-3xl font-bold mt-2">{stats.completedTests}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">{t('revenue')}</p>
                        <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                          +{Math.floor(Math.random() * 25)}%
                        </div>
                      </div>
                      <p className="text-3xl font-bold mt-2">{stats.revenue}</p>
                    </CardContent>
                  </Card>
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
                      <div className="text-3xl font-bold">{users.length}</div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {users.filter(u => u.role === 'doctor').length} {t('doctors')}, {users.filter(u => u.role === 'patient').length} {t('patients')}, {users.filter(u => u.role === 'admin').length} {t('admin')}
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
                      {appointments.length > 0 ? (
                        appointments.slice(0, 3).map((appointment, index) => (
                          <div className="text-sm" key={index}>
                            <div className="font-medium">
                              {appointment.session_type} {t('appointment')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(appointment.created_at).toLocaleString()}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          {t('no_recent_activities')}
                        </div>
                      )}
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
                    <CardTitle>{t('manage_users')}</CardTitle>
                    <CardDescription>
                      {t('view_and_manage_all_users')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {users.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t('name')}</TableHead>
                            <TableHead>{t('email')}</TableHead>
                            <TableHead>{t('role')}</TableHead>
                            <TableHead>{t('actions')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <div className="bg-secondary/20 text-xs inline-block px-2 py-1 rounded-full">
                                  {t(user.role)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">{t('view')}</Button>
                                  <Button variant="outline" size="sm">{t('manage')}</Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        {t('no_users_found')}
                      </div>
                    )}
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
                                <p className="text-2xl font-bold">{appointments.length}</p>
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
                                <p className="text-2xl font-bold">{stats.completedTests}</p>
                              </div>
                              <Activity className="h-10 w-10 text-primary/60" />
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-muted-foreground">{t('active_users')}</p>
                                <p className="text-2xl font-bold">{users.length > 0 ? Math.round(users.filter(u => u.role === 'patient').length / users.length * 100) : 0}%</p>
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
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
