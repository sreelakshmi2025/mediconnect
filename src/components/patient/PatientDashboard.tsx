import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  Search,
  Bell,
  ArrowRight,
  Stethoscope,
  XCircle,
  Plus,
  AlertCircle,
} from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const {
    currentUser,
    currentPatient,
    getEnrichedAppointments,
    setActivePage,
    cancelAppointment,
    notifications,
  } = useApp();

  const userAppointments = getEnrichedAppointments(true);

  const upcomingAppointments = userAppointments.filter(
    (a) => (a.status === 'CONFIRMED' || a.status === 'PENDING') && new Date(a.appointment_date) >= new Date(new Date().toDateString())
  );
  const completedAppointments = userAppointments.filter((a) => a.status === 'COMPLETED');
  const cancelledAppointments = userAppointments.filter((a) => a.status === 'CANCELLED');

  const nextAppointment = upcomingAppointments[0];

  const recentNotifications = currentUser
    ? notifications.filter((n) => n.user_id === currentUser.user_id).slice(0, 4)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-semibold text-blue-100 backdrop-blur-xs">
            Patient Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Good morning, {currentUser?.name || 'Patient'} 👋
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm">
            Welcome back to MediConnect. Manage your clinical visits, upcoming consultations, and medical test reports.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            id="dash-book-now-btn"
            onClick={() => setActivePage('patient-book')}
            className="px-5 py-2.5 bg-white hover:bg-blue-50 text-blue-800 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Book Appointment
          </button>
          <button
            onClick={() => setActivePage('doctors')}
            className="px-4 py-2.5 bg-blue-900/60 hover:bg-blue-900 text-white rounded-xl text-xs sm:text-sm font-medium border border-blue-400/30 transition-colors cursor-pointer"
          >
            Find Doctor
          </button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Upcoming Appointments</span>
            <div className="text-3xl font-extrabold text-blue-600">{upcomingAppointments.length}</div>
            <p className="text-[11px] text-slate-400">Scheduled consultations</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Completed Consultations</span>
            <div className="text-3xl font-extrabold text-teal-600">{completedAppointments.length}</div>
            <p className="text-[11px] text-slate-400">Prescriptions available</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Cancelled / Inactive</span>
            <div className="text-3xl font-extrabold text-slate-600">{cancelledAppointments.length}</div>
            <p className="text-[11px] text-slate-400">Released time slots</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="font-semibold text-slate-700 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          Quick Patient Actions:
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActivePage('patient-book')}
            className="px-3 py-1.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" /> Book Appointment
          </button>
          <button
            onClick={() => setActivePage('doctors')}
            className="px-3 py-1.5 bg-white text-slate-700 font-medium rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" /> Find Doctor
          </button>
          <button
            onClick={() => setActivePage('patient-documents')}
            className="px-3 py-1.5 bg-white text-slate-700 font-medium rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" /> Upload Document
          </button>
        </div>
      </div>

      {/* Two Column Section: Upcoming Appointment Card + Recent Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Next Upcoming Appointment Highlight */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Upcoming Appointment
            </h2>
            {nextAppointment && (
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                nextAppointment.status === 'CONFIRMED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {nextAppointment.status}
              </span>
            )}
          </div>

          {nextAppointment ? (
            <div className="bg-gradient-to-br from-blue-50/70 to-slate-50 p-5 rounded-2xl border border-blue-100 space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={nextAppointment.doctor?.photo_url}
                  alt={nextAppointment.doctor?.user?.name || 'Doctor'}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs"
                />
                <div className="flex-1">
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                    {nextAppointment.department?.department_name}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    {nextAppointment.doctor?.user?.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {nextAppointment.doctor?.specialization}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Appointment Date</span>
                  <span className="font-bold text-slate-800">
                    {new Date(nextAppointment.appointment_date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Time Slot</span>
                  <span className="font-bold text-blue-600">{nextAppointment.appointment_time}</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 bg-white/80 p-3 rounded-xl border border-slate-200/60">
                <strong className="text-slate-700">Reason for visit: </strong>
                {nextAppointment.reason}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500 font-medium">
                  ID: <span className="font-bold text-slate-800">{nextAppointment.appointment_code}</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to cancel appointment ${nextAppointment.appointment_code}?`)) {
                        cancelAppointment(nextAppointment.appointment_id);
                      }
                    }}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cancel Appointment
                  </button>
                  <button
                    onClick={() => setActivePage('patient-appointments')}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">No upcoming appointments scheduled.</p>
              <button
                onClick={() => setActivePage('patient-book')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Book Consultation Now
              </button>
            </div>
          )}
        </div>

        {/* Right: Latest Notifications */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              Recent Activity
            </h2>
            <button
              onClick={() => setActivePage('patient-notifications')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View all
            </button>
          </div>

          <div className="space-y-2.5">
            {recentNotifications.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No notifications yet.</p>
            ) : (
              recentNotifications.map((notif) => (
                <div
                  key={notif.notification_id}
                  className={`p-3 rounded-xl border text-xs space-y-1 transition-colors ${
                    notif.is_read ? 'bg-slate-50/70 border-slate-100 text-slate-600' : 'bg-blue-50/50 border-blue-100 text-slate-800 font-medium'
                  }`}
                >
                  <p className="leading-relaxed">{notif.message}</p>
                  <span className="text-[10px] text-slate-400 block">
                    {new Date(notif.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })} at{' '}
                    {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Appointments History Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Appointments</h2>
            <p className="text-xs text-slate-500">History of your appointments at MediConnect</p>
          </div>
          <button
            onClick={() => setActivePage('patient-appointments')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Manage all appointments <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">APT ID</th>
                <th className="py-3 px-3">Doctor</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {userAppointments.slice(0, 5).map((appt) => (
                <tr key={appt.appointment_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{appt.appointment_code}</td>
                  <td className="py-3 px-3 font-semibold">{appt.doctor?.user?.name}</td>
                  <td className="py-3 px-3 text-slate-500">{appt.department?.department_name}</td>
                  <td className="py-3 px-3 font-medium">
                    {appt.appointment_date} • {appt.appointment_time}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        appt.status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : appt.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : appt.status === 'COMPLETED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setActivePage('patient-appointments')}
                      className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
