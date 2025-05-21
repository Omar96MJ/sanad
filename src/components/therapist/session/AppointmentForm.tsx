
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { Patient } from "@/components/search/PatientSearch";
import { AppointmentFormValues } from "./types";
import { PatientSelector } from "./components/PatientSelector";
import { DateTimeSelector } from "./components/DateTimeSelector";
import { SessionTypeSelector } from "./components/SessionTypeSelector";
import { NotesField } from "./components/NotesField";
import { toast } from "sonner";

interface AppointmentFormProps {
  onSubmit: (values: AppointmentFormValues) => Promise<void>;
  isSaving: boolean;
}

export const AppointmentForm = ({ onSubmit, isSaving }: AppointmentFormProps) => {
  const { t } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<AppointmentFormValues>({
    defaultValues: {
      patient_name: "",
      patient_id: undefined,
      session_date: undefined,
      session_time: "",
      session_type: "",
      notes: ""
    }
  });

  const patientName = watch("patient_name");
  const sessionTime = watch("session_time");
  const sessionType = watch("session_type");
  const notes = watch("notes");

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setValue("patient_name", patient.name);
    setValue("patient_id", patient.id);
  };

  const handlePatientNameChange = (name: string) => {
    setValue("patient_name", name);
    // If manually typing a name, clear the selected patient ID
    if (!selectedPatient || selectedPatient.name !== name) {
      setValue("patient_id", undefined);
      setSelectedPatient(null);
    }
  };

  const handleTimeChange = (time: string) => {
    setValue("session_time", time);
  };

  const handleSessionTypeChange = (type: string) => {
    setValue("session_type", type);
  };

  const handleNotesChange = (newNotes: string) => {
    setValue("notes", newNotes);
  };

  const validateForm = () => {
    if (!patientName.trim()) {
      setValidationError(t('patient_name_required'));
      return false;
    }

    if (!date) {
      setValidationError(t('date_required'));
      return false;
    }

    if (!sessionTime.trim()) {
      setValidationError(t('time_required'));
      return false;
    }

    if (!sessionType.trim()) {
      setValidationError(t('session_type_required'));
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleFormSubmit = async (values: AppointmentFormValues) => {
    try {
      if (!validateForm()) {
        toast.error(validationError || t('please_fill_all_fields'));
        return;
      }

      // Set the date in the form data
      if (date) {
        values.session_date = date;
      }
      
      // Ensure values.patient_id is undefined rather than an invalid string
      if (values.patient_id && typeof values.patient_id === 'string' && 
          values.patient_id.startsWith('default-')) {
        values.patient_id = undefined;
      }

      await onSubmit(values);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(t('error_scheduling_session'));
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <PatientSelector 
        patientName={patientName}
        onPatientSelect={handlePatientSelect}
        onPatientNameChange={handlePatientNameChange}
        selectedPatient={selectedPatient}
        error={!!errors.patient_name || (validationError?.includes('patient') || false)}
      />
      
      <DateTimeSelector 
        date={date}
        setDate={(newDate) => {
          setDate(newDate);
          if (newDate) {
            setValue("session_date", newDate);
          }
        }}
        time={sessionTime}
        setTime={handleTimeChange}
        dateError={!!errors.session_date || (validationError?.includes('date') || false)}
        timeError={!!errors.session_time || (validationError?.includes('time') || false)}
      />
      
      <SessionTypeSelector 
        sessionType={sessionType}
        setSessionType={handleSessionTypeChange}
        error={!!errors.session_type || (validationError?.includes('session_type') || false)}
      />
      
      <NotesField 
        notes={notes}
        setNotes={handleNotesChange}
      />
      
      {validationError && (
        <p className="text-red-500 text-sm">{validationError}</p>
      )}
      
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? t('scheduling') + "..." : t('schedule_session')}
        </Button>
      </div>
    </form>
  );
};
