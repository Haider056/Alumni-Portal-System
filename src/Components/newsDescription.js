import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { AppShell, CoverImage, Loading, formatDate } from './ui';

function NewsDescription() {
  const { newsId } = useParams();
  const [newsDetails, setnewsDetails] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [more, setMore] = useState([]);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      const parsedRole = JSON.parse(storedRole);
      setUserRole(parsedRole.role);
    }
  }, []);

  useEffect(() => {
    const fetchnewsDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/auth/news/${newsId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });
        const data = await response.json();
        setnewsDetails(data.newsID);
      } catch (error) {
        console.error('Error fetching news details:', error);
      }
    };
    fetchnewsDetails();
  }, [newsId]);

  useEffect(() => {
    fetch(`http://localhost:3001/auth/getnews`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setMore(((d && d.news) || []).filter((n) => String(n.id) !== String(newsId)).slice(0, 3)))
      .catch(() => {});
  }, [newsId]);

  if (!newsDetails) return <AppShell role={userRole}><Loading /></AppShell>;

  const words = String(newsDetails.newsDescription || '').split(/\s+/).length;

  return (
    <AppShell role={userRole}>
      <article className="page py-8">
        <Link to="/News" className="inline-flex items-center gap-1.5 text-sm text-ink-3 hover:text-ink">
          <FiArrowLeft /> All news
        </Link>
        <header className="max-w-[760px] mx-auto mt-8 text-center">
          <div className="eyebrow">{formatDate(newsDetails.created_at, { month: 'long', day: 'numeric', year: 'numeric' })} · {Math.max(1, Math.round(words / 200))} min read</div>
          <h1 className="text-2xl mt-3">{newsDetails.newsTitle}</h1>
        </header>
        <CoverImage src={newsDetails.newsImageURL} alt={newsDetails.newsTitle} className="w-full max-w-[880px] mx-auto mt-10 aspect-[12/7] rounded-card border border-line" />
        <div className="max-w-[680px] mx-auto mt-10">
          <p className="text-md text-ink-2 leading-8 whitespace-pre-line">{newsDetails.newsDescription}</p>
          <div className="mt-10 pt-6 border-t border-line flex items-center justify-between text-sm text-ink-3">
            <span>Published by the IST Alumni Office</span>
            <span className="font-mono text-2xs">NEWS-{String(newsDetails.id).padStart(4, '0')}</span>
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <section className="page pb-4">
          <h2 className="text-md font-semibold mb-4">More news</h2>
          <div className="grid grid-cols-3 gap-6">
            {more.map((n) => (
              <Link key={n.id} to={`/newsDescription/${n.id}`} className="group card p-5 hover:border-line-strong">
                <div className="eyebrow">{formatDate(n.created_at)}</div>
                <div className="text-base font-semibold mt-2 group-hover:text-accent">{n.newsTitle}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </AppShell>
  );
}

export default NewsDescription;
