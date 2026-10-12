import React, { useState, useEffect } from 'react';
import { timetableApi } from '../../api/timetableApi';
import { adminApi } from '../../api/dashboardApi';
import { Classroom, Section, Subject, TimetableEntry, User } from '../../types';
import {
  CalendarDays,
  PlusCircle,
  Clock,
  MapPin,
  User as UserIcon,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

export const AdminTimetablePage: React.FC = () => {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string>('MONDAY');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form dependencies
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [faculties, setFaculties] = useState<User[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  // Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [form, setForm] = useState({
    subjectId: '',
    facultyId: '',
    sectionId: '',
    classroomId: '',
    dayOfWeek: 'MONDAY',
    startTime: '09:00',
    endTime: '10:00',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [tableList, subs, facs, secs, rooms] = await Promise.all([
        timetableApi.getTimetable(),
        adminApi.getSubjects(),
        adminApi.getUsers('FACULTY'),
        adminApi.getSections(),
        adminApi.getClassrooms(),
      ]);

      setEntries(tableList);
      setSubjects(subs);
      setFaculties(facs);
      setSections(secs);
      setClassrooms(rooms);

      if (subs.length > 0 && !form.subjectId) setForm((prev) => ({ ...prev, subjectId: String(subs[0].id) }));
      if (facs.length > 0 && !form.facultyId) setForm((prev) => ({ ...prev, facultyId: String(facs[0].id) }));
      if (secs.length > 0 && !form.sectionId) setForm((prev) => ({ ...prev, sectionId: String(secs[0].id) }));
      if (rooms.length > 0 && !form.classroomId) setForm((prev) => ({ ...prev, classroomId: String(rooms[0].id) }));
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to load timetable dataset',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTimetable = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setFeedback(null);

      await timetableApi.createTimetable({
        subjectId: Number(form.subjectId),
        facultyId: Number(form.facultyId),
        sectionId: Number(form.sectionId),
        classroomId: Number(form.classroomId),
        dayOfWeek: form.dayOfWeek,
        startTime: form.startTime,
        endTime: form.endTime,
      });

      setIsAddModalOpen(false);
      setFeedback({
        type: 'success',
        message: 'Timetable entry validated with zero conflicts and saved!',
      });
      loadData();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Conflict detected! Timetable creation rejected.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this timetable allocation?')) return;
    try {
      await timetableApi.deleteTimetable(id);
      setFeedback({ type: 'success', message: 'Timetable slot removed.' });
      loadData();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete entry');
    }
  };

  const dayEntries = entries
    .filter((e) => e.dayOfWeek.toUpperCase() === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <CalendarDays className="w-7 h-7 text-blue-400" />
            Institutional Timetable Builder
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Build weekly master class schedules with automatic conflict detection for faculty, rooms, and sections
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="shadow-lg shadow-blue-600/30 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Assign Timetable Slot
        </Button>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-3 border ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Day Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {DAYS.map((day) => {
          const count = entries.filter((e) => e.dayOfWeek.toUpperCase() === day).length;
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-[#0B132B] text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{day}</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                  isSelected ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Day Schedule Grid */}
      {loading ? (
        <LoadingSkeleton height="350px" />
      ) : dayEntries.length === 0 ? (
        <div className="p-16 rounded-2xl bg-[#0B132B]/80 border border-slate-800 text-center">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">No Classes on {selectedDay}</h3>
          <p className="text-xs text-slate-500 mt-1">Assign timetable slots using the button above.</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#0B132B]/80 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Time Window</th>
                  <th className="px-5 py-3.5 font-semibold">Subject</th>
                  <th className="px-5 py-3.5 font-semibold">Faculty In Charge</th>
                  <th className="px-5 py-3.5 font-semibold">Section</th>
                  <th className="px-5 py-3.5 font-semibold">Classroom</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {dayEntries.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-5 py-3.5 font-mono font-semibold text-teal-300">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-teal-400" />
                        {item.startTime} - {item.endTime}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-white">{item.subjectName}</div>
                      <div className="text-[11px] font-mono text-blue-400">{item.subjectCode}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1.5 text-slate-200">
                        <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                        {item.facultyName}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-300">Section {item.sectionName}</td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        {item.building} Rm {item.roomNumber}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Delete slot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Slot Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Assign Timetable Slot">
        <form onSubmit={handleCreateTimetable} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subject *</label>
              <select
                required
                value={form.subjectId}
                onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Faculty Member *</label>
              <select
                required
                value={form.facultyId}
                onChange={(e) => setForm({ ...form, facultyId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                {faculties.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.fullName} ({f.collegeId})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Section Cohort *</label>
              <select
                required
                value={form.sectionId}
                onChange={(e) => setForm({ ...form, sectionId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                {sections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    Section {sec.name} ({sec.academicYear})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Classroom / Lab *</label>
              <select
                required
                value={form.classroomId}
                onChange={(e) => setForm({ ...form, classroomId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id}>
                    Room {c.roomNumber} ({c.building})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Day of Week *</label>
              <select
                value={form.dayOfWeek}
                onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Start Time *</label>
              <input
                type="time"
                required
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">End Time *</label>
              <input
                type="time"
                required
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>
              The server will automatically perform conflict validation across professor double-booking, classroom double-booking, and section schedules.
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Validating Conflicts...' : 'Save & Publish Slot'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
