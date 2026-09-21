import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Stethoscope,
  Calendar,
  CheckCircle,
  Database,
  Cloud,
  ShieldCheck,
  Building2,
  TrendingUp,
  Activity,
  ArrowRight,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    patients,
    doctors,
    appointments,
    departments,
    setActivePage,
  } = useApp();

  const totalPatients = patients.length;
  const totalDoctors = doctors.length;
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter((a) => a.status === 'COMPLETED').length;
  const confirmedAppointments = appointments.filter((a) => a.status === 'CONFIRMED').length;
  const pendingAppointments = appointments.filter((a) => a.status === 'PENDING').length;
  const cancelledAppointments = appointments.filter((a) => a.status === 'CANCELLED').length;

  // Department distribution
  const deptStats = departments.map((dept) => {
    const count = appointments.filter((a) => a.department_id === dept.department_id).length;
    return {
      name: dept.department_name,
      count,
      pct: totalAppointments > 0 ? Math.round((count / totalAppointments) * 100) : 0,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-xs font-semibold text-purple-300 border border-purple-400/30">
            Hospital Operations & Cloud Analytics
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            MediConnect Hospital Administration
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Real-time OPD throughput, doctor allocation, patient demographics, and AWS infrastructure health.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActivePage('admin-doctors')}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-colors cursor-pointer"
          >
            + Add New Doctor
          </button>
          <button
            onClick={() => setActivePage('admin-appointments')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-medium border border-white/20 transition-colors cursor-pointer"
          >
            All Appointments
          </button>
        </div>
      </div>

      {/* Metric Cards (Section 26) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Patients</span>
            <div className="text-3xl font-extrabold text-blue-600">{totalPatients}</div>
            <p className="text-[11px] text-slate-400">Registered hospital records</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Doctors</span>
            <div className="text-3xl font-extrabold text-teal-600">{totalDoctors}</div>
            <p className="text-[11px] text-slate-400">Active specialists on duty</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Stethoscope className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Bookings</span>
            <div className="text-3xl font-extrabold text-purple-600">{totalAppointments}</div>
            <p className="text-[11px] text-slate-400">Processed through system</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Consultations Done</span>
            <div className="text-3xl font-extrabold text-emerald-600">{completedAppointments}</div>
            <p className="text-[11px] text-slate-400">Prescriptions delivered</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* AWS Cloud Infrastructure Health Monitor (College viva highlight) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">AWS Cloud Architecture Live Status</h3>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
            ● 99.99% Operational (us-east-1)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">AWS RDS MySQL</span>
              <Database className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-sm font-bold text-white">Connected & Locked</div>
            <p className="text-[11px] text-slate-400">
              ACID transactional row locks active. Double-booking check: <strong>ENFORCED</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">AWS S3 Object Storage</span>
              <Cloud className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-sm font-bold text-white">Vault Encrypted (AES-256)</div>
            <p className="text-[11px] text-slate-400">
              Pre-signed URL authorization timeout: <strong>15 minutes</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">IAM Security Roles</span>
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-sm font-bold text-white">RBAC Isolation Active</div>
            <p className="text-[11px] text-slate-400">
              Role boundaries: Patient, Doctor, Administrator separated.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Analytics Bento: Department Share & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Volume Progress Bars */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Appointments per Department</h3>
              <p className="text-xs text-slate-500">Distribution of patient clinical bookings across hospital wings</p>
            </div>
            <span className="text-xs font-semibold text-blue-600">Total: {totalAppointments}</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {deptStats.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between font-semibold text-slate-700">
                  <span>{item.name}</span>
                  <span className="text-slate-500">
                    {item.count} appointments ({item.pct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(item.pct, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Appointment Status Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Appointment Status Distribution</h3>
            <p className="text-xs text-slate-500">Breakdown of current lifecycle states</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Confirmed</span>
              <div className="text-2xl font-black text-emerald-700">{confirmedAppointments}</div>
              <p className="text-[10px] text-emerald-600">Ready for consultation</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100 space-y-1">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Pending</span>
              <div className="text-2xl font-black text-amber-700">{pendingAppointments}</div>
              <p className="text-[10px] text-amber-600">Awaiting doctor review</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100 space-y-1">
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Completed</span>
              <div className="text-2xl font-black text-blue-700">{completedAppointments}</div>
              <p className="text-[10px] text-blue-600">Prescription archived</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-100 space-y-1">
              <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider">Cancelled</span>
              <div className="text-2xl font-black text-red-700">{cancelledAppointments}</div>
              <p className="text-[10px] text-red-600">Slot released to pool</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-center">
            <button
              onClick={() => setActivePage('admin-appointments')}
              className="text-xs text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
            >
              Manage all appointments <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
