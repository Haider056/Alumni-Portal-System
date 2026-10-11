import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { AppShell, PageHeader, EmptyState, formatDate } from '../Components/ui';

const PostedSuccessStories = () => {
  const [successStories, setSuccessStories] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      const parsedRole = JSON.parse(storedRole);
      setUserRole(parsedRole.role);
    }
  }, []);

  const fetchSuccessStories = async () => {
    const userEmail = localStorage.getItem('email');
    try {
      const response = await fetch(`http://localhost:3001/auth/successStories/${userEmail}`, {
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
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    fetchSuccessStories();
  }, []);

  const handleClick = () => navigate('/PostAlumniSuccessStories');

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this story?')) return;
    try {
      await fetch(`http://localhost:3001/auth/deleteSuccessStory/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      fetchSuccessStories();
    } catch (error) {
      console.error('Error deleting success story:', error);
    }
  };

  return (
    <AppShell role={userRole}>
      <PageHeader
        eyebrow="Alumni"
        title="My success stories"
        description="Stories you have shared appear on the home page and the Stories section."
        actions={<button type="button" className="btn btn-primary" onClick={handleClick}><FiPlus className="text-[15px]" /> New story</button>}
      />
      <div className="page py-8">
        {loaded && successStories.length === 0 && (
          <EmptyState
            title="No stories yet"
            description="Tell students what you have been up to since graduating."
            action={<button type="button" className="btn btn-primary" onClick={handleClick}>Write a story</button>}
          />
        )}
        <div className="grid grid-cols-2 gap-6">
          {successStories.map((story, index) => (
            <article key={story.id || index} className="card p-6 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="eyebrow">{story.department_name} · Class of {story.graduation_year}</span>
                <span className="badge badge-success">Published</span>
              </div>
              <p className="text-base text-ink-2 leading-7 mt-4 flex-1 clamp-3">{story.success_story}</p>
              <div className="mt-5 pt-4 border-t border-line flex items-center justify-between">
                <span className="text-sm text-ink-3">Shared {formatDate(story.created_at)}</span>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(story.id)}>
                  <FiTrash2 /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
};

export default PostedSuccessStories;
