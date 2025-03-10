
import { User, UserRole } from "./types";

export interface TherapistProfile extends User {
  specialization: string;
  bio: string;
  patients: number;
  yearsOfExperience: number;
  introductionVideo?: string;
}

export interface PatientRecord {
  id: string;
  patientId: string;
  patientName: string;
  creationDate: string;
  author: string;
  content: string;
}

export interface SessionNote {
  id: string;
  patientId: string;
  creationDate: string;
  author: string;
  content: string;
}

export interface Appointment {
  id: string;
  therapistId: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  duration: number; // in minutes
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Availability {
  id: string;
  therapistId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isAvailable: boolean;
}

export interface TransferRequest {
  id: string;
  patientId: string;
  patientName: string;
  fromTherapistId: string;
  toTherapistId: string;
  requestDate: string;
  status: 'pending' | 'accepted' | 'rejected';
  reason?: string;
}

export interface EvaluationForm {
  id: string;
  therapistId: string;
  title: string;
  description: string;
  questions: EvaluationQuestion[];
  createdAt: string;
}

export interface EvaluationQuestion {
  id: string;
  type: 'text' | 'multiple-choice' | 'scale' | 'boolean';
  question: string;
  options?: string[]; // For multiple-choice questions
  scaleRange?: { min: number; max: number }; // For scale questions
}

export interface FormSubmission {
  id: string;
  formId: string;
  patientId: string;
  submissionDate: string;
  answers: {
    questionId: string;
    answer: string | number | boolean;
  }[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'appointment' | 'transfer' | 'form' | 'system';
  isRead: boolean;
  createdAt: string;
}
