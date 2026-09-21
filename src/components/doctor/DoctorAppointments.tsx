import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Search,
  Filter,
  Check,
  X,
  Eye,
  FileText,
  User,
  Clock,
  Stethoscope,
} from 'lucide-react';
import { Appointment, MedicalDocument } from '../../types';
import { ConsultationNotesModal } from './ConsultationNotesModal';

export const DoctorAppointments: React.FC = () => {
  const {
    getEnrichedAppointments,
    updateAppointmentStatus,
    documents,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [selectedPatientModal, setSelectedPatientModal] = useState<Appointment | null>(null);
  const [completingAppt, setCompletingAppt] = useState<Appointment | null>(null);

  const appointments = getEnrichedAppointments(true);

  const filtered = useMemo(() => {
    return appointments.filter((appt) => {
      const matchStatus = statusFilter === 'ALL' || appt.status === statusFilter;
      const matchDate = !dateFilter || appt.appointment_date === dateFilter;
      const matchSearch =
        !searchTerm ||
        appt.patient?.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.appointment_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.reason.toLowerCase().includes(searchTerm.toLowerCase());
      return matchStatus && matchDate && matchSearch;
    });
  }, [appointments, statusFilter, dateFilter, searchTerm]);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Clinical Queue</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Patient Consultations</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Review consultation history, verify patient symptoms, examine uploaded lab reports, and write prescriptions.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Records' : st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search patient name, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
          />

          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs text-red-600 hover:underline font-semibold"
            >
              Clear Date
            </button>
          )}
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No matching appointments found.</p>
            <p className="text-xs text-slate-400">Try changing status filters or clear search keywords.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">APT ID</th>
                  <th className="py-3.5 px-4">Patient Details</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Chief Complaint</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((appt) => (
                  <tr key={appt.appointment_id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{appt.appointment_code}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{appt.patient?.user?.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {appt.patient?.gender} • {appt.patient?.user?.phone || appt.patient?.phone}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{appt.appointment_date}</div>
                      <div className="text-[11px] font-mono text-teal-600 font-bold">{appt.appointment_time}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-600">
                      "{appt.reason}"
                    </td>
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
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => setSelectedPatientModal(appt)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        title="View Patient Info & Uploaded Files"
                      >
                        Patient Card
                      </button>

                      {appt.status === 'PENDING' && (
                        <button
                          onClick={() => handleAccept(appt)}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Accept
                        </button>
                      )}

                      {appt.status === 'CONFIRMED' && (
                        <button
                          onClick={() => setCompletingAppt(appt)}
                          className="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Complete
                        </button>
                      )}

                      {appt.status !== 'CANCELLED' && appt.status !== 'COMPLETED' && (
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

      {/* Patient Detail Modal */}
      {selectedPatientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                  Patient Medical Dossier
                </span>
                <h3 className="font-bold text-lg">{selectedPatientModal.patient?.user?.name}</h3>
              </div>
              <button
                onClick={() => setSelectedPatientModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Age / DOB</span>
                  <span className="font-semibold text-slate-800">
                    {selectedPatientModal.patient?.date_of_birth}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Gender</span>
                  <span className="font-semibold text-slate-800">
                    {selectedPatientModal.patient?.gender}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Phone</span>
                  <span className="font-semibold text-slate-800">
                    {selectedPatientModal.patient?.user?.phone || selectedPatientModal.patient?.phone}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Address</span>
                  <span className="text-slate-700">{selectedPatientModal.patient?.address}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Chief Complaint:</span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 italic">
                  "{selectedPatientModal.reason}"
                </p>
              </div>

              {/* Uploaded Documents */}
              <div>
                <span className="font-bold text-slate-800 block mb-1">Attached S3 Medical Documents:</span>
                {documents.filter((d) => d.patient_id === selectedPatientModal.patient_id).length === 0 ? (
                  <p className="text-slate-400 italic p-2 bg-slate-50 rounded-lg">No documents attached for this patient.</p>
                ) : (
                  <div className="space-y-2">
                    {documents
                      .filter((d) => d.patient_id === selectedPatientModal.patient_id)
                      .map((doc) => (
                        <div
                          key={doc.document_id}
                          className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <div>
                              <strong className="text-slate-800 block">{doc.file_name}</strong>
                              <span className="text-[10px] text-slate-500 font-mono">
                                AWS Key: {doc.s3_key}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => alert(`Opening secure stream from ${doc.s3_url}`)}
                            className="px-2 py-1 bg-blue-600 text-white rounded text-[11px] font-semibold"
                          >
                            Examine
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedPatientModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
