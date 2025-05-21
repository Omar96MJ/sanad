
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { AppointmentForm } from "./AppointmentForm";
import { AppointmentFormValues } from "./types";

type AppointmentDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AppointmentFormValues) => Promise<void>;
  isSaving: boolean;
};

export const AppointmentDialog = ({ isOpen, onOpenChange, onSubmit, isSaving }: AppointmentDialogProps) => {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('schedule_new_session')}</DialogTitle>
          <DialogDescription>
            {t('enter_session_details_below')}
          </DialogDescription>
        </DialogHeader>
        
        <AppointmentForm onSubmit={onSubmit} isSaving={isSaving} />
      </DialogContent>
    </Dialog>
  );
};
