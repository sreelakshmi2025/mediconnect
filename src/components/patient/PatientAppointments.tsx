import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  XCircle,
  Stethoscope,
  Plus,
  Eye,
} from 'lucide-react';
import { Appointment } from '../../types';

export const PatientAppointments: React.FC = () => {
  const { getEnrichedAppointments, cancelAppointment, setActivePage } = useApp();

  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'PENDING' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');
  const [selectedApptModal, setSelectedApptModal] = useState<Appointment | null>(null);

  const appointments = getEnrichedAppointments(true);

  const filteredAppointments = useMemo(() => {
    switch (activeTab) {
      case 'UPCOMING':
        return appointments.filter((a) => a.status === 'CONFIRMED');
      case 'PENDING':
        return appointments.filter((a) => a.status === 'PENDING');
      case 'COMPLETED':
        return appointments.filter((a) => a.status === 'COMPLETED');
      case 'CANCELLED':
        return appointments.filter((a) => a.status === 'CANCELLED');
      default:
        return appointments;
    }
  }, [appointments, activeTab]);

  const handleCancel = (appt: Appointment) => {
    if (confirm(`Are you sure you want to cancel appointment ${appt.appointment_code}? The slot will be released for other patients.`)) {
      const res = cancelAppointment(appt.appointment_id);
      alert(res.message);
      if (selectedApptModal?.appointment_id === appt.appointment_id) {
        setSelectedApptModal(null);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Patient Records</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Appointments</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            View upcoming schedule, digital prescriptions from completed visits, and booking statuses.
          </p>
        </div>
        <button
          id="patient-new-booking-btn"
          onClick={() => setActivePage('patient-book')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Book New Appointment
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
        {[
          { key: 'UPCOMING', label: 'Upcoming / Confirmed', count: appointments.filter((a) => a.status === 'CONFIRMED').length },
          { key: 'PENDING', label: 'Pending Requests', count: appointments.filter((a) => a.status === 'PENDING').length },
          { key: 'COMPLETED', label: 'Completed Consultations', count: appointments.filter((a) => a.status === 'COMPLETED').length },
          { key: 'CANCELLED', label: 'Cancelled', count: appointments.filter((a) => a.status === 'CANCELLED').length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.key
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === tab.key ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredAppointments.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No appointments found in this section.</h3>
            <p className="text-xs text-slate-400">You do not have any {activeTab.toLowerCase()} appointments.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Appointment ID</th>
                  <th className="py-3.5 px-4">Doctor</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Time Slot</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredAppointments.map((appt) => (
                  <tr key={appt.appointment_id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{appt.appointment_code}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{appt.doctor?.user?.name}</div>
                      <div className="text-[10px] text-slate-400">{appt.doctor?.specialization}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">{appt.department?.department_name}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{appt.appointment_date}</td>
                    <td className="py-3.5 px-4 font-medium text-blue-600">{appt.appointment_time}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
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
                      <button
                        onClick={() => setSelectedApptModal(appt)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        View Details
                      </button>
                      {appt.status !== 'CANCELLED' && appt.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleCancel(appt)}
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
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

      {/* APPOINTMENT DETAILS MODAL (Section 18) */}
      {selectedApptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                  Appointment Overview
                </span>
                <h2 className="text-xl font-bold mt-1">ID: {selectedApptModal.appointment_code}</h2>
              </div>
              <button
                onClick={() => setSelectedApptModal(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
              {/* Doctor & Dept */}
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <img
                  src={selectedApptModal.doctor?.photo_url}
                  alt={selectedApptModal.doctor?.user?.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                />
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-blue-600 uppercase">
                    {selectedApptModal.department?.department_name}
                  </span>
                  <h3 className="font-bold text-base text-slate-900">{selectedApptModal.doctor?.user?.name}</h3>
                  <p className="text-slate-500">{selectedApptModal.doctor?.specialization}</p>
                </div>
              </div>

              {/* Consultation Details */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Date</span>
                  <span className="font-bold text-slate-800">{selectedApptModal.appointment_date}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Time Slot</span>
                  <span className="font-bold text-blue-600">{selectedApptModal.appointment_time}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Status</span>
                  <span className="font-bold text-emerald-600">{selectedApptModal.status}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Booking Created</span>
                  <span className="text-slate-600">
                    {new Date(selectedApptModal.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Reason */}
              <div>
                <span className="font-bold text-slate-800 block mb-1">Reason for Visit:</span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-100 leading-relaxed text-slate-600">
                  {selectedApptModal.reason}
                </p>
              </div>

              {/* Doctor Clinical Notes (if completed) */}
              {selectedApptModal.status === 'COMPLETED' && selectedApptModal.notes ? (
                <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-3">
                  <div className="flex items-center gap-1.5 text-blue-800 font-bold text-xs uppercase">
                    <Stethoscope className="w-4 h-4 text-blue-600" />
                    Doctor's Diagnosis & Clinical Notes
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-blue-100 text-slate-700">
                    <strong className="block text-slate-800 mb-1">Diagnosis / Observations:</strong>
                    <p className="leading-relaxed whitespace-pre-line">{selectedApptModal.notes.notes}</p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-blue-100 text-slate-700">
                    <strong className="block text-slate-800 mb-1">Prescription & Advice:</strong>
                    <p className="leading-relaxed whitespace-pre-line font-mono text-[11px] text-blue-900 bg-blue-50/50 p-2 rounded-lg">
                      {selectedApptModal.notes.prescription}
                    </p>
                  </div>

                  {selectedApptModal.notes.follow_up_date && (
                    <div className="text-xs text-blue-700 font-medium">
                      Follow-up Recommended on: <strong>{selectedApptModal.notes.follow_up_date}</strong>
                    </div>
                  )}
                </div>
              ) : selectedApptModal.status === 'COMPLETED' ? (
                <div className="p-3 bg-slate-50 rounded-xl text-slate-500 text-center italic">
                  Consultation completed. Doctor notes are being archived in the cloud.
                </div>
              ) : null}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedApptModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Close
              </button>

              {selectedApptModal.status !== 'CANCELLED' && selectedApptModal.status !== 'COMPLETED' && (
                <button
                  onClick={() => handleCancel(selectedApptModal)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel Appointment
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
