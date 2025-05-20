
import { LanguageProvider } from '@/hooks/useLanguage';
import TherapistDashboardComponent from "./TherapistDashboard/index";

// Wrap TherapistDashboard with LanguageProvider to ensure useLanguage context is available
const TherapistDashboard = () => {
  return (
    <LanguageProvider>
      <TherapistDashboardComponent />
    </LanguageProvider>
  );
};

export default TherapistDashboard;
