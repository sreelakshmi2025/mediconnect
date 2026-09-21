export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN';

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface User {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  created_at: string;
}

export interface Patient {
  patient_id: number;
  user_id: number;
  date_of_birth: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  phone?: string;
  user?: User;
}

export interface Department {
  department_id: number;
  department_name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  icon_name: string;
  head_doctor?: string;
}

export interface Doctor {
  doctor_id: number;
  user_id: number;
  department_id: number;
  specialization: string;
  qualification: string;
  experience: number; // in years
  consultation_fee: number; // in INR ₹
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  rating: number;
  available_days: string[];
  photo_url: string;
  about: string;
  bio?: string;
  user?: User;
  department?: Department;
}

export interface DoctorSchedule {
  schedule_id: number;
  doctor_id: number;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  available: boolean;
  slots?: string[]; // e.g. ["09:00 AM", "09:30 AM", ...]
}

export interface MedicalDocument {
  document_id: number;
  patient_id: number;
  appointment_id?: number;
  file_name: string;
  file_type: 'PDF' | 'JPG' | 'PNG';
  file_size: string;
  s3_key: string;
  s3_url: string;
  uploaded_at: string;
}

export interface AppointmentNote {
  note_id: number;
  appointment_id: number;
  doctor_id: number;
  notes: string;
  prescription: string;
  follow_up_date?: string;
  created_at: string;
}

export interface Appointment {
  appointment_id: number;
  appointment_code: string; // e.g. APT-10025
  patient_id: number;
  doctor_id: number;
  department_id: number;
  schedule_id?: number;
  appointment_date: string; // YYYY-MM-DD
  appointment_time: string; // "10:30 AM"
  reason: string;
  status: AppointmentStatus;
  created_at: string;
  // Joins
  patient?: Patient & { user?: User };
  doctor?: Doctor & { user?: User };
  department?: Department;
  notes?: AppointmentNote;
  documents?: MedicalDocument[];
}

export interface Notification {
  notification_id: number;
  user_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  type?: 'appointment' | 'schedule' | 'document' | 'system' | 'APPOINTMENT_BOOKED' | 'APPOINTMENT_CONFIRMED' | 'APPOINTMENT_CANCELLED' | 'REMINDER' | string;
  link?: string;
}

export interface ContactMessage {
  message_id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}
