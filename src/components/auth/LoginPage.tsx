import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, Lock, Mail, AlertCircle, ArrowRight, UserCheck, Stethoscope, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginAsRole, setActivePage, pageParams } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    const res = await login(email, password);
    if (!res.success) {
      setError(res.message);
    } else {
      if (pageParams?.redirect === 'patient-book') {
        setActivePage('patient-book', {
          doctorId: pageParams.doctorId,
          departmentId: pageParams.departmentId,
        });
      }
    }
  };

  const handleDemoLogin = (role: 'PATIENT' | 'DOCTOR' | 'ADMIN', userId?: number) => {
    loginAsRole(role, userId);
    if (pageParams?.redirect === 'patient-book') {
      setActivePage('patient-book', {
        doctorId: pageParams.doctorId,
        departmentId: pageParams.departmentId,
      });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Healthcare Illustration / Visual */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Activity className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-2xl font-bold tracking-tight">MediConnect</span>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              Cloud-Based Hospital Appointment Management System. Access patient dashboards, doctor consultations, and administrative analytics.
            </p>
          </div>

          <div className="my-8 relative z-10">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">College Demo Fast-Pass</span>
              <p className="text-xs text-slate-200">
                Click any demo profile below for instantaneous 1-click role testing:
              </p>
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  id="demo-login-patient"
                  onClick={() => handleDemoLogin('PATIENT')}
                  className="w-full text-left p-2 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-semibold flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-300" /> Patient (Rahul Kumar)
                  </span>
                  <span className="text-[10px] text-blue-200">Sign In &rarr;</span>
                </button>

                <button
                  type="button"
                  id="demo-login-doctor"
                  onClick={() => handleDemoLogin('DOCTOR', 2)}
                  className="w-full text-left p-2 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-semibold flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-teal-300" /> Doctor (Dr. Anjali Menon)
                  </span>
                  <span className="text-[10px] text-teal-200">Sign In &rarr;</span>
                </button>

                <button
                  type="button"
                  id="demo-login-admin"
                  onClick={() => handleDemoLogin('ADMIN')}
                  className="w-full text-left p-2 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-semibold flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-300" /> Administrator (System Admin)
                  </span>
                  <span className="text-[10px] text-purple-200">Sign In &rarr;</span>
                </button>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 relative z-10">
            Protected by AWS Security Groups & IAM Role policies.
          </div>
        </div>

        {/* Right Side: Split-Screen Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Welcome Back 👋
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Login to your MediConnect account.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    id="login-email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patient.rahul@gmail.com or dr.anjali@mediconnect.com"
                    className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => alert('For college demonstration, any demo password is valid, or click the quick demo profile on the left!')}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    id="login-password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="login-submit-btn"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                Login to MediConnect
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
              Don't have an account?{' '}
              <button
                onClick={() => setActivePage('register')}
                className="text-blue-600 font-bold hover:underline cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
