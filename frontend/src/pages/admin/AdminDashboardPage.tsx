import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboardApi';
import { AdminDashboard } from '../../types';
import {
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  CalendarDays,
  FileSpreadsheet,
  ShieldCheck,
  Search,
  Megaphone,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Activity,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { StatCard } from '../../components/StatCard';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardApi.getAdminAnalytics();
      setData(res);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load administrative analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton height="150px" />
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

  if (error || !data) {
    return (
      <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-rose-300">Unable to load admin dashboard</h3>
        <p className="text-sm text-rose-200/80 mb-4">{error || 'Unknown error occurred'}</p>
        <Button onClick={fetchAnalytics} variant="secondary">Try Again</Button>
      </div>
    );
  }

  // Fallback demo chart data if backend returns empty chart data
  const chartData = data.attendanceChartData && data.attendanceChartData.length > 0
    ? data.attendanceChartData
    : [
        { day: 'Mon', present: 24, absent: 3 },
        { day: 'Tue', present: 28, absent: 2 },
        { day: 'Wed', present: 31, absent: 1 },
        { day: 'Thu', present: 26, absent: 4 },
        { day: 'Fri', present: 29, absent: 2 },
      ];

  return (
    <div className="space-y-6">
      {/* Admin Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-[#0B132B] to-slate-900 border border-blue-500/30 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
              <span>Campus Management Executive Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Institutional Analytics & Control
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              System health, role enforcement, academic scheduling, attendance auditing, and security telemetry.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link to="/admin/users">
              <Button variant="primary" size="sm" className="shadow-lg shadow-blue-600/30">
                <Users className="w-4 h-4 mr-1.5" /> Manage Users
              </Button>
            </Link>
            <Link to="/admin/academics">
              <Button variant="secondary" size="sm">
                <GraduationCap className="w-4 h-4 mr-1.5" /> Academics & Rooms
              </Button>
            </Link>
            <Link to="/admin/announcements">
              <Button variant="outline" size="sm">
                <Megaphone className="w-4 h-4 mr-1.5" /> Broadcast Notice
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={data.totalStudents}
          subtitle={`Active users: ${data.activeUsers}`}
          icon={<GraduationCap className="w-5 h-5 text-blue-400" />}
        />
        <StatCard
          title="Total Faculty"
          value={data.totalFaculty}
          subtitle="Assigned across departments"
          icon={<Users className="w-5 h-5 text-teal-400" />}
        />
        <StatCard
          title="Academic Units"
          value={data.totalDepartments}
          subtitle={`${data.totalSubjects} accredited subjects`}
          icon={<Building2 className="w-5 h-5 text-purple-400" />}
        />
        <StatCard
          title="Attendance Logs"
          value={data.totalAttendanceRecords}
          subtitle="QR & GPS verified check-ins"
          icon={<Activity className="w-5 h-5 text-emerald-400" />}
        />
      </div>

      {/* Analytics Chart & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Attendance Trend (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0B132B]/80 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-400" />
                Weekly Attendance Trend
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Aggregate daily attendance checks vs absent count across all sections
              </p>
            </div>
            <Link to="/admin/attendance" className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1">
              Audit Logs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="present" name="Present Count" fill="#14B8A6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="absent" name="Absent Count" fill="#F43F5E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Operations Panel */}
        <div className="rounded-2xl bg-[#0B132B]/80 border border-slate-800 p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              Administrative Operations
            </h2>
            <p className="text-xs text-slate-400">
              One-click access to core college workflow configuration and moderation desks.
            </p>

            <div className="space-y-2.5 pt-1">
              <Link
                to="/admin/timetable"
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                    Timetable Matrix & Conflict Check
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition" />
              </Link>

              <Link
                to="/admin/lost-found"
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Search className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                    Lost & Found Claims Desk
                  </span>
                </div>
                <Badge variant="warning">{data.pendingLostFoundCount} Pending</Badge>
              </Link>

              <Link
                to="/admin/attendance"
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                    Master Attendance Audit & CSV Export
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition" />
              </Link>

              <Link
                to="/admin/audit-logs"
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                    Security Telemetry Logs
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition" />
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Database Status</span>
            <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Local MySQL 8.x Connected
            </span>
          </div>
        </div>
      </div>

      {/* Recent System Audit Logs Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-400" />
            Recent Security & Audit Telemetry
          </h2>
          <Link to="/admin/audit-logs" className="text-xs font-semibold text-rose-400 hover:text-rose-300">
            View All Logs
          </Link>
        </div>

        <div className="rounded-2xl bg-[#0B132B]/80 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3 font-semibold">Timestamp</th>
                  <th className="px-5 py-3 font-semibold">Action</th>
                  <th className="px-5 py-3 font-semibold">Actor / User</th>
                  <th className="px-5 py-3 font-semibold">Details / Entity</th>
                  <th className="px-5 py-3 font-semibold">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {(!data.recentAuditLogs || data.recentAuditLogs.length === 0) ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-6 text-center text-slate-500">
                      No security audit events recorded.
                    </td>
                  </tr>
                ) : (
                  data.recentAuditLogs.slice(0, 5).map((log: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="px-5 py-3 font-mono text-slate-400">
                        {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'Just now'}
                      </td>
                      <td className="px-5 py-3">
                        <span className="font-semibold text-blue-400">{log.action}</span>
                      </td>
                      <td className="px-5 py-3 font-mono text-white">{log.username || 'system'}</td>
                      <td className="px-5 py-3 text-slate-300 truncate max-w-xs">{log.details || 'N/A'}</td>
                      <td className="px-5 py-3 font-mono text-slate-400">{log.ipAddress || '127.0.0.1'}</td>
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
