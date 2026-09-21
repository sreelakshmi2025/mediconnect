import React from 'react';
import { useApp } from '../../context/AppContext';
import { HeartPulse, Brain, Bone, Sparkles, Eye, Smile, Stethoscope, ArrowRight, CheckCircle2 } from 'lucide-react';

export const DepartmentsPage: React.FC = () => {
  const { departments, doctors, setActivePage } = useApp();

  const getDeptIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartPulse':
        return <HeartPulse className="w-7 h-7 text-red-600" />;
      case 'Brain':
        return <Brain className="w-7 h-7 text-indigo-600" />;
      case 'Bone':
        return <Bone className="w-7 h-7 text-amber-600" />;
      case 'Sparkles':
        return <Sparkles className="w-7 h-7 text-pink-600" />;
      case 'Eye':
        return <Eye className="w-7 h-7 text-teal-600" />;
      case 'Smile':
        return <Smile className="w-7 h-7 text-sky-600" />;
      default:
        return <Stethoscope className="w-7 h-7 text-blue-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Clinical Excellence</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Hospital Departments</h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Comprehensive outpatient and inpatient medical departments equipped with advanced diagnostic equipment and dedicated specialists.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const docList = doctors.filter((d) => d.department_id === dept.department_id);
          return (
            <div
              key={dept.department_id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
                    {getDeptIcon(dept.icon_name)}
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    {docList.length} Active Doctor{docList.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {dept.department_name}
                  </h2>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{dept.description}</p>
                </div>

                {dept.head_doctor && (
                  <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-700">Department Head: </span>
                    {dept.head_doctor}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> OPD Open Daily
                </span>

                <button
                  onClick={() => setActivePage('doctors', { departmentId: dept.department_id })}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 group-hover:translate-x-1 transition-all cursor-pointer"
                >
                  View Doctors <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
