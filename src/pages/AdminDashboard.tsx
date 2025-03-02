
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/hooks/useSettings";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Users, Settings, Activity, Shield } from "lucide-react";

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  const { t } = useLanguage();
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState("overview");

  // Redirect if user is not admin
  if (!user || !isAdmin()) {
    navigate("/");
    return null;
  }

  const handleSettingToggle = (setting: keyof typeof settings) => {
    if (typeof settings[setting] === 'boolean') {
      updateSettings({ [setting]: !settings[setting] });
      toast.success(`Setting "${setting}" updated successfully`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow mt-16 md:mt-20 py-8">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">{t('admin_dashboard')}</h1>
              <p className="text-muted-foreground">
                {t('manage_users')} {t('system_settings')}
              </p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <Shield className="text-primary mr-2 h-5 w-5" />
              <span className="text-sm font-medium">{user.name} - {t('admin_panel')}</span>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-3 md:w-[400px]">
              <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
              <TabsTrigger value="users">{t('users')}</TabsTrigger>
              <TabsTrigger value="settings">{t('system_settings')}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center">
                      <Users className="mr-2 h-5 w-5 text-primary" />
                      {t('users')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">3</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      1 {t('doctors')}, 1 {t('patients')}, 1 {t('admin_panel')}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center">
                      <Activity className="mr-2 h-5 w-5 text-primary" />
                      {t('recent_activities')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm">
                      <div className="font-medium">System Update</div>
                      <div className="text-xs text-muted-foreground">2 hours ago</div>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">New User Registration</div>
                      <div className="text-xs text-muted-foreground">Yesterday</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center">
                      <Settings className="mr-2 h-5 w-5 text-primary" />
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
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('manage_users')}</CardTitle>
                  <CardDescription>
                    View and manage all users in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">Dr. Sarah Johnson</div>
                        <div className="bg-secondary/20 text-xs px-2 py-1 rounded-full">
                          {t('doctors')}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">doctor@example.com</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>

                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">Michael Chen</div>
                        <div className="bg-secondary/20 text-xs px-2 py-1 rounded-full">
                          {t('patients')}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">patient@example.com</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>

                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">Admin User</div>
                        <div className="bg-primary/20 text-xs px-2 py-1 rounded-full">
                          {t('admin_panel')}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">admin@example.com</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('system_settings')}</CardTitle>
                  <CardDescription>
                    Manage system-wide settings and configurations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enable-registration">{t('signup')}</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow new users to register
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
                        <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Put the site in maintenance mode
                        </p>
                      </div>
                      <Switch
                        id="maintenance-mode"
                        checked={settings.maintenanceMode}
                        onCheckedChange={() => handleSettingToggle('maintenanceMode')}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button onClick={() => toast.success("Settings saved successfully")}>
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
