
import { createContext, useState, useContext, ReactNode } from 'react';
import { SystemSettings } from '@/lib/types';

type SettingsContextType = {
  settings: SystemSettings;
  updateSettings: (settings: Partial<SystemSettings>) => void;
};

const defaultSettings: SystemSettings = {
  language: 'ar', // Changed default from 'en' to 'ar'
  theme: 'light',
  enableRegistration: true,
  maintenanceMode: false
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const savedSettings = localStorage.getItem('system-settings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('system-settings', JSON.stringify(updatedSettings));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === null) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
