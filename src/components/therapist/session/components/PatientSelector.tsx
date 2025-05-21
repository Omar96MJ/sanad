
import { useState } from "react";
import { UserIcon } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PatientSearch, Patient } from "@/components/search/PatientSearch";
import { usePatients } from "../usePatients";

interface PatientSelectorProps {
  patientName: string;
  onPatientSelect: (patient: Patient) => void;
  onPatientNameChange: (name: string) => void;
  selectedPatient: Patient | null;
  error?: boolean;
}

export const PatientSelector = ({ 
  patientName, 
  onPatientSelect, 
  onPatientNameChange,
  selectedPatient,
  error
}: PatientSelectorProps) => {
  const { t } = useLanguage();
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const { patients, defaultPatients, isLoading: loadingPatients } = usePatients();

  const handlePatientSelect = (patient: Patient) => {
    onPatientSelect(patient);
    setShowPatientSearch(false);
  };

  const handleQuickPatientSelect = (defaultPatient: Patient) => {
    onPatientSelect(defaultPatient);
  };

  return (
    <>
      <div className="space-y-2">
        <label htmlFor="patient_name" className="text-sm font-medium">
          {t('patient_name')}
        </label>
        <div className="flex gap-2">
          <Input
            id="patient_name"
            placeholder={t('enter_patient_name')}
            className="flex-1"
            value={patientName}
            onChange={(e) => onPatientNameChange(e.target.value)}
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setShowPatientSearch(true)}
          >
            {t('search')}
          </Button>
        </div>
        {error && (
          <p className="text-red-500 text-xs">{t('patient_name_required')}</p>
        )}

        {/* Quick patient selection */}
        <div className="mt-2">
          <p className="text-sm text-muted-foreground mb-2">{t('quick_select')}</p>
          <div className="flex flex-wrap gap-2">
            {defaultPatients?.map(patient => (
              <Badge 
                key={patient.id}
                variant={patientName === patient.name ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleQuickPatientSelect(patient)}
              >
                <UserIcon className="h-3 w-3 mr-1" /> {patient.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Patient search dialog (hidden by default) */}
      {showPatientSearch && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">{t('search_patients')}</h3>
            <PatientSearch onPatientSelect={handlePatientSelect} />
            <Button 
              variant="outline"
              className="mt-4 w-full"
              onClick={() => setShowPatientSearch(false)}
            >
              {t('cancel')}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
