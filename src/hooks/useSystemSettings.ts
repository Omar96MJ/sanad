
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SystemSettings {
  enableRegistration: boolean;
  maintenanceMode: boolean;
  emailNotifications: boolean;
}

export const useSystemSettings = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    enableRegistration: true,
    maintenanceMode: false,
    emailNotifications: true
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      // Since we don't have a dedicated system settings table yet,
      // we'll use localStorage as fallback and prepare for future Supabase integration
      const savedSettings = localStorage.getItem('system-settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({
          enableRegistration: parsed.enableRegistration ?? true,
          maintenanceMode: parsed.maintenanceMode ?? false,
          emailNotifications: parsed.emailNotifications ?? true
        });
      }
    } catch (err) {
      console.error('Error fetching system settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async (key: keyof SystemSettings, value: boolean) => {
    try {
      setIsLoading(true);
      const newSettings = { ...settings, [key]: value };
      
      // Save to localStorage for now
      localStorage.setItem('system-settings', JSON.stringify(newSettings));
      
      setSettings(newSettings);
      return true;
    } catch (err) {
      console.error('Error updating setting:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    isLoading,
    updateSetting,
    refreshSettings: fetchSettings
  };
};
