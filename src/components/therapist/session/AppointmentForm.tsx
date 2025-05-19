
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import { AppointmentFormValues } from "./types";
import { DialogTitle, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { PatientSearch, Patient } from "@/components/search/PatientSearch";

interface AppointmentFormProps {
  onSubmit: (values: AppointmentFormValues) => Promise<void>;
  isSaving: boolean;
}

export const AppointmentForm = ({ onSubmit, isSaving }: AppointmentFormProps) => {
  const { t } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<AppointmentFormValues>({
    defaultValues: {
      patient_name: "",
      session_date: undefined,
      session_time: "",
      session_type: "",
      notes: ""
    }
  });

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setValue("patient_name", patient.name);
    setValue("patient_id", patient.id);
    setShowPatientSearch(false);
  };
  
  return (
    <>
      {showPatientSearch ? (
        <>
          <DialogHeader>
            <DialogTitle>{t('search_patient')}</DialogTitle>
          </DialogHeader>
          <DialogContent className="overflow-hidden">
            <PatientSearch 
              onPatientSelect={handlePatientSelect}
              buttonText={t('select')}
            />
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowPatientSearch(false)}
              >
                {t('cancel')}
              </Button>
            </div>
          </DialogContent>
        </>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="patient_name" className="text-sm font-medium">
              {t('patient_name')}
            </label>
            <div className="flex gap-2">
              <Input
                id="patient_name"
                placeholder={t('enter_patient_name')}
                className="flex-1"
                value={selectedPatient?.name || ""}
                readOnly={!!selectedPatient}
                {...register("patient_name", { required: true })}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowPatientSearch(true)}
              >
                {t('search')}
              </Button>
            </div>
            {errors.patient_name && (
              <p className="text-red-500 text-xs">{t('patient_name_required')}</p>
            )}
            {selectedPatient && (
              <input 
                type="hidden" 
                {...register("patient_id")}
                value={selectedPatient.id} 
              />
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('date')}</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : t('select_date')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                      setDate(date);
                      if (date) {
                        setValue("session_date", date);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.session_date && (
                <p className="text-red-500 text-xs">{t('date_required')}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="session_time" className="text-sm font-medium">
                {t('time')}
              </label>
              <Input
                id="session_time"
                placeholder="14:00"
                {...register("session_time", { required: true })}
              />
              {errors.session_time && (
                <p className="text-red-500 text-xs">{t('time_required')}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="session_type" className="text-sm font-medium">
              {t('session_type')}
            </label>
            <Select
              onValueChange={(value) => setValue("session_type", value)}
              defaultValue=""
            >
              <SelectTrigger>
                <SelectValue placeholder={t('select_session_type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="initial_consultation">{t('initial_consultation')}</SelectItem>
                <SelectItem value="follow_up">{t('follow_up')}</SelectItem>
                <SelectItem value="therapy_session">{t('therapy_session')}</SelectItem>
                <SelectItem value="evaluation">{t('evaluation')}</SelectItem>
              </SelectContent>
            </Select>
            {errors.session_type && (
              <p className="text-red-500 text-xs">{t('session_type_required')}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              {t('notes')} ({t('optional')})
            </label>
            <Textarea
              id="notes"
              placeholder={t('enter_session_notes')}
              {...register("notes")}
            />
          </div>
          
          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? t('scheduling') + "..." : t('schedule_session')}
            </Button>
          </div>
        </form>
      )}
    </>
  );
};
