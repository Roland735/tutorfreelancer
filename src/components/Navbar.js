"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { GraduationCap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { usePlatformContent } from "@/lib/usePlatformContent";

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { content } = usePlatformContent(["site.navigation"]);
  const navigation = content["site.navigation"] || {};
  const navLinks = navigation.links || [];
  const brand = navigation.brand || {
    name: "Mwana Wevhu Connect",
    tagline: "Zimbabwe Tutor Marketplace",
  };
  const authLabels = navigation.auth || {
    loginLabel: "Log In",
    signupLabel: "Join Now",
    mobileSignupLabel: "Create an Account",
    dashboardLabel: "Dashboard",
    mobileDashboardLabel: "Go to Dashboard",
    logoutLabel: "Log Out",
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navShell = scrolled
    ? "border-white/10 bg-slate-950/78 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.95)] backdrop-blur-xl"
    : "border-white/5 bg-slate-950/50 backdrop-blur-md";

  return (
    <nav className="sticky top-0 z-50 px-3 py-3 sm:px-4">
      <div className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border px-4 py-3 transition-all duration-300 sm:px-5 ${navShell}`}>
        <Link
          href="/"
          className="flex items-center gap-3 text-foreground transition hover:opacity-95"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-400/20 via-emerald-400/10 to-sky-400/20 text-emerald-300 shadow-[0_14px_30px_-18px_rgba(16,185,129,0.85)]">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <span className="block font-heading text-base font-semibold tracking-tight sm:text-lg">
              {brand.name}
            </span>
            <span className="block text-[11px] uppercase tracking-[0.22em] text-slate-400">
              {brand.tagline}
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] p-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${pathname === link.href
                  ? "bg-white/10 text-white"
                  : "text-slate-300 hover:bg-white/6 hover:text-white"
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {session ? (
            <>
              <span className="hidden text-sm text-slate-300 xl:block">
                {session.user?.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="rounded-full px-4 text-slate-200 hover:bg-white/8 hover:text-white"
              >
                {authLabels.logoutLabel}
              </Button>
              <Button
                asChild
                size="sm"
                className="rounded-full border border-emerald-300/20 bg-emerald-400 px-5 text-slate-950 shadow-[0_18px_40px_-20px_rgba(16,185,129,0.8)] hover:bg-emerald-300"
              >
                <Link href="/dashboard">{authLabels.dashboardLabel}</Link>
              </Button>
            </>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="rounded-full px-4 text-slate-200 hover:bg-white/8 hover:text-white"
              >
                <Link href="/login">{authLabels.loginLabel}</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="rounded-full border border-emerald-300/20 bg-emerald-400 px-5 text-slate-950 shadow-[0_18px_40px_-20px_rgba(16,185,129,0.8)] hover:bg-emerald-300"
              >
                <Link href="/signup">{authLabels.signupLabel}</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/[0.08] lg:hidden"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mx-auto mt-3 max-w-7xl px-1 lg:hidden">
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/92 p-4 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.95)] backdrop-blur-xl">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/6 hover:text-white"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="my-4 h-px bg-white/10" />
            {session ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                  <img
                    src={session.user?.image || `https://ui-avatars.com/api/?name=${session.user?.name || "User"}`}
                    className="h-10 w-10 rounded-full border border-white/10 object-cover"
                    alt={session.user?.name || "User"}
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">{session.user?.name}</p>
                    <p className="text-xs text-slate-400">Signed in</p>
                  </div>
                </div>
                <Button
                  asChild
                  className="w-full rounded-full bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                >
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>{authLabels.mobileDashboardLabel}</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-full border-white/12 bg-white/[0.03] text-slate-100 hover:bg-white/[0.06]"
                  onClick={() => signOut()}
                >
                  {authLabels.logoutLabel}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-full border-white/12 bg-white/[0.03] text-slate-100 hover:bg-white/[0.06]"
                >
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>{authLabels.loginLabel}</Link>
                </Button>
                <Button
                  asChild
                  className="w-full rounded-full bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                >
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>{authLabels.mobileSignupLabel}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
