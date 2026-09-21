import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Stethoscope, CheckCircle2, User, Award, Clock, DollarSign, Image } from 'lucide-react';

export const DoctorProfile: React.FC = () => {
  const { currentDoctor, updateDoctorProfile, currentUser } = useApp();

  const [specialization, setSpecialization] = useState(currentDoctor?.specialization || '');
  const [qualification, setQualification] = useState(currentDoctor?.qualification || '');
  const [experience, setExperience] = useState(currentDoctor?.experience?.toString() || '10');
  const [fee, setFee] = useState(currentDoctor?.consultation_fee?.toString() || '600');
  const [bio, setBio] = useState(currentDoctor?.bio || currentDoctor?.about || '');
  const [photoUrl, setPhotoUrl] = useState(currentDoctor?.photo_url || '');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE' | 'ON_LEAVE'>(currentDoctor?.status || 'ACTIVE');

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDoctor) return;

    updateDoctorProfile(currentDoctor.doctor_id, {
      specialization: specialization.trim(),
      qualification: qualification.trim(),
      experience: Number(experience) || 1,
      consultation_fee: Number(fee) || 500,
      about: bio.trim(),
      bio: bio.trim(),
      photo_url: photoUrl.trim(),
      status,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Clinical Credentials</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Doctor Clinical Profile</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Update your public hospital credentials, consultation fee, and clinical biography.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Doctor profile and consultation fee updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 text-xs">
        <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
          <img
            src={photoUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'}
            alt="Doctor"
            className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-sm"
          />
          <div>
            <h2 className="text-xl font-bold text-slate-900">{currentUser?.name}</h2>
            <p className="text-teal-600 font-medium">{specialization}</p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {status.replace('_', ' ')}
              </span>
              <span className="text-[11px] text-slate-400">Doctor ID #{currentDoctor?.doctor_id}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Specialization</label>
            <input
              type="text"
              required
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Degrees & Qualifications</label>
            <input
              type="text"
              required
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              placeholder="e.g. MBBS, MD, DM"
              className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Years of Experience</label>
            <input
              type="number"
              min={1}
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Consultation Fee (₹)</label>
            <input
              type="number"
              min={100}
              step={50}
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Duty Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white"
            >
              <option value="ACTIVE">Active & Available</option>
              <option value="ON_LEAVE">On Leave</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Profile Photo URL</label>
          <input
            type="url"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Clinical Biography & Special Interests</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Describe your medical practice, areas of expertise, fellowships, and research interests..."
            className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};
