import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/dashboardApi';
import { Role, User, UserStatus } from '../../types';
import {
  Users,
  UserPlus,
  Search,
  Shield,
  GraduationCap,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Ban,
  Check,
  UserCheck,
} from 'lucide-react';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<'ALL' | Role>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Create User Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submittingCreate, setSubmittingCreate] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    collegeId: '',
    password: '',
    role: 'STUDENT' as Role,
    phoneNumber: '',
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const roleParam = selectedRole === 'ALL' ? undefined : selectedRole;
      const data = await adminApi.getUsers(roleParam);
      setUsers(data);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to fetch user directory',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedRole]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.collegeId || !form.password) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      setSubmittingCreate(true);
      await adminApi.createUser({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        collegeId: form.collegeId.trim(),
        password: form.password,
        role: form.role,
        phoneNumber: form.phoneNumber.trim() || undefined,
      });

      setIsCreateModalOpen(false);
      setForm({
        fullName: '',
        email: '',
        collegeId: '',
        password: '',
        role: 'STUDENT',
        phoneNumber: '',
      });
      setFeedback({
        type: 'success',
        message: `User created successfully!`,
      });
      fetchUsers();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to create user');
    } finally {
      setSubmittingCreate(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    const nextStatus: UserStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await adminApi.updateUserStatus(user.id, nextStatus);
      setFeedback({
        type: 'success',
        message: `User ${user.fullName} is now ${nextStatus}.`,
      });
      fetchUsers();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update user status');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.collegeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-blue-400" />
            User Management & Directory
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Provision student, faculty, and administrative accounts with role-based permissions
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          className="shadow-lg shadow-blue-600/30 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add New User
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

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          {(['ALL', 'STUDENT', 'FACULTY', 'ADMIN'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                selectedRole === role
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-[#0B132B] text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {role === 'ALL' ? 'All Roles' : `${role}s`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or ID..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0B132B] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <LoadingSkeleton height="350px" />
      ) : (
        <div className="rounded-2xl bg-[#0B132B]/80 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">User</th>
                  <th className="px-5 py-3.5 font-semibold">College ID</th>
                  <th className="px-5 py-3.5 font-semibold">Role</th>
                  <th className="px-5 py-3.5 font-semibold">Account Status</th>
                  <th className="px-5 py-3.5 font-semibold">Created Date</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/30 transition">
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-white">{u.fullName}</div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-teal-300">{u.collegeId}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            u.role === 'ADMIN'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : u.role === 'FACULTY'
                              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}
                        >
                          {u.role === 'ADMIN' && <Shield className="w-3 h-3" />}
                          {u.role === 'FACULTY' && <Briefcase className="w-3 h-3" />}
                          {u.role === 'STUDENT' && <GraduationCap className="w-3 h-3" />}
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={u.status === 'ACTIVE' ? 'success' : 'danger'}>
                          {u.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Button
                          size="sm"
                          variant={u.status === 'ACTIVE' ? 'outline' : 'secondary'}
                          onClick={() => handleToggleStatus(u)}
                          className={`text-xs ${
                            u.status === 'ACTIVE'
                              ? 'border-rose-500/40 text-rose-300 hover:bg-rose-500/10'
                              : 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10'
                          }`}
                        >
                          {u.status === 'ACTIVE' ? (
                            <>
                              <Ban className="w-3.5 h-3.5 mr-1" /> Suspend
                            </>
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5 mr-1" /> Activate
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Provision New Campus User"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Jane Smith or Rahul Sharma"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="name@campus.edu"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">College ID *</label>
              <input
                type="text"
                required
                placeholder="e.g. STU1001 or FAC2001"
                value={form.collegeId}
                onChange={(e) => setForm({ ...form, collegeId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Role *</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="STUDENT">STUDENT</option>
                <option value="FACULTY">FACULTY</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Temporary Password *</label>
              <input
                type="password"
                required
                placeholder="Min 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number (Optional)</label>
            <input
              type="text"
              placeholder="+91 9876543210"
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submittingCreate}>
              {submittingCreate ? 'Saving...' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
