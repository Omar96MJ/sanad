
export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  recordType: string;
  content: string;
  therapistId: string;
  therapistName: string;
}

export interface MedicalHistorySectionProps {
  patientId?: string;
  patientName?: string;
}
