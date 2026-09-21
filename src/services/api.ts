/**
 * MediConnect API Client Service
 * Connects the React frontend to the Express REST API (backed by MySQL / AWS RDS)
 * with graceful fallback to localStorage when the MySQL server is offline.
 */

import {
  Appointment,
  Doctor,
  Patient,
  Department,
  User,
  DoctorSchedule,
  MedicalDocument,
  AppointmentStatus,
  UserRole,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  isBackendConnected: boolean;
}

class ApiService {
  private baseUrl: string;
  private isServerReachable: boolean | null = null;
  private lastHealthCheck: number = 0;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Health check to verify if Express + MySQL backend is online
  async checkHealth(): Promise<{ online: boolean; database?: string; message?: string }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800);

      const res = await fetch(`${this.baseUrl}/health`, { credentials: 'omit', signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        this.isServerReachable = true;
        this.lastHealthCheck = Date.now();
        return { online: true, database: json.database || 'CONNECTED' };
      }
      this.isServerReachable = false;
      return { online: false, message: 'Server responded with status ' + res.status };
    } catch {
      this.isServerReachable = false;
      this.lastHealthCheck = Date.now();
      return { online: false, message: 'Backend not reachable at ' + this.baseUrl };
    }
  }

  get isConnected(): boolean {
    return !!this.isServerReachable;
  }

  // Generic fetch wrapper with timeout
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || `HTTP error ${response.status}`);
      }

      return await response.json();
    } catch (err: any) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  // ==================== AUTH ====================
  async login(email: string, role?: UserRole): Promise<{ user: User; profile: any }> {
    return this.request<{ user: User; profile: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, role }),
    });
  }

  async registerPatient(data: {
    name: string;
    email: string;
    phone: string;
    date_of_birth: string;
    gender: 'Male' | 'Female' | 'Other';
    address: string;
  }): Promise<{ user: User; patient: Patient }> {
    return this.request<{ user: User; patient: Patient }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ==================== APPOINTMENTS ====================
  async getAppointments(filters?: {
    patient_id?: number;
    doctor_id?: number;
    status?: AppointmentStatus;
    date?: string;
  }): Promise<Appointment[]> {
    const query = new URLSearchParams();
    if (filters?.patient_id) query.append('patient_id', filters.patient_id.toString());
    if (filters?.doctor_id) query.append('doctor_id', filters.doctor_id.toString());
    if (filters?.status) query.append('status', filters.status);
    if (filters?.date) query.append('date', filters.date);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this.request<Appointment[]>(`/appointments${queryString}`);
  }

  async getAppointmentById(id: number): Promise<Appointment> {
    return this.request<Appointment>(`/appointments/${id}`);
  }

  async bookAppointment(bookingData: {
    patient_id: number;
    doctor_id: number;
    department_id: number;
    schedule_id?: number;
    appointment_date: string;
    appointment_time: string;
    reason: string;
  }): Promise<{ message: string; appointment_id: number; appointment_code: string }> {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async updateAppointmentStatus(
    id: number,
    status: AppointmentStatus
  ): Promise<{ message: string }> {
    return this.request(`/appointments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async saveAppointmentNotes(
    id: number,
    notesData: { doctor_id: number; notes: string; prescription: string; follow_up_date?: string }
  ): Promise<{ message: string }> {
    return this.request(`/appointments/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify(notesData),
    });
  }

  // ==================== DOCTORS ====================
  async getDoctors(filters?: { department_id?: number; status?: string }): Promise<Doctor[]> {
    const query = new URLSearchParams();
    if (filters?.department_id) query.append('department_id', filters.department_id.toString());
    if (filters?.status) query.append('status', filters.status);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this.request<Doctor[]>(`/doctors${queryString}`);
  }

  async getDoctorById(id: number): Promise<Doctor> {
    return this.request<Doctor>(`/doctors/${id}`);
  }

  async updateDoctorProfile(id: number, data: Partial<Doctor>): Promise<{ message: string }> {
    return this.request(`/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getDoctorSchedules(id: number): Promise<DoctorSchedule[]> {
    return this.request<DoctorSchedule[]>(`/doctors/${id}/schedules`);
  }

  // ==================== PATIENTS ====================
  async getPatients(): Promise<Patient[]> {
    return this.request<Patient[]>('/patients');
  }

  async getPatientById(id: number): Promise<Patient> {
    return this.request<Patient>(`/patients/${id}`);
  }

  async updatePatientProfile(
    id: number,
    data: Partial<Patient & { name?: string; phone?: string }>
  ): Promise<{ message: string }> {
    return this.request(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getPatientDocuments(patientId: number): Promise<MedicalDocument[]> {
    return this.request<MedicalDocument[]>(`/patients/${patientId}/documents`);
  }

  async uploadPatientDocument(
    patientId: number,
    docData: {
      file_name: string;
      file_type: 'PDF' | 'JPG' | 'PNG';
      file_size: string;
      appointment_id?: number;
      s3_key?: string;
      s3_url?: string;
    }
  ): Promise<{ message: string; document_id: number }> {
    return this.request(`/patients/${patientId}/documents`, {
      method: 'POST',
      body: JSON.stringify(docData),
    });
  }

  // ==================== DEPARTMENTS ====================
  async getDepartments(): Promise<Department[]> {
    return this.request<Department[]>('/departments');
  }
}

export const api = new ApiService();
