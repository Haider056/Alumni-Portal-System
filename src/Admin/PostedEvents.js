import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { AppShell, PageHeader, DateTile, EmptyState, formatTiming, relativeDays, parseDate } from '../Components/ui';

const PostedEvents = () => {
  const [eventsList, setEventsList] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const userEmail = localStorage.getItem('email');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://localhost:3001/auth/allEvents`, { credentials: 'include' });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setEventsList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching Events:', error);
      } finally {
        setLoaded(true);
      }
    };
    fetchEvents();
    fetch('http://localhost:3001/auth/bookings', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setBookings(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, [userEmail]);

  const handleClick = () => navigate('/postEvents');

  const deleteEvent = async (eventId) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      const response = await fetch(`http://localhost:3001/auth/events/${eventId}`, { method: 'DELETE', credentials: 'include' });
      if (!response.ok) throw new Error('Network response was not ok');
      setEventsList(eventsList.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const sorted = [...eventsList].sort((a, b) => (parseDate(a.eventDate) || 0) - (parseDate(b.eventDate) || 0));
  const isBooked = (e) => bookings.some((b) => b.eventTitle === e.eventTitle && b.eventDate === e.eventDate);

  return (
    <AppShell role="admin">
      <PageHeader
        eyebrow="Admin · Events"
        title="Posted events"
        description="Events published to the calendar, with their auditorium bookings."
        actions={<button type="button" className="btn btn-primary" onClick={handleClick}><FiPlus className="text-[15px]" /> New event</button>}
      />
      <div className="page py-8 grid grid-cols-12 gap-6">
        <section className="col-span-8">
          {loaded && sorted.length === 0 && <EmptyState title="No events yet" action={<button type="button" className="btn btn-primary" onClick={handleClick}>Create event</button>} />}
          {sorted.length > 0 && (
            <div className="card overflow-hidden">
              <ul className="divide-y divide-line">
                {sorted.map((event) => (
                  <li key={event.id} className="flex items-center gap-4 px-5 py-4">
                    <DateTile date={event.eventDate} />
                    <Link to={`/event/${event.id}`} className="min-w-0 flex-1 group">
                      <div className="text-sm font-medium group-hover:text-accent">{event.eventTitle}</div>
                      <div className="text-sm text-ink-3 mt-0.5">{formatTiming(event.eventTiming)} · {event.eventLocations}</div>
                    </Link>
                    {isBooked(event) && <span className="badge badge-accent">Auditorium booked</span>}
                    <span className="font-mono text-2xs uppercase text-ink-4 w-24 text-right">{relativeDays(event.eventDate)}</span>
                    <button type="button" aria-label="Delete event" className="btn btn-danger btn-sm px-2.5" onClick={() => deleteEvent(event.id)}><FiTrash2 /></button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
        <aside className="col-span-4">
          <div className="card">
            <div className="px-5 h-12 flex items-center justify-between border-b border-line">
              <span className="text-sm font-semibold">Auditorium schedule</span>
              <span className="font-mono text-2xs text-ink-4">{bookings.length} BOOKINGS</span>
            </div>
            <ul className="divide-y divide-line">
              {bookings.map((b) => (
                <li key={b.id} className="px-5 py-3">
                  <div className="text-sm font-medium">{b.eventTitle}</div>
                  <div className="font-mono text-xs text-ink-3 mt-0.5 tnum">{b.eventDate} · {String(b.eventTime).slice(0, 5)}–{String(b.eventEndTime).slice(0, 5)}</div>
                </li>
              ))}
              {bookings.length === 0 && <li className="px-5 py-6 text-sm text-ink-3">No bookings.</li>}
            </ul>
          </div>
        </aside>
      </div>
    </AppShell>
  );
};

export default PostedEvents;
