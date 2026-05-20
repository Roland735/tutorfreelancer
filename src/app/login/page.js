"use client";

import { useEffect, useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  CheckCircle,
  Github,
  GraduationCap,
  LockKeyhole,
  Mail,
  Quote,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { usePlatformContent } from "@/lib/usePlatformContent";

const LOGIN_STORAGE_KEY = "tutorfreelance-remembered-login";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const { content } = usePlatformContent(["page.login"]);
  const pageContent = content["page.login"] || {};
  const trustMetrics = (pageContent.trustMetrics || []).map((metric, index) => ({
    ...metric,
    icon: [Users, ShieldCheck, BookOpenText][index] || Users,
  }));
  const demoRoles = pageContent.demoRoles || [
    { role: "student", label: "Load Student Account" },
    { role: "tutor", label: "Load Tutor Account" },
    { role: "admin", label: "Load Admin Account" },
  ];
  const authContent = pageContent.auth || {};

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const savedLogin = window.localStorage.getItem(LOGIN_STORAGE_KEY);
      if (!savedLogin) {
        return;
      }

      const parsedLogin = JSON.parse(savedLogin);
      setRememberMe(parsedLogin.rememberMe !== false);
      setEmail(parsedLogin.email || "");
    } catch (storageError) {
      console.error("Unable to load remembered login details:", storageError);
      window.localStorage.removeItem(LOGIN_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!rememberMe) {
      window.localStorage.removeItem(LOGIN_STORAGE_KEY);
      return;
    }

    try {
      // Only persist the email locally; never store plaintext passwords.
      window.localStorage.setItem(
        LOGIN_STORAGE_KEY,
        JSON.stringify({
          email,
          rememberMe: true,
        })
      );
    } catch (storageError) {
      console.error("Unable to save remembered login details:", storageError);
    }
  }, [email, rememberMe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else {
        if (!rememberMe && typeof window !== "undefined") {
          window.localStorage.removeItem(LOGIN_STORAGE_KEY);
        }
        router.push(redirect);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    signIn(provider, { callbackUrl: redirect });
  };

  const handleFill = async (role) => {
    setDemoLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/demo-users?role=${role}`);
      const data = await res.json();
      if (res.ok && data?.email) {
        setEmail(data.email);
        setPassword("password123");
      } else {
        setError(data?.message || "No seeded user found");
      }
    } catch {
      setError("Unable to load seeded user");
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.18),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#0f172a_48%,_#111827_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1600px] flex-col lg:flex-row">
        <section className="flex w-full items-center justify-center px-4 py-8 sm:px-6 lg:w-[48%] lg:px-10 lg:py-12 xl:px-14">
          <div className="w-full max-w-xl">
            <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-semibold text-white/90 shadow-[0_16px_40px_rgba(2,6,23,0.35)] backdrop-blur-xl transition hover:border-primary/50 hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-sky-400 to-emerald-300 text-slate-950 shadow-lg">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-[0.7rem] uppercase tracking-[0.22em] text-white/55">Trusted tutoring network</span>
                  <span className="block text-base font-semibold text-white">TutorFreelance</span>
                </span>
              </Link>
              <div className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200 sm:block">
                {authContent.badge || "Secure sign-in"}
              </div>
            </div>

            <Card className="overflow-hidden border border-white/12 bg-white/10 shadow-[0_24px_80px_rgba(2,6,23,0.55)] backdrop-blur-2xl">
              <div className="border-b border-white/10 bg-white/[0.03] px-6 py-6 sm:px-8 sm:py-8">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100/80">
                  <Sparkles className="h-3.5 w-3.5" />
                  {authContent.eyebrow || "Welcome back"}
                </div>
                <div className="space-y-3">
                  <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    {authContent.title || "Sign in to your academic workspace"}
                  </h1>
                  <p className="max-w-lg text-sm leading-6 text-slate-300 sm:text-base">
                    {authContent.description || "Return to a calm, secure platform built for university students who teach, learn, and collaborate with confidence."}
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-300">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/30 px-3 py-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-300" />
                    Protected access and trusted identities
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/30 px-3 py-2">
                    <LockKeyhole className="h-4 w-4 text-sky-300" />
                    Fast login across student and tutor accounts
                  </div>
                </div>
              </div>

              <CardContent className="space-y-7 px-6 py-6 sm:px-8 sm:py-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-slate-100">
                      University email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@university.edu"
                      className="h-14 rounded-2xl border-white/12 bg-slate-950/35 px-4 text-base text-white placeholder:text-slate-400 focus-visible:ring-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <label htmlFor="password" className="block text-sm font-medium text-slate-100">
                        Password
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-sky-200 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="h-14 rounded-2xl border-white/12 bg-slate-950/35 px-4 text-base text-white placeholder:text-slate-400 focus-visible:ring-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                    <label className="inline-flex items-center gap-3 text-sm text-slate-300">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-white/20 bg-slate-950/60 text-primary focus:ring-2 focus:ring-primary"
                      />
                      Remember this device
                    </label>
                    <div className="inline-flex items-center gap-2 text-xs text-slate-400">
                      <ShieldCheck className="h-4 w-4 text-emerald-300" />
                      End-to-end account protection
                    </div>
                  </div>

                  {error && (
                    <div
                      role="alert"
                      aria-live="polite"
                      className="flex items-start gap-3 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100"
                    >
                      <CheckCircle className="mt-0.5 h-4 w-4 rotate-45 shrink-0 text-rose-200" />
                      <span>{error}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="h-14 w-full rounded-2xl bg-gradient-to-r from-primary via-sky-400 to-emerald-300 text-base font-semibold text-slate-950 shadow-[0_18px_45px_rgba(59,130,246,0.35)] transition duration-200 hover:scale-[1.01] hover:from-primary/95 hover:via-sky-300 hover:to-emerald-200"
                  >
                    <span>{loading ? "Signing in..." : "Sign in to TutorFreelance"}</span>
                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>

                <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4 sm:p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">Quick access for demo accounts</p>
                      <p className="text-xs leading-5 text-slate-400">
                        Load a seeded profile instantly. Demo password: <span className="font-semibold text-slate-200">password123</span>
                      </p>
                    </div>
                    <div className="text-xs text-slate-500">Useful for previews and QA</div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {demoRoles.map((item) => (
                      <Button
                        key={item.role}
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={demoLoading || loading}
                        onClick={() => handleFill(item.role)}
                        className="h-11 rounded-xl border-white/12 bg-white/5 text-sm capitalize text-slate-100 hover:bg-white/10"
                      >
                        {demoLoading ? "Loading..." : item.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="rounded-full border border-white/10 bg-slate-900 px-4 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialLogin("google")}
                    className="h-12 rounded-2xl border-white/12 bg-white/5 text-sm font-medium text-slate-100 hover:bg-white/10"
                  >
                    <Mail className="mr-2 h-4 w-4 text-sky-200" />
                    Continue with Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialLogin("github")}
                    className="h-12 rounded-2xl border-white/12 bg-white/5 text-sm font-medium text-slate-100 hover:bg-white/10"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Continue with GitHub
                  </Button>
                </div>

                <p className="text-center text-sm text-slate-400">
                  New to the platform?{" "}
                  <Link
                    href="/signup"
                    className="font-semibold text-sky-200 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                  >
                    Create your account
                  </Link>
                </p>
              </CardContent>
            </Card>

            <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:hidden">
              {trustMetrics.map(({ value, label, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/6 p-4 shadow-[0_18px_40px_rgba(2,6,23,0.35)] backdrop-blur-xl"
                >
                  <Icon className="mb-3 h-4 w-4 text-sky-200" />
                  <div className="text-xl font-semibold text-white">{value}</div>
                  <div className="mt-1 text-xs leading-5 text-slate-400">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="relative hidden w-[52%] overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(14,165,233,0.18)_0%,rgba(15,23,42,0.6)_35%,rgba(2,6,23,0.15)_100%)]" />
          <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="absolute bottom-12 right-8 h-80 w-80 rounded-full bg-emerald-300/14 blur-3xl" />
          <div className="absolute left-1/2 top-10 h-[480px] w-[480px] -translate-x-1/2 rounded-full border border-white/10 bg-white/[0.02]" />

          <div className="relative z-10 flex w-full flex-col justify-between px-10 py-12 xl:px-14">
            <div className="flex items-center justify-between">
              <div className="max-w-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200/80">
                  Student-first tutoring platform
                </p>
                <h2 className="mt-4 text-4xl font-semibold leading-tight text-white xl:text-5xl">
                  Trusted by ambitious students who want better academic outcomes.
                </h2>
                <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
                  TutorFreelance connects learners with verified university tutors in a space that feels private, focused, and built for real progress.
                </p>
              </div>

              <Card className="w-52 border border-white/12 bg-white/[0.08] shadow-[0_30px_90px_rgba(2,6,23,0.4)] backdrop-blur-2xl">
                <CardContent className="p-5">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-300">Live momentum</div>
                  <div className="mt-4 space-y-4">
                    <div>
                      <div className="text-3xl font-semibold text-white">1,240</div>
                      <div className="text-sm text-slate-400">Sessions booked this week</div>
                    </div>
                    <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm text-emerald-100">
                      +18% booking growth across partner campuses
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 grid grid-cols-[1.2fr_0.8fr] gap-6">
              <Card className="border border-white/12 bg-white/[0.08] shadow-[0_28px_80px_rgba(2,6,23,0.45)] backdrop-blur-2xl">
                <CardContent className="p-8">
                  <Quote className="h-9 w-9 text-sky-200/75" />
                  <p className="mt-6 max-w-2xl text-2xl font-medium leading-10 text-white">
                    &quot;I found a tutor who had taken the exact same econometrics course at my university. The platform felt professional from the moment I logged in.&quot;
                  </p>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300 to-emerald-300 text-lg font-semibold text-slate-950 shadow-lg">
                      AL
                    </div>
                    <div>
                      <div className="text-base font-semibold text-white">Ariana Lopez</div>
                      <div className="text-sm text-slate-400">Economics undergraduate, University of Toronto</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                {trustMetrics.map(({ value, label, icon: Icon }) => (
                  <Card
                    key={label}
                    className="border border-white/12 bg-white/[0.08] shadow-[0_24px_70px_rgba(2,6,23,0.38)] backdrop-blur-2xl"
                  >
                    <CardContent className="flex items-start gap-4 p-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-sky-200">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-2xl font-semibold text-white">{value}</div>
                        <div className="mt-1 text-sm text-slate-400">{label}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary text-xl font-semibold animate-pulse">Loading login...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
