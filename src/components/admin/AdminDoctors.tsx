import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Stethoscope,
  Plus,
  Edit2,
  Calendar,
  Search,
  CheckCircle2,
  X,
  UserCheck,
  Award,
  DollarSign,
  Clock,
} from 'lucide-react';
import { Doctor } from '../../types';

export const AdminDoctors: React.FC = () => {
  const { doctors, departments, addDoctor, updateDoctorProfile } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [viewingScheduleDoc, setViewingScheduleDoc] = useState<Doctor | null>(null);

  // Add Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Doctor@123');
  const [departmentId, setDepartmentId] = useState<number>(departments[0]?.department_id || 1);
  const [specialization, setSpecialization] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('8');
  const [fee, setFee] = useState('600');
  const [photoUrl, setPhotoUrl] = useState('');
  const [bio, setBio] = useState('');

  const filteredDoctors = doctors.filter((doc) => {
    const nameMatch = doc.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const specMatch = doc.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || specMatch;
  });

  const handleAddDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !specialization.trim()) return;

    addDoctor({
      name: name.trim().startsWith('Dr.') ? name.trim() : `Dr. ${name.trim()}`,
      email: email.trim(),
      password,
      department_id: Number(departmentId),
      specialization: specialization.trim(),
      qualification: qualification.trim() || 'MBBS, MD',
      experience: Number(experience) || 5,
      consultation_fee: Number(fee) || 500,
      photo_url:
        photoUrl.trim() ||
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
      bio: bio.trim() || 'Experienced specialist consultant committed to patient wellness.',
      available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    });

    // reset
    setName('');
    setEmail('');
    setSpecialization('');
    setQualification('');
    setAddModalOpen(false);
  };

  const handleToggleStatus = (doc: Doctor) => {
    const nextStatus = doc.status === 'ACTIVE' ? 'ON_LEAVE' : 'ACTIVE';
    updateDoctorProfile(doc.doctor_id, { status: nextStatus });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Clinical Staff Management</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Hospital Doctors</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Onboard specialist physicians, adjust consultation fees, and control duty status across all departments.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Doctor
        </button>
      </div>

      {/* Search toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search doctors by name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          Total Doctors: <span className="text-purple-600 font-bold">{doctors.length}</span>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => {
          const dept = departments.find((d) => d.department_id === doc.department_id);
          return (
            <div
              key={doc.doctor_id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={doc.photo_url}
                      alt={doc.user?.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-base text-slate-900 leading-snug">{doc.user?.name}</h3>
                      <p className="text-xs font-semibold text-purple-700">{doc.specialization}</p>
                      <span className="text-[10px] text-slate-400 block">{dept?.department_name}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleStatus(doc)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase cursor-pointer transition-colors ${
                      doc.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                    title="Click to toggle status"
                  >
                    {doc.status.replace('_', ' ')}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Experience</span>
                    <span className="font-bold text-slate-800">{doc.experience} Years</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Fee</span>
                    <span className="font-bold text-slate-900">₹{doc.consultation_fee}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">OPD Days: </span>
                  {doc.available_days.join(', ')}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setViewingScheduleDoc(doc)}
                  className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" /> Schedule
                </button>

                <button
                  onClick={() => setEditingDoctor(doc)}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Doctor
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Doctor Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-purple-800 to-indigo-900 p-5 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Plus className="w-5 h-5" /> Onboard New Specialist Physician
              </h3>
              <button onClick={() => setAddModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDoctorSubmit} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Doctor Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Harikrishnan Nair"
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Login Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dr.hari@mediconnect.com"
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Medical Department *</label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(Number(e.target.value))}
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white"
                  >
                    {departments.map((d) => (
                      <option key={d.department_id} value={d.department_id}>
                        {d.department_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Specialization / Role *</label>
                  <input
                    type="text"
                    required
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g. Interventional Cardiologist"
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Degrees *</label>
                  <input
                    type="text"
                    required
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="MBBS, MS, MCh"
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Experience (Yrs)</label>
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
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor Photo URL (Optional)</label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor Biography</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Brief clinical background..."
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Save & Onboard Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Doctor Modal */}
      {editingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Edit2 className="w-4 h-4" /> Edit: {editingDoctor.user?.name}
              </h3>
              <button onClick={() => setEditingDoctor(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEditingDoctor(null);
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specialization</label>
                <input
                  type="text"
                  value={editingDoctor.specialization}
                  onChange={(e) =>
                    setEditingDoctor({ ...editingDoctor, specialization: e.target.value })
                  }
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    value={editingDoctor.consultation_fee}
                    onChange={(e) =>
                      setEditingDoctor({
                        ...editingDoctor,
                        consultation_fee: Number(e.target.value),
                      })
                    }
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={editingDoctor.experience}
                    onChange={(e) =>
                      setEditingDoctor({
                        ...editingDoctor,
                        experience: Number(e.target.value),
                      })
                    }
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Duty Status</label>
                <select
                  value={editingDoctor.status}
                  onChange={(e) =>
                    setEditingDoctor({ ...editingDoctor, status: e.target.value as any })
                  }
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="ON_LEAVE">ON_LEAVE</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingDoctor(null)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateDoctorProfile(editingDoctor.doctor_id, {
                      specialization: editingDoctor.specialization,
                      consultation_fee: editingDoctor.consultation_fee,
                      experience: editingDoctor.experience,
                      status: editingDoctor.status,
                    });
                    setEditingDoctor(null);
                  }}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Doctor Schedule Modal */}
      {viewingScheduleDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] text-purple-300 uppercase font-bold">OPD Roster</span>
                <h3 className="font-bold text-base">{viewingScheduleDoc.user?.name}</h3>
              </div>
              <button onClick={() => setViewingScheduleDoc(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <strong className="block text-slate-800 mb-2">Available Consultation Days:</strong>
                <div className="flex flex-wrap gap-1.5">
                  {viewingScheduleDoc.available_days.map((d) => (
                    <span key={d} className="px-3 py-1 rounded-lg bg-purple-50 text-purple-800 font-bold border border-purple-200">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 space-y-1">
                <div>Working Hours: <strong>09:00 AM to 05:00 PM</strong></div>
                <div>Slot Duration: <strong>30 Minutes</strong></div>
                <div>Consultation Fee: <strong>₹{viewingScheduleDoc.consultation_fee}</strong></div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewingScheduleDoc(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
