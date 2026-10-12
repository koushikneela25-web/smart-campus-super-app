import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventsApi } from '../../api/eventsApi';
import { CampusEvent } from '../../types';
import {
  CalendarCheck2,
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Share2,
} from 'lucide-react';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export const StudentEventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<CampusEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchEvent = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await eventsApi.getEventById(Number(id));
      setEvent(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch event details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleRsvp = async () => {
    if (!event) return;
    try {
      setSubmitting(true);
      setFeedback(null);
      if (event.isRegisteredByMe) {
        await eventsApi.cancelRsvp(event.id);
        setFeedback({ type: 'success', message: 'RSVP successfully cancelled.' });
      } else {
        await eventsApi.rsvpEvent(event.id);
        setFeedback({ type: 'success', message: 'You have registered for this event!' });
      }
      await fetchEvent();
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || 'Action failed. Capacity might be full.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton height="40px" width="150px" />
        <LoadingSkeleton height="350px" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-rose-300">Event Not Found</h3>
        <p className="text-sm text-rose-200/80 mb-4">{error || 'Requested event does not exist.'}</p>
        <Button onClick={() => navigate('/student/events')} variant="secondary">
          Back to Events List
        </Button>
      </div>
    );
  }

  const isFull = event.registeredCount >= event.maxCapacity;
  const pct = Math.round((event.registeredCount / event.maxCapacity) * 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          to="/student/events"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Events
        </Link>
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

      {/* Event Details Card */}
      <div className="rounded-2xl bg-[#0B132B] border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="purple">{event.category}</Badge>
              <Badge
                variant={
                  event.status === 'UPCOMING'
                    ? 'info'
                    : event.status === 'ONGOING'
                    ? 'success'
                    : 'secondary'
                }
              >
                {event.status}
              </Badge>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Event link copied to clipboard!');
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700/60"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{event.title}</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Date</p>
                <p className="font-semibold text-white">
                  {new Date(event.startTime).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-300">
              <Clock className="w-4 h-4 text-teal-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Time Window</p>
                <p className="font-semibold text-white">
                  {new Date(event.startTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} -{' '}
                  {new Date(event.endTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Venue</p>
                <p className="font-semibold text-white truncate">{event.venue}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">About This Event</h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{event.description}</p>
          </div>

          {/* Organizer details */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 uppercase font-semibold">Organized By</p>
              <p className="text-sm font-bold text-white">{event.organizerName}</p>
            </div>
          </div>

          {/* Capacity Section */}
          <div className="space-y-2 p-5 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                <Users className="w-4 h-4 text-purple-400" />
                Auditorium / Seating Capacity
              </span>
              <span className="font-mono text-slate-200">
                {event.registeredCount} / {event.maxCapacity} ({pct}%)
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  pct >= 90 ? 'bg-rose-500' : pct >= 60 ? 'bg-amber-500' : 'bg-purple-500'
                }`}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              {event.maxCapacity - event.registeredCount} spots remaining before booking closes.
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-4 flex justify-end">
            {event.isRegisteredByMe ? (
              <Button
                variant="danger"
                disabled={submitting}
                onClick={handleRsvp}
                className="px-6 py-2.5"
              >
                <XCircle className="w-4 h-4 mr-2" />
                {submitting ? 'Cancelling...' : 'Cancel My RSVP'}
              </Button>
            ) : isFull ? (
              <Button variant="secondary" disabled className="px-6 py-2.5 opacity-60">
                Capacity Reached
              </Button>
            ) : (
              <Button
                variant="primary"
                disabled={submitting}
                onClick={handleRsvp}
                className="px-8 py-2.5 shadow-lg shadow-purple-600/30"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {submitting ? 'Reserving...' : 'RSVP for Event'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
