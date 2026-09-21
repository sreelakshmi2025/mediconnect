import React from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, ShieldCheck, Heart, Cloud, CheckCircle2, Server, Database, Lock, Users } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActivePage } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <Activity className="w-3.5 h-3.5" />
          About MediConnect
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Pioneering Cloud-Connected Healthcare Management
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          MediConnect is a next-generation hospital appointment management system developed to eliminate OPD waiting lines,
          empower doctors with agile schedule controls, and provide secure, encrypted medical document storage in the cloud.
        </p>
      </div>

      {/* Mission & Vision Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            To provide patients in Kerala and across the region with seamless, dignified access to clinical specialists.
            We eliminate hours of physical queueing by digitizing outpatient scheduling, instant slot confirmation, and digital prescriptions.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-700">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Our Vision</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            To build a resilient, scalable, cloud-native healthcare ecosystem where patient data is safeguarded with bank-grade encryption,
            OPD operations achieve zero double-booking errors, and doctors can focus 100% on patient diagnoses and care.
          </p>
        </div>
      </div>

      {/* How Cloud Technology Helps Healthcare */}
      <div className="bg-slate-100/70 p-8 sm:p-12 rounded-3xl border border-slate-200 space-y-8">
        <div className="max-w-3xl">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Cloud Innovation</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            How Cloud Technology Transforms Healthcare
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Traditional hospital software relies on fragile local on-premise servers prone to hard drive crashes, power outages,
            and data loss. MediConnect leverages AWS Cloud Infrastructure for fault-tolerance, privacy, and speed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Zero Waiting Bottlenecks</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Patients book specific 30-minute time slots in advance from mobile or desktop, arriving right on time and reducing physical infection risks in waiting halls.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">AWS S3 Medical Storage</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Patient scan reports, MRI diagnostics, and blood tests are stored in private AWS S3 buckets, accessible only via temporary signed authorization tokens.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">ACID Transaction Locking</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              AWS RDS MySQL provides strict relational foreign key constraints and transactional row locks that strictly prevent two patients from claiming the same doctor slot.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Role-Based Data Isolation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strict authorization rules prevent patients from viewing other patients’ records, and prevent doctors from viewing patients outside their scheduled consultations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Real-time Coordination</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Doctors instantly accept or reschedule appointments, while patients receive immediate digital status updates and prescriptions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">High Availability (99.99%)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated cloud health monitors and multi-Availability Zone database clustering ensure hospital staff can access critical records 24 hours a day, 365 days a year.
            </p>
          </div>
        </div>
      </div>

      {/* Hospital Details & CTA */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-xl font-bold text-slate-900">MediConnect Super Specialty Hospital</h3>
          <p className="text-sm text-slate-500">East Fort Road, Thrissur, Kerala • Accredited Tertiary Healthcare Facility</p>
        </div>
        <button
          onClick={() => setActivePage('patient-book')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors shrink-0 cursor-pointer shadow-xs"
        >
          Book an Appointment Today
        </button>
      </div>
    </div>
  );
};
