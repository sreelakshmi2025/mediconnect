import React from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, MapPin, Phone, Mail, Clock, Shield, Cloud, Server, Database } from 'lucide-react';

interface FooterProps {
  onOpenCloudModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCloudModal }) => {
  const { setActivePage } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & College Project Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">MediConnect</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Cloud-Based Hospital Appointment Management System designed for modern healthcare. Connecting patients,
              specialist doctors, and hospital administrators with secure cloud document archiving.
            </p>
            <div className="pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                <Cloud className="w-3.5 h-3.5 text-amber-400" />
                <span>AWS Cloud Computing Project</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => setActivePage('home')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('doctors')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Find Doctors
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('departments')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Departments & Specializations
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('about')}
                  className="hover:text-blue-400 transition-colors"
                >
                  About MediConnect
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('contact')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Contact Hospital
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCloudModal}
                  className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-medium"
                >
                  AWS Cloud Architecture Hub
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: For Patients */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Patient Portal</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => setActivePage('patient-book')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Book an Appointment
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('login')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Patient Login
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('register')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Create Patient Account
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('patient-documents')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Medical Records & S3 Vault
                </button>
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Department Heads:</span> Cardiology, Neurology,
              Orthopedics, Dermatology, Ophthalmology, Dentistry.
            </div>
          </div>

          {/* Col 4: Hospital Contact & AWS Details */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Hospital Contact</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  MediConnect Super Specialty Hospital, East Fort, Thrissur, Kerala, India - 680005
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+91 98470 11223 / +91 487 2345678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>support@mediconnect.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Emergency: 24/7 | OPD: 08:30 AM - 08:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Cloud Infrastructure Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Server className="w-3.5 h-3.5 text-blue-400" />
              AWS EC2 (Flask + Gunicorn)
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Database className="w-3.5 h-3.5 text-teal-400" />
              AWS RDS MySQL 8.x (Private VPC)
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Cloud className="w-3.5 h-3.5 text-amber-400" />
              AWS S3 Pre-signed Medical Storage
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Role-Based Access & IAM
            </span>
          </div>

          <div className="text-slate-500">
            © 2026 MediConnect Hospital. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
