
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import SessionBookingForm from "@/components/SessionBookingForm";

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SessionModal = ({ isOpen, onClose }: SessionModalProps) => {
  const { t } = useLanguage();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t('bookasession')}</DialogTitle>
          <DialogDescription>
            {t('sessionbooking_description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <SessionBookingForm onSuccess={onClose} inDashboard={true} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionModal;
