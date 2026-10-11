import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiCheck, FiX } from 'react-icons/fi';
import { AppShell, Avatar, JobTypeBadge, Loading, Notice, jobTypeLabel, postedAgo, formatDate } from './ui';

function Section({ title, children }) {
  if (!children) return null;
  return (
    <section className="py-6 border-t border-line first:border-t-0 first:pt-0">
      <h2 className="text-base font-semibold mb-2">{title}</h2>
      <p className="text-base text-ink-2 leading-7 whitespace-pre-line">{children}</p>
    </section>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-t border-line first:border-t-0">
      <dt className="text-sm text-ink-3">{label}</dt>
      <dd className="text-sm text-ink text-right">{children}</dd>
    </div>
  );
}

function Jobdescription() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [applyState, setApplyState] = useState({ status: 'idle', message: '' });

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      const parsedRole = JSON.parse(storedRole);
      setUserRole(parsedRole.role);
    }
  }, []);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/auth/JobDescription/${jobId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });
        const data = await response.json();
        setJobDetails(data.postJobOrInternship);
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };
    fetchJobDetails();
  }, [jobId]);

  const handleApply = () => {
    setApplyState({ status: 'idle', message: '' });
    setIsApplyModalOpen(true);
  };
  const handleCloseApplyModal = () => setIsApplyModalOpen(false);
  const handleViewPortofolio = () => navigate('/Portfolio');

  const handleApplyWithPortfolio = async () => {
    setApplyState({ status: 'sending', message: '' });
    try {
      const userEmail = localStorage.getItem('email');
      const response = await fetch('http://localhost:3001/auth/applyJob', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ jobId: jobId, applicantEmail: userEmail })
      });
      const responseData = await response.json().catch(() => ({}));
      if (response.ok) {
        setApplyState({ status: 'done', message: responseData.message || 'Application submitted.' });
      } else {
        console.error('Job application failed:', response.statusText);
        setApplyState({ status: 'error', message: 'Could not submit your application. Create your portfolio first, then try again.' });
      }
    } catch (error) {
      console.error('Error applying for the job:', error);
      setApplyState({ status: 'error', message: 'Could not reach the server. Please try again.' });
    }
  };

  if (!jobDetails) return <AppShell role={userRole}><Loading /></AppShell>;

  return (
    <AppShell role={userRole}>
      <div className="bg-surface border-b border-line">
        <div className="page pt-6 pb-8">
          <Link to="/jobPage" className="inline-flex items-center gap-1.5 text-sm text-ink-3 hover:text-ink">
            <FiArrowLeft /> All jobs
          </Link>
          <div className="mt-6 flex items-start gap-5">
            <Avatar name={jobDetails.jobTitle} size={56} square />
            <div className="min-w-0 flex-1">
              <h1 className="text-xl">{jobDetails.jobTitle}</h1>
              <div className="mt-2 flex items-center gap-2 text-sm text-ink-3">
                <JobTypeBadge type={jobDetails.jobType} />
                <span className="badge badge-neutral"><FiMapPin /> {jobDetails.jobLocations}</span>
                <span className="ml-1">Posted by {jobDetails.postedBy}{jobDetails.created_at && <> · {postedAgo(jobDetails.created_at)}</>}</span>
              </div>
            </div>
            <button id="apply-now" type="button" className="btn btn-primary btn-lg" onClick={handleApply}>Apply now</button>
          </div>
        </div>
      </div>

      <div className="page py-10 grid grid-cols-12 gap-10">
        <article className="col-span-8">
          <Section title="About the role">{jobDetails.jobDescription}</Section>
          <Section title="Responsibilities">{jobDetails.jobResponsibilities}</Section>
          <Section title="Requirements">{jobDetails.jobRequirements}</Section>
          <Section title="Qualifications">{jobDetails.jobQualifications}</Section>
        </article>

        <aside className="col-span-4">
          <div className="card p-5 sticky top-24">
            <div className="eyebrow">Compensation</div>
            <div className="text-lg font-semibold mt-1.5 tnum">{jobDetails.jobSalary}</div>
            <dl className="mt-4">
              <Row label="Type">{jobTypeLabel(jobDetails.jobType)}</Row>
              <Row label="Location">{jobDetails.jobLocations}</Row>
              <Row label="Posted by">{jobDetails.postedBy}</Row>
              {jobDetails.created_at && <Row label="Posted on">{formatDate(jobDetails.created_at)}</Row>}
              <Row label="Reference"><span className="font-mono text-xs">JOB-{String(jobDetails.id).padStart(4, '0')}</span></Row>
            </dl>
            <button type="button" className="btn btn-primary w-full mt-5" onClick={handleApply}>Apply with portfolio</button>
            <button type="button" className="btn btn-secondary w-full mt-2" onClick={handleViewPortofolio}>Review my portfolio</button>
            <p className="text-xs text-ink-3 mt-4 leading-5">Your portal portfolio is shared with the poster when you apply. Listings expire 30 days after posting.</p>
          </div>
        </aside>
      </div>

      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-ink/40 flex items-center justify-center p-6" onMouseDown={handleCloseApplyModal}>
          <div className="card shadow-pop w-full max-w-[460px]" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between px-6 pt-5">
              <div>
                <div className="eyebrow">Apply</div>
                <h2 className="text-lg mt-1">{jobDetails.jobTitle}</h2>
              </div>
              <button type="button" aria-label="Close" className="h-8 w-8 inline-flex items-center justify-center rounded-ctl text-ink-3 hover:bg-canvas" style={{ margin: 0 }} onClick={handleCloseApplyModal}>
                <FiX />
              </button>
            </div>
            <div className="px-6 py-4 text-sm text-ink-2 leading-6">
              {applyState.status === 'done' ? (
                <div className="flex gap-3 items-start">
                  <span className="h-8 w-8 shrink-0 rounded-full bg-success-soft text-success inline-flex items-center justify-center"><FiCheck /></span>
                  <div>
                    <div className="font-medium text-ink">Application sent</div>
                    <div className="text-ink-3">Your portfolio was shared with {jobDetails.postedBy}, who will contact you directly.</div>
                  </div>
                </div>
              ) : (
                <>
                  Your IST portfolio (profile, education, experience and skills) will be shared with <span className="font-medium text-ink">{jobDetails.postedBy}</span>.
                  {applyState.status === 'error' && <div className="mt-3"><Notice tone="danger">{applyState.message}</Notice></div>}
                </>
              )}
            </div>
            <div className="px-6 py-4 border-t border-line flex justify-end gap-2 bg-canvas rounded-b-card">
              {applyState.status === 'done' ? (
                <button type="button" className="btn btn-primary" onClick={handleCloseApplyModal}>Done</button>
              ) : (
                <>
                  <button type="button" className="btn btn-ghost" onClick={handleCloseApplyModal}>Cancel</button>
                  <button type="button" className="btn btn-secondary" onClick={handleViewPortofolio}>View portfolio</button>
                  <button id="apply-confirm" type="button" className="btn btn-primary" disabled={applyState.status === 'sending'} onClick={handleApplyWithPortfolio}>
                    {applyState.status === 'sending' ? 'Sending…' : 'Apply with portfolio'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

export default Jobdescription;
