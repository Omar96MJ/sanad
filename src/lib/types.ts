
export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorId: string;
  authorRole: UserRole;
  publishedDate: string;
  imageUrl: string;
  tags: string[];
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
