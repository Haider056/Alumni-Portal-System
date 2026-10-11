import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell, PageHeader, FormSection, FormActions, Notice, getRole } from '../Components/ui';

const JOB_TYPES = [
  ['Full time', 'Full-time'],
  ['Part Time', 'Part-time'],
  ['internship', 'Internship'],
  ['Project Base', 'Project-based'],
];

export default function PostJoborInternship() {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobResponsibilities, setJobResponsibilities] = useState('');
  const [jobRequirements, setJobRequirements] = useState('');
  const [jobQualifications, setJobQualifications] = useState('');
  const [jobType, setJobType] = useState('');
  const [jobLocations, setJobLocations] = useState('');
  const [jobSalary, setJobSalary] = useState('');
  const [status, setStatus] = useState(null);
  const role = getRole();

  const handlePostJob = async (e) => {
    if (e) e.preventDefault();
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    try {
      const response = await fetch('http://localhost:3001/auth/createJobOrInternship', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle,
          jobDescription,
          jobResponsibilities,
          jobRequirements,
          jobQualifications,
          jobType,
          jobLocations,
          jobSalary,
          postedBy: name,
          postedByEmail: email,
        }),
      });
      const responseData = await response.json().catch(() => ({}));
      if (response.ok) setStatus({ tone: 'success', text: responseData.message || 'Job posted.' });
      else setStatus({ tone: 'danger', text: responseData.message || 'Could not post the job.' });
    } catch (error) {
      console.error('Error posting job or internship:', error);
      setStatus({ tone: 'danger', text: 'Error posting job or internship. Please try again later.' });
    }
  };

  const area = (id, label, value, set, placeholder, rows = 4) => (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <textarea id={id} rows={rows} value={value} onChange={(e) => set(e.target.value)} className="input" placeholder={placeholder} />
    </div>
  );

  return (
    <AppShell role={role}>
      <PageHeader
        eyebrow={role === 'admin' ? 'Careers office' : 'Alumni'}
        title="Post a job or internship"
        description="Share an opening with IST students and graduates. Applicants apply with their portal portfolio."
        actions={role === 'alumni' && <Link to="/PastJoborInternship" className="btn btn-secondary">My postings</Link>}
      />
      <div className="page py-8">
        <form onSubmit={handlePostJob} className="card px-8 pt-8">
          {status && <div className="mb-6"><Notice tone={status.tone}>{status.text}</Notice></div>}

          <FormSection title="Role" description="The title and summary shown on the jobs board.">
            <div>
              <label htmlFor="jobTitle" className="label">Job title</label>
              <input id="jobTitle" type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="input" placeholder="e.g. Junior Backend Engineer" />
            </div>
            <div>
              <span className="label">Type</span>
              <div className="segmented">
                {JOB_TYPES.map(([value, label]) => (
                  <button key={value} type="button" aria-pressed={jobType === value} onClick={() => setJobType(value)}>{label}</button>
                ))}
              </div>
            </div>
            {area('jobDescription', 'Description', jobDescription, setJobDescription, 'Company, team and what the role is about.', 3)}
          </FormSection>

          <FormSection title="Details" description="Be specific — candidates filter on these.">
            {area('jobResponsibilities', 'Responsibilities', jobResponsibilities, setJobResponsibilities, 'What the person will do day to day.')}
            {area('jobRequirements', 'Requirements', jobRequirements, setJobRequirements, 'Skills and experience needed.')}
            {area('jobQualifications', 'Qualifications', jobQualifications, setJobQualifications, 'Degree or certifications.', 2)}
          </FormSection>

          <FormSection title="Location & pay">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="jobLocations" className="label">Location</label>
                <input id="jobLocations" type="text" value={jobLocations} onChange={(e) => setJobLocations(e.target.value)} className="input" placeholder="Islamabad (Hybrid)" />
              </div>
              <div>
                <label htmlFor="jobSalary" className="label">Salary</label>
                <input id="jobSalary" type="text" value={jobSalary} onChange={(e) => setJobSalary(e.target.value)} className="input" placeholder="PKR 150,000 / month" />
              </div>
            </div>
          </FormSection>

          <FormActions note="This listing will expire in 30 days.">
            <Link to={role === 'alumni' ? '/PastJoborInternship' : '/jobPage'} className="btn btn-ghost">Cancel</Link>
            <button type="submit" className="btn btn-primary">Publish job</button>
          </FormActions>
        </form>
      </div>
    </AppShell>
  );
}
