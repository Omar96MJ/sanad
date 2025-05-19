
import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import MedicalRecordItem from "@/components/therapist/medical-records/MedicalRecordItem";
import { MedicalRecord } from "@/components/therapist/medical-records/types";

interface MedicalRecordListProps {
  records: MedicalRecord[];
  onEditRecord: (record: MedicalRecord) => void;
}

const MedicalRecordList = ({ records, onEditRecord }: MedicalRecordListProps) => {
  const { t } = useLanguage();

  if (records.length === 0) {
    return (
      <p className="text-center py-6 text-muted-foreground">{t('no_medical_records')}</p>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <MedicalRecordItem 
          key={record.id} 
          record={record} 
          onEditClick={onEditRecord} 
        />
      ))}
    </div>
  );
};

export default MedicalRecordList;
