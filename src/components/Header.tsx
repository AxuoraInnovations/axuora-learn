"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";

const mainNavLinks = [
  { href: "/about", label: "About Us" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blogs", label: "Blogs" },
  { href: "/contact", label: "Contact" },
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
            className="fixed top-0 left-0 right-0 z-40 flex max-h-[42vh] min-h-0 flex-col overflow-y-auto overflow-x-hidden rounded-b-2xl bg-[#0C6CFF] shadow-2xl lg:hidden"
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
              className="flex shrink-0 items-center justify-between px-4 pt-4 pb-2 md:px-6 md:pt-5 md:pb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05, duration: 0.25 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 1.1 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "tween", duration: 0.35, delay: 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Link
                  href="/"
                  className="block text-lg font-semibold tracking-tight text-white md:text-xl"
                  onClick={onClose}
                >
                  AxuoraLearn
                </Link>
              </motion.div>
              <motion.button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white hover:bg-white/10 transition-colors"
                aria-label="Close menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </motion.div>
            {/* Nav links */}
            <nav className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-4 md:gap-4 md:py-5">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{
                    duration: 0.28,
                    delay: 0.08 + i * 0.05,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <Link
                    href={link.href}
                    className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-white/10 transition-colors md:text-lg"
                    onClick={onClose}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            {/* CTA: Join the Waitlist */}
            <motion.div
              className="shrink-0 px-4 pb-6 pt-4 md:px-6 md:pb-8 md:pt-5 flex justify-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <Link
                href="/waitlist"
                onClick={onClose}
                className="inline-flex w-[min(90%,280px)] min-w-[200px] items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-900 transition-colors md:text-base md:py-3.5"
              >
                Join the Waitlist
                <svg className="size-4 shrink-0 md:size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7v10M17 7H7" />
                </svg>
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

  const blendedNavPaths = ["/", "/about", "/features", "/pricing", "/contact", "/blogs", "/waitlist"];
  const isBlendedNav = blendedNavPaths.includes(pathname);
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

  // Blended style on landing + about, features, pricing, contact, blogs: gradient/transparent at top, blue bar when scrolled.
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
          <Link href="/" className={cn("-ml-0.5 rounded-md p-2 hover:opacity-90", isBlendedNav ? "hover:bg-white/10" : "hover:bg-gray-100")} aria-label="Axuora Learn home">
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
        {/* Nav links centered in the middle (desktop only) */}
        <div className="hidden lg:flex flex-1 items-center justify-center gap-1">
          {mainNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClasses}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-2 shrink-0 lg:flex">
          <Link
            href="/waitlist"
            className={
              isBlendedNav
                ? "inline-flex h-10 items-center justify-center rounded-md border-2 border-white bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
                : "inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-transparent px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            }
          >
            Sign In
          </Link>
          <Button
            asChild
            size="lg"
            variant="default"
            className={cn(
              "gap-1.5",
              isBlendedNav && "!bg-black hover:!bg-gray-800 !text-white !shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            )}
          >
            <Link href="/waitlist">
              Join the Waitlist
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7v10M17 7H7" />
              </svg>
            </Link>
          </Button>
        </div>
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
