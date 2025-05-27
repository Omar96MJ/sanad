
import { EvaluationForm, FormSubmission } from "@/lib/therapist-types";

// Mock evaluation forms
export const mockForms: EvaluationForm[] = [
  {
    id: '1',
    therapistId: '1',
    title: 'Depression Assessment (PHQ-9)',
    description: 'Patient Health Questionnaire for screening and measuring the severity of depression',
    questions: [
      {
        id: '1-1',
        question_text: 'Little interest or pleasure in doing things',
        question_type: 'scale',
        options: [],
        required: true,
        order_index: 1,
        type: 'scale',
        question: 'Little interest or pleasure in doing things',
        scaleRange: { min: 0, max: 3 }
      },
      {
        id: '1-2',
        question_text: 'Feeling down, depressed, or hopeless',
        question_type: 'scale',
        options: [],
        required: true,
        order_index: 2,
        type: 'scale',
        question: 'Feeling down, depressed, or hopeless',
        scaleRange: { min: 0, max: 3 }
      }
    ],
    created_by: '1',
    created_at: '2023-09-01',
    updated_at: '2023-09-01',
    is_active: true,
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
        question_text: 'Feeling nervous, anxious, or on edge',
        question_type: 'scale',
        options: [],
        required: true,
        order_index: 1,
        type: 'scale',
        question: 'Feeling nervous, anxious, or on edge',
        scaleRange: { min: 0, max: 3 }
      },
      {
        id: '2-2',
        question_text: 'Not being able to stop or control worrying',
        question_type: 'scale',
        options: [],
        required: true,
        order_index: 2,
        type: 'scale',
        question: 'Not being able to stop or control worrying',
        scaleRange: { min: 0, max: 3 }
      }
    ],
    created_by: '1',
    created_at: '2023-09-05',
    updated_at: '2023-09-05',
    is_active: true,
    createdAt: '2023-09-05'
  }
];

// Mock form submissions
export const mockSubmissions: FormSubmission[] = [
  {
    id: '1',
    form_id: '1',
    patient_id: '1',
    responses: [
      { question_id: '1-1', answer: 2 },
      { question_id: '1-2', answer: 3 }
    ],
    submitted_at: '2023-10-20',
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
    form_id: '2',
    patient_id: '2',
    responses: [
      { question_id: '2-1', answer: 1 },
      { question_id: '2-2', answer: 2 }
    ],
    submitted_at: '2023-10-18',
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
export const mockPatients = [
  { id: '1', name: 'John Smith' },
  { id: '2', name: 'Emma Johnson' },
  { id: '3', name: 'Michael Brown' }
];
