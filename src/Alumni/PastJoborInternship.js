import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiUsers, FiTrash2 } from 'react-icons/fi';
import { AppShell, PageHeader, Avatar, JobTypeBadge, EmptyState, formatDate } from '../Components/ui';

const PastJoborInternship = () => {
  const [jobs, setJobs] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const userEmail = localStorage.getItem('email');
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      const parsedRole = JSON.parse(storedRole);
      setUserRole(parsedRole.role);
    }
    fetchJobs(); // eslint-disable-next-line
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`http://localhost:3001/auth/PostedJobs/${userEmail}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      const data = await response.json();
      setJobs(data.postJobsOrInternships || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoaded(true);
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm('Delete this job post? This cannot be undone.')) return;
    try {
      const response = await fetch(`http://localhost:3001/auth/DeleteJob/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      if (response.ok) fetchJobs();
      else console.error('Failed to delete job');
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleClick = () => navigate('/PostJoborInternship');
  const handleViewApplications = (jobId) => navigate(`/viewApplication/${jobId}`);

  return (
    <AppShell role={userRole}>
      <PageHeader
        eyebrow="Alumni"
        title="My job postings"
        description="Roles you have shared with the IST network. Listings expire 30 days after posting."
        actions={<button type="button" className="btn btn-primary" onClick={handleClick}><FiPlus className="text-[15px]" /> Post a job</button>}
      />
      <div className="page py-8">
        {loaded && jobs.length === 0 ? (
          <EmptyState
            title="You have not posted any roles"
            description="Share an opening at your company with IST students and graduates."
            action={<button type="button" className="btn btn-primary" onClick={handleClick}>Post a job</button>}
          />
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line bg-canvas">
                  {['Role', 'Type', 'Location', 'Salary', 'Posted', ''].map((h) => (
                    <th key={h} className="px-5 h-10 eyebrow font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-canvas/60">
                    <td className="px-5 py-4">
                      <Link to={`/JobDescription/${job.id}`} className="flex items-center gap-3 group">
                        <Avatar name={job.jobTitle} size={36} square />
                        <div className="min-w-0">
                          <div className="text-sm font-medium group-hover:text-accent">{job.jobTitle}</div>
                          <div className="font-mono text-2xs text-ink-4">JOB-{String(job.id).padStart(4, '0')}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-4"><JobTypeBadge type={job.jobType} /></td>
                    <td className="px-5 py-4 text-sm text-ink-2">{job.jobLocations}</td>
                    <td className="px-5 py-4 font-mono text-xs text-ink-2 whitespace-nowrap">{job.jobSalary}</td>
                    <td className="px-5 py-4 text-sm text-ink-3 whitespace-nowrap">{formatDate(job.created_at)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleViewApplications(job.id)}>
                          <FiUsers /> Applications
                        </button>
                        <button type="button" aria-label="Delete job post" className="btn btn-danger btn-sm px-2.5" onClick={() => deleteJob(job.id)}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default PastJoborInternship;
