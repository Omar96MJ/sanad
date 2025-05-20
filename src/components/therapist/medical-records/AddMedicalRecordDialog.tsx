
import React, { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface AddMedicalRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddRecord: (recordType: string, content: string) => void;
}

const AddMedicalRecordDialog = ({ 
  open, 
  onOpenChange, 
  onAddRecord 
}: AddMedicalRecordDialogProps) => {
  const { t } = useLanguage();
  const [recordType, setRecordType] = useState('');
  const [newRecordContent, setNewRecordContent] = useState('');

  const handleAddRecord = () => {
    if (!newRecordContent.trim() || !recordType.trim()) {
      // Fix: Changed toast.error to toast
      toast(t('please_fill_all_fields'));
      return;
    }
    
    onAddRecord(recordType, newRecordContent);
    setRecordType('');
    setNewRecordContent('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('add_medical_record')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('record_type')}</label>
            <input
              type="text"
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
              placeholder={t('enter_record_type')}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('record_content')}</label>
            <Textarea 
              value={newRecordContent}
              onChange={(e) => setNewRecordContent(e.target.value)}
              placeholder={t('enter_record_details')}
              rows={6}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={handleAddRecord}>
            {t('add_record')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMedicalRecordDialog;
