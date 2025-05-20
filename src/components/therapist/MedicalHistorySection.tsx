
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import MedicalRecordList from "./medical-records/MedicalRecordList";
import AddMedicalRecordDialog from "./medical-records/AddMedicalRecordDialog";
import EditMedicalRecordDialog from "./medical-records/EditMedicalRecordDialog";
import MedicalRecordsHeader from "./medical-records/MedicalRecordsHeader";
import { MedicalRecord, MedicalHistorySectionProps } from "./medical-records/types";
import { createMedicalRecord, mockRecords } from "./medical-records/services/recordService";

const MedicalHistorySection = ({ patientId, patientName }: MedicalHistorySectionProps) => {
  const { t } = useLanguage();
  
  const [records, setRecords] = useState<MedicalRecord[]>(mockRecords);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<MedicalRecord | null>(null);
  
  const handleAddRecord = (recordType: string, content: string) => {    
    const newRecord = createMedicalRecord(
      patientId,
      patientName,
      recordType,
      content
    );
    
    // In a real app, this would be an API call to save the record
    setRecords([...records, newRecord]);
    
    toast.success(t('record_added_successfully'));
    setAddDialogOpen(false);
  };
  
  const handleEditRecord = (record: MedicalRecord | null) => {
    if (!record) return;
    
    // In a real app, this would be an API call to update the record
    setRecords(records.map(r => 
      r.id === record.id ? record : r
    ));
    
    toast.success(t('record_updated_successfully'));
    setEditDialogOpen(false);
    setCurrentRecord(null);
  };
  
  return (
    <Card>
      <CardHeader>
        <MedicalRecordsHeader 
          patientName={patientName}
          onAddRecord={() => setAddDialogOpen(true)}
        />
      </CardHeader>
      <CardContent>
        <MedicalRecordList 
          records={records} 
          onEditRecord={(record) => {
            setCurrentRecord(record);
            setEditDialogOpen(true);
          }}
        />
        
        <AddMedicalRecordDialog 
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onAddRecord={handleAddRecord}
        />
        
        <EditMedicalRecordDialog 
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          currentRecord={currentRecord}
          onUpdateRecord={handleEditRecord}
          onRecordChange={setCurrentRecord}
        />
      </CardContent>
    </Card>
  );
};

export default MedicalHistorySection;
