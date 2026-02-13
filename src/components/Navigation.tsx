"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/blogs", label: "Blog" },
  { href: "/integrations", label: "Integrations" },
  { href: "/career", label: "Career" },
  { href: "/contact", label: "Contact" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-theme-10">
      <div className="max-w-content mx-auto px-5 md:px-10 flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="text-xl font-semibold text-neutral-dark">
          Axuora Learn
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-theme-4 hover:text-primary text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/waitlist"
            className="text-theme-4 hover:text-primary font-medium text-sm"
          >
            Waitlist
          </Link>
          <Link
            href="/waitlist"
            className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Get started
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-theme-10 bg-white px-5 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-theme-4 hover:text-primary font-medium"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/waitlist" className="text-primary font-medium" onClick={() => setOpen(false)}>
            Waitlist
          </Link>
          <Link
            href="/waitlist"
            className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-medium text-center"
            onClick={() => setOpen(false)}
          >
            Get started
          </Link>
        </div>
      )}
    </header>
  );
}
