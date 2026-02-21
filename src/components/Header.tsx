"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { ArrowUpRight } from "lucide-react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";

const mainNavLinks = [
  { href: "/about", label: "About Us" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blogs", label: "Blogs" },
  { href: "/contact", label: "Contact Us" },
];

function useScroll(threshold: number) {
  const [scrolled, setScrolled] = React.useState(false);
  const onScroll = React.useCallback(() => {
    setScrolled(typeof window !== "undefined" && window.scrollY > threshold);
  }, [threshold]);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);
  React.useEffect(() => {
    onScroll();
  }, [onScroll]);
  return scrolled;
}

type MobileMenuProps = {
  open: boolean;
  mounted: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
};

function MobileMenu({ open, mounted, onClose, links }: MobileMenuProps) {
  if (!mounted || typeof document === "undefined" || !document.body) return null;
  return createPortal(
    <AnimatePresence mode="wait">
      {open && (
        <>
          {/* Backdrop fade for nice opening/closing */}
          <motion.div
            key="mobile-menu-backdrop"
            className="fixed inset-0 z-40 bg-black/20 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            aria-hidden
          />
          <motion.div
            key="mobile-menu"
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-hidden={!open}
            className="fixed top-0 left-0 right-0 z-40 flex w-full flex-col rounded-b-2xl bg-[#0C6CFF] shadow-2xl lg:hidden"
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{
              type: "tween",
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            {/* Header: AxuoraLearn + close */}
            <motion.div
              className="flex shrink-0 items-center justify-between border-b border-white/15 px-5 py-4 md:px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05, duration: 0.25 }}
            >
              <Link
                href="/"
                className="text-lg font-semibold tracking-tight text-white md:text-xl"
                onClick={onClose}
              >
                AxuoraLearn
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/90 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
            {/* Nav links: single column, centered */}
            <nav className="flex flex-col py-2">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  className="w-full"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.06 + i * 0.04 }}
                >
                  <Link
                    href={link.href}
                    className="block w-full text-center px-5 py-3.5 text-[15px] font-medium text-white hover:bg-white/10 active:bg-white/15 transition-colors md:px-6 md:py-3 md:text-base"
                    onClick={onClose}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            {/* Waitlist CTA */}
            <motion.div
              className="shrink-0 flex flex-col items-center gap-3 border-t border-white/15 px-5 py-4 md:px-6 md:py-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <Link
                href="/waitlist"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black/90"
              >
                Join the Waitlist
                <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden />
              </Link>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const scrolled = useScroll(10);

  // Landing-style nav (transparent/white text, then blue when scrolled) on: home, about, features, pricing, contact, blogs list, blog post pages, waitlist
  const blendedNavPaths = ["/", "/about", "/features", "/pricing", "/contact", "/blogs", "/waitlist", "/sign-in", "/sign-up", "/onboarding", "/dashboard"];
  const isBlendedNav =
    blendedNavPaths.includes(pathname) || (pathname?.startsWith("/blogs/") ?? false);
  const isBlendedNavIntro = isBlendedNav && !scrolled;
  const isBlendedNavScrolled = isBlendedNav && scrolled;

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Blended style: gradient/transparent at top, blue bar when scrolled. Other pages: light bar.
  const headerClasses = isBlendedNav
    ? cn(
        "sticky top-0 z-50 w-full text-white transition-[background-color,border-color,box-shadow,opacity] duration-500 ease-[0.4,0,0.2,1]",
        isBlendedNavScrolled
          ? "bg-[#0F62FE]/90 backdrop-blur-lg border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      )
    : "sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur text-gray-900 transition-[background-color,border-color] duration-500 ease-[0.4,0,0.2,1]";

  const linkClasses = isBlendedNav
    ? "rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
    : "rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900";

  const logoColor = isBlendedNav ? "text-white" : "text-gray-900";

  return (
    <header
      className={headerClasses}
      style={
        isBlendedNavIntro
          ? {
              backgroundImage: "url(/nav-intro-bg.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 pl-3 pr-4 md:pl-4 md:pr-8">
        <div className="flex min-w-0 shrink-0 items-center">
          <Link
            href="/"
            className={cn("-ml-0.5 rounded-md p-2 hover:opacity-90", isBlendedNav ? "hover:bg-white/10" : "hover:bg-gray-100")}
            aria-label="Axuora Learn home"
          >
            <span
              className={cn(
                "font-semibold tracking-tight",
                logoColor,
                isBlendedNav ? "text-2xl md:text-3xl" : "text-xl"
              )}
            >
              AxuoraLearn
            </span>
          </Link>
        </div>
        {/* Nav links centered, same height as right-side buttons for alignment */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <div className="flex items-center gap-0.5 h-10">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(linkClasses, "flex items-center h-10 px-3 rounded-md")}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <Link
          href="/waitlist"
          className="hidden lg:inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black/90"
        >
          Join the Waitlist
          <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden />
        </Link>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-md lg:hidden",
            isBlendedNav ? "border border-white/40 text-white hover:bg-white/10" : "border border-gray-300 text-gray-700 hover:bg-gray-100"
          )}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          <MenuToggleIcon open={open} className="size-5" />
        </button>
      </nav>
      <MobileMenu
        open={open}
        mounted={mounted}
        onClose={() => setOpen(false)}
        links={mainNavLinks}
      />
    </header>
  );
}
