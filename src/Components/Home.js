import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiChevronRight, FiMapPin, FiClock, FiPlus } from 'react-icons/fi';
import './Styles/home.css';
import {
  AppShell, Avatar, DateTile, JobTypeBadge, Loading, CoverImage,
  formatDate, formatTiming, parseDate, postedAgo, relativeDays,
} from './ui';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

const ROLE_COPY = {
  alumni: 'Here is what is happening across the IST network this week.',
  student: 'New openings, events and stories from IST graduates.',
  admin: 'An overview of the portal. Publish news and events from the menu above.',
};

function Stat({ label, value, sub }) {
  return (
    <div className="px-6 py-5 first:pl-0">
      <div className="eyebrow">{label}</div>
      <div className="text-xl font-semibold tnum mt-2">{value}</div>
      <div className="text-sm text-ink-3 mt-0.5 truncate">{sub}</div>
    </div>
  );
}

function Home() {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successStories, setSuccessStories] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [eventsList, setEventsList] = useState([]);

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    const storedRole = localStorage.getItem('role');
    if (storedName) setUserName(storedName);
    if (storedRole) {
      const parsedRole = JSON.parse(storedRole);
      setUserRole(parsedRole.role);
    }
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`http://localhost:3001/auth/AllPostedJobs/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        const data = await response.json();
        setJobs(data.allPostJobsOrInternships || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError(error);
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://localhost:3001/auth/allEvents`, { credentials: 'include' });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setEventsList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching Events:', error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchSuccessStories = async () => {
      try {
        const response = await fetch(`http://localhost:3001/auth/AllSuccessStories/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        const data = await response.json();
        setSuccessStories(data.successStories || []);
      } catch (error) {
        console.error('Error fetching alumni success stories:', error);
      }
    };
    fetchSuccessStories();
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`http://localhost:3001/auth/getnews`, { credentials: 'include' });
        const data = await response.json();
        if (data && data.news && data.news.length > 0) setNewsList(data.news);
      } catch (error) {
        console.error('Error fetching News:', error);
      }
    };
    fetchNews();
  }, []);

  if (isLoading) return <AppShell><Loading /></AppShell>;
  if (error) return <AppShell><div className="page py-16 text-danger">Error: {error.message}</div></AppShell>;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = [...eventsList]
    .filter((e) => { const d = parseDate(e.eventDate); return !d || d >= today; })
    .sort((a, b) => (parseDate(a.eventDate) || 0) - (parseDate(b.eventDate) || 0));
  const internships = jobs.filter((j) => /intern/i.test(j.jobType || '')).length;
  const latestJobs = [...jobs].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)).slice(0, 5);
  const firstName = (userName || '').split(' ')[0];

  const primary =
    userRole === 'alumni' ? { to: '/PastJoborInternship', label: 'Post a job' } :
    userRole === 'admin' ? { to: '/PostEvents', label: 'New event' } :
    { to: '/jobPage', label: 'Browse jobs' };

  return (
    <AppShell role={userRole}>
      {/* Welcome header */}
      <section className="bg-surface border-b border-line">
        <div className="page pt-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="eyebrow mb-2">
                {today.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <h1 className="text-2xl">{greeting()}, {firstName}</h1>
              <p className="text-md text-ink-3 mt-2">{ROLE_COPY[userRole] || ROLE_COPY.student}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/Portfolio" className="btn btn-secondary">View portfolio</Link>
              <Link to={primary.to} className="btn btn-primary">
                {userRole !== 'student' && <FiPlus className="text-[15px]" />}{primary.label}
              </Link>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-4 divide-x divide-line border-t border-line">
            <Stat label="Open roles" value={jobs.length} sub={`${internships} internships · ${jobs.length - internships} jobs`} />
            <Stat
              label="Upcoming events"
              value={upcoming.length}
              sub={upcoming[0] ? `Next: ${formatDate(upcoming[0].eventDate, { month: 'short', day: 'numeric' })} · ${upcoming[0].eventTitle}` : 'Nothing scheduled'}
            />
            <Stat label="News posts" value={newsList.length} sub={newsList[0] ? `Latest ${formatDate(newsList[0].created_at, { month: 'short', day: 'numeric' })}` : 'No posts yet'} />
            <Stat label="Success stories" value={successStories.length} sub="Shared by IST graduates" />
          </div>
        </div>
      </section>

      <div className="page py-10 space-y-12">
        {/* Jobs + events */}
        <div className="grid grid-cols-12 gap-6">
          <section className="col-span-8 card overflow-hidden">
            <div className="flex items-center justify-between px-5 h-14 border-b border-line">
              <h2 className="text-base font-semibold">Latest openings</h2>
              <Link to="/jobpage" className="text-sm text-ink-3 hover:text-ink inline-flex items-center gap-1">
                View all {jobs.length} <FiArrowRight />
              </Link>
            </div>
            <ul className="divide-y divide-line">
              {latestJobs.map((job) => (
                <li key={job.id}>
                  <Link to={`/JobDescription/${job.id}`} className="group flex items-center gap-4 px-5 py-4 hover:bg-canvas">
                    <Avatar name={job.jobTitle} size={40} square />
                    <div className="min-w-0 flex-1">
                      <div className="text-base font-medium text-ink truncate group-hover:text-accent">{job.jobTitle}</div>
                      <div className="text-sm text-ink-3 flex items-center gap-1.5 mt-0.5 truncate">
                        <FiMapPin className="shrink-0" /> {job.jobLocations}
                        <span className="text-ink-4">·</span> {job.postedBy}
                        {job.created_at && <><span className="text-ink-4">·</span> {postedAgo(job.created_at)}</>}
                      </div>
                    </div>
                    <JobTypeBadge type={job.jobType} />
                    <span className="w-44 text-right font-mono text-xs text-ink-2 tnum truncate">{job.jobSalary}</span>
                    <FiChevronRight className="text-ink-4 group-hover:text-ink-2" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="col-span-4 card overflow-hidden">
            <div className="flex items-center justify-between px-5 h-14 border-b border-line">
              <h2 className="text-base font-semibold">Upcoming events</h2>
              <Link to="/Upcomingevents" className="text-sm text-ink-3 hover:text-ink inline-flex items-center gap-1">
                Calendar <FiArrowRight />
              </Link>
            </div>
            <ul className="divide-y divide-line">
              {upcoming.slice(0, 4).map((event) => (
                <li key={event.id}>
                  <Link to={`/event/${event.id}`} className="group flex gap-4 px-5 py-4 hover:bg-canvas">
                    <DateTile date={event.eventDate} />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-ink clamp-2 group-hover:text-accent">{event.eventTitle}</div>
                      <div className="text-xs text-ink-3 mt-1 flex items-center gap-1.5 whitespace-nowrap min-w-0">
                        <FiClock className="shrink-0" /> {formatTiming(event.eventTiming)}
                        <span className="text-ink-4">·</span>
                        <span className="truncate">{event.eventLocations}</span>
                      </div>
                      <div className="font-mono text-2xs text-ink-4 mt-1 uppercase">{relativeDays(event.eventDate)}</div>
                    </div>
                  </Link>
                </li>
              ))}
              {upcoming.length === 0 && <li className="px-5 py-8 text-sm text-ink-3">No upcoming events.</li>}
            </ul>
          </section>
        </div>

        {/* News */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-md font-semibold">Latest news</h2>
              <p className="text-sm text-ink-3 mt-0.5">Announcements from the institute and the alumni office.</p>
            </div>
            <Link to="/News" className="btn btn-ghost btn-sm">All news <FiArrowRight /></Link>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {newsList.slice(0, 3).map((news) => (
              <Link key={news.id} to={`/newsDescription/${news.id}`} className="group card overflow-hidden flex flex-col hover:border-line-strong">
                <CoverImage src={news.newsImageURL} alt="" className="w-full aspect-[16/9] border-b border-line" />
                <div className="p-5">
                  <div className="eyebrow">{formatDate(news.created_at, { month: 'short', day: 'numeric', year: 'numeric' }) || 'News'}</div>
                  <div className="text-base font-semibold mt-2 group-hover:text-accent">{news.newsTitle}</div>
                  <p className="text-sm text-ink-3 mt-1.5 clamp-2">{news.newsDescription}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Success stories */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-md font-semibold">Alumni success stories</h2>
              <p className="text-sm text-ink-3 mt-0.5">Where IST graduates are now, in their own words.</p>
            </div>
            <Link to="/SuccessStories" className="btn btn-ghost btn-sm">All stories <FiArrowRight /></Link>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {successStories.slice(0, 2).map((story, index) => (
              <figure key={index} className="card p-6 flex flex-col">
                <blockquote className="text-base text-ink-2 leading-7 clamp-3">“{story.success_story}”</blockquote>
                <figcaption className="mt-5 pt-5 border-t border-line flex items-center gap-3">
                  <Avatar name={story.alumni_name} size={36} />
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{story.alumni_name}</div>
                    <div className="text-xs text-ink-3">{story.department_name} · Class of {story.graduation_year}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default Home;
