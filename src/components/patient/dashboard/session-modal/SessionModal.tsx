
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { SessionModalForm } from "./SessionModalForm";
import { useSessionForm } from "./useSessionForm";

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionBooked?: () => void;
}

export const SessionModal = ({ isOpen, onClose, onSessionBooked }: SessionModalProps) => {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  
  const { 
    handleBookSession, 
    isLoading, 
    setIsLoading 
  } = useSessionForm({ 
    onClose, 
    onSessionBooked 
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[80vh] overflow-y-auto md:max-h-[calc(100vh-7rem)]">
        <DialogHeader>
          <DialogTitle>
            {isRTL ? "احجز جلسة جديدة" : "Schedule a New Session"}
          </DialogTitle>
        </DialogHeader>
        
        <SessionModalForm 
          onSubmit={handleBookSession}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
