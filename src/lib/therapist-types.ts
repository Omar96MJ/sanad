import { User, UserRole } from "./types";

export interface TherapistProfile extends User {
  specialization: string;
  bio: string;
  patients: number;
  yearsOfExperience: number;
  introductionVideo?: string;
}

export interface PatientNote {
  id: string; // UUID للسجل/الملاحظة
  patient_id: string; // UUID للمريض
  doctor_id: string; // UUID للطبيب
  content: string;
  note_date: string; //  سيعود كتاريخ بصيغة YYYY-MM-DD
  created_at?: string; //  اختياري إذا لم تكن دائمًا تجلبه أو تستخدمه في الواجهة
  updated_at?: string; //  اختياري

  // حقول اختيارية يمكنك إضافتها بعد عمل JOIN عند جلب البيانات (إذا لزم الأمر)
  patient_name?: string; //  اسم المريض (يُجلب من profiles)
  doctor_name?: string;  //  اسم الطبيب الكاتب (يُجلب من doctors)
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

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  recipientId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessageTimestamp: string;
  unreadCount: number;
}


// نفس تعريف  نوع الطبيب
export type DoctorProfile = {
  id: string;
  user_id: string; // هذا هو user_id من auth.users
  name: string;
  specialization: string;
  bio: string;
  years_of_experience: number;
  patients_count: number; // سنقوم بحسابه ونخزنه هنا أيضًا لتمريره للمكونات الفرعية
  profile_image: string;
  weekly_available_hours: number; // افترضنا أن هذا الحقل موجود في profileData
};



export type PatientListItem = {
  id: string; // هذا سيكون id المريض من جدول profiles (الذي هو نفسه user_id الخاص به)
  name: string | null; // اسم المريض، قد يكون فارغًا (null) إذا لم يتم إدخاله في profiles
  email: string | null; // إيميل المريض، قد يكون فارغًا أيضًا
  lastSession: string; // تاريخ آخر جلسة. مبدئيًا، سنجعل قيمته "N/A"
  nextSession: string; // تاريخ الجلسة القادمة. مبدئيًا، سنجعل قيمته "N/A"
  // يمكنك إضافة أي حقول أخرى من جدول profiles تحتاج لعرضها في القائمة هنا
  // مثال: profile_image?: string | null;
};

export type CurrentDoctorProp = {
  id: string; // id من جدول doctors (المفتاح الأساسي لجدول doctors)
  user_id: string; // user_id المرتبط بـ auth.users (اختياري هنا، لكنه جزء من بيانات الطبيب)
  name: string; // اسم الطبيب
  // ... يمكنك إضافة أي حقول أخرى من نوع DoctorProfile قد تحتاجها في PatientManagement
};