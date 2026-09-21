import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Public Views
import { HomePage } from './components/public/HomePage';
import { DoctorsPage } from './components/public/DoctorsPage';
import { DepartmentsPage } from './components/public/DepartmentsPage';
import { AboutPage } from './components/public/AboutPage';
import { ContactPage } from './components/public/ContactPage';

// Auth Views
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';

// Patient Views
import { PatientDashboard } from './components/patient/PatientDashboard';
import { PatientBookAppointment } from './components/patient/PatientBookAppointment';
import { PatientAppointments } from './components/patient/PatientAppointments';
import { PatientDocuments } from './components/patient/PatientDocuments';
import { PatientProfile } from './components/patient/PatientProfile';
import { PatientNotifications } from './components/patient/PatientNotifications';

// Doctor Views
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { DoctorAppointments } from './components/doctor/DoctorAppointments';
import { DoctorSchedule } from './components/doctor/DoctorSchedule';
import { DoctorProfile } from './components/doctor/DoctorProfile';

// Admin Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminAppointments } from './components/admin/AdminAppointments';
import { AdminDoctors } from './components/admin/AdminDoctors';
import { AdminPatients } from './components/admin/AdminPatients';
import { AdminDepartments } from './components/admin/AdminDepartments';

import { AwsCloudArchitectureModal } from './components/common/AwsCloudArchitectureModal';
import { ShieldAlert, LogIn, UserCheck } from 'lucide-react';

const MainRouter: React.FC = () => {
  const { activePage, currentUser, setActivePage, loginAsRole } = useApp();
  const [cloudModalOpen, setCloudModalOpen] = React.useState(false);

  // Route Protection
  const renderCurrentPage = () => {
    // 1. Patient routes protection
    if (activePage.startsWith('patient-')) {
      if (!currentUser) {
        return (
          <div className="max-w-lg mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <LogIn className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Patient Login Required</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Please sign in to book consultations, upload medical documents to AWS S3, and view your prescription records.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setActivePage('login', { redirect: activePage })}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Sign In to Continue
              </button>
              <button
                onClick={() => loginAsRole('PATIENT')}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                1-Click Demo Patient
              </button>
            </div>
          </div>
        );
      }

      switch (activePage) {
        case 'patient-dashboard':
          return <PatientDashboard />;
        case 'patient-book':
          return <PatientBookAppointment />;
        case 'patient-appointments':
          return <PatientAppointments />;
        case 'patient-documents':
          return <PatientDocuments />;
        case 'patient-profile':
          return <PatientProfile />;
        case 'patient-notifications':
          return <PatientNotifications />;
      }
    }

    // 2. Doctor routes protection
    if (activePage.startsWith('doctor-')) {
      if (!currentUser || (currentUser.role !== 'DOCTOR' && currentUser.role !== 'ADMIN')) {
        return (
          <div className="max-w-lg mx-auto my-16 p-8 bg-white rounded-3xl border border-amber-200 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Doctor Access Required</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              The clinical management portal is restricted to authorized physicians and department specialists.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => loginAsRole('DOCTOR', 2)}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                1-Click Switch: Dr. Anjali Menon
              </button>
              <button
                onClick={() => setActivePage('login')}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Sign In with Doctor ID
              </button>
            </div>
          </div>
        );
      }

      switch (activePage) {
        case 'doctor-dashboard':
          return <DoctorDashboard />;
        case 'doctor-appointments':
          return <DoctorAppointments />;
        case 'doctor-schedule':
          return <DoctorSchedule />;
        case 'doctor-profile':
          return <DoctorProfile />;
      }
    }

    // 3. Admin routes protection
    if (activePage.startsWith('admin-')) {
      if (!currentUser || currentUser.role !== 'ADMIN') {
        return (
          <div className="max-w-lg mx-auto my-16 p-8 bg-white rounded-3xl border border-purple-200 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Administrator Access Required</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Hospital administrative analytics, user databases, and AWS RDS/S3 operational controls are restricted to administrators.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => loginAsRole('ADMIN')}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                1-Click Switch: Hospital Admin
              </button>
              <button
                onClick={() => setActivePage('login')}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Admin Sign In
              </button>
            </div>
          </div>
        );
      }

      switch (activePage) {
        case 'admin-dashboard':
          return <AdminDashboard />;
        case 'admin-appointments':
          return <AdminAppointments />;
        case 'admin-doctors':
          return <AdminDoctors />;
        case 'admin-patients':
          return <AdminPatients />;
        case 'admin-departments':
          return <AdminDepartments />;
      }
    }

    // 4. Public and Auth Routes
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'doctors':
        return <DoctorsPage />;
      case 'departments':
        return <DepartmentsPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar onOpenCloudModal={() => setCloudModalOpen(true)} />
      <main className="flex-1 w-full">{renderCurrentPage()}</main>
      <Footer onOpenCloudModal={() => setCloudModalOpen(true)} />
      <AwsCloudArchitectureModal
        isOpen={cloudModalOpen}
        onClose={() => setCloudModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
