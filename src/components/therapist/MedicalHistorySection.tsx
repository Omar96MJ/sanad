
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileText, Plus } from "lucide-react";
import MedicalRecordList from "./medical-records/MedicalRecordList";
import AddMedicalRecordDialog from "./medical-records/AddMedicalRecordDialog";
import EditMedicalRecordDialog from "./medical-records/EditMedicalRecordDialog";
import { MedicalRecord, MedicalHistorySectionProps } from "./medical-records/types";

const MedicalHistorySection = ({ patientId, patientName }: MedicalHistorySectionProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [records, setRecords] = useState<MedicalRecord[]>([
    // Mock data - in a real app this would come from the database
    {
      id: '1',
      patientId: patientId || '1',
      patientName: patientName || 'John Doe',
      date: '2025-05-01',
      recordType: 'Initial Assessment',
      content: 'Patient reports experiencing anxiety and sleep disturbances for the past 3 months. Describes feeling overwhelmed at work and home.',
      therapistId: 'therapist-1',
      therapistName: 'Dr. Smith'
    },
    {
      id: '2',
      patientId: patientId || '1',
      patientName: patientName || 'John Doe',
      date: '2025-05-10',
      recordType: 'Therapy Progress',
      content: 'Patient has been practicing mindfulness techniques daily. Reports slight improvement in anxiety symptoms. Sleep still disrupted.',
      therapistId: 'therapist-1',
      therapistName: 'Dr. Smith'
    }
  ]);
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<MedicalRecord | null>(null);
  
  const handleAddRecord = (recordType: string, content: string) => {    
    const newRecord: MedicalRecord = {
      id: `${Date.now()}`,
      patientId: patientId || '1',
      patientName: patientName || 'John Doe',
      date: new Date().toISOString().split('T')[0],
      recordType: recordType,
      content: content,
      therapistId: 'therapist-1',
      therapistName: 'Dr. Smith' // This would come from the logged-in user in a real app
    };
    
    // In a real app, this would be an API call to save the record
    setRecords([...records, newRecord]);
    
    toast(t('record_added_successfully'));
    setAddDialogOpen(false);
  };
  
  const handleEditRecord = (record: MedicalRecord | null) => {
    if (!record) return;
    
    // In a real app, this would be an API call to update the record
    setRecords(records.map(r => 
      r.id === record.id ? record : r
    ));
    
    toast(t('record_updated_successfully'));
    setEditDialogOpen(false);
    setCurrentRecord(null);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('medical_history')}
          </div>
          <Button onClick={() => setAddDialogOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            {t('add_medical_record')}
          </Button>
        </CardTitle>
        <CardDescription>
          {patientName ? t('medical_history_for', { name: patientName }) : t('patient_medical_history')}
        </CardDescription>
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
