
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EvaluationForm, FormSubmission } from "@/lib/therapist-types";

interface FormResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedForm: EvaluationForm | null;
  formSubmissions: FormSubmission[];
  patients: { id: string; name: string }[];
}

export const FormResultsDialog = ({
  open,
  onOpenChange,
  selectedForm,
  formSubmissions,
  patients,
}: FormResultsDialogProps) => {
  const { t } = useLanguage();

  if (!selectedForm) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('form_results')}: {selectedForm.title}</DialogTitle>
          <DialogDescription>
            {t('view_patient_responses')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          {formSubmissions.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">{t('no_submissions_found')}</p>
          ) : (
            formSubmissions.map((submission) => {
              const patient = patients.find(p => p.id === submission.patientId);
              return (
                <Card key={submission.id} className="bg-muted/40">
                  <CardHeader>
                    <CardTitle className="text-base">{patient?.name || 'Unknown Patient'}</CardTitle>
                    <CardDescription>{submission.submissionDate}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {submission.answers.map((answer, index) => {
                        const question = selectedForm.questions.find(q => q.id === answer.questionId);
                        return (
                          <div key={index} className="border-b pb-2">
                            <p className="font-medium">{question?.question || 'Unknown Question'}</p>
                            <p className="mt-1">{answer.answer.toString()}</p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
