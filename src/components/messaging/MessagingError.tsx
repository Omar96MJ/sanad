
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

interface MessagingErrorProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

const MessagingError: React.FC<MessagingErrorProps> = ({
  title,
  message,
  onRetry
}) => {
  const { t } = useLanguage();
  
  return (
    <Alert variant="destructive" className="my-4">
      <AlertTriangle className="h-4 w-4" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription className="flex flex-col gap-3">
        <p>{message}</p>
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 w-fit"
            onClick={onRetry}
          >
            {t('retry') || "Retry"}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default MessagingError;
