
import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

interface MedicalRecordsHeaderProps {
  patientName?: string;
  onAddRecord: () => void;
}

const MedicalRecordsHeader = ({ patientName, onAddRecord }: MedicalRecordsHeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <>
      <CardTitle className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {t('medical_history')}
        </div>
        <Button onClick={onAddRecord} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          {t('add_medical_record')}
        </Button>
      </CardTitle>
      <CardDescription>
        {patientName 
          ? t('medical_history_for', { name: patientName }) 
          : t('patient_medical_history')}
      </CardDescription>
    </>
  );
};

export default MedicalRecordsHeader;
