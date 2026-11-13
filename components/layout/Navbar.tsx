"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/items", label: "Browse items" },
  { href: "/messages", label: "Messages" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 shadow-[0_8px_30px_-24px_rgba(16,29,47,0.35)] backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="mx-auto max-w-7xl px-5 sm:px-6"
      >
        <div className="flex h-19 items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-500"
            aria-label="Foundly home"
            onClick={() => setMenuOpen(false)}
          >
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-400 text-[#101D2F] shadow-md shadow-amber-400/20">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  d="M12 3.5 19 6v5.3c0 4.4-2.8 7.4-7 9.2-4.2-1.8-7-4.8-7-9.2V6l7-2.5Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="m9 12 2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-extrabold tracking-tight text-[#101D2F]">
                foundly<span className="text-amber-500">.</span>
              </span>
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:block">
                Lost &amp; found together
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 rounded-full bg-slate-100/80 p-1 md:flex">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors " +
                  (isActive(href)
                    ? "bg-white text-[#101D2F] shadow-sm"
                    : "text-slate-500 hover:bg-white/70 hover:text-[#101D2F]")
                }
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/auth/login"
              className="rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:text-[#101D2F] focus-visible:outline-2 focus-visible:outline-amber-500"
            >
              Log in
            </Link>
            <Link
              href="/auth/logout"
              className="rounded-full px-3 py-2 text-sm font-semibold text-slate-400 transition hover:text-[#101D2F] focus-visible:outline-2 focus-visible:outline-amber-500"
            >
              Log out
            </Link>
            <Link
              href="/items/post"
              className="group inline-flex items-center gap-2 rounded-full bg-[#101D2F] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#101D2F]/15 transition hover:-translate-y-0.5 hover:bg-[#1d334d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            >
              <span className="grid h-5 w-5 place-items-center rounded-full bg-amber-400 text-sm leading-none text-[#101D2F] transition group-hover:rotate-90">
                +
              </span>
              Post an item
            </Link>
          </div>

          <button
            type="button"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-[#101D2F] transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 md:hidden"
          >
            {menuOpen ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  d="m6 6 12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>

        {menuOpen && (
          <div
            id="mobile-navigation"
            className="border-t border-slate-100 pb-5 pt-3 md:hidden"
          >
            <div className="grid gap-1">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive(href) ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={
                    "rounded-xl px-4 py-3 text-sm font-semibold transition " +
                    (isActive(href)
                      ? "bg-amber-50 text-[#101D2F]"
                      : "text-slate-600 hover:bg-slate-50")
                  }
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className="mt-3 flex gap-3 border-t border-slate-100 pt-4">
              <Link
                href="/auth/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-full border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-[#101D2F]"
              >
                Log in
              </Link>
              <Link
                href="/items/post"
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-full bg-[#101D2F] px-4 py-3 text-center text-sm font-semibold text-white"
              >
                + Post an item
              </Link>
            </div>
            <Link
              href="/auth/logout"
              onClick={() => setMenuOpen(false)}
              className="mt-3 inline-flex px-4 py-2 text-sm font-medium text-slate-400 hover:text-[#101D2F]"
            >
              Log out
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
