
import { LanguageProvider } from '@/hooks/useLanguage';
import { SettingsProvider } from '@/hooks/useSettings';
import TherapistDashboardContent from '@/components/therapist/dashboard/TherapistDashboardContent';

const TherapistDashboard = () => {
  return (
    <SettingsProvider>
      <LanguageProvider>
        <TherapistDashboardContent />
      </LanguageProvider>
    </SettingsProvider>
  );
};

export default TherapistDashboard;
