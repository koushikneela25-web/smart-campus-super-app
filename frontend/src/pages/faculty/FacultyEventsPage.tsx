import React, { useState, useEffect } from 'react';
import { eventsApi } from '../../api/eventsApi';
import { CampusEvent, EventCategory } from '../../types';
import {
  CalendarCheck2,
  PlusCircle,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export const FacultyEventsPage: React.FC = () => {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'WORKSHOP' as EventCategory,
    venue: '',
    startTime: '',
    endTime: '',
    maxCapacity: 100,
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsApi.getEvents();
      setEvents(data);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to fetch events',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.venue || !form.startTime || !form.endTime) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      await eventsApi.createEvent({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        venue: form.venue.trim(),
        startTime: form.startTime,
        endTime: form.endTime,
        maxCapacity: Number(form.maxCapacity),
      });

      setIsCreateModalOpen(false);
      setForm({
        title: '',
        description: '',
        category: 'WORKSHOP',
        venue: '',
        startTime: '',
        endTime: '',
        maxCapacity: 100,
      });
      setFeedback({
        type: 'success',
        message: 'Campus event successfully scheduled and published to the student portal!',
      });
      fetchEvents();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to publish event');
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
            <CalendarCheck2 className="w-7 h-7 text-purple-400" />
            Campus Event Administration
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Host technical hackathons, guest lectures, department workshops, and manage seat reservations
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          className="shadow-lg shadow-purple-600/30 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Schedule New Event
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

      {/* Event Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LoadingSkeleton height="260px" />
          <LoadingSkeleton height="260px" />
          <LoadingSkeleton height="260px" />
        </div>
      ) : events.length === 0 ? (
        <div className="p-16 rounded-2xl bg-[#0B132B]/80 border border-slate-800 text-center">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">No Events Scheduled</h3>
          <p className="text-xs text-slate-500 mt-1">Create your first faculty or department event today.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((item) => {
            const pct = Math.round((item.registeredCount / item.maxCapacity) * 100);
            return (
              <div
                key={item.id}
                className="rounded-2xl bg-[#0B132B]/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between overflow-hidden shadow-lg p-5 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="purple">{item.category}</Badge>
                    <span className="text-[11px] font-mono text-slate-400">
                      Organized by: {item.organizerName}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>{new Date(item.startTime).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="truncate">{item.venue}</span>
                    </div>
                  </div>

                  {/* Seat Reservation progress */}
                  <div className="space-y-1 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> Bookings
                      </span>
                      <span className="font-mono text-teal-300 font-semibold">
                        {item.registeredCount} / {item.maxCapacity} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-purple-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Status: <strong className="text-white">{item.status}</strong></span>
                  <span className="text-[11px] font-mono text-slate-500">ID #{item.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Event Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Schedule New Campus Event"
      >
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Event Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Annual AI & Robotics Hackathon 2026"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as EventCategory })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                <option value="WORKSHOP">WORKSHOP</option>
                <option value="TECHNICAL">TECHNICAL</option>
                <option value="ACADEMIC">ACADEMIC</option>
                <option value="CULTURAL">CULTURAL</option>
                <option value="SPORTS">SPORTS</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Max Capacity (Seats) *</label>
              <input
                type="number"
                required
                min={1}
                value={form.maxCapacity}
                onChange={(e) => setForm({ ...form, maxCapacity: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Campus Venue *</label>
            <input
              type="text"
              required
              placeholder="e.g. Main Campus Auditorium / Hall B"
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Start Time *</label>
              <input
                type="datetime-local"
                required
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">End Time *</label>
              <input
                type="datetime-local"
                required
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description *</label>
            <textarea
              required
              rows={3}
              placeholder="Outline agenda, prerequisites, key takeaways, and speakers..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish Event'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
