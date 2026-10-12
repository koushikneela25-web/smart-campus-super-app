import React, { useState, useEffect } from 'react';
import { attendanceApi } from '../../api/attendanceApi';
import { AttendanceSession } from '../../types';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Users,
  Clock,
  MapPin,
  CheckCircle2,
  RefreshCw,
  Search,
} from 'lucide-react';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export const AdminAttendancePage: React.FC = () => {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await attendanceApi.getMySessions();
      setSessions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const filtered = sessions.filter(
    (s) =>
      s.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.facultyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sessionDate.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FileSpreadsheet className="w-7 h-7 text-emerald-400" />
            Institutional Attendance Reports
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Audit campus attendance sessions, export accredited CSV logs, and inspect geofence verifications
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button variant="secondary" size="sm" onClick={loadSessions}>
            <RefreshCw className="w-4 h-4 mr-1.5" /> Refresh
          </Button>
          <a
            href={attendanceApi.exportCsvUrl()}
            download
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition"
          >
            <Download className="w-4 h-4" /> Download Complete Report (CSV)
          </a>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by subject, faculty, date..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0B132B] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Sessions Audit Table */}
      {loading ? (
        <LoadingSkeleton height="350px" />
      ) : (
        <div className="rounded-2xl bg-[#0B132B]/80 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Date</th>
                  <th className="px-5 py-3.5 font-semibold">Subject</th>
                  <th className="px-5 py-3.5 font-semibold">Faculty</th>
                  <th className="px-5 py-3.5 font-semibold">Section</th>
                  <th className="px-5 py-3.5 font-semibold">Geofence</th>
                  <th className="px-5 py-3.5 font-semibold">Attendees</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Export</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-8 text-center text-slate-500">
                      No attendance sessions found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/30 transition">
                      <td className="px-5 py-3.5 font-mono text-slate-300">{s.sessionDate}</td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-white">{s.subjectName}</div>
                        <div className="text-[11px] font-mono text-emerald-400">{s.subjectCode}</div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-200">{s.facultyName}</td>
                      <td className="px-5 py-3.5 text-slate-300">Section {s.sectionName}</td>
                      <td className="px-5 py-3.5">
                        {s.geofenceEnabled ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                            <MapPin className="w-3 h-3" /> {s.radiusMeters}m
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Disabled</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-teal-300">
                        {s.checkInCount || 0} students
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={s.isActive ? 'success' : 'secondary'}>
                          {s.isActive ? 'ACTIVE' : 'COMPLETED'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <a
                          href={attendanceApi.exportCsvUrl(s.id)}
                          download
                          className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
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
      )}
    </div>
  );
};
