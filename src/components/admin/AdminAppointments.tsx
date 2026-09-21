import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Search,
  Download,
  Filter,
  Eye,
  XCircle,
  FileSpreadsheet,
  X,
  Stethoscope,
} from 'lucide-react';
import { Appointment } from '../../types';

export const AdminAppointments: React.FC = () => {
  const {
    getEnrichedAppointments,
    departments,
    doctors,
    cancelAppointment,
  } = useApp();

  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [doctorFilter, setDoctorFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

  const appointments = getEnrichedAppointments(false);

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      const matchDept = deptFilter === 'ALL' || a.department_id === Number(deptFilter);
      const matchDoc = doctorFilter === 'ALL' || a.doctor_id === Number(doctorFilter);
      const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;
      const matchDate = !dateFilter || a.appointment_date === dateFilter;
      const matchSearch =
        !searchTerm ||
        a.appointment_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.patient?.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.doctor?.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.reason.toLowerCase().includes(searchTerm.toLowerCase());

      return matchDept && matchDoc && matchStatus && matchDate && matchSearch;
    });
  }, [appointments, deptFilter, doctorFilter, statusFilter, dateFilter, searchTerm]);

  const handleExportCSV = () => {
    const headers = [
      'Appointment Code',
      'Patient Name',
      'Patient Phone',
      'Doctor Name',
      'Department',
      'Date',
      'Time Slot',
      'Status',
      'Reason',
      'Consultation Fee',
    ];

    const rows = filtered.map((a) => [
      a.appointment_code,
      `"${a.patient?.user?.name || ''}"`,
      a.patient?.user?.phone || a.patient?.phone || '',
      `"${a.doctor?.user?.name || ''}"`,
      `"${a.department?.department_name || ''}"`,
      a.appointment_date,
      a.appointment_time,
      a.status,
      `"${(a.reason || '').replace(/"/g, '""')}"`,
      a.doctor?.consultation_fee || 500,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mediconnect_appointments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAdminCancel = (appt: Appointment) => {
    if (confirm(`Administrative Action: Cancel appointment ${appt.appointment_code}?`)) {
      cancelAppointment(appt.appointment_id);
      if (selectedAppt?.appointment_id === appt.appointment_id) {
        setSelectedAppt(null);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Hospital Administration</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Master Appointments Registry</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Comprehensive audit logs of all outpatient visits across MediConnect specialty departments.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4" /> Export CSV Report
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search code, patient, doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d.department_id} value={d.department_id}>
                {d.department_name}
              </option>
            ))}
          </select>

          {/* Doctor Filter */}
          <select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
          >
            <option value="ALL">All Doctors</option>
            {doctors.map((d) => (
              <option key={d.doctor_id} value={d.doctor_id}>
                {d.user?.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Date */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
          />
        </div>

        {(deptFilter !== 'ALL' || doctorFilter !== 'ALL' || statusFilter !== 'ALL' || dateFilter || searchTerm) && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <span>Filtering active: showing {filtered.length} of {appointments.length} records</span>
            <button
              onClick={() => {
                setDeptFilter('ALL');
                setDoctorFilter('ALL');
                setStatusFilter('ALL');
                setDateFilter('');
                setSearchTerm('');
              }}
              className="text-red-600 font-bold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700 text-sm">No appointment records match filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">APT Code</th>
                  <th className="py-3.5 px-4">Patient</th>
                  <th className="py-3.5 px-4">Doctor & Specialty</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Fee</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((appt) => (
                  <tr key={appt.appointment_id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{appt.appointment_code}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{appt.patient?.user?.name}</div>
                      <div className="text-[10px] text-slate-400">{appt.patient?.user?.phone || appt.patient?.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{appt.doctor?.user?.name}</div>
                      <div className="text-[10px] text-slate-500">{appt.department?.department_name}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{appt.appointment_date}</div>
                      <div className="text-[10px] text-blue-600 font-mono font-bold">{appt.appointment_time}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">₹{appt.doctor?.consultation_fee}</td>
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
                        onClick={() => setSelectedAppt(appt)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Details
                      </button>
                      {appt.status !== 'CANCELLED' && appt.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleAdminCancel(appt)}
                          className="px-2 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold cursor-pointer"
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

      {/* Details Modal */}
      {selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-purple-800 to-slate-900 p-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                  Administrative Record Audit
                </span>
                <h3 className="font-bold text-lg">{selectedAppt.appointment_code}</h3>
              </div>
              <button onClick={() => setSelectedAppt(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient:</span>
                  <strong className="text-slate-900">{selectedAppt.patient?.user?.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Doctor:</span>
                  <strong className="text-slate-900">{selectedAppt.doctor?.user?.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span>{selectedAppt.department?.department_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Slot:</span>
                  <span className="font-bold text-slate-800">{selectedAppt.appointment_date} @ {selectedAppt.appointment_time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-emerald-600">{selectedAppt.status}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Patient Chief Complaint:</span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-600">
                  {selectedAppt.reason}
                </p>
              </div>

              {selectedAppt.notes && (
                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 space-y-1">
                  <strong className="text-blue-900 block">Doctor Diagnosis & Prescription:</strong>
                  <p className="text-slate-700">{selectedAppt.notes.notes}</p>
                  <p className="font-mono text-[11px] text-blue-800 pt-1">{selectedAppt.notes.prescription}</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedAppt(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Close
              </button>

              {selectedAppt.status !== 'CANCELLED' && (
                <button
                  onClick={() => handleAdminCancel(selectedAppt)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold"
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
