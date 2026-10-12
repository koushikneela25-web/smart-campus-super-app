import React, { useState, useEffect } from 'react';
import { timetableApi } from '../../api/timetableApi';
import { TimetableEntry } from '../../types';
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  BookOpen,
  Calendar,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { Button } from '../../components/Button';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

export const StudentTimetablePage: React.FC = () => {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current day of week to set as default active tab
  const todayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday...
  const defaultDay = todayIndex >= 1 && todayIndex <= 6 ? DAYS[todayIndex - 1] : 'MONDAY';
  const [selectedDay, setSelectedDay] = useState<string>(defaultDay);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await timetableApi.getMyTimetable();
        setEntries(res);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to fetch timetable schedule');
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton height="100px" />
        <LoadingSkeleton height="50px" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LoadingSkeleton height="160px" />
          <LoadingSkeleton height="160px" />
          <LoadingSkeleton height="160px" />
          <LoadingSkeleton height="160px" />
        </div>
      </div>
    );
  }

  const dayEntries = entries
    .filter((e) => e.dayOfWeek.toUpperCase() === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <CalendarDays className="w-7 h-7 text-blue-400" />
            Academic Timetable
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Weekly lecture schedules, lab sessions, classrooms, and assigned faculty
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={viewMode === 'day' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('day')}
          >
            Daily View
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'week' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('week')}
          >
            Weekly Grid
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Day Selector Tabs */}
      {viewMode === 'day' && (
        <>
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

          {/* Schedule list for selected day */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-teal-400">
                {selectedDay} Schedule &bull; {dayEntries.length} Classes
              </span>
            </div>

            {dayEntries.length === 0 ? (
              <div className="p-12 rounded-2xl bg-[#0B132B]/80 border border-slate-800 text-center">
                <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-300">No Classes Scheduled</h3>
                <p className="text-xs text-slate-500 mt-1">There are no academic classes on {selectedDay}.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dayEntries.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-gradient-to-br from-[#0B132B] to-slate-900 border border-slate-800 hover:border-blue-500/40 transition group space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {item.subjectCode}
                        </span>
                        <span className="text-xs text-teal-400 font-semibold">
                          Section {item.sectionName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 text-teal-300 font-mono text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {item.startTime} - {item.endTime}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition line-clamp-1">
                        {item.subjectName}
                      </h3>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5 truncate">
                        <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{item.facultyName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span className="truncate">
                          {item.building} Rm {item.roomNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Full Weekly Grid */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DAYS.map((day) => {
            const list = entries
              .filter((e) => e.dayOfWeek.toUpperCase() === day)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));

            return (
              <div key={day} className="rounded-2xl bg-[#0B132B]/80 border border-slate-800 overflow-hidden flex flex-col">
                <div className="px-5 py-3.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">{day}</h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    {list.length} classes
                  </span>
                </div>

                <div className="p-4 space-y-3 flex-1">
                  {list.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-500">No scheduled sessions</div>
                  ) : (
                    list.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2 hover:border-slate-700 transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-blue-400">{item.subjectCode}</span>
                          <span className="font-mono text-[11px] text-teal-300">
                            {item.startTime} - {item.endTime}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-white truncate">{item.subjectName}</h4>
                        <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                          <span className="truncate">{item.facultyName}</span>
                          <span className="text-slate-300">
                            {item.building} {item.roomNumber}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
