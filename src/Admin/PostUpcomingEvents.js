import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiImage, FiAlertTriangle, FiCheck } from 'react-icons/fi';
import { AppShell, PageHeader, FormSection, FormActions, Notice } from '../Components/ui';

function Switch({ checked, onChange, id }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative h-6 w-10 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-line-strong'}`}
      style={{ margin: 0 }}
    >
      <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-xs transition-transform ${checked ? 'translate-x-4' : ''}`} />
    </button>
  );
}

const toMinutes = (t) => {
  const [h, m] = String(t).split(':').map(Number);
  return h * 60 + (m || 0);
};

export default function PostUpcomingEvents() {
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [eventLocations, setEventLocations] = useState('');
  const [eventTiming, setEventTiming] = useState(() => { const d = new Date(); d.setHours(18, 0, 0, 0); return d; });
  const [imageFile, setImageFile] = useState(null);
  const [eventEndTime, setEventEndTime] = useState(() => { const d = new Date(); d.setHours(20, 0, 0, 0); return d; });
  const [showAuditoriumBooking, setShowAuditoriumBooking] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/auth/bookings', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setBookings(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  const handleFileChange = (e) => setImageFile(e.target.files[0]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTime = (time) => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  // Display format stored on the event ("06:00 PM"), matching existing rows.
  const formatDisplayTime = (time) => time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const dayBookings = bookings.filter((b) => b.eventDate === formatDate(eventDate));
  const start = toMinutes(formatTime(eventTiming));
  const end = toMinutes(formatTime(eventEndTime));
  const isThisEvent = (b) => booked && b.eventTitle === eventTitle;
  const conflicts = dayBookings.filter((b) => !isThisEvent(b) && toMinutes(b.eventTime) < end && toMinutes(b.eventEndTime) > start);

  const handlePostEvent = (e) => {
    if (e) e.preventDefault();
    setStatus(null);
    setSubmitting(true);
    const formData = new FormData();
    formData.append('title', eventTitle);
    formData.append('description', eventDescription);
    formData.append('date', formatDate(eventDate));
    formData.append('locations', eventLocations);
    formData.append('timing', formatDisplayTime(eventTiming));
    if (imageFile) formData.append('image', imageFile);

    const bookAuditorium = () => {
      if (!showAuditoriumBooking) return Promise.resolve();
      const eventData = {
        eventTitle: eventTitle,
        eventDate: formatDate(eventDate),
        eventTime: formatTime(eventTiming),
        eventEndTime: formatTime(eventEndTime),
      };
      return fetch('http://localhost:3001/auth/book', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      }).then((response) => {
        if (response.ok) return response.json();
        return response.json().then((data) => {
          const err = new Error(data.message || 'Failed to book auditorium');
          err.userMessage = data.message;
          throw err;
        });
      });
    };

    bookAuditorium()
      .then(() => fetch('http://localhost:3001/auth/CreateEvents', { method: 'POST', credentials: 'include', body: formData }))
      .then((response) => {
        if (!response.ok) throw new Error('Failed to register event');
        setStatus({
          tone: 'success',
          text: showAuditoriumBooking
            ? `Event published and auditorium booked for ${formatDate(eventDate)}, ${formatTime(eventTiming).slice(0, 5)}–${formatTime(eventEndTime).slice(0, 5)}.`
            : 'Event published to the calendar.',
        });
        if (showAuditoriumBooking) {
          setBooked(true);
          setBookings((prev) => [...prev, { id: `new-${Date.now()}`, eventTitle, eventDate: formatDate(eventDate), eventTime: formatTime(eventTiming), eventEndTime: formatTime(eventEndTime) }]);
        }
      })
      .catch((error) => {
        console.error('Error:', error.message);
        setStatus({ tone: 'danger', text: error.userMessage ? `Auditorium not booked: ${error.userMessage}.` : 'Failed to register event.' });
      })
      .finally(() => setSubmitting(false));
  };

  const timePicker = (id, selected, onChange) => (
    <DatePicker
      id={id}
      selected={selected}
      onChange={onChange}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15}
      timeCaption="Time"
      dateFormat="hh:mm aa"
      minTime={new Date().setHours(8, 0, 0)}
      maxTime={new Date().setHours(23, 0, 0)}
      className="input"
    />
  );

  return (
    <AppShell role="admin">
      <PageHeader
        eyebrow="Admin · Events"
        title="New event"
        description="Publish an event to the calendar and, if needed, reserve the main auditorium."
        actions={<Link to="/PostedEvents" className="btn btn-secondary">All events</Link>}
      />
      <div className="page py-8">
        <form onSubmit={handlePostEvent} className="card px-8 pt-8">
          {status && <div className="mb-6"><Notice tone={status.tone} onClose={() => setStatus(null)}>{status.text}</Notice></div>}

          <FormSection title="Event" description="Title and description as they appear on the events page.">
            <div>
              <label className="label" htmlFor="eventTitle">Title</label>
              <input id="eventTitle" type="text" className="input" placeholder="e.g. Final Year Project Showcase" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="eventDescription">Description</label>
              <textarea id="eventDescription" rows={4} className="input" placeholder="What is happening, who it is for, what to bring." value={eventDescription} onChange={(e) => setEventDescription(e.target.value)}></textarea>
            </div>
          </FormSection>

          <FormSection title="When & where">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label" htmlFor="eventDate">Date</label>
                <DatePicker id="eventDate" selected={eventDate} onChange={(date) => setEventDate(date)} className="input" dateFormat="EEE, MMM d, yyyy" />
              </div>
              <div>
                <label className="label" htmlFor="eventStart">Start time</label>
                {timePicker('eventStart', eventTiming, (date) => setEventTiming(date))}
              </div>
              <div>
                <label className="label" htmlFor="eventLocations">Venue</label>
                <input id="eventLocations" type="text" className="input" placeholder="Main Auditorium" value={eventLocations} onChange={(e) => setEventLocations(e.target.value)} />
              </div>
            </div>
            <label htmlFor="eventImage" className="flex items-center gap-4 rounded-card border border-dashed border-line-strong bg-canvas px-5 py-5 cursor-pointer hover:border-accent">
              <span className="h-10 w-10 rounded-ctl bg-surface border border-line inline-flex items-center justify-center text-ink-3"><FiImage /></span>
              <span>
                <span className="block text-sm font-medium">{imageFile ? imageFile.name : 'Upload a cover image'}</span>
                <span className="block text-xs text-ink-3">PNG or JPG, 1200 × 700 recommended</span>
              </span>
              <input id="eventImage" type="file" accept="image/*" className="sr-only" name="imageFile" onChange={handleFileChange} />
            </label>
          </FormSection>

          <FormSection title="Auditorium" description="Reserve the main auditorium. Overlapping bookings are rejected.">
            <div className="flex items-center justify-between rounded-ctl border border-line px-4 py-3">
              <div>
                <label htmlFor="auditoriumBooking" className="text-sm font-medium">Book the auditorium for this event</label>
                <div className="text-xs text-ink-3">Main auditorium, IST campus</div>
              </div>
              <Switch id="auditoriumBooking" checked={showAuditoriumBooking} onChange={() => setShowAuditoriumBooking(!showAuditoriumBooking)} />
            </div>

            {showAuditoriumBooking && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="label">Date</span>
                    <div className="input flex items-center bg-canvas text-ink-2 font-mono text-sm">{formatDate(eventDate)}</div>
                  </div>
                  <div>
                    <label className="label" htmlFor="bookingStart">From</label>
                    {timePicker('bookingStart', eventTiming, (date) => setEventTiming(date))}
                  </div>
                  <div>
                    <label className="label" htmlFor="bookingEnd">Until</label>
                    {timePicker('bookingEnd', eventEndTime, (date) => setEventEndTime(date))}
                  </div>
                </div>

                <div className="rounded-ctl border border-line">
                  <div className="px-4 h-10 flex items-center justify-between border-b border-line bg-canvas rounded-t-ctl">
                    <span className="eyebrow">Bookings on {formatDate(eventDate)}</span>
                    {booked ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success"><FiCheck /> Booked</span>
                    ) : conflicts.length > 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-danger"><FiAlertTriangle /> Overlaps existing booking</span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success"><FiCheck /> Slot available</span>
                    )}
                  </div>
                  <ul className="divide-y divide-line">
                    {dayBookings.map((b) => (
                      <li key={b.id} className="px-4 py-2.5 flex items-center justify-between text-sm">
                        <span className={conflicts.includes(b) ? 'text-danger font-medium' : isThisEvent(b) ? 'text-ink font-medium' : 'text-ink-2'}>
                          {b.eventTitle}{isThisEvent(b) && <span className="badge badge-accent ml-2 h-5">This event</span>}
                        </span>
                        <span className="font-mono text-xs text-ink-3 tnum">{String(b.eventTime).slice(0, 5)}–{String(b.eventEndTime).slice(0, 5)}</span>
                      </li>
                    ))}
                    {dayBookings.length === 0 && <li className="px-4 py-3 text-sm text-ink-3">No other bookings on this day.</li>}
                  </ul>
                </div>
              </div>
            )}
          </FormSection>

          <FormActions note={showAuditoriumBooking ? 'The auditorium is booked first, then the event is published.' : 'The event is published immediately.'}>
            <Link to="/PostedEvents" className="btn btn-ghost">Cancel</Link>
            <button id="publish-event" type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Publishing…' : showAuditoriumBooking ? 'Book & publish' : 'Publish event'}
            </button>
          </FormActions>
        </form>
      </div>
    </AppShell>
  );
}
