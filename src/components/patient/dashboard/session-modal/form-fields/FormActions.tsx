
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  isLoading: boolean;
  onCancel: () => void;
}

export const FormActions = ({ isLoading, onCancel }: FormActionsProps) => {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button variant="outline" onClick={onCancel} disabled={isLoading} type="button">
        {isRTL ? "إلغاء" : "Cancel"}
      </Button>
      <Button 
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isRTL ? "جاري الحجز..." : "Booking..."}
          </>
        ) : (
          isRTL ? "تأكيد الحجز" : "Confirm Booking"
        )}
      </Button>
    </div>
  );
};
