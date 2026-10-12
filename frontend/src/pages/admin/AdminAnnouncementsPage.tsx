import React, { useState, useEffect } from 'react';
import { announcementApi } from '../../api/notificationApi';
import { AnnouncementItem } from '../../types';
import {
  Megaphone,
  PlusCircle,
  Calendar,
  User,
  AlertCircle,
  CheckCircle2,
  Users,
  Sparkles,
} from 'lucide-react';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export const AdminAnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [form, setForm] = useState({
    title: '',
    content: '',
    targetRole: 'ALL',
    priority: 'NORMAL',
  });

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await announcementApi.getAnnouncements();
      setAnnouncements(data);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to load announcements',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      await announcementApi.createAnnouncement({
        title: form.title.trim(),
        content: form.content.trim(),
        targetRole: form.targetRole,
        priority: form.priority,
      });

      setIsCreateModalOpen(false);
      setForm({ title: '', content: '', targetRole: 'ALL', priority: 'NORMAL' });
      setFeedback({
        type: 'success',
        message: 'Campus broadcast notice published successfully!',
      });
      fetchAnnouncements();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to publish announcement');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Megaphone className="w-7 h-7 text-amber-400" />
            Campus Broadcast Announcements
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Publish institutional circulars, holiday notices, exam schedules, and urgent notifications
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          className="shadow-lg shadow-amber-600/30 self-start sm:self-auto bg-amber-600 hover:bg-amber-500 border-none"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Broadcast New Notice
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

      {/* Announcements List */}
      {loading ? (
        <div className="space-y-4">
          <LoadingSkeleton height="120px" />
          <LoadingSkeleton height="120px" />
          <LoadingSkeleton height="120px" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="p-16 rounded-2xl bg-[#0B132B]/80 border border-slate-800 text-center">
          <Megaphone className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">No Announcements Published</h3>
          <p className="text-xs text-slate-500 mt-1">Broadcast official news to students and faculty above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#0B132B]/90 border border-slate-800 hover:border-slate-700 transition space-y-3 shadow-lg"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider ${
                      item.priority === 'URGENT'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : item.priority === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {item.priority}
                  </span>
                  <Badge variant="info">Target: {item.targetRole}</Badge>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-sm text-slate-300 mt-1.5 leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Posted by <strong className="text-white">{item.authorName}</strong></span>
                </span>
                <span className="font-mono text-[11px] text-slate-500">ID #{item.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Broadcast Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Broadcast Institutional Notice"
      >
        <form onSubmit={handlePublish} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Notice Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. End Semester Examination Schedule Announcement"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Audience *</label>
              <select
                value={form.targetRole}
                onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">All Campus (Everyone)</option>
                <option value="STUDENT">Students Only</option>
                <option value="FACULTY">Faculty Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Priority Level *</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="NORMAL">NORMAL</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Circular Content *</label>
            <textarea
              required
              rows={4}
              placeholder="Enter full announcement body, instructions, dates, or guidelines..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Broadcasting...' : 'Publish Announcement'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
