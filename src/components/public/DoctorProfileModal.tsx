import React from 'react';
import { Doctor } from '../../types';
import { X, Calendar, Award, GraduationCap, IndianRupee, Star, MapPin, Clock, Stethoscope } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DoctorProfileModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onBook: (doctor: Doctor) => void;
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({ doctor, onClose, onBook }) => {
  const { departments } = useApp();
  if (!doctor) return null;

  const department = departments.find((d) => d.department_id === doctor.department_id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-700 to-teal-700 p-6 text-white flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={doctor.photo_url}
              alt={doctor.user?.name || 'Doctor'}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs">
                  {department?.department_name || 'Specialist'}
                </span>
                <span className="flex items-center text-amber-300 text-xs font-bold gap-1 bg-black/20 px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                  {doctor.rating}
                </span>
              </div>
              <h2 className="text-2xl font-bold mt-1 tracking-tight">{doctor.user?.name || 'Doctor'}</h2>
              <p className="text-blue-100 text-sm font-medium">{doctor.specialization}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Key Quick Stats */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Experience</span>
              <span className="text-base font-bold text-slate-800">{doctor.experience}+ Years</span>
            </div>
            <div className="border-x border-slate-200">
              <span className="text-xs text-slate-500 font-medium block">Consultation Fee</span>
              <span className="text-base font-bold text-blue-600">₹{doctor.consultation_fee}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Status</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                {doctor.status}
              </span>
            </div>
          </div>

          {/* About Doctor */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-blue-600" />
              About Doctor
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
              {doctor.about}
            </p>
          </div>

          {/* Qualifications & Hospital */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                Medical Qualifications
              </div>
              <p className="text-sm font-medium text-slate-800">{doctor.qualification}</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
                <MapPin className="w-4 h-4 text-blue-600" />
                Hospital & Department
              </div>
              <p className="text-sm font-medium text-slate-800">
                MediConnect Super Specialty Hospital, Thrissur ({department?.department_name})
              </p>
            </div>
          </div>

          {/* Available OPD Days */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Available OPD Days
            </h3>
            <div className="flex flex-wrap gap-2">
              {doctor.available_days.map((day) => (
                <span
                  key={day}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200"
                >
                  {day} (Morning & Afternoon OPD)
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onBook(doctor);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};
