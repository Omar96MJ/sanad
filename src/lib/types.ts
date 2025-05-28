
export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  name: string;
  email?: string;
  role?: UserRole;
  profileImage?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  titleAr?: string;
  excerpt: string;
  excerptAr?: string;
  content: string;
  contentAr?: string;
  author: string;
  authorAr?: string;
  authorId: string;
  authorRole: UserRole;
  publishedDate: string;
  imageUrl: string;
  tags: string[];
  tagsAr?: string[];
}

export interface Doctor extends User {
  specialization: string;
  bio: string;
  patients: number;
  yearsOfExperience: number;
}

export interface Patient extends User {
  assignedDoctor?: string;
  lastAppointment?: string;
  upcomingAppointment?: string;
}

export interface Admin extends User {
  permissions: {
    manageUsers: boolean;
    manageContent: boolean;
    manageSettings: boolean;
  };
  lastLogin?: string;
}

export interface SystemSettings {
  language: 'en' | 'ar';
  theme: 'light' | 'dark';
  enableRegistration: boolean;
  maintenanceMode: boolean;
}
