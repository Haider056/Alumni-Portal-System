import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import { AppShell, CoverImage, DateTile, Loading, formatDate, formatTiming, relativeDays } from './ui';

function Row({ icon, label, children }) {
  return (
    <div className="flex gap-3 py-3 border-t border-line first:border-t-0">
      <span className="h-8 w-8 rounded-ctl bg-canvas border border-line inline-flex items-center justify-center text-ink-3 shrink-0">{icon}</span>
      <div>
        <div className="text-xs text-ink-3">{label}</div>
        <div className="text-sm font-medium text-ink mt-0.5">{children}</div>
      </div>
    </div>
  );
}

export default function EventDetails() {
  const { id } = useParams();
  const [userRole, setUserRole] = useState('');
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      const parsedRole = JSON.parse(storedRole);
      setUserRole(parsedRole.role);
    }

    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3001/auth/event/${id}`, { credentials: 'include' });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error('Error fetching Event:', error);
      }
    };
    fetchEvent();
  }, [id]);

  if (!event) return <AppShell role={userRole}><Loading /></AppShell>;

  return (
    <AppShell role={userRole}>
      <div className="bg-surface border-b border-line">
        <div className="page pt-6 pb-8">
          <Link to="/UpcomingEvents" className="inline-flex items-center gap-1.5 text-sm text-ink-3 hover:text-ink">
            <FiArrowLeft /> All events
          </Link>
          <div className="mt-6 flex items-center gap-5">
            <DateTile date={event.eventDate} size="lg" />
            <div>
              <div className="eyebrow">{relativeDays(event.eventDate)} · {formatDate(event.eventDate, { weekday: 'long' })}</div>
              <h1 className="text-xl mt-1">{event.eventTitle}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="page py-10 grid grid-cols-12 gap-10">
        <article className="col-span-8">
          <CoverImage src={event.imageURL} alt={event.eventTitle} className="w-full aspect-[12/7] rounded-card border border-line" />
          <h2 className="text-base font-semibold mt-8 mb-2">About this event</h2>
          <p className="text-md text-ink-2 leading-8 whitespace-pre-line">{event.eventDescription}</p>
        </article>
        <aside className="col-span-4">
          <div className="card p-5 sticky top-24">
            <div className="eyebrow mb-2">Details</div>
            <Row icon={<FiCalendar />} label="Date">{formatDate(event.eventDate, { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</Row>
            <Row icon={<FiClock />} label="Starts">{formatTiming(event.eventTiming)}</Row>
            <Row icon={<FiMapPin />} label="Venue">{event.eventLocations}</Row>
            <div className="mt-4 pt-4 border-t border-line text-xs text-ink-3 leading-5">
              Open to IST alumni and students. Bring your university or alumni card for entry.
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
