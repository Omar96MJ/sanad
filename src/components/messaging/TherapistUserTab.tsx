
import React from "react";
import { PatientSearch, Patient } from "@/components/search/PatientSearch";
import { useLanguage } from "@/hooks/useLanguage";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface TherapistUserTabProps {
  onPatientSelect: (patient: Patient) => void;
}

const TherapistUserTab: React.FC<TherapistUserTabProps> = ({
  onPatientSelect
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4">
      <PatientSearch 
        onPatientSelect={onPatientSelect}
        buttonText={t('message') || "Message"}
      />
      
      <Alert variant="default" className="bg-primary/5 mt-4">
        <AlertTriangle className="h-4 w-4 mr-2" />
        <AlertDescription>
          {t('search_patients_hint') || "Search for patients by name to start a conversation."}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default TherapistUserTab;
