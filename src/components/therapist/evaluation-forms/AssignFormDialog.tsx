
import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EvaluationForm } from "@/lib/therapist-types";

interface AssignFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedForm: EvaluationForm | null;
  selectedPatient: string;
  setSelectedPatient: (patientId: string) => void;
  patients: { id: string; name: string }[];
  handleAssignForm: () => void;
}

export const AssignFormDialog = ({
  open,
  onOpenChange,
  selectedForm,
  selectedPatient,
  setSelectedPatient,
  patients,
  handleAssignForm,
}: AssignFormDialogProps) => {
  const { t } = useLanguage();

  if (!selectedForm) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('assign_form')}: {selectedForm.title}</DialogTitle>
          <DialogDescription>
            {t('select_patient_to_send_form')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('patient')}</label>
            <select 
              className="w-full p-2 border rounded"
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
            >
              <option value="">{t('select_patient')}</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="pt-4">
            <h3 className="font-medium mb-2">{t('form_info')}:</h3>
            <p className="text-sm">{selectedForm.description}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {t('questions_count')} {selectedForm.questions.length}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={handleAssignForm}>
            {t('assign_form')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
