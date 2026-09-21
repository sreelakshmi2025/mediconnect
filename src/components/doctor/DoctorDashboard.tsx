import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Check,
  X,
  Stethoscope,
  FileText,
  Settings,
  ArrowRight,
} from 'lucide-react';
import { Appointment } from '../../types';
import { ConsultationNotesModal } from './ConsultationNotesModal';

export const DoctorDashboard: React.FC = () => {
  const {
    currentUser,
    currentDoctor,
    getEnrichedAppointments,
    updateAppointmentStatus,
    setActivePage,
  } = useApp();

  const [completingAppt, setCompletingAppt] = useState<Appointment | null>(null);

  const docAppointments = getEnrichedAppointments(true);

  // Today's appointments (or active upcoming)
  const todayStr = '2026-09-25'; // matching demo active OPD day

  const todayAppointments = docAppointments.filter(
    (a) => a.appointment_date === todayStr || a.appointment_date === '2026-09-26'
  );

  const pendingRequests = docAppointments.filter((a) => a.status === 'PENDING');
  const completedCount = docAppointments.filter((a) => a.status === 'COMPLETED').length;
  const confirmedCount = docAppointments.filter((a) => a.status === 'CONFIRMED').length;

  const handleAccept = (appt: Appointment) => {
    updateAppointmentStatus(appt.appointment_id, 'CONFIRMED');
  };

  const handleCancel = (appt: Appointment) => {
    if (confirm(`Cancel appointment ${appt.appointment_code}?`)) {
      updateAppointmentStatus(appt.appointment_id, 'CANCELLED');
    }
  };

  const handleNotesSubmit = (notes: { notes: string; prescription: string; follow_up_date?: string }) => {
    if (!completingAppt) return;
    updateAppointmentStatus(completingAppt.appointment_id, 'COMPLETED', notes);
    setCompletingAppt(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-semibold text-teal-200 backdrop-blur-xs">
            Doctor Clinical Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, Dr. {currentUser?.name?.replace(/^Dr\.\s*/i, '') || 'Doctor'} 🩺
          </h1>
          <p className="text-teal-100 text-xs sm:text-sm">
            {currentDoctor?.specialization} • MediConnect Hospital • Consultation Fee: ₹{currentDoctor?.consultation_fee}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActivePage('doctor-schedule')}
            className="px-4 py-2.5 bg-white hover:bg-teal-50 text-teal-900 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4" /> Manage Schedule
          </button>
          <button
            onClick={() => setActivePage('doctor-profile')}
            className="px-4 py-2.5 bg-teal-950/60 hover:bg-teal-950 text-white rounded-xl text-xs sm:text-sm font-medium border border-teal-500/30 transition-colors cursor-pointer"
          >
            Doctor Profile
          </button>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Today's Schedule</span>
            <div className="text-3xl font-extrabold text-teal-600">{todayAppointments.length}</div>
            <p className="text-[11px] text-slate-400">Patients booked for today</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Pending Action</span>
            <div className="text-3xl font-extrabold text-amber-600">{pendingRequests.length}</div>
            <p className="text-[11px] text-slate-400">Awaiting your approval</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Consultations</span>
            <div className="text-3xl font-extrabold text-blue-600">{completedCount}</div>
            <p className="text-[11px] text-slate-400">Prescriptions issued</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Pending Requests Alert Banner */}
      {pendingRequests.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              You have <strong>{pendingRequests.length} pending consultation requests</strong> waiting for confirmation.
            </span>
          </div>
          <button
            onClick={() => setActivePage('doctor-appointments')}
            className="font-bold underline hover:text-amber-950 shrink-0 cursor-pointer"
          >
            Review & Accept &rarr;
          </button>
        </div>
      )}

      {/* Today's Schedule Table & Quick Status Actions */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Today's OPD Queue & Patient Schedule</h2>
            <p className="text-xs text-slate-500">
              Manage patient arrivals, issue digital prescriptions, or update consultation statuses.
            </p>
          </div>

          <button
            onClick={() => setActivePage('doctor-appointments')}
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            All appointments ({docAppointments.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {todayAppointments.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            No consultations scheduled for today.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Time Slot</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Reason / Symptoms</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {todayAppointments.map((appt) => (
                  <tr key={appt.appointment_id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{appt.appointment_time}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{appt.patient?.user?.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {appt.patient?.gender} • {appt.patient?.user?.phone || appt.patient?.phone}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-600">"{appt.reason}"</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
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
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {appt.status === 'PENDING' && (
                        <button
                          onClick={() => handleAccept(appt)}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Accept
                        </button>
                      )}

                      {appt.status === 'CONFIRMED' && (
                        <button
                          onClick={() => setCompletingAppt(appt)}
                          className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Complete & Prescribe
                        </button>
                      )}

                      {appt.status !== 'COMPLETED' && appt.status !== 'CANCELLED' && (
                        <button
                          onClick={() => handleCancel(appt)}
                          className="px-2 py-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Completion Modal */}
      {completingAppt && (
        <ConsultationNotesModal
          appointment={completingAppt}
          onClose={() => setCompletingAppt(null)}
          onSubmit={handleNotesSubmit}
        />
      )}
    </div>
  );
};
