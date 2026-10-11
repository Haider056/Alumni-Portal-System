import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiImage } from 'react-icons/fi';
import { AppShell, PageHeader, FormSection, FormActions, Notice } from '../Components/ui';

export default function PostNews() {
  const [newsData, setNewsData] = useState({
    newsTitle: '',
    newsDescription: '',
    newsImage: null,
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const updatedValue = files ? files[0] : value;
    setNewsData({ ...newsData, [name]: updatedValue });
  };

  const handlePostNews = async (e) => {
    if (e) e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('newsTitle', newsData.newsTitle);
      formData.append('newsDescription', newsData.newsDescription);
      formData.append('newsImage', newsData.newsImage);

      const response = await fetch('http://localhost:3001/auth/createNews', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const responseData = await response.json().catch(() => ({}));
      setStatus({ tone: response.ok ? 'success' : 'danger', text: responseData.message || (response.ok ? 'News published.' : 'Could not publish news.') });
    } catch (error) {
      console.error('Error during fetch:', error);
      setStatus({ tone: 'danger', text: 'Could not reach the server.' });
    }
  };

  return (
    <AppShell role="admin">
      <PageHeader
        eyebrow="Admin · News"
        title="Post news"
        description="Publish an announcement to every alumni and student on the portal."
        actions={<Link to="/PostedNews" className="btn btn-secondary">All posts</Link>}
      />
      <div className="page py-8">
        <form onSubmit={handlePostNews} className="card px-8 pt-8">
          {status && <div className="mb-6"><Notice tone={status.tone}>{status.text}</Notice></div>}
          <FormSection title="Article" description="Headlines work best under 70 characters.">
            <div>
              <label className="label" htmlFor="newsTitle">Title</label>
              <input id="newsTitle" type="text" className="input" placeholder="e.g. IST team wins national robotics challenge" name="newsTitle" onChange={handleChange} />
            </div>
            <div>
              <label className="label" htmlFor="newsDescription">Body</label>
              <textarea id="newsDescription" rows={8} className="input" placeholder="Write the announcement…" name="newsDescription" onChange={handleChange}></textarea>
            </div>
          </FormSection>
          <FormSection title="Cover image" description="Shown on the news list and at the top of the article. 1200 × 700 recommended.">
            <label htmlFor="newsImage" className="flex items-center gap-4 rounded-card border border-dashed border-line-strong bg-canvas px-5 py-6 cursor-pointer hover:border-accent">
              <span className="h-10 w-10 rounded-ctl bg-surface border border-line inline-flex items-center justify-center text-ink-3"><FiImage /></span>
              <span>
                <span className="block text-sm font-medium">{newsData.newsImage ? newsData.newsImage.name : 'Choose an image'}</span>
                <span className="block text-xs text-ink-3">PNG or JPG</span>
              </span>
              <input id="newsImage" type="file" accept="image/*" className="sr-only" name="newsImage" onChange={handleChange} />
            </label>
          </FormSection>
          <FormActions note="Published immediately.">
            <Link to="/PostedNews" className="btn btn-ghost">Cancel</Link>
            <button type="submit" className="btn btn-primary">Publish news</button>
          </FormActions>
        </form>
      </div>
    </AppShell>
  );
}
