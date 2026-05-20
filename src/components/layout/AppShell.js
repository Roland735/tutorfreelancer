"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  Search,
  Settings,
  UserRound,
  X,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { WorkspaceModeProvider } from "@/components/layout/WorkspaceModeContext";
import {
  getAdminPageMeta,
  getAdminSections,
  getAdminSecondaryItems,
} from "@/lib/admin-navigation";
import {
  PAGE_META,
  STUDENT_NAV_SECTIONS,
  STUDENT_SECONDARY_ITEMS,
  TUTOR_NAV_SECTIONS,
  TUTOR_SECONDARY_ITEMS,
} from "@/lib/dashboard-navigation";

function resolveHref(href, role) {
  return typeof href === "function" ? href(role) : href;
}

function isItemActive(pathname, item, role) {
  const href = resolveHref(item.href, role);

  if (item.exact) {
    return pathname === href;
  }

  if (item.matchers?.length) {
    return item.matchers.some((matcher) =>
      matcher === "/" ? pathname === "/" : pathname.startsWith(matcher)
    );
  }

  return pathname === href;
}

function toTitleCase(value) {
  return value
    .replace(/-/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getPageMeta(pathname, roleScope) {
  const adminMeta = getAdminPageMeta(pathname);
  if (adminMeta) {
    return adminMeta;
  }

  const pageMap = [...PAGE_META];

  const match = pageMap.find((item) => item.test(pathname));
  if (match) {
    return match;
  }

  const fallbackTitle =
    pathname === "/dashboard"
      ? roleScope === "admin"
        ? "Admin Dashboard"
        : "Dashboard"
      : toTitleCase(pathname.split("/").filter(Boolean).at(-1) || "Dashboard");

  return {
    title: fallbackTitle,
    description: "A focused workspace built for tutoring operations, collaboration, and growth.",
  };
}

function buildBreadcrumbs(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  if (!segments.length) {
    return [{ label: "Home", href: "/" }];
  }

  let currentPath = "";

  return segments.map((segment) => {
    currentPath += `/${segment}`;
    return {
      label: toTitleCase(segment),
      href: currentPath,
    };
  });
}

function inferSidebarMode(pathname, role) {
  if (pathname.startsWith("/jobs/post")) {
    return "student";
  }

  if (pathname.startsWith("/earnings") || pathname.startsWith("/reviews")) {
    return "tutor";
  }

  if (role === "tutor") {
    return "tutor";
  }

  return "student";
}

function LoadingShell() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.16),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#0f172a_48%,_#111827_100%)]" />
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
        <div className="relative z-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-5 py-4 shadow-[0_18px_50px_rgba(2,6,23,0.4)] backdrop-blur-xl">
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-300" />
          <p className="text-sm font-medium text-slate-200">Loading workspace...</p>
        </div>
      </div>
    </div>
  );
}

function SidebarContent({
  role,
  pathname,
  collapsed,
  roleScope,
  permissions,
  navMode,
  onModeChange,
  onNavigate,
  onToggleCollapse,
}) {
  const sections = roleScope === "admin"
    ? getAdminSections(permissions)
    : navMode === "tutor"
      ? TUTOR_NAV_SECTIONS
      : STUDENT_NAV_SECTIONS;
  const secondaryItems = roleScope === "admin"
    ? getAdminSecondaryItems(permissions)
    : navMode === "tutor"
      ? TUTOR_SECONDARY_ITEMS
      : STUDENT_SECONDARY_ITEMS;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-5">
        <Link
          href={roleScope === "admin" ? "/admin/dashboard" : "/dashboard"}
          className="flex min-w-0 flex-1 items-center gap-3"
          onClick={onNavigate}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-sky-400 to-emerald-300 text-sm font-semibold text-slate-950 shadow-[0_16px_40px_rgba(59,130,246,0.28)]">
            TF
          </div>
          <div className={cn("min-w-0 transition-all", collapsed && "pointer-events-none hidden")}>
            <p className="truncate text-sm font-semibold text-white">TutorFreelancer</p>
            <p className="truncate text-xs text-slate-400">
              {roleScope === "admin" ? "Platform Operations" : "Student Tutor Workspace"}
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:border-primary/30 hover:bg-white/10 hover:text-white lg:inline-flex"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <div className="sidebar-scrollbar flex-1 overflow-y-auto px-3 py-4">
        {roleScope === "user" ? (
          <div className="mb-6">
            <div
              className={cn(
                "mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500",
                collapsed && "hidden"
              )}
            >
              Workspace Intent
            </div>
            <div
              className={cn(
                "rounded-2xl border border-white/10 bg-white/[0.04] p-1",
                collapsed && "p-1.5"
              )}
            >
              <div className={cn("grid gap-1", collapsed ? "grid-cols-1" : "grid-cols-2")}>
                {[
                  { label: "Student", value: "student" },
                  { label: "Tutor", value: "tutor" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onModeChange(option.value)}
                    className={cn(
                      "rounded-xl px-3 py-2.5 text-sm font-medium transition",
                      navMode === option.value
                        ? "bg-gradient-to-r from-primary via-sky-400 to-emerald-300 text-slate-950 shadow-[0_10px_30px_rgba(2,6,23,0.2)]"
                        : "text-slate-300 hover:bg-white/[0.06] hover:text-white",
                      collapsed && "px-0"
                    )}
                    aria-pressed={navMode === option.value}
                    title={collapsed ? option.label : undefined}
                  >
                    <span className={cn(collapsed && "sr-only")}>{option.label}</span>
                    {collapsed ? option.label.charAt(0) : null}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {sections.map((section) => (
          <div key={section.label} className="mb-6">
            <div
              className={cn(
                "mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500",
                collapsed && "hidden"
              )}
            >
              {section.label}
            </div>
            <div className="space-y-1.5">
              {section.items.map((item) => {
                const active = isItemActive(pathname, item, role);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={resolveHref(item.href, role)}
                    onClick={onNavigate}
                    className={cn(
                      "group flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm transition-all duration-200",
                      active
                        ? "border-primary/30 bg-[linear-gradient(135deg,rgba(16,185,129,0.18),rgba(56,189,248,0.12))] text-white shadow-[0_12px_35px_rgba(2,6,23,0.22)]"
                        : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white",
                      collapsed && "justify-center px-2.5"
                    )}
                    aria-current={active ? "page" : undefined}
                    title={collapsed ? item.label : undefined}
                  >
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                        active
                          ? "bg-white/12 text-emerald-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                          : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-sky-200"
                      )}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <span className={cn("min-w-0 flex-1 font-medium", collapsed && "hidden")}>
                      {item.label}
                    </span>
                    {item.badge && !collapsed ? (
                      <span className="rounded-full bg-gradient-to-r from-primary to-sky-400 px-2 py-0.5 text-[11px] font-semibold text-slate-950">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 px-3 py-4">
        <div className="space-y-1.5">
          {secondaryItems.map((item) => {
            const active = isItemActive(pathname, item, role);
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={resolveHref(item.href, role)}
                onClick={onNavigate}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-600 transition-all hover:bg-white hover:text-slate-900",
                  "text-slate-300 hover:bg-white/5 hover:text-white",
                  active && "bg-white/7 text-white",
                  collapsed && "justify-center px-2.5"
                )}
                title={collapsed ? item.label : undefined}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition group-hover:bg-white/10 group-hover:text-sky-200">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span className={cn("font-medium", collapsed && "hidden")}>{item.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={cn(
              "group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm text-rose-600 transition-all hover:bg-rose-50",
              "text-rose-200 hover:bg-rose-400/10 hover:text-rose-100",
              collapsed && "justify-center px-2.5"
            )}
            title={collapsed ? "Logout" : undefined}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-400/10 text-rose-200 transition group-hover:bg-rose-400/15">
              <LogOut className="h-4.5 w-4.5" />
            </span>
            <span className={cn("font-medium", collapsed && "hidden")}>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AppShell({ children, roleScope = "user" }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const profileMenuRef = useRef(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem("app-shell-sidebar-collapsed") === "true";
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [storedNavMode, setStoredNavMode] = useState(() => {
    if (typeof window === "undefined") {
      return "student";
    }

    return window.localStorage.getItem("app-shell-nav-mode") || "student";
  });

  const userRole = session?.user?.role === "admin" ? "admin" : session?.user?.role === "tutor" ? "tutor" : "student";
  const adminPermissions = session?.user?.permissions || [];
  const displayName = session?.user?.name || (roleScope === "admin" ? "Administrator" : "Student");
  const pageMeta = useMemo(() => getPageMeta(pathname, roleScope), [pathname, roleScope]);
  const breadcrumbs = useMemo(() => buildBreadcrumbs(pathname), [pathname]);
  const navMode = useMemo(() => {
    if (roleScope !== "user") {
      return "student";
    }

    if (pathname.startsWith("/earnings") || pathname.startsWith("/reviews") || pathname.startsWith("/jobs/post")) {
      return inferSidebarMode(pathname, userRole);
    }

    return storedNavMode || inferSidebarMode(pathname, userRole);
  }, [pathname, roleScope, storedNavMode, userRole]);

  useEffect(() => {
    window.localStorage.setItem("app-shell-sidebar-collapsed", String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    window.localStorage.setItem("app-shell-nav-mode", navMode);
  }, [navMode]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (status !== "authenticated") {
      return;
    }

    if (roleScope === "admin" && session?.user?.role !== "admin") {
      router.replace("/dashboard");
      return;
    }

    if (roleScope === "user" && session?.user?.role === "admin") {
      router.replace("/admin/dashboard");
    }
  }, [roleScope, router, session, status]);

  useEffect(() => {
    if (status !== "authenticated" || roleScope === "admin") {
      return;
    }

    let ignore = false;

    async function loadNotificationCount() {
      try {
        const response = await fetch("/api/workspace", { cache: "no-store" });
        const payload = await response.json();

        if (!ignore && response.ok) {
          setUnreadNotificationCount(payload.notifications?.unreadCount || 0);
        }
      } catch {
        if (!ignore) {
          setUnreadNotificationCount(0);
        }
      }
    }

    loadNotificationCount();

    function handleNotificationRefresh() {
      loadNotificationCount();
    }

    window.addEventListener("workspace-notifications-updated", handleNotificationRefresh);

    return () => {
      ignore = true;
      window.removeEventListener("workspace-notifications-updated", handleNotificationRefresh);
    };
  }, [pathname, roleScope, status]);

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return undefined;
    }

    function handleOutsideClick(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false);
        setIsMobileSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isProfileMenuOpen]);

  if (status !== "authenticated") {
    return <LoadingShell />;
  }

  const totalNotifications = roleScope === "admin" ? 12 : unreadNotificationCount;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.16),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#0f172a_48%,_#111827_100%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />

      <div className="relative flex min-h-screen">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 hidden border-r border-white/10 bg-slate-950/85 backdrop-blur-2xl lg:flex",
            isSidebarCollapsed ? "w-24" : "w-72"
          )}
        >
          <SidebarContent
            role={userRole}
            pathname={pathname}
            collapsed={isSidebarCollapsed}
            roleScope={roleScope}
            permissions={adminPermissions}
            navMode={navMode}
            onModeChange={setStoredNavMode}
            onNavigate={() => setIsMobileSidebarOpen(false)}
            onToggleCollapse={() => setIsSidebarCollapsed((current) => !current)}
          />
        </aside>

        <div
          className={cn(
            "flex min-h-screen flex-1 flex-col transition-[padding] duration-300",
            isSidebarCollapsed ? "lg:pl-24" : "lg:pl-72"
          )}
        >
          <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl">
            <div className="flex min-h-[4.5rem] flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:flex-nowrap lg:px-8">
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 shadow-[0_10px_30px_rgba(2,6,23,0.22)] transition hover:border-primary/30 hover:bg-white/10 lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="min-w-0 flex-[1_1_16rem]">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  {breadcrumbs.map((item, index) => (
                    <div key={item.href} className="flex items-center gap-2">
                      {index > 0 ? <ChevronRight className="h-3.5 w-3.5" /> : null}
                      <span className={cn(index === breadcrumbs.length - 1 && "text-slate-300")}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-1 flex items-center gap-3">
                  <h1 className="truncate text-lg font-semibold tracking-tight text-white sm:text-2xl">
                    {pageMeta.title}
                  </h1>
                </div>
                <p className="mt-1 hidden text-sm text-slate-300 sm:block">
                  {`Hello ${displayName.split(" ")[0]}, ${pageMeta.description}`}
                </p>
              </div>

              <div className="hidden flex-[1_1_20rem] justify-center lg:flex">
                <label className="relative w-full max-w-md">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    placeholder={
                      roleScope === "admin"
                        ? "Search users, jobs, tutors, reports..."
                        : "Search jobs, messages, bookings..."
                    }
                    className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white shadow-[0_10px_30px_rgba(2,6,23,0.22)] outline-none transition placeholder:text-slate-400 focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
                  />
                </label>
              </div>

              <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/notifications")}
                  className={cn(
                    "relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border shadow-[0_10px_30px_rgba(2,6,23,0.22)] transition",
                    pathname.startsWith("/notifications")
                      ? "border-primary/30 bg-[linear-gradient(135deg,rgba(16,185,129,0.18),rgba(56,189,248,0.12))] text-white"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-primary/30 hover:bg-white/10 hover:text-white"
                  )}
                  aria-label="Open notifications"
                >
                  <Bell className={cn("h-4.5 w-4.5", totalNotifications > 0 && "animate-[pulse_2.6s_ease-in-out_infinite]")} />
                  {totalNotifications > 0 ? (
                    <>
                      <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-emerald-300 ring-4 ring-slate-950/80" />
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-primary to-sky-400 px-1 text-[10px] font-semibold text-slate-950">
                        {totalNotifications > 9 ? "9+" : totalNotifications}
                      </span>
                    </>
                  ) : null}
                </button>

                <div className="relative" ref={profileMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsProfileMenuOpen((current) => !current)}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-2.5 py-2 shadow-[0_10px_30px_rgba(2,6,23,0.22)] transition hover:border-primary/30 hover:bg-white/10"
                    aria-expanded={isProfileMenuOpen}
                    aria-haspopup="menu"
                  >
                    <Avatar
                      src={session?.user?.image}
                      alt={session?.user?.name || "User"}
                      fallback={(session?.user?.name || "U").charAt(0)}
                      className="h-9 w-9 ring-2 ring-primary/25"
                    />
                    <div className="hidden text-left md:block">
                      <p className="max-w-28 truncate text-sm font-semibold text-white">
                        {displayName}
                      </p>
                      <p className="text-xs capitalize text-slate-400">
                        {roleScope === "admin" ? "Admin" : userRole}
                      </p>
                    </div>
                    <ChevronDown className="hidden h-4 w-4 text-slate-400 md:block" />
                  </button>

                  {isProfileMenuOpen ? (
                    <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 p-2 shadow-[0_24px_80px_rgba(2,6,23,0.55)] backdrop-blur-2xl">
                      <div className="rounded-2xl bg-white/5 px-4 py-3">
                        <p className="truncate text-sm font-semibold text-white">{displayName}</p>
                        <p className="truncate text-xs text-slate-400">{session?.user?.email}</p>
                      </div>
                      <div className="mt-2 space-y-1">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                        >
                          <UserRound className="h-4 w-4" />
                          Profile
                        </Link>
                        <Link
                          href={roleScope === "admin" ? "/admin/settings" : "/settings"}
                          className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                        <button
                          type="button"
                          onClick={() => signOut({ callbackUrl: "/login" })}
                          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm text-rose-200 transition hover:bg-rose-400/10"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 pb-8 pt-6 sm:px-6 lg:px-8 lg:pb-10">
            <div className="mx-auto w-full max-w-7xl">
              <WorkspaceModeProvider
                value={{
                  navMode,
                  setNavMode: setStoredNavMode,
                }}
              >
                {children}
              </WorkspaceModeProvider>
            </div>
          </main>
        </div>
      </div>

      {isMobileSidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-label="Close navigation menu"
          />

          <div className="absolute inset-y-0 left-0 flex w-full max-w-[20rem] flex-col border-r border-white/10 bg-slate-950/95 shadow-[0_24px_80px_rgba(2,6,23,0.55)] backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <div>
                <p className="text-sm font-semibold text-white">Navigation</p>
                <p className="text-xs text-slate-400">Everything you need in one place.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 shadow-[0_10px_30px_rgba(2,6,23,0.22)]"
                aria-label="Close navigation menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <SidebarContent
              role={userRole}
              pathname={pathname}
              collapsed={false}
              roleScope={roleScope}
              permissions={adminPermissions}
              navMode={navMode}
              onModeChange={setStoredNavMode}
              onNavigate={() => setIsMobileSidebarOpen(false)}
              onToggleCollapse={() => { }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
