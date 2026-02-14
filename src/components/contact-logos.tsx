"use client";

import { useId } from "react";

/**
 * Official-style logos for contact channels. Brand colors preserved.
 * Gmail: Google brand colors. Instagram: brand gradient.
 */

export function GmailLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 49.4 512 399.42"
      className={className}
      aria-hidden
    >
      <g fill="none" fillRule="evenodd">
        <g fillRule="nonzero">
          <path fill="#4285f4" d="M34.91 448.818h81.454V251L0 163.727V413.91c0 19.287 15.622 34.91 34.91 34.91z" />
          <path fill="#34a853" d="M395.636 448.818h81.455c19.287 0 34.909-15.622 34.909-34.909V163.727L395.636 251z" />
          <path fill="#fbbc04" d="M395.636 99.727V251L512 163.727v-46.545c0-43.142-49.25-67.782-83.782-41.891z" />
        </g>
        <path fill="#ea4335" d="M116.364 251V99.727L256 204.455 395.636 99.727V251L256 355.727z" />
        <path fill="#c5221f" fillRule="nonzero" d="M0 117.182v46.545L116.364 251V99.727L83.782 75.291C49.25 49.4 0 74.04 0 117.18z" />
      </g>
    </svg>
  );
}

/** Instagram gradient (brand colors). useId avoids duplicate SVG ids when used twice. */
export function InstagramLogo({ className }: { className?: string }) {
  const id = `instagram-${useId().replace(/:/g, "")}`;
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient
          id={id}
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#F58529" />
          <stop offset="50%" stopColor="#DD2A7B" />
          <stop offset="100%" stopColor="#8134AF" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id})`}
        d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2zm-.2 2A3.6 3.6 0 004 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 003.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6zm9.65 1.5A1.25 1.25 0 0118.5 6.75 1.25 1.25 0 0117.25 8 1.25 1.25 0 0116 6.75 1.25 1.25 0 0117.25 5.5zM12 7a5 5 0 015 5 5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5zm0 2a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3 3 3 0 00-3-3z"
      />
    </svg>
  );
}
