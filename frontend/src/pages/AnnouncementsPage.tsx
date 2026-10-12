import React, { useState, useEffect } from 'react';
import { announcementApi } from '../api/notificationApi';
import { AnnouncementItem } from '../types';
import { Badge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Megaphone, Calendar, User, AlertTriangle } from 'lucide-react';

export const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await announcementApi.getAnnouncements();
        setAnnouncements(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return <Badge variant="danger" size="sm" className="gap-1"><AlertTriangle className="w-3 h-3" /> URGENT</Badge>;
      case 'HIGH':
        return <Badge variant="warning" size="sm">HIGH PRIORITY</Badge>;
      default:
        return <Badge variant="neutral" size="sm">ANNOUNCEMENT</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Campus Broadcasts & Announcements</h1>
        <p className="text-xs text-slate-400 mt-1">Official circulars, academic notices, and university-wide alerts</p>
      </div>

      {isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : announcements.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 border border-slate-800">
          <EmptyState
            icon={<Megaphone className="w-8 h-8" />}
            title="No Active Announcements"
            description="There are no active campus circulars published for your role at this time."
          />
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div
              key={a.id}
              className={`glass-panel rounded-2xl p-6 border transition-all duration-200 ${
                a.priority === 'URGENT'
                  ? 'border-rose-500/40 bg-rose-500/5 hover:border-rose-500/60'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  {getPriorityBadge(a.priority)}
                  <span className="text-xs text-slate-400">Target: <strong className="text-slate-300">{a.targetRole}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-white mb-2">{a.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{a.content}</p>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>Published by: <strong className="text-slate-200">{a.authorName}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
