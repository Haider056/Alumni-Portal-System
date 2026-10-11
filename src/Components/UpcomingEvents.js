import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiClock, FiMapPin, FiArrowRight, FiPlus } from 'react-icons/fi';
import { AppShell, PageHeader, DateTile, CoverImage, EmptyState, formatTiming, parseDate, relativeDays } from './ui';

export default function UpComingEvents() {
  const [userRole, setUserRole] = useState('');
  const [eventsList, setEventsList] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState('upcoming');
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      const parsedRole = JSON.parse(storedRole);
      setUserRole(parsedRole.role);
    }

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
  }, []);

  const { upcoming, past } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sorted = [...eventsList].sort((a, b) => (parseDate(a.eventDate) || 0) - (parseDate(b.eventDate) || 0));
    return {
      upcoming: sorted.filter((e) => { const d = parseDate(e.eventDate); return !d || d >= today; }),
      past: sorted.filter((e) => { const d = parseDate(e.eventDate); return d && d < today; }).reverse(),
    };
  }, [eventsList]);

  const list = view === 'upcoming' ? upcoming : past;

  // group by month
  const groups = [];
  list.forEach((e) => {
    const d = parseDate(e.eventDate);
    const key = d ? d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Date to be announced';
    const g = groups.find((x) => x.key === key);
    if (g) g.items.push(e); else groups.push({ key, items: [e] });
  });

  return (
    <AppShell role={userRole}>
      <PageHeader
        eyebrow="Calendar"
        title="Events"
        description="Meetups, career fairs and workshops on campus and online."
        actions={userRole === 'admin' && (
          <Link to="/PostEvents" className="btn btn-primary"><FiPlus className="text-[15px]" /> New event</Link>
        )}
      />

      <div className="page py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="segmented">
            <button type="button" aria-pressed={view === 'upcoming'} onClick={() => setView('upcoming')}>
              Upcoming <span className="font-mono text-2xs text-ink-4 ml-1">{upcoming.length}</span>
            </button>
            <button type="button" aria-pressed={view === 'past'} onClick={() => setView('past')}>
              Past <span className="font-mono text-2xs text-ink-4 ml-1">{past.length}</span>
            </button>
          </div>
        </div>

        {loaded && list.length === 0 && (
          <EmptyState title={view === 'upcoming' ? 'No upcoming events' : 'No past events'} description="New events from the alumni office will appear here." />
        )}

        <div className="space-y-10">
          {groups.map((g) => (
            <section key={g.key}>
              <h2 className="eyebrow mb-3">{g.key}</h2>
              <ul className="space-y-3">
                {g.items.map((event) => (
                  <li key={event.id}>
                    <div
                      role="link"
                      tabIndex={0}
                      data-event-id={event.id}
                      onClick={() => navigate(`/event/${event.id}`)}
                      onKeyDown={(e) => e.key === 'Enter' && navigate(`/event/${event.id}`)}
                      className="group card p-4 flex gap-5 cursor-pointer hover:border-line-strong transition-colors"
                    >
                      <DateTile date={event.eventDate} size="lg" />
                      <div className="min-w-0 flex-1 py-0.5">
                        <div className="flex items-center gap-2">
                          <h3 className="text-md font-semibold group-hover:text-accent">{event.eventTitle}</h3>
                          <span className="font-mono text-2xs uppercase text-ink-4">{relativeDays(event.eventDate)}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-ink-3 mt-1">
                          <span className="inline-flex items-center gap-1.5"><FiClock /> {formatTiming(event.eventTiming)}</span>
                          <span className="inline-flex items-center gap-1.5"><FiMapPin /> {event.eventLocations}</span>
                        </div>
                        <p className="text-sm text-ink-2 mt-2.5 clamp-2 max-w-2xl">{event.eventDescription}</p>
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-accent mt-3">
                          View details <FiArrowRight />
                        </span>
                      </div>
                      <CoverImage src={event.imageURL} alt="" className="w-[248px] aspect-[12/7] self-start rounded-ctl border border-line shrink-0" />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
