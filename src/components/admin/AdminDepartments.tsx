import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Plus, Edit2, Users, CheckCircle2, X } from 'lucide-react';
import { Department } from '../../types';

export const AdminDepartments: React.FC = () => {
  const { departments, doctors, addDepartment, updateDepartment } = useApp();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [headDoctor, setHeadDoctor] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addDepartment({
      department_name: name.trim(),
      description: description.trim(),
      head_doctor: headDoctor.trim() || undefined,
      icon_name: 'Stethoscope',
      status: 'ACTIVE',
    });

    setName('');
    setDescription('');
    setHeadDoctor('');
    setAddModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Clinical Infrastructure</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Hospital Departments</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Configure medical specialties, department heads, and doctor allocations across MediConnect.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      {/* Grid of Departments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const docCount = doctors.filter((d) => d.department_id === dept.department_id).length;
          return (
            <div
              key={dept.department_id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                    {docCount} Specialist{docCount !== 1 ? 's' : ''}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-900">{dept.department_name}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{dept.description}</p>
                </div>

                {dept.head_doctor && (
                  <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-700">Department Head: </span>
                    {dept.head_doctor}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Dept ID: #{dept.department_id}</span>
                <button
                  onClick={() => setEditingDept(dept)}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Department Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-purple-800 p-5 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Building2 className="w-5 h-5" /> Add Medical Department
              </h3>
              <button onClick={() => setAddModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pediatrics, Oncology, ENT"
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department Head Doctor</label>
                <input
                  type="text"
                  value={headDoctor}
                  onChange={(e) => setHeadDoctor(e.target.value)}
                  placeholder="e.g. Dr. K. Radhakrishnan"
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief clinical scope and outpatient services provided..."
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {editingDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Edit2 className="w-4 h-4" /> Edit Department
              </h3>
              <button onClick={() => setEditingDept(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateDepartment(editingDept.department_id, {
                  department_name: editingDept.department_name,
                  description: editingDept.description,
                  head_doctor: editingDept.head_doctor,
                });
                setEditingDept(null);
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  value={editingDept.department_name}
                  onChange={(e) =>
                    setEditingDept({ ...editingDept, department_name: e.target.value })
                  }
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Head Doctor</label>
                <input
                  type="text"
                  value={editingDept.head_doctor || ''}
                  onChange={(e) =>
                    setEditingDept({ ...editingDept, head_doctor: e.target.value })
                  }
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingDept.description}
                  onChange={(e) =>
                    setEditingDept({ ...editingDept, description: e.target.value })
                  }
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingDept(null)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
