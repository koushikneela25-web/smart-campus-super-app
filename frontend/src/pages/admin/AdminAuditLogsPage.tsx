import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/dashboardApi';
import {
  ShieldAlert,
  Search,
  RefreshCw,
  Clock,
  User,
  Activity,
  Terminal,
} from 'lucide-react';
import { Button } from '../../components/Button';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = logs.filter(
    (l) =>
      (l.action && l.action.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.username && l.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.details && l.details.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.ipAddress && l.ipAddress.includes(searchQuery))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-7 h-7 text-rose-400" />
            Security & Audit Telemetry Logs
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Immutable system audit logs tracking authentication attempts, role modifications, and administrative operations
          </p>
        </div>

        <Button variant="secondary" size="sm" onClick={fetchLogs}>
          <RefreshCw className="w-4 h-4 mr-1.5" /> Refresh Telemetry
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by action, username, or IP address..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0B132B] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Logs Table */}
      {loading ? (
        <LoadingSkeleton height="350px" />
      ) : (
        <div className="rounded-2xl bg-[#0B132B]/80 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Event Timestamp</th>
                  <th className="px-5 py-3.5 font-semibold">Security Action</th>
                  <th className="px-5 py-3.5 font-semibold">Actor / User</th>
                  <th className="px-5 py-3.5 font-semibold">Operation Details</th>
                  <th className="px-5 py-3.5 font-semibold">Origin IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                      No security audit events recorded.
                    </td>
                  </tr>
                ) : (
                  filtered.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition">
                      <td className="px-5 py-3.5 font-mono text-slate-400 whitespace-nowrap">
                        {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A'}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono font-bold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-white">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          {log.username || 'SYSTEM'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-300 font-mono text-[11px] max-w-md truncate">
                        {log.details || 'Operation completed'}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-400 whitespace-nowrap">
                        {log.ipAddress || '127.0.0.1'}
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
