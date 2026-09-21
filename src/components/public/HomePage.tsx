import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Calendar,
  ShieldCheck,
  Clock,
  Cloud,
  CheckCircle2,
  Star,
  ArrowRight,
  Stethoscope,
  HeartPulse,
  Brain,
  Bone,
  Sparkles,
  Eye,
  Smile,
  ChevronRight,
  Users,
  Building,
} from 'lucide-react';
import { Doctor } from '../../types';
import { DoctorProfileModal } from './DoctorProfileModal';

export const HomePage: React.FC = () => {
  const { departments, doctors, setActivePage, currentUser } = useApp();

  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [selectedSpec, setSelectedSpec] = useState<string>('');
  const [activeDoctorModal, setActiveDoctorModal] = useState<Doctor | null>(null);

  // Enriched doctors with user and dept info
  const enrichedDoctors = doctors.map((doc) => {
    return doc;
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActivePage('doctors', { departmentId: selectedDeptId, specialization: selectedSpec });
  };

  const handleBookClick = (doctor?: Doctor) => {
    if (doctor) {
      if (currentUser?.role === 'PATIENT') {
        setActivePage('patient-book', { doctorId: doctor.doctor_id, departmentId: doctor.department_id });
      } else if (!currentUser) {
        setActivePage('login', { redirect: 'patient-book', doctorId: doctor.doctor_id, departmentId: doctor.department_id });
      } else {
        setActivePage('patient-book', { doctorId: doctor.doctor_id, departmentId: doctor.department_id });
      }
    } else {
      if (currentUser?.role === 'PATIENT') {
        setActivePage('patient-book');
      } else if (!currentUser) {
        setActivePage('login', { redirect: 'patient-book' });
      } else {
        setActivePage('patient-book');
      }
    }
  };

  const getDeptIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartPulse':
        return <HeartPulse className="w-6 h-6 text-red-600" />;
      case 'Brain':
        return <Brain className="w-6 h-6 text-indigo-600" />;
      case 'Bone':
        return <Bone className="w-6 h-6 text-amber-600" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-pink-600" />;
      case 'Eye':
        return <Eye className="w-6 h-6 text-teal-600" />;
      case 'Smile':
        return <Smile className="w-6 h-6 text-sky-600" />;
      default:
        return <Stethoscope className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 pt-10 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-blue-700 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                Cloud-Based Hospital Appointment System
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Your Health, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-teal-600">
                  Our Priority.
                </span>
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Book appointments with trusted doctors quickly, securely, and conveniently.
                Experience streamlined OPD scheduling, real-time doctor availability, and AWS cloud-secured medical records.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  id="hero-book-btn"
                  onClick={() => handleBookClick()}
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  Book an Appointment
                </button>

                <button
                  id="hero-find-doc-btn"
                  onClick={() => setActivePage('doctors')}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-sm border border-slate-300 shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-slate-500" />
                  Find a Doctor
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  No waiting room bottlenecks
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Verified Specialists
                </span>
                <span className="flex items-center gap-1.5">
                  <Cloud className="w-4 h-4 text-blue-600" />
                  AWS Encrypted Vault
                </span>
              </div>
            </div>

            {/* Right: Hospital Hero Illustration / Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
                  alt="Modern Hospital Medical Consultation"
                  className="w-full h-[400px] object-cover opacity-95 hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="px-2.5 py-1 rounded-md bg-blue-600/90 text-[11px] font-bold uppercase tracking-wider w-max mb-1">
                    MediConnect Super Specialty Hospital
                  </span>
                  <h3 className="text-xl font-bold">24/7 Expert Patient Care</h3>
                  <p className="text-xs text-slate-300 mt-1">Thrissur, Kerala • Fully Automated Cloud OPD System</p>
                </div>
              </div>

              {/* Floating Live Badge */}
              <div className="absolute -bottom-5 -left-4 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 hidden sm:flex">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Instant Slots</div>
                  <div className="text-[11px] text-slate-500">Real-time schedule sync</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Appointment Card */}
          <div className="mt-12 bg-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-200/80">
            <div className="mb-3 flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">Find Your Doctor</h2>
              <span className="text-xs text-slate-400 font-normal">Search by clinical department & specialization</span>
            </div>

            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                <select
                  id="home-search-dept"
                  value={selectedDeptId}
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                  className="w-full text-sm rounded-xl border border-slate-300 px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Departments (Cardiology, Neurology...)</option>
                  {departments.map((d) => (
                    <option key={d.department_id} value={d.department_id}>
                      {d.department_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Specialization</label>
                <select
                  id="home-search-spec"
                  value={selectedSpec}
                  onChange={(e) => setSelectedSpec(e.target.value)}
                  className="w-full text-sm rounded-xl border border-slate-300 px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Specialization</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Orthopedic">Orthopedic Surgeon</option>
                  <option value="Eye">Ophthalmologist</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  id="home-search-btn"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer h-[42px]"
                >
                  <Search className="w-4 h-4" />
                  Search Doctors
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. STATISTICS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-400">50+</div>
              <div className="text-sm font-medium text-slate-300">Verified Doctors</div>
              <div className="text-[11px] text-slate-500">Board certified specialists</div>
            </div>
            <div className="space-y-1 pt-6 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-400">12</div>
              <div className="text-sm font-medium text-slate-300">Hospital Departments</div>
              <div className="text-[11px] text-slate-500">OPD & surgical suites</div>
            </div>
            <div className="space-y-1 pt-6 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">5,000+</div>
              <div className="text-sm font-medium text-slate-300">Active Patients</div>
              <div className="text-[11px] text-slate-500">Registered in Kerala</div>
            </div>
            <div className="space-y-1 pt-6 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">10,000+</div>
              <div className="text-sm font-medium text-slate-300">Completed Appointments</div>
              <div className="text-[11px] text-slate-500">Zero double-booking errors</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE MEDICONNECT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Features & Benefits</span>
          <h2 className="text-3xl font-bold text-slate-900">Why Choose MediConnect?</h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Engineered with modern cloud architecture to eliminate physical queues and safeguard sensitive patient healthcare records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Online Appointment Booking</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Book appointments from anywhere. Select your preferred date, consult time, and department in 3 easy steps.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Verified Doctors</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Find doctors by department and specialization. Review credentials, experience, and consultation fees upfront.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Cloud className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Secure Cloud Storage</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Store medical documents securely in AWS S3 with encrypted pre-signed access tokens and role isolation.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Reduced Waiting Time</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Choose a convenient appointment slot with backend slot collision locks to avoid physical waiting at the hospital.
            </p>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (5 Steps) */}
      <section className="bg-slate-100/60 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Simple Process</span>
            <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
            <p className="text-slate-600 text-sm">
              Your seamless journey from registration to meeting your specialist doctor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { step: '1', title: 'Create Account', desc: 'Sign up as a patient in seconds.' },
              { step: '2', title: 'Find Doctor', desc: 'Browse specialists by department.' },
              { step: '3', title: 'Choose Time', desc: 'Pick an open slot that suits you.' },
              { step: '4', title: 'Book Appointment', desc: 'Attach reports and confirm online.' },
              { step: '5', title: 'Meet Your Doctor', desc: 'Consult and receive your digital Rx.' },
            ].map((item, idx) => (
              <div
                key={item.step}
                className="relative bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-2"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm mx-auto flex items-center justify-center shadow-xs">
                  {item.step}
                </div>
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                {idx < 4 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-slate-300">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. POPULAR DEPARTMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Medical Specialities</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-1">Popular Departments</h2>
          </div>
          <button
            onClick={() => setActivePage('departments')}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            View all departments <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.slice(0, 6).map((dept) => {
            const docCount = doctors.filter((d) => d.department_id === dept.department_id).length;
            return (
              <div
                key={dept.department_id}
                onClick={() => setActivePage('doctors', { departmentId: dept.department_id })}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getDeptIcon(dept.icon_name)}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {docCount} Specialist{docCount !== 1 ? 's' : ''}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {dept.department_name}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {dept.description}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span>View Doctors</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. FEATURED DOCTORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Expert Physicians</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-1">Featured Doctors</h2>
          </div>
          <button
            onClick={() => setActivePage('doctors')}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            Explore all doctors <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {enrichedDoctors.slice(0, 4).map((doctor) => {
            const dept = departments.find((d) => d.department_id === doctor.department_id);
            return (
              <div
                key={doctor.doctor_id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col"
              >
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={doctor.photo_url}
                    alt={doctor.user?.name || 'Doctor'}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-amber-300 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-300" />
                    {doctor.rating}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-slate-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                    {dept?.department_name}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{doctor.user?.name || 'Doctor'}</h3>
                    <p className="text-xs text-blue-600 font-medium line-clamp-1">{doctor.specialization}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{doctor.experience} Years Experience • {doctor.qualification}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Consultation</span>
                      <span className="font-bold text-slate-800">₹{doctor.consultation_fee}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setActiveDoctorModal(doctor)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => handleBookClick(doctor)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-blue-700 to-teal-700 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-3xl font-extrabold tracking-tight">Ready to book your appointment?</h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              Consult top doctors at MediConnect Super Specialty Hospital today. Hassle-free online booking with confirmed slots.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              id="cta-book-now-btn"
              onClick={() => handleBookClick()}
              className="px-6 py-3 bg-white hover:bg-slate-100 text-blue-700 font-bold rounded-xl text-sm shadow-md transition-all cursor-pointer"
            >
              Book Now
            </button>
            <button
              onClick={() => setActivePage('doctors')}
              className="px-6 py-3 bg-blue-800/60 hover:bg-blue-800 text-white font-semibold rounded-xl text-sm border border-blue-400/40 transition-all cursor-pointer"
            >
              Browse Doctors
            </button>
          </div>
        </div>
      </section>

      {/* Doctor Profile Modal */}
      <DoctorProfileModal
        doctor={activeDoctorModal}
        onClose={() => setActiveDoctorModal(null)}
        onBook={(doc) => handleBookClick(doc)}
      />
    </div>
  );
};
