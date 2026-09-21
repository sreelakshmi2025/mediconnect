import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Filter, Star, Calendar, User, Stethoscope, RefreshCw } from 'lucide-react';
import { Doctor } from '../../types';
import { DoctorProfileModal } from './DoctorProfileModal';

export const DoctorsPage: React.FC = () => {
  const { doctors, departments, pageParams, setActivePage, currentUser } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>(
    pageParams?.departmentId ? String(pageParams.departmentId) : ''
  );
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedProfileModal, setSelectedProfileModal] = useState<Doctor | null>(null);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      // Name search
      const nameMatch = doc.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(searchTerm.toLowerCase());

      // Department match
      const deptMatch = !selectedDept || doc.department_id === Number(selectedDept);

      // Day match
      const dayMatch = !selectedDay || doc.available_days.includes(selectedDay);

      return nameMatch && deptMatch && dayMatch;
    });
  }, [doctors, searchTerm, selectedDept, selectedDay]);

  const handleBook = (doctor: Doctor) => {
    if (currentUser?.role === 'PATIENT') {
      setActivePage('patient-book', { doctorId: doctor.doctor_id, departmentId: doctor.department_id });
    } else if (!currentUser) {
      setActivePage('login', { redirect: 'patient-book', doctorId: doctor.doctor_id, departmentId: doctor.department_id });
    } else {
      setActivePage('patient-book', { doctorId: doctor.doctor_id, departmentId: doctor.department_id });
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDept('');
    setSelectedDay('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Specialist Directory</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Find Your Doctor</h1>
        <p className="text-sm text-slate-600">
          Search and book consultations with our team of board-certified consultants and senior surgeons.
        </p>
      </div>

      {/* Search & Filters Card */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Search by doctor name */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              id="doctor-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by doctor name or condition..."
              className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Department Filter */}
          <div className="sm:col-span-3">
            <select
              id="filter-dept-select"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full text-sm py-2.5 px-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.department_id} value={d.department_id}>
                  {d.department_name}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Day Filter */}
          <div className="sm:col-span-3">
            <select
              id="filter-day-select"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full text-sm py-2.5 px-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any Available Day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="sm:col-span-1 flex justify-end">
            <button
              onClick={handleResetFilters}
              title="Reset Filters"
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-800">{filteredDoctors.length}</strong> available doctors
          </span>
          {(searchTerm || selectedDept || selectedDay) && (
            <span className="text-blue-600 font-medium">Filters applied</span>
          )}
        </div>
      </div>

      {/* Doctor Cards Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
          <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No doctors match your search</h3>
          <p className="text-xs text-slate-500">Try adjusting your keywords or clearing the department filter.</p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => {
            const dept = departments.find((d) => d.department_id === doctor.department_id);
            return (
              <div
                key={doctor.doctor_id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Photo Banner */}
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
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-md shadow-2xs">
                      {dept?.department_name}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                        {doctor.user?.name || 'Doctor'}
                      </h2>
                      <p className="text-xs font-semibold text-blue-600">{doctor.specialization}</p>
                      <p className="text-xs text-slate-500 mt-1">{doctor.qualification}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Experience</span>
                        <span className="font-semibold text-slate-700">{doctor.experience} Years</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Consultation Fee</span>
                        <span className="font-bold text-emerald-600">₹{doctor.consultation_fee}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 font-semibold uppercase block mb-1">
                        Available OPD Days:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {doctor.available_days.map((day) => (
                          <span
                            key={day}
                            className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-100"
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedProfileModal(doctor)}
                    className="flex-1 py-2 text-xs font-semibold rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => handleBook(doctor)}
                    className="flex-1 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Book Appointment
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <DoctorProfileModal
        doctor={selectedProfileModal}
        onClose={() => setSelectedProfileModal(null)}
        onBook={(doc) => handleBook(doc)}
      />
    </div>
  );
};
