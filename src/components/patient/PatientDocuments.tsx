import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Upload,
  Cloud,
  Download,
  Trash2,
  ExternalLink,
  Plus,
  Shield,
  CheckCircle2,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { MedicalDocument } from '../../types';

export const PatientDocuments: React.FC = () => {
  const { currentPatient, documents, uploadDocument, deleteDocument, appointments } = useApp();

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedDocViewer, setSelectedDocViewer] = useState<MedicalDocument | null>(null);

  // Form state for upload
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState<'PDF' | 'JPG' | 'PNG'>('PDF');
  const [appointmentId, setAppointmentId] = useState<string>('');
  const [fileSizeStr, setFileSizeStr] = useState('2.4 MB');

  const patientDocs = currentPatient
    ? documents.filter((d) => d.patient_id === currentPatient.patient_id)
    : [];

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPatient || !fileName.trim()) return;

    uploadDocument(
      currentPatient.patient_id,
      {
        name: fileName.trim().endsWith(`.${fileType.toLowerCase()}`)
          ? fileName.trim()
          : `${fileName.trim()}.${fileType.toLowerCase()}`,
        type: fileType,
        size: fileSizeStr,
      },
      appointmentId ? Number(appointmentId) : undefined
    );

    setFileName('');
    setUploadModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 mb-1">
            <Cloud className="w-3.5 h-3.5 text-amber-600" />
            AWS S3 Medical Storage Vault
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Medical Documents</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Securely encrypted diagnostic reports, lab tests, and imaging scans with time-limited pre-signed URLs.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* Cloud Security Info Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">AWS S3 Server-Side Encryption (SSE-S3 / AES-256)</h4>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Bucket: <code className="text-amber-300">mediconnect-medical-documents-2026</code> • Direct public listing is disabled.
            </p>
          </div>
        </div>
        <div className="text-[11px] text-slate-400 bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700">
          Temporary Pre-signed URL validity: <strong className="text-emerald-400">15 Minutes</strong>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {patientDocs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No medical documents uploaded yet.</h3>
            <p className="text-xs text-slate-400">Upload your blood reports, scans, or prescriptions for doctor consultation.</p>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Upload First Document
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">File Name</th>
                  <th className="py-3.5 px-4">Format</th>
                  <th className="py-3.5 px-4">Size</th>
                  <th className="py-3.5 px-4">Linked Appointment</th>
                  <th className="py-3.5 px-4">Uploaded At</th>
                  <th className="py-3.5 px-4">AWS S3 Object Key</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {patientDocs.map((doc) => (
                  <tr key={doc.document_id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="truncate max-w-[200px]">{doc.file_name}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px]">
                        {doc.file_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{doc.file_size}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {doc.appointment_id ? `APT-${doc.appointment_id}` : 'General Record'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(doc.uploaded_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[10px] text-slate-400 truncate max-w-[180px]">
                      {doc.s3_key}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedDocViewer(doc)}
                        className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
                        title="View Document with AWS S3 Pre-signed URL"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          alert(`Simulating AWS S3 download for ${doc.file_name} using secure presigned link.`);
                        }}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete document "${doc.file_name}" from S3 storage?`)) {
                            deleteDocument(doc.document_id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload Document Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-blue-700 to-teal-700 p-5 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Upload className="w-5 h-5" /> Upload to AWS S3
              </h3>
              <button onClick={() => setUploadModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Title / File Name *</label>
                <input
                  type="text"
                  required
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g. ECG_Report_September2026"
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">File Format *</label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value as any)}
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PDF">PDF Report</option>
                    <option value="JPG">JPG Image</option>
                    <option value="PNG">PNG Scan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">File Size</label>
                  <input
                    type="text"
                    value={fileSizeStr}
                    onChange={(e) => setFileSizeStr(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Link to Appointment (Optional)</label>
                <select
                  value={appointmentId}
                  onChange={(e) => setAppointmentId(e.target.value)}
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">General Patient Document</option>
                  {appointments
                    .filter((a) => a.patient_id === currentPatient?.patient_id)
                    .map((a) => (
                      <option key={a.appointment_id} value={a.appointment_id}>
                        {a.appointment_code} ({a.appointment_date})
                      </option>
                    ))}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] space-y-1">
                <strong>S3 Destination Path:</strong>
                <div className="font-mono text-[10px] break-all">
                  s3://mediconnect-medical-documents-2026/patient-documents/patient-
                  {currentPatient?.patient_id}/{fileName || 'filename'}.{fileType.toLowerCase()}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold text-xs hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {selectedDocViewer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <span className="font-bold text-sm truncate max-w-sm">{selectedDocViewer.file_name}</span>
              </div>
              <button
                onClick={() => setSelectedDocViewer(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Document Type:</span>
                  <span className="font-bold text-slate-800">{selectedDocViewer.file_type} Document</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">File Size:</span>
                  <span className="font-semibold text-slate-700">{selectedDocViewer.file_size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Uploaded Date:</span>
                  <span className="font-semibold text-slate-700">
                    {new Date(selectedDocViewer.uploaded_at).toLocaleString()}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500 block mb-1">Pre-signed S3 Authenticated URL:</span>
                  <div className="font-mono text-[10px] text-blue-700 bg-white p-2.5 rounded-lg border border-slate-200 break-all select-all">
                    {selectedDocViewer.s3_url}
                  </div>
                </div>
              </div>

              {/* Simulated visual preview */}
              <div className="h-56 bg-slate-100 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center p-6 text-center text-xs text-slate-500 space-y-2">
                <Cloud className="w-10 h-10 text-blue-500" />
                <div className="font-semibold text-slate-700">{selectedDocViewer.file_name}</div>
                <p className="text-[11px] text-slate-400 max-w-md">
                  File securely streamed from Amazon S3. In production, this renders the decrypted PDF viewer or high-resolution DICOM/radiology image.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedDocViewer(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Close Viewer
              </button>
              <button
                onClick={() => alert('Download initiated with AWS pre-signed signature token.')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                <Download className="w-3.5 h-3.5" /> Download Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
