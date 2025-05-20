
import { MedicalRecord } from "@/components/therapist/medical-records/types";

// Function to generate a new record
export const createMedicalRecord = (
  patientId: string = '1',
  patientName: string = 'John Doe',
  recordType: string,
  content: string,
): MedicalRecord => {
  return {
    id: `${Date.now()}`,
    patientId,
    patientName,
    date: new Date().toISOString().split('T')[0],
    recordType,
    content,
    therapistId: 'therapist-1',
    therapistName: 'Dr. Smith' // This would come from the logged-in user in a real app
  };
};

// In a real app, these would be API calls
export const mockRecords: MedicalRecord[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Doe',
    date: '2025-05-01',
    recordType: 'Initial Assessment',
    content: 'Patient reports experiencing anxiety and sleep disturbances for the past 3 months. Describes feeling overwhelmed at work and home.',
    therapistId: 'therapist-1',
    therapistName: 'Dr. Smith'
  },
  {
    id: '2',
    patientId: '1',
    patientName: 'John Doe',
    date: '2025-05-10',
    recordType: 'Therapy Progress',
    content: 'Patient has been practicing mindfulness techniques daily. Reports slight improvement in anxiety symptoms. Sleep still disrupted.',
    therapistId: 'therapist-1',
    therapistName: 'Dr. Smith'
  }
];
