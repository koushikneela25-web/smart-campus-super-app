import React, { useState, useEffect } from 'react';
import { attendanceApi } from '../../api/attendanceApi';
import { AttendanceRecord, AttendanceSummary } from '../../types';
import {
  QrCode,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  BookOpen,
  Calendar,
  ShieldCheck,
  RefreshCw,
  Search,
} from 'lucide-react';
import { StatCard } from '../../components/StatCard';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export const StudentAttendancePage: React.FC = () => {
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [geoEnabled, setGeoEnabled] = useState(true);
  const [gpsCoords, setGpsCoords] = useState<{ lat?: number; lng?: number }>({});
  const [filterQuery, setFilterQuery] = useState('');

  const loadData = async () => {
    try {
      const [sumRes, recRes] = await Promise.all([
        attendanceApi.getSummary(),
        attendanceApi.getMyRecords(),
      ]);
      setSummary(sumRes);
      setRecords(recRes);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to load attendance records',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    // Pre-fetch browser geolocation if enabled
    if (navigator.geolocation && geoEnabled) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoords({
            lat: Number(pos.coords.latitude.toFixed(6)),
            lng: Number(pos.coords.longitude.toFixed(6)),
          });
        },
        () => {
          // Fallback to default campus coordinates if denied/unavailable (e.g. localhost testing)
          setGpsCoords({ lat: 12.971598, lng: 77.594566 });
        }
      );
    }
  }, [geoEnabled]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      setFeedback({ type: 'error', message: 'Please enter a valid attendance QR token.' });
      return;
    }

    try {
      setSubmitting(true);
      setFeedback(null);

      const payload: { qrToken: string; latitude?: number; longitude?: number } = {
        qrToken: tokenInput.trim(),
      };

      if (geoEnabled && gpsCoords.lat && gpsCoords.lng) {
        payload.latitude = gpsCoords.lat;
        payload.longitude = gpsCoords.lng;
      }

      const record = await attendanceApi.checkIn(payload);
      setFeedback({
        type: 'success',
        message: `Successfully verified for ${record.subjectName || record.subjectCode}! Marked ${record.status}.`,
      });
      setTokenInput('');
      await loadData();
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || 'Attendance verification failed. Token may be expired or geofence violated.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRecords = records.filter(
    (r) =>
      r.subjectName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      r.subjectCode.toLowerCase().includes(filterQuery.toLowerCase()) ||
      r.sessionDate.includes(filterQuery) ||
      r.status.toLowerCase().includes(filterQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton height="140px" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <LoadingSkeleton height="100px" />
          <LoadingSkeleton height="100px" />
          <LoadingSkeleton height="100px" />
          <LoadingSkeleton height="100px" />
        </div>
        <LoadingSkeleton height="350px" />
      </div>
    );
  }

  const overall = summary?.overallPercentage ?? 0;
  const isOverallLow = overall < 75;

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <QrCode className="w-7 h-7 text-teal-400" />
            Smart Attendance Portal
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Check-in securely via temporary QR tokens with cryptographic expiration & geofence validation
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Stats
        </Button>
      </div>

      {/* Check-In Submission Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-[#0B132B] to-slate-900 border border-blue-500/30 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Live Attendance Check-In</h2>
            <p className="text-xs text-slate-400">
              Scan the dynamic QR code displayed on the classroom projector or enter token string manually
            </p>
          </div>
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-xl mb-4 text-sm flex items-start gap-3 border ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">{feedback.type === 'success' ? 'Verification Passed' : 'Verification Issue'}</p>
              <p className="text-xs opacity-90 mt-0.5">{feedback.message}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleCheckIn} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Paste or enter 64-char QR session token..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 font-mono tracking-wider"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="px-6 py-3 shrink-0 shadow-lg shadow-blue-600/30 font-semibold"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {submitting ? 'Verifying...' : 'Submit Check-In'}
            </Button>
          </div>

          {/* GPS Geofence details */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1 gap-2 border-t border-slate-800/80">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={geoEnabled}
                onChange={(e) => setGeoEnabled(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
              />
              <span className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                Attach GPS Location (Required for sessions with geofence restriction)
              </span>
            </label>

            {geoEnabled && gpsCoords.lat && (
              <span className="font-mono text-[11px] text-teal-300 bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/20">
                Lat: {gpsCoords.lat}, Lng: {gpsCoords.lng}
              </span>
            )}
          </div>
        </form>
      </div>

      {/* KPI Stats */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Overall Attendance"
            value={`${summary.overallPercentage}%`}
            subtitle={
              isOverallLow ? (
                <span className="text-rose-400 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Deficit: Minimum 75% required
                </span>
              ) : (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Eligible for semester exams
                </span>
              )
            }
            icon={<ShieldCheck className={`w-5 h-5 ${isOverallLow ? 'text-rose-400' : 'text-emerald-400'}`} />}
          />
          <StatCard
            title="Total Sessions"
            value={summary.totalSessions}
            subtitle="Conducted across all subjects"
            icon={<Calendar className="w-5 h-5 text-blue-400" />}
          />
          <StatCard
            title="Present Count"
            value={summary.presentCount}
            subtitle="Verified attendance logs"
            icon={<CheckCircle2 className="w-5 h-5 text-teal-400" />}
          />
          <StatCard
            title="Absent Count"
            value={summary.absentCount}
            subtitle="Missed or unrecorded classes"
            icon={<AlertCircle className="w-5 h-5 text-amber-400" />}
          />
        </div>
      )}

      {/* Subject Wise Cards */}
      {summary && summary.subjectSummaries.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-400" />
            Subject-Wise Attendance Breakdown
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {summary.subjectSummaries.map((sub) => {
              const isLow = sub.percentage < 75;
              return (
                <div
                  key={sub.subjectId}
                  className="p-5 rounded-xl bg-[#0B132B]/80 border border-slate-800 hover:border-slate-700 transition space-y-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                        {sub.subjectCode}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1.5 line-clamp-1">{sub.subjectName}</h3>
                    </div>
                    <Badge variant={isLow ? 'danger' : 'success'}>{sub.percentage}%</Badge>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Attended Classes</span>
                      <span className="font-mono text-slate-200">
                        {sub.attendedClasses} / {sub.totalClasses}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isLow ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(sub.percentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 pt-1">
                    {isLow ? (
                      <span className="text-rose-400 font-medium">Warning: Attend next classes to regain 75%.</span>
                    ) : (
                      <span className="text-emerald-400 font-medium">Safe zone: Meets University compliance.</span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Attendance History Log Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">My Attendance History</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-slate-800 text-slate-400">
              {filteredRecords.length} records
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search by subject or date..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0B132B] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="rounded-2xl bg-[#0B132B]/80 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Subject</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Check-in Time</th>
                  <th className="px-5 py-3 font-semibold">Geofence Distance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                      No attendance records found matching query.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-800/30 transition">
                      <td className="px-5 py-3.5 font-mono text-slate-300">{record.sessionDate}</td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-white">{record.subjectName}</div>
                        <div className="text-[11px] font-mono text-slate-400">{record.subjectCode}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge
                          variant={
                            record.status === 'PRESENT'
                              ? 'success'
                              : record.status === 'LATE'
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {record.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-300">
                        {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : 'N/A'}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-400">
                        {record.distanceMeters !== undefined && record.distanceMeters !== null ? (
                          <span className="flex items-center gap-1 text-teal-400">
                            <MapPin className="w-3 h-3" />
                            {Math.round(record.distanceMeters)}m
                          </span>
                        ) : (
                          <span className="text-slate-500">None</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
