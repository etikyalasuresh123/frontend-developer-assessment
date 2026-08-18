'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    {
      name: 'Dashboard',
      href: '/',
      icon: '▦',
    },
    {
      name: 'Classes',
      href: '/classes',
      icon: '▤',
    },
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed left-0 top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
        <div>
          <h1 className="text-lg font-bold text-slate-900">
            Student Admin
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
          aria-label="Open navigation"
        >
          <span className="text-2xl">☰</span>
        </button>
      </header>

      {/* Overlay - Mobile */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-slate-900 text-white transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-700 px-6">
          <div>
            <h1 className="text-xl font-bold">
              Student Admin
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              Management Dashboard
            </p>
          </div>

          {/* Close button - Mobile */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Main Menu
          </p>

          <div className="space-y-2">
            {links.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="text-lg">
                    {link.icon}
                  </span>

                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-700 p-4">
          <p className="text-xs text-slate-500">
            School Administration
          </p>
        </div>
      </aside>
    </>
  );
}