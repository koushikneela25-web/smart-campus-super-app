import React, { useState, useEffect } from 'react';
import { notificationApi } from '../api/notificationApi';
import { NotificationItem } from '../types';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Bell, Check, Clock, QrCode, CalendarDays, CalendarCheck2, Search, Megaphone } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await notificationApi.getMyNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id: number) => {
    try {
      await notificationApi.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAll = async () => {
    try {
      await notificationApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ATTENDANCE':
        return <QrCode className="w-4 h-4 text-emerald-400" />;
      case 'TIMETABLE':
        return <CalendarDays className="w-4 h-4 text-sky-400" />;
      case 'EVENT':
        return <CalendarCheck2 className="w-4 h-4 text-purple-400" />;
      case 'LOST_FOUND':
        return <Search className="w-4 h-4 text-amber-400" />;
      case 'ANNOUNCEMENT':
        return <Megaphone className="w-4 h-4 text-teal-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Notification Feed</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time alerts for attendance, timetables, events, and lost & found</p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <Button variant="secondary" size="sm" onClick={handleMarkAll} leftIcon={<Check className="w-4 h-4" />}>
            Mark All as Read
          </Button>
        )}
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <LoadingSkeleton rows={5} />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12">
            <EmptyState
              icon={<Bell className="w-8 h-8" />}
              title="No Notifications Yet"
              description="You're all caught up! New attendance check-ins, timetable updates, and event alerts will appear here."
            />
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.isRead && handleMarkRead(n.id)}
                className={`p-4 sm:p-5 flex items-start gap-4 transition-colors cursor-pointer ${
                  !n.isRead ? 'bg-blue-600/10 hover:bg-blue-600/15' : 'hover:bg-slate-800/30'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 shrink-0">
                  {getTypeIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-white">{n.title}</h4>
                    <Badge variant="neutral" size="sm">
                      {n.type}
                    </Badge>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {!n.isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkRead(n.id);
                    }}
                    title="Mark read"
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
