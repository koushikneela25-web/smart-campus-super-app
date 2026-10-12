import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../api/authApi';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { User, Mail, IdCard, Phone, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await authApi.updateProfile({ fullName, phoneNumber });
      await refreshProfile();
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Account Profile</h1>
        <p className="text-xs text-slate-400 mt-1">Manage personal contact details and review university identity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Identity Overview Card */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-blue-500/20 mb-4">
            {user?.fullName.charAt(0)}
          </div>
          <h2 className="text-base font-bold text-white">{user?.fullName}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>

          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <Badge variant="primary" size="md">
              {user?.role}
            </Badge>
            <Badge variant="success" size="md">
              {user?.status}
            </Badge>
          </div>

          <div className="w-full mt-6 pt-6 border-t border-slate-800 space-y-3 text-left">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <IdCard className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-400">College ID:</span>
              <span className="font-mono text-white font-semibold ml-auto">{user?.collegeId}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-400">Registered:</span>
              <span className="text-white ml-auto">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-6">
            Update Profile Information
          </h3>

          {success && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Profile information successfully updated!</span>
            </div>
          )}

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address (Institutional — Locked)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" isLoading={isLoading}>
              Save Profile Changes
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
