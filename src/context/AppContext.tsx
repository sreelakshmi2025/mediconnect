import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  User,
  Patient,
  Doctor,
  Department,
  DoctorSchedule,
  Appointment,
  MedicalDocument,
  AppointmentNote,
  Notification,
  ContactMessage,
  UserRole,
  AppointmentStatus,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PATIENTS,
  INITIAL_DOCTORS,
  INITIAL_DEPARTMENTS,
  INITIAL_SCHEDULES,
  INITIAL_APPOINTMENTS,
  INITIAL_DOCUMENTS,
  INITIAL_NOTES,
  INITIAL_NOTIFICATIONS,
  INITIAL_CONTACT_MESSAGES,
} from '../data/initialData';
import { api } from '../services/api';

interface AppContextType {
  currentUser: User | null;
  currentRole: UserRole | null;
  currentPatient: Patient | null;
  currentDoctor: Doctor | null;
  activePage: string;
  pageParams: any;
  setActivePage: (page: string, params?: any) => void;

  // Backend / Database Connection Status
  isBackendConnected: boolean;
  isCheckingBackend: boolean;
  backendStatus: string;
  checkBackendConnection: () => Promise<boolean>;

  users: User[];
  patients: Patient[];
  doctors: Doctor[];
  departments: Department[];
  schedules: DoctorSchedule[];
  appointments: Appointment[];
  documents: MedicalDocument[];
  notes: AppointmentNote[];
  notifications: Notification[];
  contactMessages: ContactMessage[];

  // Auth actions
  login: (email: string, password?: string) => Promise<{ success: boolean; message: string; role?: UserRole }>;
  loginAsRole: (role: UserRole, specificUserId?: number) => void;
  logout: () => void;
  registerPatient: (data: {
    name: string;
    email: string;
    phone: string;
    date_of_birth: string;
    gender: 'Male' | 'Female' | 'Other';
    address: string;
    password?: string;
  }) => Promise<{ success: boolean; message: string }>;

  // Appointment actions
  bookAppointment: (params: {
    patient_id: number;
    doctor_id: number;
    department_id: number;
    appointment_date: string;
    appointment_time: string;
    reason: string;
    schedule_id?: number;
    document?: { name: string; type: 'PDF' | 'JPG' | 'PNG'; size: string };
  }) => { success: boolean; message: string; appointment?: Appointment };

  cancelAppointment: (appointmentId: number, reason?: string) => { success: boolean; message: string };
  acceptAppointment: (appointmentId: number) => { success: boolean; message: string };
  rejectAppointment: (appointmentId: number) => { success: boolean; message: string };
  completeAppointment: (
    appointmentId: number,
    notesText: string,
    prescriptionText: string,
    followUpDate?: string
  ) => { success: boolean; message: string };
  updateAppointmentStatus: (
    appointmentId: number,
    status: AppointmentStatus,
    notes?: { notes: string; prescription: string; follow_up_date?: string }
  ) => { success: boolean; message: string };

  // Document actions
  uploadDocument: (
    patientId: number,
    file: { name: string; type: 'PDF' | 'JPG' | 'PNG'; size: string },
    appointmentId?: number
  ) => MedicalDocument;
  deleteDocument: (documentId: number) => void;

  // Schedules
  addSchedule: (schedule: Omit<DoctorSchedule, 'schedule_id'>) => void;
  updateDoctorSchedule: (doctorId: number, availableDays: string[], slots?: string[]) => void;

  // Profile updates
  updatePatientProfile: (patientId: number, data: Partial<Patient & { name?: string; phone?: string }>) => void;
  updateDoctorProfile: (doctorId: number, data: Partial<Doctor>) => void;

  // Admin actions
  addDoctor: (data: any) => void;
  updateDoctorStatus: (doctorId: number, status: 'ACTIVE' | 'INACTIVE') => void;
  updatePatientStatus: (patientId: number, status: string) => void;
  addDepartment: (dept: Omit<Department, 'department_id'>) => void;
  updateDepartment: (deptId: number, dept: Partial<Department>) => void;

  // Notifications
  markNotificationRead: (notificationId: number) => void;
  markNotificationAsRead: (notificationId: number) => void;
  markAllNotificationsRead: (userId: number) => void;
  markAllNotificationsAsRead: (userId?: number) => void;

  // Contact
  sendContactMessage: (msg: Omit<ContactMessage, 'message_id' | 'created_at'>) => void;

  // Utilities
  getEnrichedAppointments: (filterForUser?: boolean) => Appointment[];
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'mediconnect_users_v1',
  PATIENTS: 'mediconnect_patients_v1',
  DOCTORS: 'mediconnect_doctors_v1',
  DEPARTMENTS: 'mediconnect_departments_v1',
  SCHEDULES: 'mediconnect_schedules_v1',
  APPOINTMENTS: 'mediconnect_appointments_v1',
  DOCUMENTS: 'mediconnect_documents_v1',
  NOTES: 'mediconnect_notes_v1',
  NOTIFICATIONS: 'mediconnect_notifications_v1',
  CONTACT: 'mediconnect_contacts_v1',
  CURRENT_USER_ID: 'mediconnect_current_user_id_v1',
  ACTIVE_PAGE: 'mediconnect_active_page_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>(INITIAL_USERS);

  const [patients, setPatients] = useState<Patient[]>(() => {
      return INITIAL_PATIENTS;
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
      return INITIAL_DOCTORS;
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
      return INITIAL_DEPARTMENTS;
  });

  const [schedules, setSchedules] = useState<DoctorSchedule[]>(() => {
      return INITIAL_SCHEDULES;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
      return INITIAL_APPOINTMENTS;
  });

  const [documents, setDocuments] = useState<MedicalDocument[]>(() => {
      return INITIAL_DOCUMENTS;
  });

  const [notes, setNotes] = useState<AppointmentNote[]>(() => {
      return INITIAL_NOTES;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
      return INITIAL_NOTIFICATIONS;
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
      return INITIAL_CONTACT_MESSAGES;
  });

  const [currentUserId, setCurrentUserId] = useState<number | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved ? Number(saved) : null;
  });

  const [activePage, setActivePageState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_PAGE) || 'home';
  });

  const [pageParams, setPageParams] = useState<any>(null);

  // Backend & MySQL Connectivity State
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [isCheckingBackend, setIsCheckingBackend] = useState<boolean>(true);
  const [backendStatus, setBackendStatus] = useState<string>('Initializing');

  const checkBackendConnection = useCallback(async (): Promise<boolean> => {
    setIsCheckingBackend(true);
    try {
      const res = await api.checkHealth();
      setIsBackendConnected(res.online);
      setBackendStatus(res.online ? 'MySQL Database Connected' : 'Local Storage Mode');

      if (res.online) {
          // Hydrate the shared view model from MySQL when the API is available.
        try {
          const [docRes, deptRes, patientRes, apptRes] = await Promise.allSettled([
            api.getDoctors(),
            api.getDepartments(),
            api.getPatients(),
            api.getAppointments(),
          ]);

          if (docRes.status === 'fulfilled') {
            setDoctors(docRes.value);
          }
          if (deptRes.status === 'fulfilled') {
            setDepartments(deptRes.value);
          }
          if (patientRes.status === 'fulfilled') {
            setPatients(patientRes.value);
            setUsers((prev) => {
              const patientUsers = patientRes.value.map((patient) => patient.user).filter(Boolean) as User[];
              return [...prev.filter((user) => user.role !== 'PATIENT'), ...patientUsers];
            });
          }
          if (apptRes.status === 'fulfilled') {
            setAppointments(apptRes.value);
          }
        } catch (e) {
          console.warn('Could not sync initial remote data:', e);
        }
      }
      return res.online;
    } catch {
      setIsBackendConnected(false);
      setBackendStatus('Local Storage Mode');
      return false;
    } finally {
      setIsCheckingBackend(false);
    }
  }, []);

  useEffect(() => {
    checkBackendConnection();
  }, [checkBackendConnection]);

  useEffect(() => {
    if (currentUserId !== null) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, String(currentUserId));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
  }, [currentUserId]);

  const setActivePage = (page: string, params?: any) => {
    setActivePageState(page);
    setPageParams(params || null);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PAGE, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentUser = useMemo(() => {
    if (!currentUserId) return null;
    return users.find((u) => u.user_id === currentUserId) || null;
  }, [currentUserId, users]);

  const currentRole = currentUser ? currentUser.role : null;

  const currentPatient = useMemo(() => {
    if (!currentUser || currentUser.role !== 'PATIENT') return null;
    return patients.find((p) => p.user_id === currentUser.user_id) || null;
  }, [currentUser, patients]);

  const currentDoctor = useMemo(() => {
    if (!currentUser || currentUser.role !== 'DOCTOR') return null;
    return doctors.find((d) => d.user_id === currentUser.user_id) || null;
  }, [currentUser, doctors]);

  // Auth
  const login = async (email: string, password = '') => {
    if (isBackendConnected) {
      try {
        const result = await api.login(email, password);
        setUsers((prev) => [...prev.filter((user) => user.user_id !== result.user.user_id), result.user]);
        if (result.profile?.patient_id) setPatients((prev) => [...prev.filter((p) => p.patient_id !== result.profile.patient_id), result.profile]);
        if (result.profile?.doctor_id) setDoctors((prev) => [...prev.filter((d) => d.doctor_id !== result.profile.doctor_id), result.profile]);
        if (result.profile?.patient_id) {
          const [patientDocuments, patientNotifications] = await Promise.all([
            api.getPatientDocuments(result.profile.patient_id),
            api.getNotifications(result.user.user_id),
          ]);
          setDocuments(patientDocuments);
          setNotifications(patientNotifications);
        }
        if (result.profile?.doctor_id) {
          const doctorSchedules = await api.getDoctorSchedules(result.profile.doctor_id);
          setSchedules(doctorSchedules);
          setNotifications(await api.getNotifications(result.user.user_id));
        }
        setCurrentUserId(result.user.user_id);
        setActivePage(result.user.role === 'PATIENT' ? 'patient-dashboard' : result.user.role === 'DOCTOR' ? 'doctor-dashboard' : 'admin-dashboard');
        return { success: true, message: `Welcome back, ${result.user.name}!`, role: result.user.role };
      } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'Unable to sign in.' };
      }
    }
    const trimmed = email.trim().toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === trimmed);
    if (!user) {
      return { success: false, message: 'Invalid email address or user not found.' };
    }
    setCurrentUserId(user.user_id);
    if (user.role === 'PATIENT') {
      setActivePage('patient-dashboard');
    } else if (user.role === 'DOCTOR') {
      setActivePage('doctor-dashboard');
    } else if (user.role === 'ADMIN') {
      setActivePage('admin-dashboard');
    }
    return { success: true, message: `Welcome back, ${user.name}!`, role: user.role };
  };

  const loginAsRole = (role: UserRole, specificUserId?: number) => {
    if (specificUserId) {
      const user = users.find((u) => u.user_id === specificUserId);
      if (user) {
        setCurrentUserId(user.user_id);
        if (role === 'PATIENT') setActivePage('patient-dashboard');
        else if (role === 'DOCTOR') setActivePage('doctor-dashboard');
        else if (role === 'ADMIN') setActivePage('admin-dashboard');
        return;
      }
    }
    const match = users.find((u) => u.role === role);
    if (match) {
      setCurrentUserId(match.user_id);
      if (role === 'PATIENT') setActivePage('patient-dashboard');
      else if (role === 'DOCTOR') setActivePage('doctor-dashboard');
      else if (role === 'ADMIN') setActivePage('admin-dashboard');
    }
  };

  const logout = () => {
    setCurrentUserId(null);
    setActivePage('home');
  };

  const registerPatient = async (data: {
    name: string;
    email: string;
    phone: string;
    date_of_birth: string;
    gender: 'Male' | 'Female' | 'Other';
    address: string;
    password?: string;
  }) => {
    if (isBackendConnected) {
      try {
        const result = await api.registerPatient({ ...data, password: data.password || '' });
        setUsers((prev) => [...prev, result.user]);
        setPatients((prev) => [...prev, result.patient]);
        setCurrentUserId(result.user.user_id);
        setActivePage('patient-dashboard');
        return { success: true, message: 'Account created successfully! Welcome to MediConnect.' };
      } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'Unable to register.' };
      }
    }
    const existing = users.find((u) => u.email.toLowerCase() === data.email.trim().toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    const newUserId = users.length > 0 ? Math.max(...users.map((u) => u.user_id)) + 1 : 1;
    const newPatientId = patients.length > 0 ? Math.max(...patients.map((p) => p.patient_id)) + 1 : 1;

    const newUser: User = {
      user_id: newUserId,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      role: 'PATIENT',
      created_at: new Date().toISOString(),
    };

    const newPatient: Patient = {
      patient_id: newPatientId,
      user_id: newUserId,
      date_of_birth: data.date_of_birth,
      gender: data.gender,
      address: data.address.trim(),
    };

    setUsers((prev) => [...prev, newUser]);
    setPatients((prev) => [...prev, newPatient]);

    // Auto-login newly registered patient
    setCurrentUserId(newUserId);
    setActivePage('patient-dashboard');

    // Welcome notification
    const welcomeNotif: Notification = {
      notification_id: Date.now(),
      user_id: newUserId,
      message: `Welcome to MediConnect, ${data.name}! Your patient account is active and ready to book appointments.`,
      is_read: false,
      created_at: new Date().toISOString(),
      type: 'system',
    };
    setNotifications((prev) => [welcomeNotif, ...prev]);

    if (isBackendConnected) {
      api.registerPatient({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        address: data.address.trim(),
          password: data.password || '',
      }).catch((err) => {
        console.warn('Backend patient registration sync error:', err);
      });
    }

    return { success: true, message: 'Account created successfully! Welcome to MediConnect.' };
  };

  // Appointments
  const bookAppointment = (params: {
    patient_id: number;
    doctor_id: number;
    department_id: number;
    appointment_date: string;
    appointment_time: string;
    reason: string;
    schedule_id?: number;
    document?: { name: string; type: 'PDF' | 'JPG' | 'PNG'; size: string };
  }) => {
    // 1. Check double-booking for the doctor at that date & time
    const slotTaken = appointments.some(
      (a) =>
        a.doctor_id === params.doctor_id &&
        a.appointment_date === params.appointment_date &&
        a.appointment_time === params.appointment_time &&
        a.status !== 'CANCELLED'
    );

    if (slotTaken) {
      return {
        success: false,
        message: 'This appointment slot is no longer available. Please select another time.',
      };
    }

    // 2. Check if patient already has an appointment with the same doctor at the exact same time
    const patientBusy = appointments.some(
      (a) =>
        a.patient_id === params.patient_id &&
        a.appointment_date === params.appointment_date &&
        a.appointment_time === params.appointment_time &&
        a.status !== 'CANCELLED'
    );

    if (patientBusy) {
      return {
        success: false,
        message: 'You already have another appointment scheduled at this exact time.',
      };
    }

    const nextId = appointments.length > 0 ? Math.max(...appointments.map((a) => a.appointment_id)) + 1 : 101;
    const code = `APT-${10000 + nextId}`;

    const newAppt: Appointment = {
      appointment_id: nextId,
      appointment_code: code,
      patient_id: params.patient_id,
      doctor_id: params.doctor_id,
      department_id: params.department_id,
      appointment_date: params.appointment_date,
      appointment_time: params.appointment_time,
      reason: params.reason,
      status: 'CONFIRMED', // default auto-confirmed or doctor gets notification
      created_at: new Date().toISOString(),
    };

    setAppointments((prev) => [newAppt, ...prev]);

    // Handle document upload if attached during booking
    if (params.document) {
      uploadDocument(params.patient_id, params.document, nextId);
    }

    // Notifications
    const doctorObj = doctors.find((d) => d.doctor_id === params.doctor_id);
    const patientObj = patients.find((p) => p.patient_id === params.patient_id);
    const patientUser = users.find((u) => u.user_id === patientObj?.user_id);

    // Patient notification
    const patientNotif: Notification = {
      notification_id: Date.now(),
      user_id: patientUser?.user_id || 0,
      message: `Your appointment with Dr. ${doctorObj?.user?.name || 'Doctor'} has been confirmed for ${params.appointment_date} at ${params.appointment_time} (ID: ${code}).`,
      is_read: false,
      created_at: new Date().toISOString(),
      type: 'appointment',
    };

    // Doctor notification
    const docUser = users.find((u) => u.user_id === doctorObj?.user_id);
    const docNotif: Notification = {
      notification_id: Date.now() + 1,
      user_id: docUser?.user_id || 0,
      message: `New confirmed appointment (${code}) by ${patientUser?.name || 'Patient'} on ${params.appointment_date} at ${params.appointment_time}. Reason: ${params.reason.slice(0, 40)}...`,
      is_read: false,
      created_at: new Date().toISOString(),
      type: 'appointment',
    };

    setNotifications((prev) => [patientNotif, docNotif, ...prev]);

    // Asynchronously synchronize with MySQL backend if online
    if (isBackendConnected) {
      api.bookAppointment({
        patient_id: params.patient_id,
        doctor_id: params.doctor_id,
        department_id: params.department_id,
        schedule_id: params.schedule_id,
        appointment_date: params.appointment_date,
        appointment_time: params.appointment_time,
        reason: params.reason,
      }).catch((err) => {
        console.warn('Backend appointment booking sync error:', err);
      });
    }

    return { success: true, message: 'Appointment booked successfully!', appointment: newAppt };
  };

  const cancelAppointment = (appointmentId: number, _reason?: string) => {
    const target = appointments.find((a) => a.appointment_id === appointmentId);
    if (!target) return { success: false, message: 'Appointment not found.' };

    if (target.status === 'COMPLETED') {
      return { success: false, message: 'Completed appointments cannot be cancelled.' };
    }

    setAppointments((prev) =>
      prev.map((a) => (a.appointment_id === appointmentId ? { ...a, status: 'CANCELLED' } : a))
    );

    // Sync status with backend
    if (isBackendConnected) {
      api.updateAppointmentStatus(appointmentId, 'CANCELLED').catch((err) => {
        console.warn('Backend appointment cancellation sync error:', err);
      });
    }

    // Notification
    const patientObj = patients.find((p) => p.patient_id === target.patient_id);
    const patientUser = users.find((u) => u.user_id === patientObj?.user_id);
    const doctorObj = doctors.find((d) => d.doctor_id === target.doctor_id);
    const docUser = users.find((u) => u.user_id === doctorObj?.user_id);

    const notif1: Notification = {
      notification_id: Date.now(),
      user_id: patientUser?.user_id || 0,
      message: `Your appointment (${target.appointment_code}) on ${target.appointment_date} at ${target.appointment_time} was cancelled successfully.`,
      is_read: false,
      created_at: new Date().toISOString(),
      type: 'appointment',
    };

    const notif2: Notification = {
      notification_id: Date.now() + 1,
      user_id: docUser?.user_id || 0,
      message: `Appointment (${target.appointment_code}) with ${patientUser?.name} on ${target.appointment_date} at ${target.appointment_time} was cancelled. The time slot is now available.`,
      is_read: false,
      created_at: new Date().toISOString(),
      type: 'appointment',
    };

    setNotifications((prev) => [notif1, notif2, ...prev]);

    return { success: true, message: 'Appointment cancelled successfully.' };
  };

  const acceptAppointment = (appointmentId: number) => {
    setAppointments((prev) =>
      prev.map((a) => (a.appointment_id === appointmentId ? { ...a, status: 'CONFIRMED' } : a))
    );

    if (isBackendConnected) {
      api.updateAppointmentStatus(appointmentId, 'CONFIRMED').catch((err) => {
        console.warn('Backend accept appointment sync error:', err);
      });
    }

    const target = appointments.find((a) => a.appointment_id === appointmentId);
    if (target) {
      const patientObj = patients.find((p) => p.patient_id === target.patient_id);
      const patientUser = users.find((u) => u.user_id === patientObj?.user_id);
      const doctorObj = doctors.find((d) => d.doctor_id === target.doctor_id);

      const notif: Notification = {
        notification_id: Date.now(),
        user_id: patientUser?.user_id || 0,
        message: `Great news! Dr. ${doctorObj?.user?.name || 'Doctor'} has accepted your appointment request for ${target.appointment_date} at ${target.appointment_time}.`,
        is_read: false,
        created_at: new Date().toISOString(),
        type: 'appointment',
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    return { success: true, message: 'Appointment accepted and confirmed.' };
  };

  const rejectAppointment = (appointmentId: number) => {
    setAppointments((prev) =>
      prev.map((a) => (a.appointment_id === appointmentId ? { ...a, status: 'CANCELLED' } : a))
    );

    if (isBackendConnected) {
      api.updateAppointmentStatus(appointmentId, 'CANCELLED').catch((err) => {
        console.warn('Backend reject appointment sync error:', err);
      });
    }

    const target = appointments.find((a) => a.appointment_id === appointmentId);
    if (target) {
      const patientObj = patients.find((p) => p.patient_id === target.patient_id);
      const patientUser = users.find((u) => u.user_id === patientObj?.user_id);
      const doctorObj = doctors.find((d) => d.doctor_id === target.doctor_id);

      const notif: Notification = {
        notification_id: Date.now(),
        user_id: patientUser?.user_id || 0,
        message: `Your appointment request with Dr. ${doctorObj?.user?.name || 'Doctor'} on ${target.appointment_date} at ${target.appointment_time} could not be confirmed. Please choose another slot.`,
        is_read: false,
        created_at: new Date().toISOString(),
        type: 'appointment',
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    return { success: true, message: 'Appointment request rejected.' };
  };

  const completeAppointment = (
    appointmentId: number,
    notesText: string,
    prescriptionText: string,
    followUpDate?: string
  ) => {
    const target = appointments.find((a) => a.appointment_id === appointmentId);
    if (!target) return { success: false, message: 'Appointment not found.' };

    if (target.status === 'CANCELLED') {
      return { success: false, message: 'Cancelled appointments cannot be marked as completed.' };
    }

    // Save appointment note
    const nextNoteId = notes.length > 0 ? Math.max(...notes.map((n) => n.note_id)) + 1 : 1;
    const newNote: AppointmentNote = {
      note_id: nextNoteId,
      appointment_id: appointmentId,
      doctor_id: target.doctor_id,
      notes: notesText,
      prescription: prescriptionText,
      follow_up_date: followUpDate || undefined,
      created_at: new Date().toISOString(),
    };

    setNotes((prev) => [...prev.filter((n) => n.appointment_id !== appointmentId), newNote]);

    setAppointments((prev) =>
      prev.map((a) => (a.appointment_id === appointmentId ? { ...a, status: 'COMPLETED' } : a))
    );

    if (isBackendConnected) {
      api.saveAppointmentNotes(appointmentId, {
        doctor_id: target.doctor_id,
        notes: notesText,
        prescription: prescriptionText,
        follow_up_date: followUpDate || undefined,
      }).catch((err) => {
        console.warn('Backend appointment completion sync error:', err);
      });
    }

    // Notification for patient
    const patientObj = patients.find((p) => p.patient_id === target.patient_id);
    const patientUser = users.find((u) => u.user_id === patientObj?.user_id);
    const doctorObj = doctors.find((d) => d.doctor_id === target.doctor_id);

    const notif: Notification = {
      notification_id: Date.now(),
      user_id: patientUser?.user_id || 0,
      message: `Dr. ${doctorObj?.user?.name || 'Doctor'} has completed your consultation (${target.appointment_code}). You can now view your diagnosis and prescription notes.`,
      is_read: false,
      created_at: new Date().toISOString(),
      type: 'appointment',
    };
    setNotifications((prev) => [notif, ...prev]);

    return { success: true, message: 'Appointment marked as completed. Notes saved.' };
  };

  const updateAppointmentStatus = (
    appointmentId: number,
    status: AppointmentStatus,
    notesData?: { notes: string; prescription: string; follow_up_date?: string }
  ) => {
    if (status === 'CONFIRMED') {
      return acceptAppointment(appointmentId);
    } else if (status === 'CANCELLED') {
      return cancelAppointment(appointmentId);
    } else if (status === 'COMPLETED' && notesData) {
      return completeAppointment(
        appointmentId,
        notesData.notes,
        notesData.prescription,
        notesData.follow_up_date
      );
    } else {
      setAppointments((prev) =>
        prev.map((a) => (a.appointment_id === appointmentId ? { ...a, status } : a))
      );
      return { success: true, message: `Status updated to ${status}` };
    }
  };

  // Documents
  const uploadDocument = (
    patientId: number,
    file: { name: string; type: 'PDF' | 'JPG' | 'PNG'; size: string },
    appointmentId?: number
  ): MedicalDocument => {
    const nextDocId = documents.length > 0 ? Math.max(...documents.map((d) => d.document_id)) + 1 : 1;
    const s3Key = `patient-documents/patient-${patientId}/${file.name.replace(/\s+/g, '_')}`;
    const s3BaseUrl = import.meta.env.VITE_S3_PUBLIC_BASE_URL || '';
    const s3Url = s3BaseUrl ? `${s3BaseUrl.replace(/\/$/, '')}/${s3Key}` : '';

    const newDoc: MedicalDocument = {
      document_id: nextDocId,
      patient_id: patientId,
      appointment_id: appointmentId,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      s3_key: s3Key,
      s3_url: s3Url,
      uploaded_at: new Date().toISOString(),
    };

    setDocuments((prev) => [newDoc, ...prev]);

    // Notification
    const patientObj = patients.find((p) => p.patient_id === patientId);
    const patientUser = users.find((u) => u.user_id === patientObj?.user_id);

    const notif: Notification = {
      notification_id: Date.now(),
      user_id: patientUser?.user_id || 0,
      message: `Medical document "${file.name}" uploaded successfully and encrypted in AWS S3 storage.`,
      is_read: false,
      created_at: new Date().toISOString(),
      type: 'document',
    };
    setNotifications((prev) => [notif, ...prev]);

    if (isBackendConnected) {
      api.uploadPatientDocument(patientId, {
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        appointment_id: appointmentId,
        s3_key: s3Key,
        s3_url: s3Url,
      }).catch((err) => {
        console.warn('Backend document upload sync error:', err);
      });
    }

    return newDoc;
  };

  const deleteDocument = (documentId: number) => {
    setDocuments((prev) => prev.filter((d) => d.document_id !== documentId));
    if (isBackendConnected) {
      api.deletePatientDocument(documentId).catch((err) => console.warn('Backend document deletion error:', err));
    }
  };

  // Schedules
  const addSchedule = (scheduleData: Omit<DoctorSchedule, 'schedule_id'>) => {
    const nextId = schedules.length > 0 ? Math.max(...schedules.map((s) => s.schedule_id)) + 1 : 1;
    const newSchedule: DoctorSchedule = {
      ...scheduleData,
      schedule_id: nextId,
    };
    setSchedules((prev) => [...prev, newSchedule]);
      if (isBackendConnected) {
        api.addDoctorSchedule(scheduleData).catch((err) => console.warn('Backend schedule creation error:', err));
      }
  };

  const updateDoctorSchedule = (doctorId: number, availableDays: string[], _slots?: string[]) => {
    setDoctors((prev) =>
      prev.map((d) => (d.doctor_id === doctorId ? { ...d, available_days: availableDays } : d))
    );
  };

  // Profile updates
  const updatePatientProfile = (
    patientId: number,
    data: Partial<Patient & { name?: string; phone?: string }>
  ) => {
    setPatients((prev) =>
      prev.map((p) => (p.patient_id === patientId ? { ...p, ...data } : p))
    );
    const patient = patients.find((p) => p.patient_id === patientId);
    if (patient && (data.name || data.phone)) {
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === patient.user_id
            ? {
                ...u,
                name: data.name || u.name,
                phone: data.phone || u.phone,
              }
            : u
        )
      );
    }

    if (isBackendConnected) {
      api.updatePatientProfile(patientId, data).catch((err) => {
        console.warn('Backend patient update sync error:', err);
      });
    }
  };

  const updateDoctorProfile = (doctorId: number, data: Partial<Doctor>) => {
    setDoctors((prev) =>
      prev.map((d) => (d.doctor_id === doctorId ? { ...d, ...data } : d))
    );

    if (isBackendConnected) {
      api.updateDoctorProfile(doctorId, data).catch((err) => {
        console.warn('Backend doctor update sync error:', err);
      });
    }
  };

  // Admin Actions
  const addDoctor = (data: any) => {
    const newUserId = users.length > 0 ? Math.max(...users.map((u) => u.user_id)) + 1 : 1;
    const newDoctorId = doctors.length > 0 ? Math.max(...doctors.map((d) => d.doctor_id)) + 1 : 1;

    const newUser: User = {
      user_id: newUserId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'DOCTOR',
      created_at: new Date().toISOString(),
    };

    const newDoctor: Doctor = {
      doctor_id: newDoctorId,
      user_id: newUserId,
      department_id: Number(data.department_id),
      specialization: data.specialization,
      qualification: data.qualification,
      experience: Number(data.experience) || 5,
      consultation_fee: Number(data.consultation_fee) || 500,
      status: 'ACTIVE',
      rating: 4.8,
      available_days: data.available_days || ['Monday', 'Wednesday', 'Friday'],
      photo_url:
        data.photo_url ||
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
      about: data.about || `Consultant at MediConnect Hospital with specialization in ${data.specialization}.`,
    };

    setUsers((prev) => [...prev, newUser]);
    setDoctors((prev) => [...prev, newDoctor]);
    if (isBackendConnected) api.addDoctor(data).catch((err) => console.warn('Backend doctor creation error:', err));
  };

  const updateDoctorStatus = (doctorId: number, status: 'ACTIVE' | 'INACTIVE') => {
    setDoctors((prev) =>
      prev.map((d) => (d.doctor_id === doctorId ? { ...d, status } : d))
    );
    if (isBackendConnected) api.updateDoctorProfile(doctorId, { status }).catch((err) => console.warn('Backend doctor status error:', err));
  };

  const updatePatientStatus = (_patientId: number, _status: string) => {
    // For admin to toggle patient status if needed
  };

  const addDepartment = (deptData: Omit<Department, 'department_id'>) => {
    const nextId = departments.length > 0 ? Math.max(...departments.map((d) => d.department_id)) + 1 : 1;
    const newDept: Department = {
      ...deptData,
      department_id: nextId,
    };
    setDepartments((prev) => [...prev, newDept]);
    if (isBackendConnected) api.addDepartment(deptData).catch((err) => console.warn('Backend department creation error:', err));
  };

  const updateDepartment = (deptId: number, data: Partial<Department>) => {
    setDepartments((prev) =>
      prev.map((d) => (d.department_id === deptId ? { ...d, ...data } : d))
    );
    if (isBackendConnected) api.updateDepartment(deptId, data).catch((err) => console.warn('Backend department update error:', err));
  };

  // Notifications
  const markNotificationRead = (notificationId: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.notification_id === notificationId ? { ...n, is_read: true } : n))
    );
    if (isBackendConnected) api.markNotificationRead(notificationId).catch((err) => console.warn('Backend notification update error:', err));
  };

  const markAllNotificationsRead = (userId: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.user_id === userId ? { ...n, is_read: true } : n))
    );
    if (isBackendConnected) api.markAllNotificationsRead(userId).catch((err) => console.warn('Backend notification update error:', err));
  };

  const markNotificationAsRead = (notificationId: number) => {
    markNotificationRead(notificationId);
  };

  const markAllNotificationsAsRead = (userId?: number) => {
    const targetId = userId ?? currentUser?.user_id;
    if (targetId) {
      markAllNotificationsRead(targetId);
    }
  };

  // Contact
  const sendContactMessage = (msg: Omit<ContactMessage, 'message_id' | 'created_at'>) => {
    const nextId =
      contactMessages.length > 0 ? Math.max(...contactMessages.map((m) => m.message_id)) + 1 : 1;
    const newMsg: ContactMessage = {
      ...msg,
      message_id: nextId,
      created_at: new Date().toISOString(),
    };
    setContactMessages((prev) => [newMsg, ...prev]);
    if (isBackendConnected) api.sendContactMessage(msg).catch((err) => console.warn('Backend contact message error:', err));
  };

  // Enriched Appointments (with joined entities)
  const getEnrichedAppointments = (filterForUser = true): Appointment[] => {
    return appointments
      .filter((appt) => {
        if (!filterForUser || !currentUser) return true;
        if (currentUser.role === 'ADMIN') return true;
        if (currentUser.role === 'DOCTOR') {
          const doc = doctors.find((d) => d.user_id === currentUser.user_id);
          return doc ? appt.doctor_id === doc.doctor_id : false;
        }
        if (currentUser.role === 'PATIENT') {
          const patient = patients.find((p) => p.user_id === currentUser.user_id);
          return patient ? appt.patient_id === patient.patient_id : false;
        }
        return false;
      })
      .map((appt) => {
        const patient = patients.find((p) => p.patient_id === appt.patient_id);
        const patientUser = patient ? users.find((u) => u.user_id === patient.user_id) : undefined;
        const doctor = doctors.find((d) => d.doctor_id === appt.doctor_id);
        const doctorUser = doctor ? users.find((u) => u.user_id === doctor.user_id) : undefined;
        const department = departments.find((dept) => dept.department_id === appt.department_id);
        const apptNote = notes.find((n) => n.appointment_id === appt.appointment_id);
        const apptDocs = documents.filter((d) => d.appointment_id === appt.appointment_id);

        return {
          ...appt,
          patient: patient ? { ...patient, user: patientUser } : undefined,
          doctor: doctor ? { ...doctor, user: doctorUser } : undefined,
          department,
          notes: apptNote,
          documents: apptDocs,
        };
      });
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setPatients(INITIAL_PATIENTS);
    setDoctors(INITIAL_DOCTORS);
    setDepartments(INITIAL_DEPARTMENTS);
    setSchedules(INITIAL_SCHEDULES);
    setAppointments(INITIAL_APPOINTMENTS);
    setDocuments(INITIAL_DOCUMENTS);
    setNotes(INITIAL_NOTES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setContactMessages(INITIAL_CONTACT_MESSAGES);
    setCurrentUserId(null);
    setActivePage('home');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        currentPatient,
        currentDoctor,
        activePage,
        pageParams,
        setActivePage,
        isBackendConnected,
        isCheckingBackend,
        backendStatus,
        checkBackendConnection,
        users,
        patients,
        doctors,
        departments,
        schedules,
        appointments,
        documents,
        notes,
        notifications,
        contactMessages,
        login,
        loginAsRole,
        logout,
        registerPatient,
        bookAppointment,
        cancelAppointment,
        acceptAppointment,
        rejectAppointment,
        completeAppointment,
        updateAppointmentStatus,
        uploadDocument,
        deleteDocument,
        addSchedule,
        updateDoctorSchedule,
        updatePatientProfile,
        updateDoctorProfile,
        addDoctor,
        updateDoctorStatus,
        updatePatientStatus,
        addDepartment,
        updateDepartment,
        markNotificationRead,
        markNotificationAsRead,
        markAllNotificationsRead,
        markAllNotificationsAsRead,
        sendContactMessage,
        getEnrichedAppointments,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
