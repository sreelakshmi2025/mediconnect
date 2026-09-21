import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  Calendar,
  FileText,
  Bell,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Cloud,
  ChevronDown,
  CheckCircle,
  Stethoscope,
  ShieldCheck,
  Building2,
  Clock,
  ExternalLink,
  Database,
  RefreshCw,
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenCloudModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCloudModal }) => {
  const {
    currentUser,
    currentRole,
    activePage,
    setActivePage,
    logout,
    loginAsRole,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    currentPatient,
    isBackendConnected,
    isCheckingBackend,
    backendStatus,
    checkBackendConnection,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const userNotifs = currentUser
    ? notifications.filter((n) => n.user_id === currentUser.user_id)
    : [];
  const unreadCount = userNotifs.filter((n) => !n.is_read).length;

  const navigate = (page: string) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    setNotifDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            id="brand-logo-btn"
            onClick={() => navigate('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold text-slate-900 tracking-tight">MediConnect</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Cloud
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Healthcare made simpler</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {!currentUser && (
              <>
                <button
                  id="nav-home-btn"
                  onClick={() => navigate('home')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    activePage === 'home' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Home
                </button>
                <button
                  id="nav-doctors-btn"
                  onClick={() => navigate('doctors')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    activePage === 'doctors' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Doctors
                </button>
                <button
                  id="nav-departments-btn"
                  onClick={() => navigate('departments')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    activePage === 'departments' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Departments
                </button>
                <button
                  id="nav-about-btn"
                  onClick={() => navigate('about')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    activePage === 'about' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  About
                </button>
                <button
                  id="nav-contact-btn"
                  onClick={() => navigate('contact')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    activePage === 'contact' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Contact
                </button>
              </>
            )}

            {/* Patient Links */}
            {currentRole === 'PATIENT' && (
              <>
                <button
                  id="nav-patient-dash"
                  onClick={() => navigate('patient-dashboard')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    activePage === 'patient-dashboard' ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  id="nav-patient-book"
                  onClick={() => navigate('patient-book')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                    activePage === 'patient-book' ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Book Appointment
                </button>
                <button
                  id="nav-patient-appts"
                  onClick={() => navigate('patient-appointments')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    activePage === 'patient-appointments' ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  My Appointments
                </button>
                <button
                  id="nav-patient-docs"
                  onClick={() => navigate('patient-documents')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                    activePage === 'patient-documents' ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-4 h-4 text-teal-600" />
                  Documents
                </button>
                <button
                  id="nav-patient-find-doc"
                  onClick={() => navigate('doctors')}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Find Doctors
                </button>
              </>
            )}

            {/* Doctor Links */}
            {currentRole === 'DOCTOR' && (
              <>
                <button
                  id="nav-doc-dash"
                  onClick={() => navigate('doctor-dashboard')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    activePage === 'doctor-dashboard' ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  id="nav-doc-sched"
                  onClick={() => navigate('doctor-schedule')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                    activePage === 'doctor-schedule' ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Clock className="w-4 h-4 text-blue-600" />
                  My Schedule
                </button>
                <button
                  id="nav-doc-patients"
                  onClick={() => navigate('doctor-patients')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                    activePage === 'doctor-patients' ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <UserIcon className="w-4 h-4 text-teal-600" />
                  My Patients
                </button>
              </>
            )}

            {/* Admin Links */}
            {currentRole === 'ADMIN' && (
              <>
                <button
                  id="nav-admin-dash"
                  onClick={() => navigate('admin-dashboard')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    activePage === 'admin-dashboard' ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Admin Overview
                </button>
                <button
                  id="nav-admin-docs"
                  onClick={() => navigate('admin-doctors')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    activePage === 'admin-doctors' ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Doctors
                </button>
                <button
                  id="nav-admin-patients"
                  onClick={() => navigate('admin-patients')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    activePage === 'admin-patients' ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Patients
                </button>
                <button
                  id="nav-admin-depts"
                  onClick={() => navigate('admin-departments')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    activePage === 'admin-departments' ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Departments
                </button>
                <button
                  id="nav-admin-appts"
                  onClick={() => navigate('admin-appointments')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    activePage === 'admin-appointments' ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  All Appointments
                </button>
                <button
                  id="nav-admin-reports"
                  onClick={() => navigate('admin-reports')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    activePage === 'admin-reports' ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Reports
                </button>
              </>
            )}
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-2.5">
            {/* Live Database / Express Backend Connectivity Badge */}
            <button
              id="backend-status-btn"
              onClick={onOpenCloudModal}
              title={`Database Status: ${backendStatus}. Click to inspect Express API & MySQL architecture.`}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                isBackendConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="relative flex h-2 w-2">
                {isBackendConnected && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isBackendConnected ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                ></span>
              </span>
              <Database className={`w-3.5 h-3.5 ${isBackendConnected ? 'text-emerald-600' : 'text-slate-500'}`} />
              <span className="hidden md:inline font-mono text-[11px]">
                {isCheckingBackend
                  ? 'Checking...'
                  : isBackendConnected
                  ? 'MySQL: Online'
                  : 'DB: Local Mode'}
              </span>
            </button>

            {/* AWS College Cloud Hub Button */}
            <button
              id="aws-cloud-hub-btn"
              onClick={onOpenCloudModal}
              title="View AWS Architecture & Project Documentation"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-800 border border-amber-300 hover:bg-amber-100/60 transition-all cursor-pointer shadow-2xs"
            >
              <Cloud className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">AWS Cloud Hub</span>
            </button>

            {/* Notification Bell (for logged-in users) */}
            {currentUser && (
              <div className="relative">
                <button
                  id="notification-bell-btn"
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-sm text-slate-800">Notifications</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                          {unreadCount} new
                        </span>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          id="mark-all-read-btn"
                          onClick={() => markAllNotificationsRead(currentUser.user_id)}
                          className="text-xs text-blue-600 hover:underline font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {userNotifs.length === 0 ? (
                        <div className="p-6 text-center text-sm text-slate-500">
                          No notifications yet.
                        </div>
                      ) : (
                        userNotifs.map((n) => (
                          <div
                            key={n.notification_id}
                            className={`p-3 text-xs transition-colors flex items-start gap-2.5 ${
                              n.is_read ? 'bg-white text-slate-600' : 'bg-blue-50/50 text-slate-800 font-medium'
                            }`}
                          >
                            <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-blue-600" />
                            <div className="flex-1">
                              <p className="leading-relaxed">{n.message}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            {!n.is_read && (
                              <button
                                onClick={() => markNotificationRead(n.notification_id)}
                                className="text-blue-600 hover:text-blue-800 shrink-0"
                                title="Mark as read"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-2 bg-slate-50 border-t border-slate-100 text-center">
                      <button
                        onClick={() => {
                          setNotifDropdownOpen(false);
                          if (currentRole === 'PATIENT') navigate('patient-notifications');
                        }}
                        className="text-xs text-slate-600 hover:text-blue-600 font-medium"
                      >
                        View all activity
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Logged in User Pill / Menu */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div
                  id="user-profile-btn"
                  onClick={() => {
                    if (currentRole === 'PATIENT') navigate('patient-profile');
                    else if (currentRole === 'DOCTOR') navigate('doctor-profile');
                  }}
                  className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-100 hover:bg-slate-200/80 rounded-full cursor-pointer transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[110px]">
                      {currentUser.name}
                    </p>
                    <span className="text-[10px] uppercase font-bold text-blue-600 block">
                      {currentUser.role}
                    </span>
                  </div>
                </div>

                <button
                  id="logout-btn"
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Fast Role Switcher Dropdown for Evaluation */}
                <div className="relative">
                  <button
                    id="quick-demo-role-btn"
                    onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
                  >
                    <span>Demo Login</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {roleDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 text-xs">
                      <div className="px-3 py-1.5 text-[11px] font-bold uppercase text-slate-400 border-b border-slate-100">
                        Select Demo Role
                      </div>
                      <button
                        onClick={() => {
                          loginAsRole('PATIENT');
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center gap-2 text-slate-700 hover:text-blue-700"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-blue-600" />
                        <div>
                          <div className="font-semibold">Patient Account</div>
                          <div className="text-[10px] text-slate-400">Rahul Kumar (East Fort)</div>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          loginAsRole('DOCTOR', 2);
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center gap-2 text-slate-700 hover:text-blue-700"
                      >
                        <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                        <div>
                          <div className="font-semibold">Doctor Account</div>
                          <div className="text-[10px] text-slate-400">Dr. Anjali Menon (Cardiology)</div>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          loginAsRole('ADMIN');
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center gap-2 text-slate-700 hover:text-blue-700"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                        <div>
                          <div className="font-semibold">Administrator</div>
                          <div className="text-[10px] text-slate-400">Hospital Admin</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                <button
                  id="login-page-btn"
                  onClick={() => navigate('login')}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </button>

                <button
                  id="register-page-btn"
                  onClick={() => navigate('register')}
                  className="px-3.5 py-1.5 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          {!currentUser ? (
            <>
              <button
                onClick={() => navigate('home')}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Home
              </button>
              <button
                onClick={() => navigate('doctors')}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Doctors
              </button>
              <button
                onClick={() => navigate('departments')}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Departments
              </button>
              <button
                onClick={() => navigate('about')}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                About MediConnect
              </button>
              <button
                onClick={() => navigate('contact')}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Contact
              </button>
            </>
          ) : currentRole === 'PATIENT' ? (
            <>
              <button
                onClick={() => navigate('patient-dashboard')}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('patient-book')}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-blue-600 bg-blue-50 font-semibold"
              >
                Book Appointment
              </button>
              <button
                onClick={() => navigate('patient-appointments')}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                My Appointments
              </button>
              <button
                onClick={() => navigate('patient-documents')}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Medical Documents (S3)
              </button>
              <button
                onClick={() => navigate('patient-profile')}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                My Profile
              </button>
            </>
          ) : currentRole === 'DOCTOR' ? (
            <>
              <button
                onClick={() => navigate('doctor-dashboard')}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('doctor-schedule')}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                My Schedules
              </button>
              <button
                onClick={() => navigate('doctor-patients')}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                My Patients
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('admin-dashboard')}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Admin Dashboard
              </button>
              <button
                onClick={() => navigate('admin-doctors')}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Doctors
              </button>
              <button
                onClick={() => navigate('admin-patients')}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Patients
              </button>
              <button
                onClick={() => navigate('admin-departments')}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Departments
              </button>
              <button
                onClick={() => navigate('admin-appointments')}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Appointments
              </button>
              <button
                onClick={() => navigate('admin-reports')}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Reports
              </button>
            </>
          )}

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                onOpenCloudModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-amber-800 bg-amber-50 rounded-lg font-medium"
            >
              <Cloud className="w-4 h-4 text-amber-600" />
              AWS Cloud Architecture & Project Files
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
