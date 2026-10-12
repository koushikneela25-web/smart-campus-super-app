import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { attendanceApi } from '../../api/attendanceApi';
import { adminApi } from '../../api/dashboardApi';
import { AttendanceRecord, AttendanceSession, Section, Subject } from '../../types';
import {
  QrCode,
  Clock,
  MapPin,
  Users,
  PlusCircle,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Copy,
  RefreshCw,
  Radio,
  Download,
} from 'lucide-react';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export const FacultyAttendancePage: React.FC = () => {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [activeSession, setActiveSession] = useState<AttendanceSession | null>(null);
  const [sessionRecords, setSessionRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Subject and Section choices for starting session
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [submittingStart, setSubmittingStart] = useState(false);

  // Form state
  const [form, setForm] = useState({
    subjectId: '',
    sectionId: '',
    durationMinutes: 10,
    geofenceEnabled: true,
    latitude: 12.971598,
    longitude: 77.594566,
    radiusMeters: 100,
  });

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Time remaining countdown in seconds
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const loadData = async () => {
    try {
      const sessList = await attendanceApi.getMySessions();
      setSessions(sessList);

      const active = sessList.find((s) => s.isActive);
      setActiveSession(active || null);

      if (active) {
        const records = await attendanceApi.getSessionRecords(active.id);
        setSessionRecords(records);
      } else {
        setSessionRecords([]);
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to fetch sessions',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadFormDependencies = async () => {
    try {
      const [subs, secs] = await Promise.all([
        adminApi.getSubjects(),
        adminApi.getSections(),
      ]);
      setSubjects(subs);
      setSections(secs);
      if (subs.length > 0 && !form.subjectId) {
        setForm((prev) => ({ ...prev, subjectId: String(subs[0].id) }));
      }
      if (secs.length > 0 && !form.sectionId) {
        setForm((prev) => ({ ...prev, sectionId: String(secs[0].id) }));
      }
    } catch (err) {
      console.error('Failed to load subjects/sections', err);
    }
  };

  useEffect(() => {
    loadData();
    loadFormDependencies();
  }, []);

  // Poll attendee list when session is active every 5 seconds
  useEffect(() => {
    if (!activeSession) return;
    const interval = setInterval(async () => {
      try {
        const records = await attendanceApi.getSessionRecords(activeSession.id);
        setSessionRecords(records);
      } catch (e) {
        // quiet poll fail
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [activeSession]);

  // Countdown timer calculation
  useEffect(() => {
    if (!activeSession) {
      setTimeLeft(0);
      return;
    }

    const updateTimer = () => {
      const diff = Math.max(0, Math.floor((new Date(activeSession.qrExpiresAt).getTime() - Date.now()) / 1000));
      setTimeLeft(diff);
      if (diff === 0 && activeSession.isActive) {
        loadData(); // Re-fetch to reflect closed session
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [activeSession]);

  const handleStartSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subjectId || !form.sectionId) {
      alert('Please select both a Subject and a Section.');
      return;
    }

    try {
      setSubmittingStart(true);
      setFeedback(null);

      const payload = {
        subjectId: Number(form.subjectId),
        sectionId: Number(form.sectionId),
        durationMinutes: Number(form.durationMinutes),
        geofenceEnabled: form.geofenceEnabled,
        latitude: form.geofenceEnabled ? form.latitude : undefined,
        longitude: form.geofenceEnabled ? form.longitude : undefined,
        radiusMeters: form.geofenceEnabled ? form.radiusMeters : undefined,
      };

      const newSession = await attendanceApi.startSession(payload);
      setIsStartModalOpen(false);
      setActiveSession(newSession);
      setFeedback({
        type: 'success',
        message: `Live attendance session started for ${newSession.subjectName}!`,
      });
      loadData();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to start session');
    } finally {
      setSubmittingStart(false);
    }
  };

  const handleCloseSession = async (sessionId: number) => {
    try {
      await attendanceApi.closeSession(sessionId);
      setFeedback({ type: 'success', message: 'Session successfully ended.' });
      loadData();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to close session');
    }
  };

  const copyToken = () => {
    if (!activeSession) return;
    navigator.clipboard.writeText(activeSession.qrToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton height="80px" />
        <LoadingSkeleton height="350px" />
        <LoadingSkeleton height="200px" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <QrCode className="w-7 h-7 text-teal-400" />
            Dynamic QR Attendance Manager
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Generate time-bounded QR tokens, enforce GPS geofence radius, and monitor live student check-ins
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setRefreshing(true);
              loadData();
            }}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {!activeSession && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsStartModalOpen(true)}
              className="shadow-lg shadow-teal-600/30"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Start New QR Session
            </Button>
          )}
        </div>
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
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Active Session Projector Card */}
      {activeSession ? (
        <div className="rounded-2xl bg-gradient-to-br from-[#0B132B] via-slate-900 to-[#070D1E] border border-teal-500/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Left QR Code Presentation */}
            <div className="p-5 rounded-2xl bg-white shadow-2xl border-4 border-teal-400 shrink-0 flex flex-col items-center">
              <QRCodeSVG
                value={activeSession.qrToken}
                size={220}
                level="H"
                includeMargin={false}
              />
              <div className="mt-3 text-center">
                <span className="text-[10px] font-bold text-slate-800 uppercase tracking-widest block">
                  Scan With Campus App
                </span>
              </div>
            </div>

            {/* Right Information & Controls */}
            <div className="flex-1 space-y-5 text-left w-full">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-pulse">
                    <Radio className="w-3.5 h-3.5" /> LIVE SESSION OPEN
                  </span>
                  <Badge variant="info">Section {activeSession.sectionName}</Badge>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-teal-300 font-mono text-sm font-bold flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-teal-400" />
                    <span>{formatCountdown(timeLeft)}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleCloseSession(activeSession.id)}
                  >
                    <XCircle className="w-4 h-4 mr-1" /> End Session
                  </Button>
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {activeSession.subjectName}{' '}
                  <span className="text-slate-400 text-base font-mono">({activeSession.subjectCode})</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Session Date: <span className="text-slate-200 font-mono">{activeSession.sessionDate}</span> &bull; Room:{' '}
                  <span className="text-slate-200">{activeSession.roomNumber || 'Main Lecture Hall'}</span>
                </p>
              </div>

              {/* Geofence & Check-In Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <span className="text-slate-400 flex items-center gap-1.5 font-semibold text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" /> Geofence Enforcement
                  </span>
                  <p className="font-mono text-teal-300">
                    {activeSession.geofenceEnabled
                      ? `Active (${activeSession.radiusMeters}m radius around campus)`
                      : 'Disabled (Any location permitted)'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <span className="text-slate-400 flex items-center gap-1.5 font-semibold text-[11px]">
                    <Users className="w-3.5 h-3.5 text-teal-400" /> Verified Attendees
                  </span>
                  <p className="font-mono text-emerald-400 text-sm font-bold">
                    {sessionRecords.length} students recorded
                  </p>
                </div>
              </div>

              {/* Token Copy Bar */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Raw Token Code (For Manual Entry)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={activeSession.qrToken}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 select-all"
                  />
                  <Button size="sm" variant="secondary" onClick={copyToken}>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Live attendee stream table */}
          <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-400" />
                Live Check-In Stream ({sessionRecords.length})
              </h3>
              <a
                href={attendanceApi.exportCsvUrl(activeSession.id)}
                download
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300"
              >
                <FileSpreadsheet className="w-4 h-4" /> Export Session CSV
              </a>
            </div>

            <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/40">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 text-[11px] uppercase tracking-wider sticky top-0">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold">Student Name</th>
                    <th className="px-4 py-2.5 font-semibold">College ID</th>
                    <th className="px-4 py-2.5 font-semibold">Status</th>
                    <th className="px-4 py-2.5 font-semibold">Time</th>
                    <th className="px-4 py-2.5 font-semibold">GPS Distance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {sessionRecords.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                        Waiting for students to scan QR code...
                      </td>
                    </tr>
                  ) : (
                    sessionRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-800/30">
                        <td className="px-4 py-2 font-medium text-white">{r.studentName}</td>
                        <td className="px-4 py-2 font-mono text-slate-400">{r.collegeId}</td>
                        <td className="px-4 py-2">
                          <Badge variant="success">{r.status}</Badge>
                        </td>
                        <td className="px-4 py-2 font-mono text-slate-400">
                          {new Date(r.checkInTime).toLocaleTimeString()}
                        </td>
                        <td className="px-4 py-2 font-mono text-slate-400">
                          {r.distanceMeters !== undefined && r.distanceMeters !== null
                            ? `${Math.round(r.distanceMeters)}m`
                            : 'N/A'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-[#0B132B]/80 border border-slate-800 text-center space-y-4">
          <QrCode className="w-16 h-16 text-slate-600 mx-auto" />
          <div>
            <h3 className="text-lg font-bold text-white">No Active Attendance Session</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Start a new session when your lecture begins to broadcast dynamic QR tokens to attending students.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsStartModalOpen(true)}
            className="shadow-lg shadow-teal-600/30 px-6"
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Start QR Session Now
          </Button>
        </div>
      )}

      {/* Past Sessions History Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Previous Attendance Sessions
          </h2>
          <a
            href={attendanceApi.exportCsvUrl()}
            download
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300"
          >
            <Download className="w-4 h-4" /> Download All Records (CSV)
          </a>
        </div>

        <div className="rounded-2xl bg-[#0B132B]/80 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Subject</th>
                  <th className="px-5 py-3 font-semibold">Section</th>
                  <th className="px-5 py-3 font-semibold">Check-ins</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {sessions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                      No attendance sessions recorded yet.
                    </td>
                  </tr>
                ) : (
                  sessions.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/30 transition">
                      <td className="px-5 py-3.5 font-mono text-slate-300">{s.sessionDate}</td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-white">{s.subjectName}</div>
                        <div className="text-[11px] font-mono text-slate-400">{s.subjectCode}</div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-300">Section {s.sectionName}</td>
                      <td className="px-5 py-3.5 font-mono font-semibold text-teal-400">
                        {s.checkInCount || 0} students
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={s.isActive ? 'success' : 'secondary'}>
                          {s.isActive ? 'ACTIVE' : 'COMPLETED'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <a
                          href={attendanceApi.exportCsvUrl(s.id)}
                          download
                          className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold"
                        >
                          <Download className="w-3.5 h-3.5" /> CSV
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Start New Session Modal */}
      <Modal
        isOpen={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
        title="Start QR Attendance Session"
      >
        <form onSubmit={handleStartSession} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Subject *</label>
            <select
              required
              value={form.subjectId}
              onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-teal-500"
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.code} - {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Section *</label>
              <select
                required
                value={form.sectionId}
                onChange={(e) => setForm({ ...form, sectionId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-teal-500"
              >
                {sections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    Section {sec.name} ({sec.academicYear})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (Minutes) *</label>
              <select
                value={form.durationMinutes}
                onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-teal-500"
              >
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>
          </div>

          {/* Geofence settings */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.geofenceEnabled}
                onChange={(e) => setForm({ ...form, geofenceEnabled: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-teal-600 focus:ring-0"
              />
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> Enable GPS Geofencing
              </span>
            </label>

            {form.geofenceEnabled && (
              <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400">Campus Lat</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={form.latitude}
                    onChange={(e) => setForm({ ...form, latitude: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">Campus Lng</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={form.longitude}
                    onChange={(e) => setForm({ ...form, longitude: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">Radius (Meters)</label>
                  <input
                    type="number"
                    value={form.radiusMeters}
                    onChange={(e) => setForm({ ...form, radiusMeters: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsStartModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submittingStart}>
              {submittingStart ? 'Starting Session...' : 'Generate Live QR'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
