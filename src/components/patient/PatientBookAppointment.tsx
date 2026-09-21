import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight,
  ArrowLeft,
  Star,
  IndianRupee,
  ShieldCheck,
} from 'lucide-react';
import { Doctor, Appointment } from '../../types';

export const PatientBookAppointment: React.FC = () => {
  const {
    departments,
    doctors,
    schedules,
    appointments,
    currentPatient,
    bookAppointment,
    setActivePage,
    pageParams,
  } = useApp();

  // Multi-step state
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedDeptId, setSelectedDeptId] = useState<number>(
    pageParams?.departmentId ? Number(pageParams.departmentId) : 0
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<number>(
    pageParams?.doctorId ? Number(pageParams.doctorId) : 0
  );

  // Today's date string YYYY-MM-DD for min date
  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>('2026-09-25');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [documentFile, setDocumentFile] = useState<{
    name: string;
    type: 'PDF' | 'JPG' | 'PNG';
    size: string;
  } | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [bookedAppointment, setBookedAppointment] = useState<Appointment | null>(null);

  // If pageParams gave doctorId, preset department
  useEffect(() => {
    if (pageParams?.doctorId && !selectedDeptId) {
      const doc = doctors.find((d) => d.doctor_id === Number(pageParams.doctorId));
      if (doc) {
        setSelectedDeptId(doc.department_id);
        setSelectedDoctorId(doc.doctor_id);
        setCurrentStep(3); // jump directly to date picker!
      }
    }
  }, [pageParams, doctors, selectedDeptId]);

  const selectedDepartment = departments.find((d) => d.department_id === selectedDeptId);
  const selectedDoctor = doctors.find((d) => d.doctor_id === selectedDoctorId);

  // Doctors in the chosen department
  const filteredDoctors = useMemo(() => {
    if (!selectedDeptId) return doctors;
    return doctors.filter((d) => d.department_id === selectedDeptId && d.status === 'ACTIVE');
  }, [doctors, selectedDeptId]);

  // Standard doctor OPD slots
  const DEFAULT_SLOTS = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '12:30 PM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
  ];

  // Look for doctor schedules for selected date, or fallback to default standard slots
  const availableSlotsForDate = useMemo(() => {
    if (!selectedDoctorId || !selectedDate) return [];
    const sched = schedules.find((s) => s.doctor_id === selectedDoctorId && s.date === selectedDate);
    return sched?.slots && sched.slots.length > 0 ? sched.slots : DEFAULT_SLOTS;
  }, [selectedDoctorId, selectedDate, schedules]);

  // Check which slots are already booked on the backend/state for this doctor & date
  const bookedSlots = useMemo(() => {
    if (!selectedDoctorId || !selectedDate) return new Set<string>();
    const taken = appointments
      .filter(
        (a) =>
          a.doctor_id === selectedDoctorId &&
          a.appointment_date === selectedDate &&
          a.status !== 'CANCELLED'
      )
      .map((a) => a.appointment_time);
    return new Set(taken);
  }, [selectedDoctorId, selectedDate, appointments]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const ext = file.name.split('.').pop()?.toUpperCase();
    if (ext !== 'PDF' && ext !== 'JPG' && ext !== 'PNG') {
      alert('Only PDF, JPG, and PNG files are accepted.');
      return;
    }

    // Size
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    setDocumentFile({
      name: file.name,
      type: ext as any,
      size: sizeMb,
    });
  };

  const handleConfirmBooking = () => {
    setErrorMsg(null);
    if (!currentPatient) {
      setErrorMsg('You must be logged in as a patient to book an appointment.');
      return;
    }

    if (!selectedDoctorId || !selectedDeptId || !selectedDate || !selectedSlot || !reason.trim()) {
      setErrorMsg('Please complete all appointment requirements before confirming.');
      return;
    }

    const res = bookAppointment({
      patient_id: currentPatient.patient_id,
      doctor_id: selectedDoctorId,
      department_id: selectedDeptId,
      appointment_date: selectedDate,
      appointment_time: selectedSlot,
      reason: reason.trim(),
      document: documentFile || undefined,
    });

    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setBookedAppointment(res.appointment || null);
      setCurrentStep(7); // success step!
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Step Tracker */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Outpatient Booking System</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Book an Appointment</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Fast, transparent hospital scheduling with automatic double-booking prevention.
        </p>
      </div>

      {/* Progress Steps (1 to 6) */}
      {currentStep < 7 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="grid grid-cols-6 gap-2 text-center text-xs">
            {[
              { num: 1, label: 'Department' },
              { num: 2, label: 'Doctor' },
              { num: 3, label: 'Date' },
              { num: 4, label: 'Time Slot' },
              { num: 5, label: 'Details' },
              { num: 6, label: 'Confirm' },
            ].map((s) => (
              <div
                key={s.num}
                className={`py-2 px-1 rounded-xl transition-all ${
                  currentStep === s.num
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : currentStep > s.num
                    ? 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200'
                    : 'bg-slate-50 text-slate-400'
                }`}
              >
                <div className="text-xs font-mono">{s.num}</div>
                <div className="text-[10px] hidden sm:block truncate">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Booking Slot Error</strong>
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        {/* STEP 1: SELECT DEPARTMENT */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 1: Select Medical Department</h2>
              <p className="text-xs text-slate-500">Choose the specialty department for your clinical consultation.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {departments.map((dept) => {
                const isSelected = selectedDeptId === dept.department_id;
                const docCount = doctors.filter((d) => d.department_id === dept.department_id).length;
                return (
                  <div
                    key={dept.department_id}
                    onClick={() => {
                      setSelectedDeptId(dept.department_id);
                      setSelectedDoctorId(0);
                    }}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-slate-900 text-sm">{dept.department_name}</h3>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{dept.description}</p>
                    <span className="text-[11px] font-semibold text-blue-600 mt-2 block">
                      {docCount} Specialist{docCount !== 1 ? 's' : ''} available
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                disabled={!selectedDeptId}
                onClick={() => setCurrentStep(2)}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors ${
                  selectedDeptId
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Continue to Select Doctor <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT DOCTOR */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 2: Select Specialist Doctor</h2>
                <p className="text-xs text-slate-500">
                  Showing consultants in{' '}
                  <strong className="text-blue-600">{selectedDepartment?.department_name}</strong>
                </p>
              </div>
              <button
                onClick={() => setCurrentStep(1)}
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                Change Department
              </button>
            </div>

            {filteredDoctors.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No active doctors found in this department. Please choose another department.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredDoctors.map((doc) => {
                  const isSelected = selectedDoctorId === doc.doctor_id;
                  return (
                    <div
                      key={doc.doctor_id}
                      onClick={() => setSelectedDoctorId(doc.doctor_id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <img
                        src={doc.photo_url}
                        alt={doc.user?.name || 'Doctor'}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-sm text-slate-900 truncate">
                            {doc.user?.name || 'Doctor'}
                          </h3>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 ml-1" />}
                        </div>
                        <p className="text-xs text-blue-600 font-medium truncate">{doc.specialization}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{doc.experience} Years • {doc.qualification}</p>
                        <div className="mt-2 flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800">Fee: ₹{doc.consultation_fee}</span>
                          <span className="text-[11px] text-slate-500">⭐ {doc.rating}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                disabled={!selectedDoctorId}
                onClick={() => setCurrentStep(3)}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors ${
                  selectedDoctorId
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Select Date <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SELECT DATE */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 3: Select Consultation Date</h2>
              <p className="text-xs text-slate-500">
                Pick an upcoming date. Past dates are strictly blocked by the system.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 max-w-md mx-auto space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                <img
                  src={selectedDoctor?.photo_url}
                  alt={selectedDoctor?.user?.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-300"
                />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{selectedDoctor?.user?.name}</h3>
                  <p className="text-xs text-blue-600">{selectedDoctor?.specialization}</p>
                  <p className="text-[11px] text-slate-400">
                    OPD Days: {selectedDoctor?.available_days.join(', ')}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Appointment Date *
                </label>
                <input
                  type="date"
                  required
                  id="book-date-input"
                  min={todayStr}
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlot(''); // reset slot when date changes
                  }}
                  className="w-full text-base font-semibold rounded-xl border border-slate-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="text-xs text-slate-500 space-y-1 bg-white p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block">Quick Date Suggestions:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['2026-09-25', '2026-09-26', '2026-09-28', '2026-09-30'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setSelectedDate(d);
                        setSelectedSlot('');
                      }}
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
                        selectedDate === d
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {new Date(d).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                disabled={!selectedDate}
                onClick={() => setCurrentStep(4)}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors ${
                  selectedDate
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Choose Available Slot <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SELECT TIME SLOT */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 4: Choose Available Slot</h2>
                <p className="text-xs text-slate-500">
                  {selectedDoctor?.user?.name} on{' '}
                  <strong className="text-slate-800">
                    {new Date(selectedDate).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </strong>
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" /> Available
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" /> Booked / Unavailable
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {availableSlotsForDate.map((slot) => {
                const isBooked = bookedSlots.has(slot);
                const isSelected = selectedSlot === slot;

                if (isBooked) {
                  return (
                    <div
                      key={slot}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-100/90 text-slate-400 text-center cursor-not-allowed flex flex-col justify-center items-center select-none"
                    >
                      <span className="text-xs font-semibold line-through">{slot}</span>
                      <span className="text-[10px] uppercase font-bold text-red-500 bg-red-50 px-1.5 py-0.2 rounded mt-1">
                        Booked
                      </span>
                    </div>
                  );
                }

                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white font-bold shadow-md ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-blue-50 text-slate-700 font-medium'
                    }`}
                  >
                    <span className="text-xs">{slot}</span>
                    <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">
                      Available
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                disabled={!selectedSlot}
                onClick={() => setCurrentStep(5)}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors ${
                  selectedSlot
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Reason & Document <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: REASON & MEDICAL REPORT UPLOAD */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 5: Reason for Visit & Document Upload</h2>
              <p className="text-xs text-slate-500">
                Help the doctor prepare for your visit. You may optionally attach your previous lab test or scan report.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Reason for Consultation / Symptoms *
                </label>
                <textarea
                  rows={4}
                  required
                  id="book-reason-input"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Regular BP review, persistent headache since Monday, chest tightness during climbing stairs..."
                  className="w-full text-sm rounded-xl border border-slate-300 p-3.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Document Upload Widget */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Upload Medical Document (Optional: PDF, JPG, PNG)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors relative">
                  <input
                    type="file"
                    id="book-document-upload"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-2 pointer-events-none">
                    <Upload className="w-8 h-8 text-blue-600 mx-auto" />
                    <div className="text-xs font-semibold text-slate-700">
                      Drag and drop medical file or <span className="text-blue-600">click to browse</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Supported formats: PDF, JPG, PNG (Stored in private AWS S3 vault)
                    </div>
                  </div>
                </div>

                {documentFile && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between text-xs text-blue-900">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">{documentFile.name}</span>
                      <span className="text-slate-500">({documentFile.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDocumentFile(null)}
                      className="text-red-600 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                disabled={!reason.trim()}
                onClick={() => setCurrentStep(6)}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors ${
                  reason.trim()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Review Summary <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: APPOINTMENT SUMMARY & CONFIRMATION */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 6: Appointment Summary</h2>
              <p className="text-xs text-slate-500">
                Please verify all consultation details before final confirmation.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b border-slate-200">
                <img
                  src={selectedDoctor?.photo_url}
                  alt={selectedDoctor?.user?.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <span className="text-[11px] font-bold text-blue-600 uppercase">
                    {selectedDepartment?.department_name}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{selectedDoctor?.user?.name}</h3>
                  <p className="text-xs text-slate-500">{selectedDoctor?.specialization}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold uppercase text-[10px]">Date</span>
                  <span className="font-bold text-slate-800">
                    {new Date(selectedDate).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase text-[10px]">Time Slot</span>
                  <span className="font-bold text-blue-600">{selectedSlot}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase text-[10px]">Hospital</span>
                  <span className="font-medium text-slate-700">MediConnect East Fort, Thrissur</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase text-[10px]">Consultation Fee</span>
                  <span className="font-bold text-emerald-600">₹{selectedDoctor?.consultation_fee} (Pay at OPD)</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                <span className="font-semibold text-slate-700 block mb-1">Reason for consultation:</span>
                <p className="text-slate-600 italic">"{reason}"</p>
              </div>

              {documentFile && (
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-slate-700 font-medium">
                    Attached Document: <strong>{documentFile.name}</strong> ({documentFile.size})
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentStep(5)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                id="confirm-booking-btn"
                onClick={handleConfirmBooking}
                className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm Appointment
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: SUCCESS SCREEN */}
        {currentStep === 7 && bookedAppointment && (
          <div className="py-8 text-center space-y-6 max-w-md mx-auto animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Confirmed</span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">✓ Appointment Booked Successfully</h2>
              <p className="text-xs text-slate-500 mt-1">
                Your consultation has been locked in the hospital database and your slot is guaranteed.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Appointment ID:</span>
                <span className="font-mono font-bold text-blue-700 text-sm">{bookedAppointment.appointment_code}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Doctor:</span>
                <span className="font-semibold text-slate-800">{selectedDoctor?.user?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Department:</span>
                <span className="text-slate-700">{selectedDepartment?.department_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Scheduled Date & Time:</span>
                <span className="font-bold text-slate-900">
                  {bookedAppointment.appointment_date} at {bookedAppointment.appointment_time}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-emerald-600 uppercase">{bookedAppointment.status}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                id="success-view-appt-btn"
                onClick={() => setActivePage('patient-appointments')}
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                View Appointment
              </button>
              <button
                onClick={() => setActivePage('patient-dashboard')}
                className="w-full sm:w-auto px-6 py-2.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
