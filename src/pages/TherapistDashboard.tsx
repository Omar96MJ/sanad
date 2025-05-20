
import { LanguageProvider } from '@/hooks/useLanguage';
import TherapistDashboardComponent from "./TherapistDashboard/index";
import { SettingsProvider } from '@/hooks/useSettings';

// Wrap TherapistDashboard with LanguageProvider and SettingsProvider to ensure both contexts are available
const TherapistDashboard = () => {
  return (
    <SettingsProvider>
      <LanguageProvider>
        <TherapistDashboardComponent />
      </LanguageProvider>
    </SettingsProvider>
  );
};

export default TherapistDashboard;
