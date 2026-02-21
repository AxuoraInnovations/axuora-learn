"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageCircle,
  Library,
  ClipboardList,
  History,
  BarChart2,
  User,
  Settings,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
  X,
  ChevronsUpDown,
  HelpCircle,
  LogOut,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: React.ReactNode;
};

const CHAT_NAV: NavItem[] = [
  { label: "AI Chat", href: "/dashboard/chat", icon: MessageCircle },
  { label: "History", href: "/dashboard/history", icon: History },
];

const LEARN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Library", href: "/dashboard/library", icon: Library },
  { label: "Mocks Generator", href: "/dashboard/practice", icon: ClipboardList },
  { label: "Insights", href: "/dashboard/stats", icon: BarChart2 },
];

interface DashboardSidebarProps {
  /** When true, sidebar is shown as overlay (mobile/tablet). */
  mobileOpen?: boolean;
  /** Called when sidebar should close (e.g. overlay backdrop or link click on mobile). */
  onMobileClose?: () => void;
  /** Controlled collapsed state for desktop (when set, layout can toggle from header). */
  collapsed?: boolean;
  /** Called when sidebar collapse state should change (desktop toggle from header). */
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function DashboardSidebar({ mobileOpen = false, onMobileClose, collapsed: controlledCollapsed, onCollapsedChange }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = controlledCollapsed ?? internalCollapsed;
  const setCollapsed = onCollapsedChange ?? setInternalCollapsed;
  const [profileOpen, setProfileOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    avatarUrl: string | null;
    email: string | null;
    displayName: string;
    plan: string;
  }>({ avatarUrl: null, email: null, displayName: "Account", plan: "Free plan" });
  const profileRef = useRef<HTMLDivElement>(null);
  const isMobileOverlay = mobileOpen;
  const onMobileCloseRef = useRef(onMobileClose);
  onMobileCloseRef.current = onMobileClose;

  useEffect(() => {
    createClient()
      .auth.getSession()
      .then(({ data: { session } }) => {
        if (!session?.user) return;
        const u = session.user;
        const meta = u.user_metadata ?? {};
        setUserInfo({
          avatarUrl: meta.avatar_url ?? meta.picture ?? null,
          email: u.email ?? null,
          displayName:
            meta.full_name ?? meta.name ?? u.email?.split("@")[0] ?? "Account",
          plan: meta.plan ?? "Free plan",
        });
      });
  }, []);

  const handleLogOut = async () => {
    setProfileOpen(false);
    onMobileClose?.();
    await createClient().auth.signOut();
    router.replace("/");
    router.refresh();
  };

  // Close mobile overlay only when route changes (e.g. after clicking a nav link). Do NOT depend on onMobileClose or the menu closes immediately after opening (new ref each render).
  useEffect(() => {
    onMobileCloseRef.current?.();
  }, [pathname]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    if (!profileOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileOpen]);

  const linkClass = (href: string) => {
    const isActive =
      pathname === href ||
      (href !== "/dashboard" && pathname.startsWith(href));
    return `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? "bg-gray-300/80 text-gray-900"
        : "bg-[#EBEBEB] text-gray-900 hover:bg-gray-300/60"
    }`;
  };

  const iconOnly = collapsed && !isMobileOverlay;

  const handleHeaderButtonClick = () => {
    if (mobileOpen) {
      onMobileClose?.();
    } else {
      setCollapsed(!collapsed);
    }
  };

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        className={linkClass(item.href)}
        title={iconOnly ? item.label : undefined}
        onClick={onMobileClose}
      >
        <Icon className="h-4 w-4 shrink-0 opacity-90" />
        {!iconOnly && (
          <>
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge}
          </>
        )}
      </Link>
    );
  };

  const content = (
    <>
      {/* Top: logo + sidebar collapse/close button (no + button; New chat is in nav below) */}
      <div
        className={`flex shrink-0 items-center border-b border-gray-300/80 bg-[#EBEBEB] px-3 py-4 ${collapsed ? "justify-center" : "justify-between"}`}
      >
        {collapsed ? (
          <button
            type="button"
            onClick={handleHeaderButtonClick}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-300/80 hover:text-gray-800"
            aria-label={isMobileOverlay ? "Close menu" : "Expand sidebar"}
            title={isMobileOverlay ? "Close menu" : "Expand sidebar"}
          >
            {isMobileOverlay ? <X className="h-5 w-5" /> : <PanelLeft className="h-4 w-4" />}
          </button>
        ) : (
          <>
            <Link href="/dashboard" className="text-base font-semibold text-gray-800 truncate min-w-0" onClick={onMobileClose}>
              AxuoraLearn
            </Link>
            <button
              type="button"
              onClick={handleHeaderButtonClick}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-300/80 hover:text-gray-800"
              aria-label={isMobileOverlay ? "Close menu" : "Collapse sidebar"}
              title={isMobileOverlay ? "Close menu" : "Collapse sidebar"}
            >
              {isMobileOverlay ? <X className="h-5 w-5" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
          </>
        )}
      </div>

      <nav className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-[#EBEBEB] px-3 py-4">
        {/* Chat: New chat button + AI Chat + History */}
        <div className="space-y-0.5">
          <p className={collapsed ? "sr-only" : "mb-2 px-3 text-[11px] font-medium uppercase tracking-wider text-gray-500"}>
            Chat
          </p>
          <Link
            href="/dashboard/chat"
            onClick={onMobileClose}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors bg-gray-900 text-white hover:bg-gray-800 ${iconOnly ? "justify-center" : ""}`}
            title={iconOnly ? "New chat" : undefined}
          >
            <Plus className="h-4 w-4 shrink-0 opacity-90" />
            {!iconOnly && <span className="flex-1 truncate">New chat</span>}
          </Link>
          {CHAT_NAV.map((item) => renderNavItem(item))}
        </div>

        <div className="my-4 h-px bg-gray-300/80" aria-hidden />

        {/* Learn: Dashboard, Library, Mocks, Insights */}
        <div className="space-y-0.5">
          <p className={collapsed ? "sr-only" : "mb-2 px-3 text-[11px] font-medium uppercase tracking-wider text-gray-500"}>
            Learn
          </p>
          {LEARN_NAV.map((item) => renderNavItem(item))}
        </div>

      </nav>

      {/* Profile at bottom */}
      <div className="shrink-0 border-t border-gray-300/80 bg-[#EBEBEB] p-3" ref={profileRef}>
        <div className={`flex ${collapsed ? "justify-center" : "items-center gap-3"}`}>
          <div className="relative flex-shrink-0">
            <button
              type="button"
              onClick={() => setProfileOpen((o) => !o)}
              className={`flex items-center gap-3 rounded-lg text-left transition-colors hover:bg-gray-300/60 focus:outline-none focus:ring-2 focus:ring-gray-400/40 focus:ring-offset-0 focus:ring-offset-[#EBEBEB] ${collapsed ? "justify-center p-1" : "w-full px-1 py-2"}`}
              aria-label="Account menu"
              aria-expanded={profileOpen}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-300 text-gray-600">
                {userInfo.avatarUrl ? (
                  <img src={userInfo.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-semibold uppercase text-gray-500">
                    {userInfo.displayName.charAt(0) || "?"}
                  </span>
                )}
              </div>
              {!collapsed && (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {userInfo.displayName}
                    </p>
                    <p className="truncate text-xs text-gray-500">{userInfo.plan}</p>
                  </div>
                  <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 text-gray-500" aria-hidden />
                </>
              )}
            </button>
            {profileOpen && (
              <div
                className={`absolute z-50 min-w-[240px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl ${iconOnly ? "bottom-0 left-full ml-2" : "bottom-full left-0 right-0 mb-2"}`}
                role="menu"
              >
                {/* Email at top */}
                {userInfo.email && (
                  <div className="border-b border-slate-100 px-3 py-2.5">
                    <p className="truncate text-sm text-slate-500">{userInfo.email}</p>
                  </div>
                )}
                {/* Settings & support */}
                <div className="py-1">
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                    role="menuitem"
                    onClick={() => {
                      setProfileOpen(false);
                      onMobileClose?.();
                    }}
                  >
                    <span className="flex items-center gap-3">
                      <Settings className="h-4 w-4 shrink-0 opacity-80" />
                      Settings
                    </span>
                    <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                      ⌘,
                    </kbd>
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                    role="menuitem"
                    onClick={() => {
                      setProfileOpen(false);
                      onMobileClose?.();
                    }}
                  >
                    <span className="flex items-center gap-3">
                      <User className="h-4 w-4 shrink-0 opacity-80" />
                      Profile
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                    role="menuitem"
                    onClick={() => {
                      setProfileOpen(false);
                      onMobileClose?.();
                    }}
                  >
                    <HelpCircle className="h-4 w-4 shrink-0 opacity-80" />
                    Get help
                  </Link>
                </div>
                <div className="h-px bg-slate-100" aria-hidden />
                {/* Upgrade */}
                <div className="py-1">
                  <Link
                    href="/dashboard/upgrade"
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                    role="menuitem"
                    onClick={() => {
                      setProfileOpen(false);
                      onMobileClose?.();
                    }}
                  >
                    <Sparkles className="h-4 w-4 shrink-0 opacity-80" />
                    Upgrade plan
                  </Link>
                </div>
                <div className="h-px bg-slate-100" aria-hidden />
                {/* Log out */}
                <div className="p-1">
                  <button
                    type="button"
                    onClick={handleLogOut}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4 shrink-0 opacity-80" />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const sidebarWidth = isMobileOverlay ? "w-[260px]" : collapsed ? "w-[72px]" : "w-[260px]";

  return (
    <>
      {/* Mobile/tablet overlay backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar: overlay on mobile, inline on desktop. h-screen + overflow-hidden so only nav scrolls and bottom never crops. */}
      <aside
        className={`
          fixed top-0 left-0 z-50 flex h-screen flex-col overflow-hidden border-r border-gray-300/80 bg-[#EBEBEB] transition-[transform,width] duration-200 ease-out
          lg:relative lg:z-auto lg:h-screen lg:shrink-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${sidebarWidth}
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        {content}
      </aside>
    </>
  );
}

/** Button to open the sidebar on mobile/tablet. Uses same panel icon as desktop sidebar. */
export function DashboardSidebarTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-200/80 hover:text-gray-900 active:bg-gray-200 lg:hidden"
      aria-label="Open sidebar"
    >
      <PanelLeft className="h-5 w-5 shrink-0" />
    </button>
  );
}
