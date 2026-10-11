import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { AppShell, PageHeader, Avatar, EmptyState, formatDate } from '../Components/ui';

export default function SuccessStories() {
  const [successStories, setSuccessStories] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [dept, setDept] = useState('All');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      const parsedRole = JSON.parse(storedRole);
      setUserRole(parsedRole.role);
    }
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
        console.error('Error fetching Success Story:', error);
      } finally {
        setLoaded(true);
      }
    };
    fetchSuccessStories();
  }, []);

  const departments = ['All', ...Array.from(new Set(successStories.map((s) => s.department_name).filter(Boolean)))];
  const visible = successStories.filter((s) => dept === 'All' || s.department_name === dept);

  return (
    <AppShell role={userRole}>
      <PageHeader
        eyebrow="Community"
        title="Success stories"
        description="Career journeys shared by IST graduates — from first jobs to founding companies."
        actions={userRole === 'alumni' && (
          <Link to="/PostAlumniSuccessStories" className="btn btn-primary"><FiPlus className="text-[15px]" /> Share your story</Link>
        )}
      />
      <div className="page py-8">
        <div className="segmented mb-6">
          {departments.map((d) => (
            <button key={d} type="button" aria-pressed={dept === d} onClick={() => setDept(d)}>{d}</button>
          ))}
        </div>

        {loaded && visible.length === 0 && <EmptyState title="No stories yet" description="Stories shared by alumni will appear here." />}

        <div className="grid grid-cols-2 gap-6">
          {visible.map((story, index) => (
            <article key={story.id || index} className="card p-6 flex flex-col">
              <div className="flex items-center gap-3">
                <Avatar name={story.alumni_name} size={44} />
                <div className="min-w-0 flex-1">
                  <div className="text-base font-semibold">{story.alumni_name}</div>
                  <div className="text-sm text-ink-3">{story.department_name}</div>
                </div>
                <span className="badge badge-neutral font-mono">CLASS OF {story.graduation_year}</span>
              </div>
              <p className="text-base text-ink-2 leading-7 mt-5 flex-1">{story.success_story}</p>
              <div className="mt-5 pt-4 border-t border-line font-mono text-2xs text-ink-4 uppercase">
                Shared {formatDate(story.created_at)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
