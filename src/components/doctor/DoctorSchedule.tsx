import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, CheckCircle2, Save, Users, AlertCircle } from 'lucide-react';

export const DoctorSchedule: React.FC = () => {
  const { currentDoctor, updateDoctorSchedule } = useApp();

  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [availableDays, setAvailableDays] = useState<string[]>(
    currentDoctor?.available_days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  );

  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [slotDuration, setSlotDuration] = useState('30');
  const [maxPatients, setMaxPatients] = useState('1');

  const [saved, setSaved] = useState(false);

  const toggleDay = (day: string) => {
    if (availableDays.includes(day)) {
      if (availableDays.length === 1) {
        alert('You must keep at least one available day.');
        return;
      }
      setAvailableDays(availableDays.filter((d) => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDoctor) return;

    // Generate time slots based on start/end
    const slots = [
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

    updateDoctorSchedule(currentDoctor.doctor_id, availableDays, slots);
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Clinical Availability</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manage OPD Schedule</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Configure weekly clinic consultation days, working hours, and appointment slot capacities.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Doctor OPD schedule and slot matrix updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        {/* Days of Week */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">
            Weekly Consultation Days *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {DAYS.map((day) => {
              const active = availableDays.includes(day);
              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                    active
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs ring-2 ring-teal-500/20'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Patients can only select appointment dates falling on your active OPD days.
          </p>
        </div>

        {/* Working Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Clinic Start Time</label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full text-sm rounded-xl border border-slate-300 pl-10 pr-3 py-2.5 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Clinic End Time</label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full text-sm rounded-xl border border-slate-300 pl-10 pr-3 py-2.5 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Slot Interval and Max Patients */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Slot Duration</label>
            <select
              value={slotDuration}
              onChange={(e) => setSlotDuration(e.target.value)}
              className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white"
            >
              <option value="15">15 Minutes</option>
              <option value="20">20 Minutes</option>
              <option value="30">30 Minutes (Recommended)</option>
              <option value="45">45 Minutes</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Max Patients per Slot</label>
            <div className="relative">
              <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="number"
                min={1}
                max={3}
                value={maxPatients}
                onChange={(e) => setMaxPatients(e.target.value)}
                className="w-full text-sm rounded-xl border border-slate-300 pl-10 pr-3 py-2.5 bg-slate-50 focus:bg-white"
              />
            </div>
            <span className="text-[10px] text-slate-400">Strictly 1 ensures zero waiting overlap.</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save Schedule
          </button>
        </div>
      </form>
    </div>
  );
};
