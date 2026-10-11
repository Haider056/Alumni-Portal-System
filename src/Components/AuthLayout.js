import React from 'react';
import logo from './Assets/logo.png';
import campus from './Assets/ist.png';

// Split-screen layout shared by sign in / sign up.
export default function AuthLayout({ title, description, children, footer, wide = false }) {
  return (
    <div className="min-h-screen grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] bg-surface">
      <div className="flex flex-col px-14 py-10">
        <div className="flex items-center gap-3">
          <img src={logo} alt="IST" className="h-9 w-auto" />
          <span className="h-5 w-px bg-line-strong" />
          <span className="text-[15px] font-semibold">Alumni Portal</span>
        </div>
        <div className="flex-1 flex items-center">
          <div className={`w-full mx-auto ${wide ? 'max-w-[520px]' : 'max-w-[380px]'} py-10`}>
            <h1 className="text-xl">{title}</h1>
            {description && <p className="text-base text-ink-3 mt-2">{description}</p>}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-8 pt-6 border-t border-line text-sm text-ink-3">{footer}</div>}
          </div>
        </div>
        <div className="font-mono text-2xs text-ink-4">© 2024 INSTITUTE OF SPACE TECHNOLOGY</div>
      </div>
      <div className="relative p-4 pl-0">
        <div className="sticky top-4 h-[calc(100vh-32px)] rounded-card overflow-hidden border border-line">
          <img src={campus} alt="IST campus, Raza Block" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute left-6 bottom-6 right-6 flex items-end justify-between">
            <div className="bg-surface rounded-ctl px-4 py-3 border border-line max-w-sm">
              <div className="eyebrow">Institute of Space Technology</div>
              <div className="text-sm text-ink mt-1">
                Jobs, events and stories from the people who studied here.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
