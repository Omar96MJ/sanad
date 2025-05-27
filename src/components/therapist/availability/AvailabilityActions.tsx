
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface AvailabilityActionsProps {
  editMode: boolean;
  isSaving: boolean;
  onStartEdit: () => void;
  onSaveChanges: () => void;
  onCancelEdit: () => void;
}

export const AvailabilityActions = ({
  editMode,
  isSaving,
  onStartEdit,
  onSaveChanges,
  onCancelEdit
}: AvailabilityActionsProps) => {
  const { t } = useLanguage();

  if (editMode) {
    return (
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancelEdit} disabled={isSaving}>
          {t('cancel')}
        </Button>
        <Button onClick={onSaveChanges} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Check className="h-4 w-4 mr-1" />
          )}
          {t('save_changes')}
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={onStartEdit}>
      {t('edit_availability')}
    </Button>
  );
};
