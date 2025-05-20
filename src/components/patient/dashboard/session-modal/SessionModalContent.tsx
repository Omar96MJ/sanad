
import { SessionModalForm } from "./SessionModalForm";
import { useSessionForm } from "./useSessionForm";

interface SessionModalContentProps {
  onClose: () => void;
  onSessionBooked?: () => void;
}

export const SessionModalContent = ({ 
  onClose, 
  onSessionBooked 
}: SessionModalContentProps) => {
  const { 
    handleBookSession, 
    isLoading, 
    setIsLoading 
  } = useSessionForm({ 
    onClose, 
    onSessionBooked 
  });

  return (
    <SessionModalForm 
      onSubmit={handleBookSession}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      onCancel={onClose}
    />
  );
};
