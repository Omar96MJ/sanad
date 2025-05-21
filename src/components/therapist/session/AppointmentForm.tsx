
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

interface AppointmentFormProps {
  onSubmit: (values: AppointmentFormValues) => Promise<void>;
  isSaving: boolean;
}

export const AppointmentForm = ({ onSubmit, isSaving }: AppointmentFormProps) => {
  const { t } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <PatientSelector 
        patientName={patientName}
        onPatientSelect={handlePatientSelect}
        onPatientNameChange={handlePatientNameChange}
        selectedPatient={selectedPatient}
        error={!!errors.patient_name}
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
        dateError={!!errors.session_date}
        timeError={!!errors.session_time}
      />
      
      <SessionTypeSelector 
        sessionType={sessionType}
        setSessionType={handleSessionTypeChange}
        error={!!errors.session_type}
      />
      
      <NotesField 
        notes={notes}
        setNotes={handleNotesChange}
      />
      
      {/* Hidden input for patient_id */}
      {selectedPatient && (
        <input 
          type="hidden" 
          {...register("patient_id")}
          value={selectedPatient.id} 
        />
      )}
      
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? t('scheduling') + "..." : t('schedule_session')}
        </Button>
      </div>
    </form>
  );
};
