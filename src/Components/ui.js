import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiChevronDown, FiLogOut, FiUser, FiKey } from 'react-icons/fi';
import Logo from './Assets/logo.png';
import { useAuth } from '../authContext';

/* ---------- helpers ---------- */

export function getRole() {
  try {
    const raw = localStorage.getItem('role');
    if (!raw) return '';
    const parsed = JSON.parse(raw);
    return (parsed && parsed.role) || '';
  } catch (e) {
    return '';
  }
}

export function useRole() {
  const [role] = useState(getRole);
  return role;
}

export function initials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

// Parses 'YYYY-MM-DD' as a local date (avoids the UTC off-by-one of new Date('YYYY-MM-DD')).
export function parseDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
  if (m && String(value).length <= 10) return new Date(+m[1], +m[2] - 1, +m[3]);
  const d = new Date(value);
  return isNaN(d) ? null : d;
}

export function formatDate(value, opts = { month: 'short', day: 'numeric', year: 'numeric' }) {
  const d = parseDate(value);
  return d ? d.toLocaleDateString('en-US', opts) : '';
}

export function relativeDays(value) {
  const d = parseDate(value);
  if (!d) return '';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((new Date(d).setHours(0, 0, 0, 0) - today) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff > 1) return `In ${diff} days`;
  if (diff === -1) return 'Yesterday';
  return `${-diff} days ago`;
}

// Event timing is stored as free text ("06:00 PM"); older rows hold a full Date string.
export function formatTiming(value) {
  if (!value) return '';
  const s = String(value);
  if (/GMT|\d{4}-\d{2}-\d{2}T/.test(s)) {
    const d = new Date(s);
    if (!isNaN(d)) return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  const hms = /^(\d{2}):(\d{2})(:\d{2})?$/.exec(s);
  if (hms) {
    const h = +hms[1];
    return `${String(((h + 11) % 12) + 1).padStart(2, '0')}:${hms[2]} ${h >= 12 ? 'PM' : 'AM'}`;
  }
  return s;
}

/* ---------- primitives ---------- */

export function Avatar({ name, size = 40, square = false, tone = 'neutral' }) {
  const tones = {
    neutral: 'bg-canvas text-ink-2 border border-line',
    accent: 'bg-accent-soft text-accent border border-accent-line',
    dark: 'bg-ink text-white',
  };
  return (
    <div
      className={`shrink-0 inline-flex items-center justify-center font-semibold select-none ${tones[tone]} ${square ? 'rounded-ctl' : 'rounded-full'}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
      aria-hidden="true"
    >
      {initials(name)}
    </div>
  );
}

export function DateTile({ date, size = 'md' }) {
  const d = parseDate(date);
  const big = size === 'lg';
  return (
    <div className={`shrink-0 flex flex-col items-center justify-center rounded-ctl border border-line bg-surface ${big ? 'w-16 h-[72px]' : 'w-12 h-14'}`}>
      <span className="font-mono text-2xs uppercase text-accent">{d ? d.toLocaleDateString('en-US', { month: 'short' }) : '—'}</span>
      <span className={`font-semibold text-ink tnum leading-none mt-1 ${big ? 'text-[26px]' : 'text-[20px]'}`}>{d ? d.getDate() : ''}</span>
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, actions, children }) {
  return (
    <div className="border-b border-line bg-surface">
      <div className="page py-8 flex items-end justify-between gap-6">
        <div className="min-w-0">
          {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
          <h1 className="text-xl">{title}</h1>
          {description && <p className="mt-1.5 text-base text-ink-3 max-w-2xl">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

export function SectionHeader({ title, description, action }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <div>
        <h2 className="text-md font-semibold">{title}</h2>
        {description && <p className="text-sm text-ink-3 mt-0.5">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="card px-6 py-12 text-center">
      <div className="text-base font-medium text-ink">{title}</div>
      {description && <p className="text-sm text-ink-3 mt-1 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function Notice({ tone = 'success', children, onClose }) {
  const tones = {
    success: 'bg-success-soft text-success border-success/20',
    danger: 'bg-danger-soft text-danger border-danger/20',
    info: 'bg-accent-soft text-accent border-accent-line',
  };
  return (
    <div className={`flex items-start justify-between gap-4 rounded-ctl border px-3.5 py-2.5 text-sm font-medium ${tones[tone]}`} role="status">
      <span>{children}</span>
      {onClose && (
        <button type="button" className="text-xs opacity-70 hover:opacity-100" onClick={onClose} style={{ margin: 0 }}>
          Dismiss
        </button>
      )}
    </div>
  );
}

export function Field({ label, hint, htmlFor, children, className = '' }) {
  return (
    <div className={className}>
      {label && <label className="label" htmlFor={htmlFor}>{label}</label>}
      {children}
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

export function Loading({ label = 'Loading' }) {
  return (
    <div className="page py-24 text-center">
      <span className="eyebrow">{label}…</span>
    </div>
  );
}

/* ---------- navigation ---------- */

const COMMON = [
  { to: '/Home', label: 'Home', match: ['/home'] },
  { to: '/jobPage', label: 'Jobs', match: ['/jobpage', '/jobdescription'] },
  { to: '/UpcomingEvents', label: 'Events', match: ['/upcomingevents', '/event/'] },
  { to: '/News', label: 'News', match: ['/news', '/newsdescription'] },
  { to: '/SuccessStories', label: 'Stories', match: ['/successstories'] },
];

const BY_ROLE = {
  alumni: [
    { to: '/PastJoborInternship', label: 'My postings', match: ['/pastjoborinternship', '/viewapplication'] },
    { to: '/PostedSuccessStories', label: 'My stories', match: ['/postedsuccessstories', '/postalumnisuccessstories'] },
  ],
  admin: [
    { to: '/PostedNews', label: 'Manage news', match: ['/postednews', '/postnews'] },
    { to: '/PostedEvents', label: 'Manage events', match: ['/postedevents', '/postevents'] },
  ],
  student: [],
};

const ROLE_LABEL = { alumni: 'Alumni', admin: 'Administrator', student: 'Student' };

export function TopNav({ role }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const name = localStorage.getItem('name') || 'Account';
  const email = localStorage.getItem('email') || '';
  const links = [...COMMON, ...(BY_ROLE[role] || [])];
  const path = pathname.toLowerCase();
  const isActive = (l) => l.match.some((m) => (m.endsWith('/') ? path.startsWith(m) : path === m || path.startsWith(m + '/')));

  useEffect(() => {
    const close = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const logout = async () => {
    await handleLogout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-line">
      <div className="page h-16 flex items-center gap-8">
        <Link to="/Home" className="flex items-center gap-3 shrink-0" aria-label="IST Alumni Portal home">
          <img src={Logo} alt="IST" className="h-8 w-auto" />
          <span className="h-5 w-px bg-line-strong" />
          <span className="text-[15px] font-semibold tracking-[-0.01em]">Alumni Portal</span>
        </Link>
        <nav className="flex items-center gap-1 min-w-0">
          {links.map((l) => {
            const active = isActive(l);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`relative h-16 inline-flex items-center px-3 text-sm font-medium transition-colors ${active ? 'text-ink' : 'text-ink-3 hover:text-ink'}`}
              >
                {l.label}
                {active && <span className="absolute left-3 right-3 bottom-0 h-[2px] bg-accent" />}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-2.5 h-10 pl-1 pr-2 rounded-ctl hover:bg-canvas"
              style={{ margin: 0 }}
              aria-haspopup="menu"
              aria-expanded={open}
            >
              <Avatar name={name} size={30} tone="dark" />
              <span className="text-left leading-tight">
                <span className="block text-sm font-medium text-ink">{name}</span>
                <span className="block text-xs text-ink-3">{ROLE_LABEL[role] || 'Member'}</span>
              </span>
              <FiChevronDown className="text-ink-3" />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-60 card shadow-pop py-1.5 z-50" role="menu">
                <div className="px-3.5 py-2 border-b border-line mb-1">
                  <div className="text-sm font-medium truncate">{name}</div>
                  <div className="text-xs text-ink-3 truncate">{email}</div>
                </div>
                <MenuItem icon={<FiUser />} onClick={() => navigate('/Portfolio')}>Portfolio</MenuItem>
                <MenuItem icon={<FiKey />} onClick={() => navigate('/ResetPassword')}>Change password</MenuItem>
                <MenuItem icon={<FiLogOut />} onClick={logout}>Log out</MenuItem>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function MenuItem({ icon, children, onClick }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3.5 h-9 text-sm text-ink-2 hover:bg-canvas hover:text-ink"
      style={{ margin: 0 }}
    >
      <span className="text-ink-3">{icon}</span>
      {children}
    </button>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="page py-10 grid grid-cols-12 gap-8">
        <div className="col-span-5">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="IST" className="h-7 w-auto" />
            <span className="text-sm font-semibold">Alumni Portal</span>
          </div>
          <p className="text-sm text-ink-3 mt-3 max-w-xs">
            The official network for graduates and students of the Institute of Space Technology, Islamabad.
          </p>
        </div>
        <div className="col-span-3">
          <div className="eyebrow mb-3">Contact</div>
          <p className="text-sm text-ink-2 leading-6">1 Islamabad Expressway<br />Sector H, DHA Phase II<br />Islamabad</p>
          <p className="text-sm text-ink-2 mt-2 font-mono tnum">(051) 907 5100</p>
        </div>
        <div className="col-span-2">
          <div className="eyebrow mb-3">Explore</div>
          <ul className="space-y-2 text-sm text-ink-2">
            <li><Link className="hover:text-ink" to="/jobPage">Jobs</Link></li>
            <li><Link className="hover:text-ink" to="/UpcomingEvents">Events</Link></li>
            <li><Link className="hover:text-ink" to="/News">News</Link></li>
            <li><Link className="hover:text-ink" to="/SuccessStories">Success stories</Link></li>
          </ul>
        </div>
        <div className="col-span-2">
          <div className="eyebrow mb-3">Account</div>
          <ul className="space-y-2 text-sm text-ink-2">
            <li><Link className="hover:text-ink" to="/Portfolio">Portfolio</Link></li>
            <li><Link className="hover:text-ink" to="/ResetPassword">Change password</Link></li>
          </ul>
        </div>
      </div>
      <div className="page">
        <div className="py-4 border-t border-line flex justify-between">
          <span className="font-mono text-2xs text-ink-4">© 2024 IST ALUMNI PORTAL</span>
          <span className="font-mono text-2xs text-ink-4">INSTITUTE OF SPACE TECHNOLOGY</span>
        </div>
      </div>
    </footer>
  );
}

export function AppShell({ children, role: roleProp }) {
  const stored = useRole();
  const role = roleProp || stored;
  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <TopNav role={role} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

/* ---------- domain helpers ---------- */

export function jobTypeLabel(type = '') {
  const t = String(type).trim();
  if (!t) return 'Role';
  const map = { job: 'Full-time', 'full time': 'Full-time', 'part time': 'Part-time', internship: 'Internship', 'project base': 'Project-based' };
  return map[t.toLowerCase()] || t.charAt(0).toUpperCase() + t.slice(1);
}

export function JobTypeBadge({ type }) {
  const isIntern = /intern/i.test(type || '');
  return <span className={`badge ${isIntern ? 'badge-accent' : 'badge-neutral'}`}>{jobTypeLabel(type)}</span>;
}

export function postedAgo(value) {
  const d = parseDate(value);
  if (!d) return '';
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  return formatDate(d);
}

export function CoverImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(!src);
  if (failed) {
    return (
      <div className={`bg-canvas border-b border-line flex items-center justify-center ${className}`}>
        <span className="eyebrow">No image</span>
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={`block object-cover ${className}`} />;
}

// Settings-style form section: label + description on the left, fields on the right.
export function FormSection({ title, description, children }) {
  return (
    <div className="grid grid-cols-12 gap-8 py-8 border-t border-line first:border-t-0 first:pt-0">
      <div className="col-span-4">
        <h2 className="text-base font-semibold">{title}</h2>
        {description && <p className="text-sm text-ink-3 mt-1 leading-6">{description}</p>}
      </div>
      <div className="col-span-8 space-y-5">{children}</div>
    </div>
  );
}

export function FormActions({ children, note }) {
  return (
    <div className="sticky bottom-0 z-10 mt-2 -mx-8 px-8 border-t border-line bg-surface rounded-b-card">
      <div className="py-4 flex items-center justify-between gap-4">
        <span className="text-sm text-ink-3">{note}</span>
        <div className="flex items-center gap-2">{children}</div>
      </div>
    </div>
  );
}
