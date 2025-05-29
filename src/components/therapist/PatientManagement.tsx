import { useState , useEffect} from "react";
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
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { User,FilePlus, Search, UserPlus, ArrowRight,Loader2, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { 
  PatientListItem, 
  CurrentDoctorProp, 
  PatientNote 
} from '@/lib/therapist-types';

interface PatientManagementProps {
  currentDoctor: CurrentDoctorProp | null;
}

const PatientManagement = ({ currentDoctor }: PatientManagementProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [patients, setPatients] = useState<PatientListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [selectedPatient, setSelectedPatient] = useState<PatientListItem | null>(null);
  const [showPatientRecordsDialog, setShowPatientRecordsDialog] = useState(false);
  const [patientNotes, setPatientNotes] = useState<PatientNote[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Function to fetch patients who have appointments with the doctor
  const fetchPatients = async (searchQuery?: string) => {
    if (!currentDoctor || !currentDoctor.id) {
      setPatients([]);
      return;
    }

    const isSearchMode = searchQuery && searchQuery.trim().length > 0;
    setIsSearching(isSearchMode);

    try {
      console.log('Fetching patients with appointments for doctor ID:', currentDoctor.id, 'with search:', searchQuery);

      // First, get all unique patient IDs who have appointments with this doctor
      let appointmentQuery = supabase
        .from('appointments')
        .select('patient_id')
        .eq('doctor_id', currentDoctor.id);

      const { data: appointmentData, error: appointmentError } = await appointmentQuery;

      if (appointmentError) {
        console.error("Error fetching appointments:", appointmentError);
        toast.error(t('error_fetching_patients') + `: ${appointmentError.message}`);
        setPatients([]);
        return;
      }

      if (!appointmentData || appointmentData.length === 0) {
        setPatients([]);
        return;
      }

      // Get unique patient IDs
      const uniquePatientIds = [...new Set(appointmentData.map(apt => apt.patient_id))];

      // Now fetch patient profiles for these IDs
      let profileQuery = supabase
        .from('profiles')
        .select('id, name, email')
        .in('id', uniquePatientIds);

      // Add search filters if search term is provided
      if (isSearchMode) {
        profileQuery = profileQuery.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
      }

      const { data: profileData, error: profileError } = await profileQuery.order('name', { ascending: true });

      if (profileError) {
        console.error("Error fetching patient profiles:", profileError);
        toast.error(t('error_fetching_patients') + `: ${profileError.message}`);
        setPatients([]);
        return;
      }

      if (profileData) {
        // For each patient, get their latest and next appointment info
        const patientsWithSessions = await Promise.all(
          profileData.map(async (patient) => {
            // Get last session
            const { data: lastSession } = await supabase
              .from('appointments')
              .select('session_date, status')
              .eq('doctor_id', currentDoctor.id)
              .eq('patient_id', patient.id)
              .in('status', ['completed'])
              .order('session_date', { ascending: false })
              .limit(1);

            // Get next session
            const { data: nextSession } = await supabase
              .from('appointments')
              .select('session_date, status')
              .eq('doctor_id', currentDoctor.id)
              .eq('patient_id', patient.id)
              .in('status', ['scheduled', 'rescheduled'])
              .gte('session_date', new Date().toISOString())
              .order('session_date', { ascending: true })
              .limit(1);

            return {
              id: patient.id,
              name: patient.name || t('name_not_set'),
              email: patient.email || t('email_not_set'),
              lastSession: lastSession && lastSession.length > 0 
                ? new Date(lastSession[0].session_date).toLocaleDateString(language)
                : "N/A",
              nextSession: nextSession && nextSession.length > 0 
                ? new Date(nextSession[0].session_date).toLocaleDateString(language)
                : "N/A",
            };
          })
        );

        setPatients(patientsWithSessions);
      }
    } catch (catchError: any) {
      console.error("Unexpected error fetching patients:", catchError);
      toast.error(t('unexpected_error_fetching_patients') + `: ${catchError.message}`);
      setPatients([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Initial load of patients
  useEffect(() => {
    const loadInitialPatients = async () => {
      setIsLoadingPatients(true);
      await fetchPatients();
      setIsLoadingPatients(false);
    };

    loadInitialPatients();
  }, [currentDoctor, t]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchPatients(searchTerm);
      } else {
        // If search is cleared, reload all patients
        fetchPatients();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // جلب وعرض سجلات/ملاحظات المريض
  const handleViewNotes = async (patient: PatientListItem) => {
    setSelectedPatient(patient);
    setShowPatientRecordsDialog(true);
    setIsLoadingNotes(true);
    setPatientNotes([]);

    if (!patient || !patient.id) {
      setIsLoadingNotes(false);
      toast.error(t('invalid_patient_selected'));
      return;
    }

    try {
      const { data, error } = await supabase
        .from('patient_notes')
        .select(`
          id,
          patient_id,
          doctor_id,
          content,
          note_date,
          created_at,
          updated_at,
          doctor:doctors ( name ) 
        `)
        .eq('patient_id', patient.id)
        .order('note_date', { ascending: false });

      if (error) {
        console.error("Error fetching patient notes:", error);
        toast.error(t('error_fetching_patient_notes') + `: ${error.message}`);
      } else if (data) {
        const formattedNotes: PatientNote[] = data.map(note => ({
          id: note.id,
          patient_id: note.patient_id,
          doctor_id: note.doctor_id,
          content: note.content,
          note_date: note.note_date,
          created_at: note.created_at,
          updated_at: note.updated_at,
          doctor_name: note.doctor?.name || t('unknown_author'),
          patient_name: patient.name || '',
        }));
        setPatientNotes(formattedNotes);
      }
    } catch (e: any) {
      console.error("Unexpected error in handleViewNotes:", e);
      toast.error(t('unexpected_error_fetching_notes'));
    } finally {
      setIsLoadingNotes(false);
    }
  };

  // إضافة سجل/ملاحظة جديدة
  const handleAddNote = async () => {
    if (!newNoteContent.trim() || !selectedPatient || !currentDoctor || !currentDoctor.id) {
      toast.error(t('note_content_required_or_patient_doctor_missing'));
      return;
    }
    
    setIsAddingNote(true); 
    const originalNotes = [...patientNotes];

    try {
      const noteToInsert = {
        patient_id: selectedPatient.id,
        doctor_id: currentDoctor.id,
        content: newNoteContent,
        note_date: new Date().toISOString().split('T')[0],
      };

      const { data: insertedNote, error } = await supabase
        .from('patient_notes')
        .insert(noteToInsert)
        .select(`
          id,
          patient_id,
          doctor_id,
          content,
          note_date,
          created_at,
          updated_at,
          doctor:doctors ( name )
        `)
        .single();

      if (error) {
        console.error("Error adding note:", error);
        toast.error(t('error_adding_note') + `: ${error.message}`);
      } else if (insertedNote) {
        toast.success(t('note_added_successfully'));
        setNewNoteContent("");

        const newFormattedNote: PatientNote = {
            id: insertedNote.id,
            patient_id: insertedNote.patient_id,
            doctor_id: insertedNote.doctor_id,
            content: insertedNote.content,
            note_date: insertedNote.note_date,
            created_at: insertedNote.created_at,
            updated_at: insertedNote.updated_at,
            doctor_name: insertedNote.doctor?.name || t('unknown_author'),
            patient_name: selectedPatient.name || '',
        };
        setPatientNotes(prevNotes => [newFormattedNote, ...prevNotes]);
      }
    } catch (e: any) {
      console.error("Unexpected error in handleAddNote:", e);
      toast.error(t('unexpected_error_adding_note'));
      setPatientNotes(originalNotes);
    } finally {
      setIsAddingNote(false);
    }
  };
 
  if (!currentDoctor && isLoadingPatients) { 
      return (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      );
  }

  if (!currentDoctor && !isLoadingPatients) { 
      return (
          <div className="p-4 text-center text-muted-foreground">
              {t('doctor_info_not_available_contact_support')}
          </div>
      );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('patients_with_appointments')}
            </div>
          </CardTitle>
          <CardDescription className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="relative flex-1">
              <Search className={`absolute top-2.5 h-4 w-4 text-muted-foreground ${isRTL ? 'right-2' : 'left-2'}`} />
              <Input
                placeholder={t('search_patients_placeholder')}
                value={searchTerm}
                onChange={handleSearchChange}
                className={isRTL ? 'pr-8' : 'pl-8'}
              />
              {(isSearching || isLoadingPatients) && (
                <Loader2 className={`absolute top-2.5 h-4 w-4 animate-spin text-muted-foreground ${isRTL ? 'left-2' : 'right-2'}`} />
              )}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingPatients ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('name')}</TableHead>
                    <TableHead>{t('email')}</TableHead>
                    <TableHead>{t('last_session')}</TableHead>
                    <TableHead>{t('next_session')}</TableHead>
                    <TableHead className="text-right rtl:text-left">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24">
                        {searchTerm ? t('no_patients_match_search') : t('no_patients_with_appointments_yet')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    patients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell>{patient.email}</TableCell>
                        <TableCell>{patient.lastSession}</TableCell>
                        <TableCell>{patient.nextSession}</TableCell>
                        <TableCell className="text-right rtl:text-left">
                          <div className="flex space-x-2 rtl:space-x-reverse justify-end rtl:justify-start">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewNotes(patient)}
                            >
                              <FileText className={`${isRTL ? 'ml-1' : 'mr-1'} h-4 w-4`} />
                              {t('view_notes')} 
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog عرض وإضافة السجلات/الملاحظات */}
      {selectedPatient && (
        <Dialog open={showPatientRecordsDialog} onOpenChange={setShowPatientRecordsDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{t('patient_notes_for')} {selectedPatient.name || t('unknown_patient')}</DialogTitle>
              <DialogDescription>
                {t('view_and_add_patient_notes')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[calc(80vh-200px)] overflow-y-auto p-1 pr-3">
              {isLoadingNotes ? (
                 <div className="flex justify-center items-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
              ) : patientNotes.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">{t('no_notes_found_for_this_patient')}</p>
              ) : (
                patientNotes.map((note) => (
                  <Card key={note.id} className="bg-muted/40 mb-3">
                    <CardHeader className="pb-2 pt-4 px-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-md">{t('note_dated')} {new Date(note.note_date).toLocaleDateString(language)}</CardTitle>
                                <CardDescription>{t('authored_by')} {note.doctor_name}</CardDescription>
                            </div>
                            <p className="text-xs text-muted-foreground pt-1">{t('created_on_db')} {new Date(note.created_at).toLocaleDateString(language)}</p>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0 pb-4 px-4">
                      <p className="whitespace-pre-wrap text-sm">{note.content}</p>
                    </CardContent>
                  </Card>
                ))
              )}
              
              {/* إضافة ملاحظة جديدة */}
              <Card className="border-dashed border-2 mt-6">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FilePlus className="h-4 w-4" />
                    {t('add_new_note_for_patient')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2 pb-4 px-4">
                  <div className="space-y-3">
                    <Textarea 
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      placeholder={t('enter_note_details_here')}
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end">
                        <Button 
                                  onClick={handleAddNote} 
                                  size="sm" 
                                  disabled={isAddingNote || !newNoteContent.trim()}
                              >
                                  {isAddingNote ? <Loader2 className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4 animate-spin`}/> : null} 
                                  {isAddingNote ? t('adding_note_progress') : t('add_note_button')}
                          </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setShowPatientRecordsDialog(false)}>
                {t('close_dialog')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PatientManagement;
