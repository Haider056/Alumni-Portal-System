import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { AppShell, PageHeader, CoverImage, EmptyState, formatDate } from '../Components/ui';

const PostedNews = () => {
  const [newsList, setNewsList] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`http://localhost:3001/auth/getnews`, { credentials: 'include' });
        const data = await response.json();
        if (data && data.news && data.news.length > 0) setNewsList(data.news);
      } catch (error) {
        console.error('Error fetching News:', error);
      } finally {
        setLoaded(true);
      }
    };
    fetchNews();
  }, []);

  const handleDelete = async (idToDelete) => {
    if (!window.confirm('Delete this news post?')) return;
    try {
      const response = await fetch(`http://localhost:3001/auth/news/${idToDelete}`, { method: 'DELETE', credentials: 'include' });
      if (response.ok) setNewsList((prev) => prev.filter((news) => news.id !== idToDelete));
      else console.error('Failed to delete news');
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  const handleClick = () => navigate('/PostNews');

  return (
    <AppShell role="admin">
      <PageHeader
        eyebrow="Admin · News"
        title="Posted news"
        description="Everything published to the newsroom. Deleting a post removes it for all members."
        actions={<button type="button" className="btn btn-primary" onClick={handleClick}><FiPlus className="text-[15px]" /> Post news</button>}
      />
      <div className="page py-8">
        {loaded && newsList.length === 0 && <EmptyState title="No news yet" action={<button type="button" className="btn btn-primary" onClick={handleClick}>Post news</button>} />}
        {newsList.length > 0 && (
          <div className="card overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line bg-canvas">
                  {['Article', 'Published', ''].map((h) => <th key={h} className="px-5 h-10 eyebrow font-normal">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {newsList.map((news) => (
                  <tr key={news.id}>
                    <td className="px-5 py-4">
                      <Link to={`/newsDescription/${news.id}`} className="flex items-center gap-4 group">
                        <CoverImage src={news.newsImageURL} alt="" className="w-28 aspect-[12/7] rounded-ctl border border-line shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm font-medium group-hover:text-accent">{news.newsTitle}</div>
                          <div className="text-sm text-ink-3 clamp-2 max-w-2xl mt-0.5">{news.newsDescription}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-sm text-ink-3 whitespace-nowrap">{formatDate(news.created_at)}</td>
                    <td className="px-5 py-4 text-right">
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(news.id)}><FiTrash2 /> Delete</button>
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

export default PostedNews;
