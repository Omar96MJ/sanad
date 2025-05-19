
import TherapistDashboard from "./TherapistDashboard/index";
import { LanguageProvider } from "@/hooks/language";

// Wrap TherapistDashboard with LanguageProvider
const WrappedTherapistDashboard = () => {
  return (
    <LanguageProvider>
      <TherapistDashboard />
    </LanguageProvider>
  );
};

export default WrappedTherapistDashboard;
