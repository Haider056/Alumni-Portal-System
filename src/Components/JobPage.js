import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiPlus, FiX } from 'react-icons/fi';
import { AppShell, PageHeader, Avatar, JobTypeBadge, Loading, EmptyState, jobTypeLabel, postedAgo } from './ui';

const baseLocation = (loc = '') => String(loc).split('(')[0].trim() || 'Unspecified';

function FilterGroup({ title, options, selected, onToggle }) {
  return (
    <div className="py-4 border-t border-line" role="group" aria-label={title}>
      <div className="eyebrow mb-2">{title}</div>
      <div className="space-y-1">
        {options.map(([value, count]) => {
          const checked = selected.includes(value);
          return (
            <label key={value} className="flex items-center gap-2.5 h-8 px-2 -mx-2 rounded-ctl cursor-pointer hover:bg-canvas">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-line-strong accent-[#1F4FD8]"
                checked={checked}
                onChange={() => onToggle(value)}
              />
              <span className={`text-sm flex-1 ${checked ? 'text-ink font-medium' : 'text-ink-2'}`}>{value}</span>
              <span className="font-mono text-2xs text-ink-4 tnum">{count}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default function JobPage() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [query, setQuery] = useState('');
  const [types, setTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
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

  const count = (fn) => {
    const m = new Map();
    jobs.forEach((j) => m.set(fn(j), (m.get(fn(j)) || 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  };
  const typeOptions = useMemo(() => count((j) => jobTypeLabel(j.jobType)), [jobs]); // eslint-disable-line react-hooks/exhaustive-deps
  const locationOptions = useMemo(() => count((j) => baseLocation(j.jobLocations)), [jobs]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (list, setList) => (value) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const salaryNum = (s = '') => parseInt(String(s).replace(/[^\d]/g, ''), 10) || 0;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = jobs.filter((job) => {
      if (types.length && !types.includes(jobTypeLabel(job.jobType))) return false;
      if (locations.length && !locations.includes(baseLocation(job.jobLocations))) return false;
      if (!q) return true;
      return [job.jobTitle, job.jobDescription, job.jobLocations, job.jobRequirements, job.postedBy]
        .filter(Boolean)
        .some((f) => f.toLowerCase().includes(q));
    });
    if (sort === 'salary') return [...list].sort((a, b) => salaryNum(b.jobSalary) - salaryNum(a.jobSalary));
    return [...list].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }, [jobs, query, types, locations, sort]);

  const activeFilters = [...types, ...locations];
  const canPost = userRole === 'alumni' || userRole === 'admin';

  if (isLoading) return <AppShell><Loading /></AppShell>;
  if (error) return <AppShell><div className="page py-16 text-danger">Error: {error.message}</div></AppShell>;

  return (
    <AppShell role={userRole}>
      <PageHeader
        eyebrow="Careers"
        title="Jobs & internships"
        description="Roles shared by IST alumni and the careers office. Apply with your portal portfolio."
        actions={canPost && (
          <Link to="/PostJoborInternship" className="btn btn-primary"><FiPlus className="text-[15px]" /> Post a job</Link>
        )}
      />

      <div className="page py-8 grid grid-cols-12 gap-8">
        <aside className="col-span-3">
          <div className="card p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold">Filters</span>
              {activeFilters.length > 0 && (
                <button type="button" className="text-xs text-ink-3 hover:text-ink" style={{ margin: 0 }} onClick={() => { setTypes([]); setLocations([]); }}>
                  Clear all
                </button>
              )}
            </div>
            <FilterGroup title="Type" options={typeOptions} selected={types} onToggle={toggle(types, setTypes)} />
            <FilterGroup title="Location" options={locationOptions} selected={locations} onToggle={toggle(locations, setLocations)} />
          </div>
        </aside>

        <section className="col-span-9">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
              <input
                id="job-search"
                className="input pl-9"
                placeholder="Search by title, skill, location or company"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select id="job-sort" className="input w-44" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
              <option value="newest">Newest first</option>
              <option value="salary">Highest salary</option>
            </select>
          </div>

          <div className="flex items-center gap-2 mt-4 mb-3 min-h-[28px]">
            <span className="font-mono text-2xs uppercase text-ink-3 tnum">{results.length} {results.length === 1 ? 'result' : 'results'}</span>
            {activeFilters.map((f) => (
              <button
                key={f}
                type="button"
                className="badge badge-neutral hover:border-line-strong"
                style={{ margin: 0 }}
                onClick={() => { setTypes(types.filter((t) => t !== f)); setLocations(locations.filter((l) => l !== f)); }}
              >
                {f} <FiX />
              </button>
            ))}
          </div>

          {results.length === 0 ? (
            <EmptyState
              title="No roles match your search"
              description="Try a different keyword or clear the filters."
              action={<button type="button" className="btn btn-secondary" onClick={() => { setQuery(''); setTypes([]); setLocations([]); }}>Reset search</button>}
            />
          ) : (
            <ul className="space-y-3">
              {results.map((job) => (
                <li key={job.id}>
                  <Link
                    to={`/JobDescription/${job.id}`}
                    data-job-id={job.id}
                    className="group card p-5 flex gap-4 hover:border-line-strong transition-colors"
                  >
                    <Avatar name={job.jobTitle} size={44} square />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="text-md font-semibold leading-6 group-hover:text-accent">{job.jobTitle}</h3>
                          <div className="text-sm text-ink-3 mt-0.5">
                            Posted by {job.postedBy}{job.created_at && <> · {postedAgo(job.created_at)}</>}
                          </div>
                        </div>
                        <span className="font-mono text-sm text-ink tnum whitespace-nowrap">{job.jobSalary}</span>
                      </div>
                      <p className="text-sm text-ink-2 mt-3 clamp-2 max-w-3xl">{job.jobDescription}</p>
                      <div className="flex items-center gap-2 mt-4">
                        <JobTypeBadge type={job.jobType} />
                        <span className="badge badge-neutral"><FiMapPin /> {job.jobLocations}</span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AppShell>
  );
}
