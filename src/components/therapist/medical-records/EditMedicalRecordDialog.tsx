import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MedicalRecord } from "@/components/therapist/medical-records/types";

interface EditMedicalRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRecord: MedicalRecord | null;
  onUpdateRecord: (record: MedicalRecord | null) => void;
  onRecordChange: (record: MedicalRecord | null) => void;
}

const EditMedicalRecordDialog = ({ 
  open, 
  onOpenChange, 
  currentRecord, 
  onUpdateRecord,
  onRecordChange
}: EditMedicalRecordDialogProps) => {
  const { t } = useLanguage();
  
  const handleEditRecord = () => {
    if (!currentRecord || !currentRecord.content.trim()) {
      toast.error(t('please_fill_all_fields'));
      return;
    }
    
    onUpdateRecord(currentRecord);
  };

  if (!currentRecord) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('update_medical_record')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('record_type')}</label>
            <input
              type="text"
              value={currentRecord.recordType}
              onChange={(e) => onRecordChange({
                ...currentRecord,
                recordType: e.target.value
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('record_content')}</label>
            <Textarea 
              value={currentRecord.content}
              onChange={(e) => onRecordChange({
                ...currentRecord,
                content: e.target.value
              })}
              rows={6}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={handleEditRecord}>
            {t('update_record')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditMedicalRecordDialog;
