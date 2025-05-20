
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { SessionModalForm } from "./SessionModalForm";

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionBooked?: () => void;
}

export const SessionModal = ({ isOpen, onClose, onSessionBooked }: SessionModalProps) => {
  const { language, t } = useLanguage();
  const isRTL = language === "ar";

  const handleSubmit = async () => {
    // This function is now just a placeholder
    // The actual functionality is in the useSessionForm hook
    // that is used by the SessionModalForm component
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isRTL ? "احجز جلسة جديدة" : "Schedule a New Session"}
          </DialogTitle>
        </DialogHeader>
        
        <SessionModalForm 
          onSubmit={handleSubmit}
          isLoading={false}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
