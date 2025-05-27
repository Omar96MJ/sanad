
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
  //DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { User,FilePlus, Search, UserPlus, ArrowRight,Loader2, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { 
  PatientListItem, 
  CurrentDoctorProp, 
  PatientNote // هذا هو النوع الجديد للسجلات الذي يعكس جدول patient_notes
} from '@/lib/therapist-types';
 


interface PatientManagementProps {
  currentDoctor: CurrentDoctorProp | null;
  // onDataChange?: () => void; //  دالة اختيارية لإعلام الأب بتحديث الإحصائيات (مثل patients_count)
}

const PatientManagement = ({ currentDoctor /*, onDataChange */ }: PatientManagementProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [patients, setPatients] = useState<PatientListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [selectedPatient, setSelectedPatient] = useState<PatientListItem | null>(null);
  const [showPatientRecordsDialog, setShowPatientRecordsDialog] = useState(false);
  const [patientNotes, setPatientNotes] = useState<PatientNote[]>([]); //  استخدام النوع الجديد PatientNote
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
    const [isAddingNote, setIsAddingNote] = useState(false);

  // حالات النقل (معلقة)
  // const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  // const [selectedTherapistForTransfer, setSelectedTherapistForTransfer] = useState("");
  // const [transferReason, setTransferReason] = useState("");

  // جلب قائمة المرضى
  useEffect(() => {
    const fetchPatients = async () => {
      if (!currentDoctor || !currentDoctor.id) {
        setIsLoadingPatients(false);
        setPatients([]);
        // console.warn("PatientManagement: Doctor ID not provided.");
        return;
      }

      setIsLoadingPatients(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, email')
          .eq('assigned_doctor_id', currentDoctor.id)
          .eq('role', 'patient');

        if (error) {
          console.error("Error fetching patients:", error);
          toast.error(t('error_fetching_patients') + `: ${error.message}`);
          setPatients([]);
        } else if (data) {
          const formattedPatients: PatientListItem[] = data.map(p => ({
            id: p.id,
            name: p.name || t('name_not_set'), // قيمة احتياطية
            email: p.email || t('email_not_set'), // قيمة احتياطية
            lastSession: "N/A",
            nextSession: "N/A",
          }));
          setPatients(formattedPatients);
        }
      } catch (catchError: any) {
        console.error("Unexpected error fetching patients:", catchError);
        toast.error(t('unexpected_error_fetching_patients') + `: ${catchError.message}`);
        setPatients([]);
      } finally {
        setIsLoadingPatients(false);
      }
    };

    fetchPatients();
  }, [currentDoctor, t]);

  const filteredPatients = patients.filter(
    patient =>
      (patient.name && patient.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // جلب وعرض سجلات/ملاحظات المريض
const handleViewNotes = async (patient: PatientListItem) => {
  setSelectedPatient(patient); // تعيين المريض المحدد ليعرف الـ Dialog أي مريض يعرض له
  setShowPatientRecordsDialog(true); // فتح الـ Dialog
  setIsLoadingNotes(true); // بدء مؤشر تحميل الملاحظات
  setPatientNotes([]); // مسح الملاحظات القديمة قبل جلب الجديدة

  if (!patient || !patient.id) {
    setIsLoadingNotes(false);
    toast.error(t('invalid_patient_selected'));
    return;
  }

  try {
    const { data, error } = await supabase
      .from('patient_notes') // التأكد من اسم الجدول الصحيح
      .select(`
        id,
        patient_id,
        doctor_id,
        content,
        note_date,
        created_at,
        updated_at,
        doctor:doctors ( name ) 
      `) // جلب اسم الطبيب الكاتب من جدول 'doctors'
      .eq('patient_id', patient.id) // فلترة الملاحظات للمريض المحدد
      .order('note_date', { ascending: false }); // ترتيب الملاحظات (الأحدث أولاً)

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
        doctor_name: note.doctor?.name || t('unknown_author'), // اسم الطبيب
        patient_name: patient.name || '', // اسم المريض من الكائن 'patient' الممرر للدالة
      }));
      setPatientNotes(formattedNotes);
    }
  } catch (e: any) {
    console.error("Unexpected error in handleViewNotes:", e);
    toast.error(t('unexpected_error_fetching_notes'));
  } finally {
    setIsLoadingNotes(false); // إيقاف مؤشر تحميل الملاحظات
  }
};

  // إضافة سجل/ملاحظة جديدة
 // داخل PatientManagement.tsx
const handleAddNote = async () => {
  if (!newNoteContent.trim() || !selectedPatient || !currentDoctor || !currentDoctor.id) {
    toast.error(t('note_content_required_or_patient_doctor_missing'));
    return;
  }
  
  // يمكنك استخدام حالة تحميل منفصلة لعملية الإضافة إذا أردت
  setIsAddingNote(true); 
  const originalNotes = [...patientNotes]; // للاسترجاع في حالة الخطأ (تحسين اختياري)

  try {
    const noteToInsert = {
      patient_id: selectedPatient.id,
      doctor_id: currentDoctor.id,
      content: newNoteContent,
      note_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      // created_at و updated_at سيتم تعيينهما بواسطة قاعدة البيانات
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
      `) // جلب الملاحظة المُدرجة مع اسم الطبيب
      .single(); // نتوقع إدراج سجل واحد

    if (error) {
      console.error("Error adding note:", error);
      toast.error(t('error_adding_note') + `: ${error.message}`);
    } else if (insertedNote) {
      toast.success(t('note_added_successfully'));
      setNewNoteContent(""); // مسح حقل الإدخال

      // تحديث قائمة الملاحظات المعروضة بإضافة الملاحظة الجديدة في الأعلى
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
      setPatientNotes(prevNotes => [newFormattedNote, ...prevNotes]); // إضافة الملاحظة الجديدة إلى بداية القائمة
      // لم نعد بحاجة لاستدعاء handleViewNotes بالكامل هنا إذا قمنا بتحديث الحالة محليًا
    }
  } catch (e: any) {
    console.error("Unexpected error in handleAddNote:", e);
    toast.error(t('unexpected_error_adding_note'));
    setPatientNotes(originalNotes); // إعادة الملاحظات الأصلية في حالة الخطأ الفادح (تحسين اختياري)
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
              {t('my_patients')}
            </div>
          </CardTitle>
          <CardDescription className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="relative flex-1">
              <Search className={`absolute top-2.5 h-4 w-4 text-muted-foreground ${isRTL ? 'right-2' : 'left-2'}`} />
              <Input
                placeholder={t('search_patients_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={isRTL ? 'pr-8' : 'pl-8'}
              />
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
                  {filteredPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24">
                        {searchTerm ? t('no_patients_match_search') : t('no_patients_assigned_yet')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPatients.map((patient) => (
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
                            {/* زر النقل معلق */}
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
      // داخل PatientManagement.tsx، في جزء الـ return
{/* Dialog عرض وإضافة السجلات/الملاحظات */}
{selectedPatient && (
  <Dialog open={showPatientRecordsDialog} onOpenChange={setShowPatientRecordsDialog}>
    <DialogContent className="max-w-3xl"> {/* يمكنك تعديل العرض الأقصى حسب الحاجة */}
      <DialogHeader>
        <DialogTitle>{t('patient_notes_for')} {selectedPatient.name || t('unknown_patient')}</DialogTitle>
        <DialogDescription>
          {t('view_and_add_patient_notes')}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 max-h-[calc(80vh-200px)] overflow-y-auto p-1 pr-3"> {/* تعديل الارتفاع والـ padding */}
        {isLoadingNotes ? (
           <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
           </div>
        ) : patientNotes.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">{t('no_notes_found_for_this_patient')}</p>
        ) : (
          patientNotes.map((note) => ( // استخدام patientNotes هنا
            <Card key={note.id} className="bg-muted/40 mb-3"> {/* أضفت mb-3 */}
              <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex justify-between items-start">
                      <div>
                          {/* يمكنك عرض عنوان الملاحظة هنا إذا أضفت حقل record_title */}
                          {/* <CardTitle className="text-md">{note.record_title || t('note_entry_on_date', { date: new Date(note.note_date).toLocaleDateString() })}</CardTitle> */}
                          <CardTitle className="text-md">{t('note_dated')} {new Date(note.note_date).toLocaleDateString(language)}</CardTitle>
                          <CardDescription>{t('authored_by')} {note.doctor_name}</CardDescription>
                      </div>
                      <p className="text-xs text-muted-foreground pt-1">{t('created_on_db')} {new Date(note.created_at).toLocaleDateString(language)}</p>
                  </div>
              </CardHeader>
              <CardContent className="pt-0 pb-4 px-4">
                {/* يمكنك إضافة زر لتعديل/حذف الملاحظة هنا إذا أردت */}
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
          <CardContent className="pt-2 pb-4 px-4"> {/* تعديل padding */}
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