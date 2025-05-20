
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { ReactNode } from "react";

interface SessionModalContainerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const SessionModalContainer = ({ 
  isOpen, 
  onClose,
  children 
}: SessionModalContainerProps) => {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isRTL ? "احجز جلسة جديدة" : "Schedule a New Session"}
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
