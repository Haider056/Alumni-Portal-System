import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiPhone } from 'react-icons/fi';
import { AppShell, Avatar, EmptyState, Loading, formatDate } from '../Components/ui';

export default function ViewApplication() {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [job, setJob] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      const parsedRole = JSON.parse(storedRole);
      setUserRole(parsedRole.role);
    }
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`http://localhost:3001/auth/jobApplications/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        const data = await response.json();
        if (response.ok) setApplications(data.applications || []);
        else console.error('Error fetching job applications:', data.message);
      } catch (error) {
        console.error('Error fetching job applications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
    fetch(`http://localhost:3001/auth/JobDescription/${id}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setJob(d.postJobOrInternship))
      .catch(() => {});
  }, [id]);

  return (
    <AppShell role={userRole}>
      <div className="bg-surface border-b border-line">
        <div className="page pt-6 pb-8">
          <Link to="/PastJoborInternship" className="inline-flex items-center gap-1.5 text-sm text-ink-3 hover:text-ink">
            <FiArrowLeft /> My postings
          </Link>
          <div className="eyebrow mt-6">Applications · JOB-{String(id).padStart(4, '0')}</div>
          <h1 className="text-xl mt-1">{job ? job.jobTitle : 'Applications'}</h1>
          <p className="text-base text-ink-3 mt-1.5">
            {loading ? 'Loading applicants…' : `${applications.length} ${applications.length === 1 ? 'applicant' : 'applicants'} applied with their portal portfolio.`}
          </p>
        </div>
      </div>

      <div className="page py-8">
        {loading && <Loading />}
        {!loading && applications.length === 0 && (
          <EmptyState title="No applications yet" description="Applicants will appear here as soon as someone applies." />
        )}
        <div className="space-y-4">
          {!loading && applications.map((a) => (
            <article key={a.application_id || a.id} className="card p-6">
              <div className="flex items-start gap-4">
                <Avatar name={a.name || a.applicant_email} size={48} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-md font-semibold">{a.name || a.applicant_email}</h2>
                    <span className="badge badge-warn">{a.application_status || 'Pending'}</span>
                  </div>
                  <div className="text-sm text-ink-3">{a.profession}</div>
                  <div className="flex items-center gap-5 mt-2 text-sm text-ink-2">
                    <span className="inline-flex items-center gap-1.5"><FiMail className="text-ink-3" /> {a.applicant_email}</span>
                    {a.number && <span className="inline-flex items-center gap-1.5"><FiPhone className="text-ink-3" /> {a.number}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="eyebrow">Applied</div>
                  <div className="text-sm mt-1">{formatDate(a.applied_at)}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 mt-5 pt-5 border-t border-line text-sm">
                <div>
                  <div className="eyebrow mb-1.5">Education</div>
                  <div className="text-ink-2">{a.education}</div>
                </div>
                <div>
                  <div className="eyebrow mb-1.5">Experience</div>
                  <div className="text-ink-2">{a.designation}{a.companyName && ` · ${a.companyName}`}{a.experience && ` (${a.experience})`}</div>
                </div>
                <div>
                  <div className="eyebrow mb-1.5">Skills</div>
                  <div className="text-ink-2">{a.skills}</div>
                </div>
              </div>
              {a.about && <p className="text-sm text-ink-2 mt-4 leading-6">{a.about}</p>}
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
