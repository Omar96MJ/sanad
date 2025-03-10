
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PatientRecord } from "@/lib/therapist-types";
import { User, Search, FilePlus, UserPlus, ArrowRight, FileText } from "lucide-react";

// Mock patient data
const mockPatients = [
  { 
    id: '1', 
    name: 'John Smith', 
    email: 'john@example.com', 
    lastSession: '2023-10-15',
    nextSession: '2023-10-29' 
  },
  { 
    id: '2', 
    name: 'Emma Johnson', 
    email: 'emma@example.com', 
    lastSession: '2023-10-18',
    nextSession: '2023-11-01' 
  },
  { 
    id: '3', 
    name: 'Michael Brown', 
    email: 'michael@example.com', 
    lastSession: '2023-10-20',
    nextSession: '2023-11-03' 
  },
];

// Mock patient records
const mockRecords: PatientRecord[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Smith',
    creationDate: '2023-09-15',
    author: 'Dr. Sarah Johnson',
    content: 'Initial session: Patient reports feeling anxious and having trouble sleeping. Recommended mindfulness techniques and sleep hygiene practices.'
  },
  {
    id: '2',
    patientId: '1',
    patientName: 'John Smith',
    creationDate: '2023-10-01',
    author: 'Dr. Sarah Johnson',
    content: 'Follow-up: Patient reports some improvement in sleep. Still experiencing anxiety at work. Discussed cognitive restructuring techniques.'
  },
  {
    id: '3',
    patientId: '1',
    patientName: 'John Smith',
    creationDate: '2023-10-15',
    author: 'Dr. Sarah Johnson',
    content: 'Patient has been practicing mindfulness daily. Reports significant improvement in anxiety levels.'
  }
];

// Mock therapists for transfer
const mockTherapists = [
  { id: '1', name: 'Dr. Michael Chen', specialization: 'Anxiety & Depression' },
  { id: '2', name: 'Dr. Lisa Wong', specialization: 'PTSD & Trauma' },
  { id: '3', name: 'Dr. James Wilson', specialization: 'Family Therapy' }
];

const PatientManagement = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showPatientRecords, setShowPatientRecords] = useState(false);
  const [newRecordContent, setNewRecordContent] = useState("");
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState("");
  const [transferReason, setTransferReason] = useState("");
  
  const filteredPatients = mockPatients.filter(
    patient => patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const patientRecords = mockRecords.filter(
    record => record.patientId === selectedPatient?.id
  );
  
  const handleAddRecord = () => {
    if (!newRecordContent.trim()) {
      toast.error(t('record_content_required'));
      return;
    }
    
    // In a real app, send to backend
    toast.success(t('record_added'));
    setNewRecordContent("");
  };
  
  const handleTransferRequest = () => {
    if (!selectedTherapist) {
      toast.error(t('select_therapist'));
      return;
    }
    
    // In a real app, send transfer request to backend
    toast.success(t('transfer_requested'));
    setTransferDialogOpen(false);
    setSelectedTherapist("");
    setTransferReason("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('my_patients')}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <UserPlus className="h-4 w-4 mr-1" />
                {t('add_patient')}
              </Button>
            </div>
          </CardTitle>
          <CardDescription className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('search_patients')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('name')}</TableHead>
                  <TableHead>{t('email')}</TableHead>
                  <TableHead>{t('last_session')}</TableHead>
                  <TableHead>{t('next_session')}</TableHead>
                  <TableHead>{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      {t('no_patients_found')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>{patient.lastSession}</TableCell>
                      <TableCell>{patient.nextSession}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedPatient(patient);
                              setShowPatientRecords(true);
                            }}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            {t('records')}
                          </Button>
                          <Dialog open={transferDialogOpen && selectedPatient?.id === patient.id} onOpenChange={setTransferDialogOpen}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedPatient(patient)}
                              >
                                <ArrowRight className="h-4 w-4 mr-1" />
                                {t('transfer')}
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{t('transfer_patient')}: {patient.name}</DialogTitle>
                                <DialogDescription>
                                  {t('transfer_description')}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">{t('select_therapist')}</label>
                                  <select 
                                    className="w-full p-2 border rounded"
                                    value={selectedTherapist}
                                    onChange={(e) => setSelectedTherapist(e.target.value)}
                                  >
                                    <option value="">{t('choose_therapist')}</option>
                                    {mockTherapists.map(therapist => (
                                      <option key={therapist.id} value={therapist.id}>
                                        {therapist.name} ({therapist.specialization})
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">{t('transfer_reason')}</label>
                                  <Textarea 
                                    value={transferReason}
                                    onChange={(e) => setTransferReason(e.target.value)}
                                    placeholder={t('optional')}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setTransferDialogOpen(false)}>
                                  {t('cancel')}
                                </Button>
                                <Button onClick={handleTransferRequest}>
                                  {t('request_transfer')}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Patient Records Dialog */}
      {selectedPatient && (
        <Dialog open={showPatientRecords} onOpenChange={setShowPatientRecords}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{t('patient_records')}: {selectedPatient.name}</DialogTitle>
              <DialogDescription>
                {t('view_update_patient_records')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {patientRecords.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">{t('no_records_found')}</p>
              ) : (
                patientRecords.map((record) => (
                  <Card key={record.id} className="bg-muted/40">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm text-muted-foreground">{record.creationDate}</p>
                          <p className="text-sm font-medium">{record.author}</p>
                        </div>
                      </div>
                      <p className="whitespace-pre-wrap">{record.content}</p>
                    </CardContent>
                  </Card>
                ))
              )}
              
              {/* Add new record */}
              <Card className="border-dashed border-2">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FilePlus className="h-4 w-4" />
                    {t('add_new_record')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea 
                      value={newRecordContent}
                      onChange={(e) => setNewRecordContent(e.target.value)}
                      placeholder={t('enter_record_details')}
                      className="min-h-32"
                    />
                    <Button onClick={handleAddRecord}>{t('add_record')}</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPatientRecords(false)}>
                {t('close')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PatientManagement;
