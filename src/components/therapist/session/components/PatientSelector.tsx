
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

  const handleQuickPatientSelect = (quickPatient: Patient) => {
    onPatientSelect(quickPatient);
  };

  // Get real patients (those with database UUIDs) for quick selection
  const quickSelectPatients = patients.filter(p => 
    !p.id.startsWith('temp-') // Real patients from database
  ).slice(0, 4); // Limit to 4 for quick selection

  // If no real patients, show default ones
  const displayQuickPatients = quickSelectPatients.length > 0 ? quickSelectPatients : defaultPatients.slice(0, 4);

  return (
    <>
      <div className="space-y-2">
        <label htmlFor="patient_name" className="text-sm font-medium">
          {t('patient_name')}
        </label>
        <div className="flex gap-2">
          <Input
            id="patient_name"
            placeholder={t('enter_patient_name') || "Enter patient name"}
            className="flex-1"
            value={patientName}
            onChange={(e) => onPatientNameChange(e.target.value)}
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setShowPatientSearch(true)}
          >
            {t('search') || "Search"}
          </Button>
        </div>
        {error && (
          <p className="text-red-500 text-xs">{t('patient_name_required') || "Patient name is required"}</p>
        )}

        {/* Quick patient selection */}
        <div className="mt-2">
          <p className="text-sm text-muted-foreground mb-2">
            {t('quick_select') || "Quick select"}
            {loadingPatients && <span className="ml-1">(Loading...)</span>}
          </p>
          <div className="flex flex-wrap gap-2">
            {displayQuickPatients.map(patient => (
              <Badge 
                key={patient.id} // Using unique database ID
                variant={patientName === patient.name ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => handleQuickPatientSelect(patient)}
              >
                <UserIcon className="h-3 w-3 mr-1" /> 
                {patient.name}
                {!patient.id.startsWith('temp-') && (
                  <span className="ml-1 text-xs opacity-70">•</span>
                )}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Patient search dialog */}
      {showPatientSearch && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">{t('search_patients') || "Search Patients"}</h3>
            <PatientSearch 
              onPatientSelect={handlePatientSelect}
              buttonText={t('select') || "Select"}
            />
            <Button 
              variant="outline"
              className="mt-4 w-full"
              onClick={() => setShowPatientSearch(false)}
            >
              {t('cancel') || "Cancel"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
