
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { toast } from "sonner";

export const SettingsTab = () => {
  const { t } = useLanguage();
  const { settings, isLoading, updateSetting } = useSystemSettings();

  const handleSettingToggle = async (setting: keyof typeof settings) => {
    const success = await updateSetting(setting, !settings[setting]);
    if (success) {
      toast.success(t('setting_updated'));
    } else {
      toast.error(t('setting_update_failed') || 'Failed to update setting');
    }
  };

  return (
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              checked={settings.emailNotifications}
              onCheckedChange={() => handleSettingToggle('emailNotifications')}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button 
            onClick={() => toast.success(t('settings_saved'))}
            disabled={isLoading}
          >
            {isLoading ? t('saving') || 'Saving...' : t('save_changes')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
