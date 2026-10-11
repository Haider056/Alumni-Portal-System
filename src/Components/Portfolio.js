import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiEdit2 } from 'react-icons/fi';
import { AppShell, PageHeader, Avatar, EmptyState, Loading, formatDate } from './ui';

function Block({ title, children }) {
  return (
    <section className="card p-6">
      <h2 className="eyebrow mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Contact({ icon, children }) {
  if (!children) return null;
  return (
    <div className="flex items-center gap-2.5 text-sm text-ink-2 py-1.5">
      <span className="text-ink-3">{icon}</span>
      <span className="truncate">{children}</span>
    </div>
  );
}

export default function Portfolio() {
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      const parsedRole = JSON.parse(storedRole);
      setUserRole(parsedRole.role);
    }
  }, []);

  useEffect(() => {
    const fetchPortfolio = async () => {
      const userEmail = localStorage.getItem('email');
      try {
        const response = await fetch(`http://localhost:3001/auth/portfolio/${userEmail}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        const data = await response.json();
        setPortfolio(data.portfolio);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const handleClick = () => navigate('/CreatePortfolio');

  if (loading) return <AppShell role={userRole}><Loading /></AppShell>;

  const skills = portfolio && portfolio.skills ? String(portfolio.skills).split(',').map((s) => s.trim()).filter(Boolean) : [];
  const dateRange = portfolio
    ? [portfolio.startDate, portfolio.endDate].map((d) => formatDate(d, { month: 'short', year: 'numeric' })).filter(Boolean).join(' – ')
    : '';

  return (
    <AppShell role={userRole}>
      <PageHeader
        eyebrow="Profile"
        title="Portfolio"
        description="This is what recruiters and alumni see when you apply for a role."
        actions={portfolio && <button type="button" className="btn btn-secondary" onClick={handleClick}><FiEdit2 /> Edit portfolio</button>}
      />
      <div className="page py-8">
        {!portfolio && (
          <EmptyState
            title="You have not created a portfolio yet"
            description="A portfolio is required to apply for jobs and internships on the portal."
            action={<button type="button" className="btn btn-primary" onClick={handleClick}>Create portfolio</button>}
          />
        )}

        {portfolio && (
          <div className="grid grid-cols-12 gap-6">
            <aside className="col-span-4">
              <div className="card p-6 sticky top-24">
                <Avatar name={portfolio.name} size={72} tone="dark" />
                <h2 className="text-lg mt-4">{portfolio.name}</h2>
                <div className="text-base text-ink-3">{portfolio.profession}</div>
                {portfolio.companyName && (
                  <div className="text-sm text-ink-2 mt-1">
                    {portfolio.designation && portfolio.designation !== portfolio.profession ? `${portfolio.designation} at ` : 'at '}
                    {portfolio.companyName}
                  </div>
                )}
                <div className="mt-5 pt-4 border-t border-line">
                  <Contact icon={<FiMail />}>{portfolio.email}</Contact>
                  <Contact icon={<FiPhone />}>{portfolio.number}</Contact>
                  <Contact icon={<FiMapPin />}>{portfolio.address}</Contact>
                </div>
                {portfolio.experience && (
                  <div className="mt-4 pt-4 border-t border-line flex items-center justify-between">
                    <span className="text-sm text-ink-3">Experience</span>
                    <span className="font-mono text-sm">{portfolio.experience}</span>
                  </div>
                )}
              </div>
            </aside>

            <div className="col-span-8 space-y-6">
              <Block title="About">
                <p className="text-base text-ink-2 leading-7">{portfolio.about}</p>
              </Block>

              <Block title="Experience">
                <div className="flex gap-4">
                  <Avatar name={portfolio.companyName} size={40} square />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="text-base font-semibold">{portfolio.designation}</div>
                      <div className="font-mono text-xs text-ink-3 whitespace-nowrap">{dateRange}</div>
                    </div>
                    <div className="text-sm text-ink-3">{portfolio.companyName}</div>
                    <p className="text-sm text-ink-2 leading-6 mt-2">{portfolio.experienceDescription}</p>
                  </div>
                </div>
              </Block>

              <Block title="Education">
                <p className="text-base text-ink-2">{portfolio.education}</p>
              </Block>

              <Block title="Skills">
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => <span key={s} className="badge badge-neutral h-7 px-2.5 text-sm">{s}</span>)}
                </div>
              </Block>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
