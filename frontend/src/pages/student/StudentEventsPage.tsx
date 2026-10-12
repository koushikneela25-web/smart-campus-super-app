import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsApi } from '../../api/eventsApi';
import { CampusEvent, EventCategory } from '../../types';
import {
  CalendarCheck2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

const CATEGORIES: ('ALL' | EventCategory)[] = [
  'ALL',
  'TECHNICAL',
  'WORKSHOP',
  'ACADEMIC',
  'CULTURAL',
  'SPORTS',
];

export const StudentEventsPage: React.FC = () => {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | EventCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedCategory !== 'ALL') {
        params.category = selectedCategory;
      }
      const data = await eventsApi.getEvents(params);
      setEvents(data);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to load campus events',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory]);

  const handleRsvp = async (event: CampusEvent) => {
    try {
      setProcessingId(event.id);
      setFeedback(null);
      if (event.isRegisteredByMe) {
        await eventsApi.cancelRsvp(event.id);
        setFeedback({ type: 'success', message: `RSVP cancelled for "${event.title}".` });
      } else {
        await eventsApi.rsvpEvent(event.id);
        setFeedback({ type: 'success', message: `Successfully registered for "${event.title}"!` });
      }
      await fetchEvents();
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || 'Transaction failed. Capacity may be fully booked.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <CalendarCheck2 className="w-7 h-7 text-purple-400" />
            Campus Events & Workshops
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Discover hackathons, guest lectures, club meets, and sports tournaments with real-time seat reservation
          </p>
        </div>
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

      {/* Search & Category Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-[#0B132B] text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events by title or venue..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0B132B] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LoadingSkeleton height="280px" />
          <LoadingSkeleton height="280px" />
          <LoadingSkeleton height="280px" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-16 rounded-2xl bg-[#0B132B]/80 border border-slate-800 text-center">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">No Events Found</h3>
          <p className="text-xs text-slate-500 mt-1">Try switching categories or clearing your search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((item) => {
            const isFull = item.registeredCount >= item.maxCapacity;
            const pct = Math.round((item.registeredCount / item.maxCapacity) * 100);

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-[#0B132B]/90 border border-slate-800 hover:border-purple-500/40 transition flex flex-col justify-between overflow-hidden group shadow-lg"
              >
                <div className="p-5 space-y-4">
                  {/* Category and Status */}
                  <div className="flex items-center justify-between">
                    <Badge variant="purple">{item.category}</Badge>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded uppercase ${
                        item.status === 'UPCOMING'
                          ? 'bg-blue-500/20 text-blue-300'
                          : item.status === 'ONGOING'
                          ? 'bg-emerald-500/20 text-emerald-300 animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Date, Time, Venue */}
                  <div className="space-y-2 text-xs text-slate-300 pt-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>{new Date(item.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>
                        {new Date(item.startTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} -{' '}
                        {new Date(item.endTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="truncate">{item.venue}</span>
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> Seats Filled
                      </span>
                      <span className="font-mono text-slate-200">
                        {item.registeredCount} / {item.maxCapacity} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          pct >= 90 ? 'bg-rose-500' : pct >= 60 ? 'bg-amber-500' : 'bg-purple-500'
                        }`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between gap-3">
                  <Link
                    to={`/student/events/${item.id}`}
                    className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    View Details <ArrowRight className="w-3 h-3" />
                  </Link>

                  {item.isRegisteredByMe ? (
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={processingId === item.id}
                      onClick={() => handleRsvp(item)}
                      className="text-xs"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" />
                      {processingId === item.id ? 'Updating...' : 'Cancel RSVP'}
                    </Button>
                  ) : isFull ? (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Housefull
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="primary"
                      disabled={processingId === item.id}
                      onClick={() => handleRsvp(item)}
                      className="text-xs shadow-md shadow-purple-600/30"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      {processingId === item.id ? 'Booking...' : 'Reserve Spot'}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
