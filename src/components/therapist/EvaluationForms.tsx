
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";
import { EvaluationForm } from "@/lib/therapist-types";
import { FormList } from "./evaluation-forms/FormList";
import { CreateFormDialog } from "./evaluation-forms/CreateFormDialog";
import { AssignFormDialog } from "./evaluation-forms/AssignFormDialog";
import { FormResultsDialog } from "./evaluation-forms/FormResultsDialog";
import { mockForms, mockSubmissions, mockPatients } from "@/models/evaluation-forms-data";

const EvaluationForms = () => {
  const { t } = useLanguage();
  
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
      <FormList 
        forms={filteredForms}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onCreateForm={() => setShowCreateForm(true)}
        onAssignForm={(form) => {
          setSelectedForm(form);
          setShowAssignForm(true);
        }}
        onViewResults={(form) => {
          setSelectedForm(form);
          setShowFormResults(true);
        }}
      />
      
      <CreateFormDialog 
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        title={newFormTitle}
        description={newFormDescription}
        questions={newFormQuestions}
        setTitle={setNewFormTitle}
        setDescription={setNewFormDescription}
        addQuestion={addQuestion}
        updateQuestion={updateQuestion}
        removeQuestion={removeQuestion}
        handleCreateForm={handleCreateForm}
      />
      
      <AssignFormDialog 
        open={showAssignForm}
        onOpenChange={setShowAssignForm}
        selectedForm={selectedForm}
        selectedPatient={selectedPatient}
        setSelectedPatient={setSelectedPatient}
        patients={mockPatients}
        handleAssignForm={handleAssignForm}
      />
      
      <FormResultsDialog 
        open={showFormResults}
        onOpenChange={setShowFormResults}
        selectedForm={selectedForm}
        formSubmissions={formSubmissions}
        patients={mockPatients}
      />
    </div>
  );
};

export default EvaluationForms;
