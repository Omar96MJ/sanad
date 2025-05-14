
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { AppointmentForm } from "./AppointmentForm";
import * as z from "zod";

const formSchema = z.object({
  patient_name: z.string().min(2),
  session_date: z.date(),
  session_time: z.string(),
  session_type: z.string(),
  notes: z.string().optional(),
});

type AppointmentDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  isSaving: boolean;
};

export const AppointmentDialog = ({ isOpen, onOpenChange, onSubmit, isSaving }: AppointmentDialogProps) => {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>{t('schedule_session')}</Button>
      </DialogTrigger>
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
