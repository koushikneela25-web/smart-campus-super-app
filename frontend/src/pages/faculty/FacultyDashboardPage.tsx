import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboardApi';
import { attendanceApi } from '../../api/attendanceApi';
import { AttendanceSession, FacultyDashboard } from '../../types';
import {
  LayoutDashboard,
  QrCode,
  CalendarDays,
  Clock,
  BookOpen,
  MapPin,
  Users,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Radio,
  FileSpreadsheet,
} from 'lucide-react';
import { StatCard } from '../../components/StatCard';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export const FacultyDashboardPage: React.FC = () => {
  const [data, setData] = useState<FacultyDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [closingId, setClosingId] = useState<number | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardApi.getFacultyDashboard();
      setData(res);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load faculty dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCloseSession = async (sessionId: number) => {
    try {
      setClosingId(sessionId);
      await attendanceApi.closeSession(sessionId);
      fetchDashboard();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to close session');
    } finally {
      setClosingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton height="160px" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <LoadingSkeleton height="100px" />
          <LoadingSkeleton height="100px" />
          <LoadingSkeleton height="100px" />
          <LoadingSkeleton height="100px" />
        </div>
        <LoadingSkeleton height="300px" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-rose-300">Unable to load faculty dashboard</h3>
        <p className="text-sm text-rose-200/80 mb-4">{error || 'Unknown error occurred'}</p>
        <Button onClick={fetchDashboard} variant="secondary">Try Again</Button>
      </div>
    );
  }

  const { profile, todayClasses, activeSessions, recentSessions, totalClassesTaught } = data;

  return (
    <div className="space-y-6">
      {/* Faculty Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-900/50 via-slate-900 to-[#0B132B] border border-teal-500/30 p-6 sm:p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Faculty Academic Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Professor {profile.fullName}
            </h1>
            <p className="text-slate-300 text-sm">
              Faculty ID: <span className="text-teal-400 font-mono font-semibold">{profile.collegeId}</span> &bull; Status:{' '}
              <span className="text-emerald-400 font-semibold">{profile.status}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/faculty/attendance">
              <Button variant="primary" className="shadow-lg shadow-teal-600/30">
                <QrCode className="w-4 h-4 mr-2" />
                Launch QR Session
              </Button>
            </Link>
            <Link to="/faculty/timetable">
              <Button variant="secondary">
                <CalendarDays className="w-4 h-4 mr-2" />
                My Weekly Classes
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Active Session Alert (if any session currently open) */}
      {activeSessions && activeSessions.length > 0 && (
        <div className="space-y-3">
          {activeSessions.map((s) => (
            <div
              key={s.id}
              className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl shadow-emerald-950/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 uppercase">
                      Live Active Session
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Expires: {new Date(s.qrExpiresAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">
                    {s.subjectName} ({s.subjectCode}) &bull; Section {s.sectionName}
                  </h3>
                  <p className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-teal-400" />
                    <span>Check-ins: <strong className="text-white">{s.checkInCount || 0}</strong> students</span>
                    {s.geofenceEnabled && (
                      <span className="text-teal-400">&bull; Geofence Active ({s.radiusMeters}m)</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link to="/faculty/attendance">
                  <Button size="sm" variant="primary" className="text-xs">
                    View Dynamic QR Screen
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="danger"
                  disabled={closingId === s.id}
                  onClick={() => handleCloseSession(s.id)}
                  className="text-xs"
                >
                  {closingId === s.id ? 'Closing...' : 'Close Early'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Classes Scheduled Today"
          value={todayClasses.length}
          subtitle="Lectures on your schedule"
          icon={<BookOpen className="w-5 h-5 text-teal-400" />}
        />
        <StatCard
          title="Active Live Sessions"
          value={activeSessions.length}
          subtitle="Open for student check-ins"
          icon={<Radio className="w-5 h-5 text-emerald-400" />}
        />
        <StatCard
          title="Total Sessions Conducted"
          value={totalClassesTaught}
          subtitle="Academic year to date"
          icon={<TrendingUp className="w-5 h-5 text-blue-400" />}
        />
        <StatCard
          title="CSV Export"
          value="Enabled"
          subtitle="Download reports anytime"
          icon={<FileSpreadsheet className="w-5 h-5 text-purple-400" />}
        />
      </div>

      {/* Two Columns: Today's Assigned Classes & Recent Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Lectures (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-teal-400" />
              <h2 className="text-lg font-bold text-white">Today's Assigned Lectures</h2>
            </div>
            <Link to="/faculty/timetable" className="text-xs font-semibold text-teal-400 hover:text-teal-300">
              Full Week Schedule
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B132B]/80 border border-slate-800 space-y-3">
            {todayClasses.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <CalendarDays className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                <p className="text-sm">No lectures assigned for today!</p>
              </div>
            ) : (
              todayClasses.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-teal-500/20 text-teal-300">
                        {item.subjectCode}
                      </span>
                      <span className="text-sm font-bold text-white">{item.subjectName}</span>
                    </div>
                    <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
                      <span>Section: <strong className="text-slate-200">{item.sectionName}</strong></span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        {item.building} Room {item.roomNumber}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs font-semibold text-teal-300 font-mono">
                        {item.startTime} - {item.endTime}
                      </div>
                    </div>
                    <Link to="/faculty/attendance">
                      <Button size="sm" variant="primary" className="text-xs shadow-md">
                        <QrCode className="w-3.5 h-3.5 mr-1" /> Start
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Attendance Sessions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold text-white">Recent Sessions</h2>
            </div>
            <Link to="/faculty/attendance" className="text-xs font-semibold text-blue-400 hover:text-blue-300">
              Manage
            </Link>
          </div>

          <div className="space-y-3">
            {recentSessions.length === 0 ? (
              <div className="p-6 rounded-xl bg-[#0B132B]/80 border border-slate-800 text-center text-xs text-slate-400">
                No past sessions recorded yet.
              </div>
            ) : (
              recentSessions.slice(0, 4).map((s) => (
                <div
                  key={s.id}
                  className="p-4 rounded-xl bg-[#0B132B]/80 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant={s.isActive ? 'success' : 'secondary'}>
                      {s.isActive ? 'ACTIVE' : 'COMPLETED'}
                    </Badge>
                    <span className="text-[11px] font-mono text-slate-400">{s.sessionDate}</span>
                  </div>

                  <h4 className="text-xs font-bold text-white truncate">{s.subjectName}</h4>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <span>Section {s.sectionName}</span>
                    <span className="font-mono text-teal-300">{s.checkInCount || 0} checked in</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
