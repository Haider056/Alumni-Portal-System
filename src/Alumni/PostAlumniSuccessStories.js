import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppShell, PageHeader, FormSection, FormActions, Notice, Avatar } from '../Components/ui';

export default function PostAlumniSuccessStories() {
  const [alumniData, setAlumniData] = useState({
    alumni_name: '',
    graduation_year: '',
    department_name: '',
    success_story: '',
    alumni_email: '',
  });
  const [userRole, setUserRole] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      const parsedRole = JSON.parse(storedRole);
      setUserRole(parsedRole.role);
    }
  }, []);

  useEffect(() => {
    const alumniName = localStorage.getItem('name');
    const alumniEmail = localStorage.getItem('email');
    if (alumniName) {
      setAlumniData((prevData) => ({ ...prevData, alumni_name: alumniName, alumni_email: alumniEmail }));
    }
  }, []);

  const handlePostJob = async (e) => {
    if (e) e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/auth/createSuccessStory', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(alumniData),
        headers: { 'Content-Type': 'application/json' },
      });
      const responseData = await response.json();
      setStatus({ tone: response.ok ? 'success' : 'danger', text: responseData.message });
    } catch (error) {
      console.error('Error during fetch:', error);
      setStatus({ tone: 'danger', text: 'Could not publish your story. Please try again.' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === 'graduation_year' ? parseInt(value) : value;
    setAlumniData({ ...alumniData, [name]: updatedValue });
  };

  const words = alumniData.success_story ? alumniData.success_story.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <AppShell role={userRole}>
      <PageHeader
        eyebrow="Alumni"
        title="Share your success story"
        description="A short story about your path since IST. It is shown to students on the home page."
        actions={<Link to="/PostedSuccessStories" className="btn btn-secondary">My stories</Link>}
      />
      <div className="page py-8">
        <form onSubmit={handlePostJob} className="card px-8 pt-8">
          {status && <div className="mb-6"><Notice tone={status.tone}>{status.text}</Notice></div>}
          <FormSection title="Author" description="Taken from your account.">
            <div className="flex items-center gap-3 rounded-ctl border border-line bg-canvas px-4 py-3">
              <Avatar name={alumniData.alumni_name} size={36} />
              <div>
                <div className="text-sm font-medium">{alumniData.alumni_name}</div>
                <div className="text-xs text-ink-3">{alumniData.alumni_email}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="graduation_year">Graduation year</label>
                <input id="graduation_year" type="number" className="input" placeholder="2019" name="graduation_year" onChange={handleChange} />
              </div>
              <div>
                <label className="label" htmlFor="department_name">Department</label>
                <input id="department_name" type="text" className="input" placeholder="Computer Science" name="department_name" onChange={handleChange} />
              </div>
            </div>
          </FormSection>
          <FormSection title="Your story" description="Where you started, what you do now, and what helped along the way. 80–200 words works well.">
            <div>
              <label className="label" htmlFor="success_story">Story</label>
              <textarea id="success_story" className="input" rows={8} placeholder="After graduating I joined…" name="success_story" onChange={handleChange}></textarea>
              <p className="hint font-mono tnum">{words} WORDS</p>
            </div>
          </FormSection>
          <FormActions note="Published immediately to all portal members.">
            <Link to="/PostedSuccessStories" className="btn btn-ghost">Cancel</Link>
            <button type="submit" className="btn btn-primary">Publish story</button>
          </FormActions>
        </form>
      </div>
    </AppShell>
  );
}
