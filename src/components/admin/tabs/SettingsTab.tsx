
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface SettingsTabProps {
  settings: any;
  onSettingToggle: (setting: string) => void;
}

const SettingsTab = ({ settings, onSettingToggle }: SettingsTabProps) => {
  const { t } = useLanguage();

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
              onCheckedChange={() => onSettingToggle('enableRegistration')}
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
              onCheckedChange={() => onSettingToggle('maintenanceMode')}
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
  );
};

export default SettingsTab;
