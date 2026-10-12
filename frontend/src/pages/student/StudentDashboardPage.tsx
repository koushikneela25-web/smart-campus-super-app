import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboardApi';
import { eventsApi } from '../../api/eventsApi';
import { StudentDashboard } from '../../types';
import {
  QrCode,
  CalendarDays,
  Clock,
  BookOpen,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Users,
  Megaphone,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { StatCard } from '../../components/StatCard';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export const StudentDashboardPage: React.FC = () => {
  const [data, setData] = useState<StudentDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardApi.getStudentDashboard();
      setData(res);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load student dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleRsvp = async (eventId: number) => {
    try {
      await eventsApi.rsvpEvent(eventId);
      setActionSuccess('RSVP confirmed successfully!');
      setTimeout(() => setActionSuccess(null), 3000);
      fetchDashboard();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to RSVP for event');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton height="180px" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LoadingSkeleton height="120px" />
          <LoadingSkeleton height="120px" />
          <LoadingSkeleton height="120px" />
        </div>
        <LoadingSkeleton height="300px" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-rose-300">Unable to load dashboard</h3>
        <p className="text-sm text-rose-200/80 mb-4">{error || 'Unknown error occurred'}</p>
        <Button onClick={fetchDashboard} variant="secondary">Try Again</Button>
      </div>
    );
  }

  const { profile, attendance, todayTimetable, nextClass, upcomingEvents, recentAnnouncements } = data;
  const isAttendanceLow = attendance.overallPercentage < 75;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{actionSuccess}</span>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900 border border-blue-500/20 p-6 sm:p-8 backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Smart Student Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {profile.fullName}!
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Student ID: <span className="text-teal-400 font-mono font-semibold">{profile.collegeId}</span> &bull; Status:{' '}
              <span className="text-emerald-400 font-semibold">{profile.status}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/student/attendance">
              <Button variant="primary" className="shadow-lg shadow-blue-600/30">
                <QrCode className="w-4 h-4 mr-2" />
                Check In / Scan QR
              </Button>
            </Link>
            <Link to="/student/timetable">
              <Button variant="secondary">
                <CalendarDays className="w-4 h-4 mr-2" />
                Schedule
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Next Class Alert Card */}
      {nextClass && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-950/40 via-blue-950/30 to-slate-900 border border-teal-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-teal-950/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">Next Upcoming Class</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-teal-500/20 text-teal-200">
                  {nextClass.startTime} - {nextClass.endTime}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                {nextClass.subjectName} <span className="text-slate-400 text-sm font-normal">({nextClass.subjectCode})</span>
              </h3>
              <p className="text-xs text-slate-300 flex items-center gap-3 mt-1">
                <span>Prof: {nextClass.facultyName}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  {nextClass.building} Room {nextClass.roomNumber}
                </span>
              </p>
            </div>
          </div>
          <Link to="/student/attendance">
            <Button size="sm" variant="outline" className="border-teal-500/40 text-teal-300 hover:bg-teal-500/10">
              Check Attendance
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Attendance Rate"
          value={`${attendance.overallPercentage}%`}
          subtitle={
            isAttendanceLow ? (
              <span className="text-rose-400 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3 h-3" /> Below 75% required
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Good standing (≥75%)
              </span>
            )
          }
          icon={<TrendingUp className="w-5 h-5 text-teal-400" />}
        />
        <StatCard
          title="Attended Classes"
          value={attendance.presentCount}
          subtitle={`Out of ${attendance.totalSessions} total scheduled`}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
        />
        <StatCard
          title="Classes Today"
          value={todayTimetable.length}
          subtitle="Lectures & practical labs"
          icon={<BookOpen className="w-5 h-5 text-blue-400" />}
        />
        <StatCard
          title="Campus Events"
          value={upcomingEvents.length}
          subtitle="Active upcoming opportunities"
          icon={<Calendar className="w-5 h-5 text-purple-400" />}
        />
      </div>

      {/* Two Column Layout: Today's Schedule & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold text-white">Today's Class Schedule</h2>
            </div>
            <Link to="/student/timetable" className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
              Full Week <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B132B]/80 border border-slate-800 space-y-3">
            {todayTimetable.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <CalendarDays className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                <p className="text-sm">No scheduled classes for today! Enjoy your free time.</p>
              </div>
            ) : (
              todayTimetable.map((slot) => (
                <div
                  key={slot.id}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-blue-500/20 text-blue-300">
                        {slot.subjectCode}
                      </span>
                      <span className="text-sm font-bold text-white">{slot.subjectName}</span>
                    </div>
                    <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
                      <span>Faculty: {slot.facultyName}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <MapPin className="w-3 h-3 text-teal-400" />
                        {slot.building} {slot.roomNumber}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs font-semibold text-teal-300 font-mono">
                        {slot.startTime} - {slot.endTime}
                      </div>
                      <div className="text-[11px] text-slate-400">Section {slot.sectionName}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Subject Attendance Breakdown Cards */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Subject Attendance Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {attendance.subjectSummaries.map((sub) => {
                const isSubLow = sub.percentage < 75;
                return (
                  <div
                    key={sub.subjectId}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-semibold text-teal-400">{sub.subjectCode}</span>
                        <Badge variant={isSubLow ? 'danger' : 'success'}>{sub.percentage}%</Badge>
                      </div>
                      <h4 className="text-sm font-semibold text-white mt-1 truncate">{sub.subjectName}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Attended {sub.attendedClasses} of {sub.totalClasses} classes
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isSubLow ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(sub.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Campus Events & Recent Announcements */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <h2 className="text-base font-bold text-white">Upcoming Events</h2>
              </div>
              <Link to="/student/events" className="text-xs font-semibold text-purple-400 hover:text-purple-300">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#0B132B]/80 border border-slate-800 text-center text-xs text-slate-400">
                  No upcoming events right now.
                </div>
              ) : (
                upcomingEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="p-4 rounded-xl bg-[#0B132B]/80 border border-slate-800 hover:border-slate-700 transition space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="purple">{event.category}</Badge>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(event.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{event.title}</h3>
                    <div className="text-xs text-slate-400 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {event.venue}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Users className="w-3 h-3 text-slate-500" />
                        {event.registeredCount}/{event.maxCapacity}
                      </span>
                    </div>

                    <div className="pt-1">
                      {event.isRegisteredByMe ? (
                        <div className="text-center py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Registered
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-full text-xs"
                          onClick={() => handleRsvp(event.id)}
                        >
                          RSVP Now
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Campus Announcements */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-white">Announcements</h2>
              </div>
              <Link to="/announcements" className="text-xs font-semibold text-amber-400 hover:text-amber-300">
                All Notices
              </Link>
            </div>

            <div className="space-y-3">
              {recentAnnouncements.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#0B132B]/80 border border-slate-800 text-center text-xs text-slate-400">
                  No campus announcements at this moment.
                </div>
              ) : (
                recentAnnouncements.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-[#0B132B]/80 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          item.priority === 'URGENT'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : item.priority === 'HIGH'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {item.priority}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{item.content}</p>
                    <p className="text-[10px] text-slate-400">Posted by {item.authorName}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
