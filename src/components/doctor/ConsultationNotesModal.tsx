import React, { useState } from 'react';
import { Stethoscope, X, CheckCircle2 } from 'lucide-react';
import { Appointment } from '../../types';

interface Props {
  appointment: Appointment;
  onClose: () => void;
  onSubmit: (notes: { notes: string; prescription: string; follow_up_date?: string }) => void;
}

export const ConsultationNotesModal: React.FC<Props> = ({ appointment, onClose, onSubmit }) => {
  const [notes, setNotes] = useState(appointment.notes?.notes || '');
  const [prescription, setPrescription] = useState(
    appointment.notes?.prescription ||
      'Tab. Paracetamol 650mg - 1-0-1 (3 days)\nTab. Pantoprazole 40mg - 1-0-0 (before food)\nAdequate hydration and rest.'
  );
  const [followUpDate, setFollowUpDate] = useState(appointment.notes?.follow_up_date || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim() || !prescription.trim()) {
      alert('Please provide diagnosis notes and a prescription advice.');
      return;
    }
    onSubmit({
      notes: notes.trim(),
      prescription: prescription.trim(),
      follow_up_date: followUpDate || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-teal-700 to-blue-800 p-5 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              Clinical Completion
            </span>
            <h3 className="font-bold text-base mt-1 flex items-center gap-2">
              <Stethoscope className="w-5 h-5" /> Consultation Notes & Prescription
            </h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Patient:</span>
              <strong className="text-slate-900">{appointment.patient?.user?.name || 'Patient'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Appointment Code:</span>
              <span className="font-mono font-bold text-blue-600">{appointment.appointment_code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Chief Complaint:</span>
              <span className="text-slate-700 italic">"{appointment.reason}"</span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Clinical Observations / Diagnosis *
            </label>
            <textarea
              rows={3}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Mild respiratory tract infection. Lungs clear to auscultation. BP 120/80 mmHg."
              className="w-full text-sm rounded-xl border border-slate-300 p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Prescription / Treatment Plan / Diet Advice *
            </label>
            <textarea
              rows={4}
              required
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              placeholder="Enter medicines, dosage schedule, and special precautions..."
              className="w-full text-sm font-mono rounded-xl border border-slate-300 p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Follow-up Review Date (Optional)
            </label>
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 font-semibold text-xs hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Complete & Save Notes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
