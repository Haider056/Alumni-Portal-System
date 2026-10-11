import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiArrowRight, FiPlus } from 'react-icons/fi';
import { AppShell, PageHeader, CoverImage, EmptyState, formatDate } from './ui';

export default function News() {
  const [newsList, setNewsList] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [query, setQuery] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      const parsedRole = JSON.parse(storedRole);
      setUserRole(parsedRole.role);
    }
  }, []);

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

  const q = query.trim().toLowerCase();
  const filtered = newsList.filter((n) => !q || `${n.newsTitle} ${n.newsDescription}`.toLowerCase().includes(q));
  const [featured, ...rest] = filtered;

  return (
    <AppShell role={userRole}>
      <PageHeader
        eyebrow="Newsroom"
        title="News"
        description="Announcements from the institute, departments and the alumni office."
        actions={
          <>
            <div className="relative w-72">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
              <input className="input pl-9" placeholder="Search news" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            {userRole === 'admin' && <Link to="/PostNews" className="btn btn-primary"><FiPlus className="text-[15px]" /> Post news</Link>}
          </>
        }
      />

      <div className="page py-8">
        {loaded && filtered.length === 0 && <EmptyState title="No news found" description="Try a different search term." />}

        {featured && (
          <Link to={`/newsDescription/${featured.id}`} className="group card overflow-hidden grid grid-cols-12 hover:border-line-strong">
            <CoverImage src={featured.newsImageURL} alt="" className="col-span-7 w-full h-full aspect-[12/7] border-r border-line" />
            <div className="col-span-5 p-8 flex flex-col">
              <div className="flex items-center gap-2">
                <span className="badge badge-accent">Latest</span>
                <span className="eyebrow">{formatDate(featured.created_at)}</span>
              </div>
              <h2 className="text-lg font-semibold mt-4 group-hover:text-accent">{featured.newsTitle}</h2>
              <p className="text-base text-ink-2 mt-3 leading-7 clamp-3">{featured.newsDescription}</p>
              <span className="mt-auto pt-6 inline-flex items-center gap-1 text-sm font-medium text-accent">Read article <FiArrowRight /></span>
            </div>
          </Link>
        )}

        {rest.length > 0 && (
          <div className="grid grid-cols-3 gap-6 mt-6">
            {rest.map((news) => (
              <Link key={news.id} to={`/newsDescription/${news.id}`} className="group card overflow-hidden flex flex-col hover:border-line-strong">
                <CoverImage src={news.newsImageURL} alt="" className="w-full aspect-[16/9] border-b border-line" />
                <div className="p-5 flex flex-col flex-1">
                  <div className="eyebrow">{formatDate(news.created_at)}</div>
                  <h3 className="text-base font-semibold mt-2 group-hover:text-accent">{news.newsTitle}</h3>
                  <p className="text-sm text-ink-3 mt-1.5 clamp-2">{news.newsDescription}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
