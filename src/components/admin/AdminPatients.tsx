import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Search, Eye, FileText, Calendar, X, Phone, Mail, MapPin } from 'lucide-react';
import { Patient, Appointment } from '../../types';

export const AdminPatients: React.FC = () => {
  const { patients, appointments, documents } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const filteredPatients = patients.filter((p) => {
    const phoneVal = p.phone || p.user?.phone || '';
    const nameMatch = p.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = p.user?.email.toLowerCase().includes(searchTerm.toLowerCase());
    const phoneMatch = phoneVal.includes(searchTerm);
    return nameMatch || emailMatch || phoneMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Patient Demographics</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Registered Patients Registry</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Database of all registered outpatients with consultation track records and archived S3 documents.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-semibold bg-white px-4 py-2 rounded-xl border border-slate-200">
          Total Registered Patients: <strong className="text-purple-700">{patients.length}</strong>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by patient name, email, or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredPatients.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No registered patients match your search term.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Patient ID</th>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Gender / DOB</th>
                  <th className="py-3.5 px-4">Address</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredPatients.map((p) => (
                  <tr key={p.patient_id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">#{p.patient_id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{p.user?.name}</td>
                    <td className="py-3.5 px-4 text-slate-500">{p.user?.email}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">{p.user?.phone || p.phone}</td>
                    <td className="py-3.5 px-4">
                      {p.gender} • <span className="text-slate-400">{p.date_of_birth}</span>
                    </td>
                    <td className="py-3.5 px-4 truncate max-w-[180px] text-slate-500">{p.address}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedPatient(p)}
                        className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Patient Dossier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Patient Dossier Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-purple-800 to-slate-900 p-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">
                  Patient Medical Registry
                </span>
                <h3 className="font-bold text-lg">{selectedPatient.user?.name}</h3>
              </div>
              <button onClick={() => setSelectedPatient(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Patient ID</span>
                  <span className="font-mono font-bold text-slate-900">#{selectedPatient.patient_id}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Email</span>
                  <span className="text-slate-700">{selectedPatient.user?.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Contact Phone</span>
                  <span className="font-semibold text-slate-800">{selectedPatient.user?.phone || selectedPatient.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Date of Birth</span>
                  <span className="text-slate-700">{selectedPatient.date_of_birth} ({selectedPatient.gender})</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Address</span>
                  <span className="text-slate-700">{selectedPatient.address}</span>
                </div>
              </div>

              {/* Consultation History */}
              <div>
                <strong className="block text-slate-800 mb-2">Hospital Appointment History:</strong>
                {appointments.filter((a) => a.patient_id === selectedPatient.patient_id).length === 0 ? (
                  <p className="text-slate-400 italic p-3 bg-slate-50 rounded-xl">No appointments booked yet.</p>
                ) : (
                  <div className="space-y-2">
                    {appointments
                      .filter((a) => a.patient_id === selectedPatient.patient_id)
                      .map((a) => (
                        <div
                          key={a.appointment_id}
                          className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                        >
                          <div>
                            <span className="font-mono font-bold text-slate-900 block">{a.appointment_code}</span>
                            <span className="text-slate-500">
                              {a.appointment_date} @ {a.appointment_time}
                            </span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              a.status === 'COMPLETED'
                                ? 'bg-blue-100 text-blue-800'
                                : a.status === 'CONFIRMED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {a.status}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Uploaded Documents */}
              <div>
                <strong className="block text-slate-800 mb-2">Attached AWS S3 Documents:</strong>
                {documents.filter((d) => d.patient_id === selectedPatient.patient_id).length === 0 ? (
                  <p className="text-slate-400 italic p-3 bg-slate-50 rounded-xl">No documents on file.</p>
                ) : (
                  <div className="space-y-2">
                    {documents
                      .filter((d) => d.patient_id === selectedPatient.patient_id)
                      .map((doc) => (
                        <div
                          key={doc.document_id}
                          className="p-3 rounded-xl border border-blue-100 bg-blue-50/50 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <div>
                              <strong className="text-slate-800 block">{doc.file_name}</strong>
                              <span className="text-[10px] text-slate-400 font-mono">{doc.s3_key}</span>
                            </div>
                          </div>
                          <span className="text-slate-500 text-[11px]">{doc.file_size}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
