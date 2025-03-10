
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
import { EvaluationForm, FormSubmission } from "@/lib/therapist-types";
import { Search, FilePlus, FileText, FileCheck } from "lucide-react";

// Mock evaluation forms
const mockForms: EvaluationForm[] = [
  {
    id: '1',
    therapistId: '1',
    title: 'Depression Assessment (PHQ-9)',
    description: 'Patient Health Questionnaire for screening and measuring the severity of depression',
    questions: [
      {
        id: '1-1',
        type: 'scale',
        question: 'Little interest or pleasure in doing things',
        scaleRange: { min: 0, max: 3 }
      },
      {
        id: '1-2',
        type: 'scale',
        question: 'Feeling down, depressed, or hopeless',
        scaleRange: { min: 0, max: 3 }
      }
    ],
    createdAt: '2023-09-01'
  },
  {
    id: '2',
    therapistId: '1',
    title: 'Anxiety Assessment (GAD-7)',
    description: 'Generalized Anxiety Disorder scale for screening and measuring the severity of anxiety',
    questions: [
      {
        id: '2-1',
        type: 'scale',
        question: 'Feeling nervous, anxious, or on edge',
        scaleRange: { min: 0, max: 3 }
      },
      {
        id: '2-2',
        type: 'scale',
        question: 'Not being able to stop or control worrying',
        scaleRange: { min: 0, max: 3 }
      }
    ],
    createdAt: '2023-09-05'
  }
];

// Mock form submissions
const mockSubmissions: FormSubmission[] = [
  {
    id: '1',
    formId: '1',
    patientId: '1',
    submissionDate: '2023-10-20',
    answers: [
      { questionId: '1-1', answer: 2 },
      { questionId: '1-2', answer: 3 }
    ]
  },
  {
    id: '2',
    formId: '2',
    patientId: '2',
    submissionDate: '2023-10-18',
    answers: [
      { questionId: '2-1', answer: 1 },
      { questionId: '2-2', answer: 2 }
    ]
  }
];

// Mock patients
const mockPatients = [
  { id: '1', name: 'John Smith' },
  { id: '2', name: 'Emma Johnson' },
  { id: '3', name: 'Michael Brown' }
];

const EvaluationForms = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedForm, setSelectedForm] = useState<EvaluationForm | null>(null);
  const [showFormResults, setShowFormResults] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  
  // Create form state
  const [newFormTitle, setNewFormTitle] = useState("");
  const [newFormDescription, setNewFormDescription] = useState("");
  const [newFormQuestions, setNewFormQuestions] = useState([
    { type: 'text', question: '', options: [], scaleRange: { min: 0, max: 5 } }
  ]);
  
  // Assign form state
  const [selectedPatient, setSelectedPatient] = useState("");
  
  const filteredForms = mockForms.filter(
    form => form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            form.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formSubmissions = selectedForm ? mockSubmissions.filter(
    submission => submission.formId === selectedForm.id
  ) : [];
  
  const handleCreateForm = () => {
    if (!newFormTitle.trim()) {
      toast.error(t('form_title_required'));
      return;
    }
    
    if (newFormQuestions.some(q => !q.question.trim())) {
      toast.error(t('all_questions_required'));
      return;
    }
    
    // In a real app, send to backend
    toast.success(t('form_created'));
    setShowCreateForm(false);
    
    // Reset form
    setNewFormTitle("");
    setNewFormDescription("");
    setNewFormQuestions([
      { type: 'text', question: '', options: [], scaleRange: { min: 0, max: 5 } }
    ]);
  };
  
  const handleAssignForm = () => {
    if (!selectedPatient) {
      toast.error(t('select_patient'));
      return;
    }
    
    // In a real app, send to backend
    toast.success(t('form_assigned'));
    setShowAssignForm(false);
    setSelectedPatient("");
  };
  
  const addQuestion = () => {
    setNewFormQuestions([
      ...newFormQuestions,
      { type: 'text', question: '', options: [], scaleRange: { min: 0, max: 5 } }
    ]);
  };
  
  const updateQuestion = (index: number, field: string, value: any) => {
    const updatedQuestions = [...newFormQuestions];
    (updatedQuestions[index] as any)[field] = value;
    setNewFormQuestions(updatedQuestions);
  };
  
  const removeQuestion = (index: number) => {
    if (newFormQuestions.length <= 1) {
      toast.error(t('form_requires_at_least_one_question'));
      return;
    }
    const updatedQuestions = [...newFormQuestions];
    updatedQuestions.splice(index, 1);
    setNewFormQuestions(updatedQuestions);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t('evaluation_forms')}
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <FilePlus className="h-4 w-4 mr-1" />
              {t('create_form')}
            </Button>
          </CardTitle>
          <CardDescription className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('search_forms')}
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
                  <TableHead>{t('title')}</TableHead>
                  <TableHead>{t('description')}</TableHead>
                  <TableHead>{t('created_at')}</TableHead>
                  <TableHead>{t('questions')}</TableHead>
                  <TableHead>{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredForms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      {t('no_forms_found')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredForms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell className="font-medium">{form.title}</TableCell>
                      <TableCell>{form.description.substring(0, 50)}{form.description.length > 50 ? '...' : ''}</TableCell>
                      <TableCell>{form.createdAt}</TableCell>
                      <TableCell>{form.questions.length}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedForm(form);
                              setShowAssignForm(true);
                            }}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            {t('assign')}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedForm(form);
                              setShowFormResults(true);
                            }}
                          >
                            <FileCheck className="h-4 w-4 mr-1" />
                            {t('results')}
                          </Button>
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
      
      {/* Create Form Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t('create_evaluation_form')}</DialogTitle>
            <DialogDescription>
              {t('create_form_description')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('form_title')}</label>
              <Input
                value={newFormTitle}
                onChange={(e) => setNewFormTitle(e.target.value)}
                placeholder={t('enter_form_title')}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('form_description')}</label>
              <Textarea
                value={newFormDescription}
                onChange={(e) => setNewFormDescription(e.target.value)}
                placeholder={t('enter_form_description')}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{t('questions')}</h3>
                <Button 
                  type="button" 
                  size="sm" 
                  onClick={addQuestion}
                >
                  {t('add_question')}
                </Button>
              </div>
              
              {newFormQuestions.map((question, index) => (
                <div key={index} className="space-y-3 p-4 border rounded-md">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{t('question')} #{index + 1}</h4>
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removeQuestion(index)}
                    >
                      {t('remove')}
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('question_text')}</label>
                    <Input
                      value={question.question}
                      onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                      placeholder={t('enter_question')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('question_type')}</label>
                    <select 
                      className="w-full p-2 border rounded"
                      value={question.type}
                      onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                    >
                      <option value="text">{t('text_input')}</option>
                      <option value="multiple-choice">{t('multiple_choice')}</option>
                      <option value="scale">{t('scale')}</option>
                      <option value="boolean">{t('yes_no')}</option>
                    </select>
                  </div>
                  
                  {question.type === 'multiple-choice' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('options')}</label>
                      <Textarea
                        placeholder={t('enter_options')}
                        value={question.options?.join('\n') || ''}
                        onChange={(e) => updateQuestion(index, 'options', e.target.value.split('\n'))}
                      />
                      <p className="text-xs text-muted-foreground">{t('one_option_per_line')}</p>
                    </div>
                  )}
                  
                  {question.type === 'scale' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t('min_value')}</label>
                        <Input
                          type="number"
                          value={question.scaleRange?.min}
                          onChange={(e) => updateQuestion(index, 'scaleRange', {
                            ...question.scaleRange,
                            min: parseInt(e.target.value)
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t('max_value')}</label>
                        <Input
                          type="number"
                          value={question.scaleRange?.max}
                          onChange={(e) => updateQuestion(index, 'scaleRange', {
                            ...question.scaleRange,
                            max: parseInt(e.target.value)
                          })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateForm(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleCreateForm}>
              {t('create_form')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Form Results Dialog */}
      {selectedForm && (
        <Dialog open={showFormResults} onOpenChange={setShowFormResults}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('form_results')}: {selectedForm.title}</DialogTitle>
              <DialogDescription>
                {t('view_patient_responses')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              {formSubmissions.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">{t('no_submissions_found')}</p>
              ) : (
                formSubmissions.map((submission) => {
                  const patient = mockPatients.find(p => p.id === submission.patientId);
                  return (
                    <Card key={submission.id} className="bg-muted/40">
                      <CardHeader>
                        <CardTitle className="text-base">{patient?.name || 'Unknown Patient'}</CardTitle>
                        <CardDescription>{submission.submissionDate}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {submission.answers.map((answer, index) => {
                            const question = selectedForm.questions.find(q => q.id === answer.questionId);
                            return (
                              <div key={index} className="border-b pb-2">
                                <p className="font-medium">{question?.question || 'Unknown Question'}</p>
                                <p className="mt-1">{answer.answer.toString()}</p>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowFormResults(false)}>
                {t('close')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Assign Form Dialog */}
      {selectedForm && (
        <Dialog open={showAssignForm} onOpenChange={setShowAssignForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('assign_form')}: {selectedForm.title}</DialogTitle>
              <DialogDescription>
                {t('select_patient_to_send_form')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('patient')}</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                >
                  <option value="">{t('select_patient')}</option>
                  {mockPatients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="pt-4">
                <h3 className="font-medium mb-2">{t('form_info')}:</h3>
                <p className="text-sm">{selectedForm.description}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {t('questions_count', { count: selectedForm.questions.length })}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAssignForm(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={handleAssignForm}>
                {t('assign_form')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EvaluationForms;
