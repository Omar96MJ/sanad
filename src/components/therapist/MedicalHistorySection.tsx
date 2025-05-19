import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileText, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// Define types for medical record objects
interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  recordType: string;
  content: string;
  therapistId: string;
  therapistName: string;
}

interface MedicalHistorySectionProps {
  patientId?: string;
  patientName?: string;
}

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
  const [newRecordContent, setNewRecordContent] = useState('');
  const [recordType, setRecordType] = useState('');
  
  const handleAddRecord = () => {
    if (!newRecordContent.trim() || !recordType.trim()) {
      toast.error(t('please_fill_all_fields'));
      return;
    }
    
    const newRecord: MedicalRecord = {
      id: `${Date.now()}`,
      patientId: patientId || '1',
      patientName: patientName || 'John Doe',
      date: new Date().toISOString().split('T')[0],
      recordType: recordType,
      content: newRecordContent,
      therapistId: 'therapist-1',
      therapistName: 'Dr. Smith' // This would come from the logged-in user in a real app
    };
    
    // In a real app, this would be an API call to save the record
    setRecords([...records, newRecord]);
    toast.success(t('record_added_successfully'));
    setAddDialogOpen(false);
    setNewRecordContent('');
    setRecordType('');
  };
  
  const handleEditRecord = () => {
    if (!currentRecord || !currentRecord.content.trim()) {
      toast.error(t('please_fill_all_fields'));
      return;
    }
    
    // In a real app, this would be an API call to update the record
    setRecords(records.map(record => 
      record.id === currentRecord.id ? currentRecord : record
    ));
    
    toast.success(t('record_updated_successfully'));
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
        {records.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground">{t('no_medical_records')}</p>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <Card key={record.id} className="bg-muted/30">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{record.recordType}</p>
                      <p className="text-sm text-muted-foreground">{record.date} • {record.therapistName}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setCurrentRecord(record);
                        setEditDialogOpen(true);
                      }}
                    >
                      {t('edit')}
                    </Button>
                  </div>
                  <p className="whitespace-pre-wrap mt-2">{record.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Add Record Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
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
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={handleAddRecord}>
                {t('add_record')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Record Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('update_medical_record')}</DialogTitle>
            </DialogHeader>
            {currentRecord && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('record_type')}</label>
                  <input
                    type="text"
                    value={currentRecord.recordType}
                    onChange={(e) => setCurrentRecord({
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
                    onChange={(e) => setCurrentRecord({
                      ...currentRecord,
                      content: e.target.value
                    })}
                    rows={6}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={handleEditRecord}>
                {t('update_record')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default MedicalHistorySection;
