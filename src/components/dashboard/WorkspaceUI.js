"use client";

import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function PageIntro({ eyebrow, title, description, actions, compact = false }) {
  return (
    <div className={cn("flex flex-col gap-6", !compact && "lg:flex-row lg:items-end lg:justify-between")}>
      <div className="max-w-3xl">
        {eyebrow ? (
          <div className="mb-3 inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
            {eyebrow}
          </div>
        ) : null}
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

export function MetricCard({ label, value, helper, icon: Icon, accent = "emerald" }) {
  const accentClass =
    accent === "sky"
      ? "border-sky-400/20 bg-sky-400/10 text-sky-100"
      : accent === "primary"
        ? "border-primary/20 bg-primary/10 text-emerald-100"
        : "border-emerald-400/20 bg-emerald-400/10 text-emerald-100";

  return (
    <Card className="rounded-3xl border-white/10 bg-white/[0.04] shadow-[0_24px_60px_-38px_rgba(2,6,23,0.95)]">
      <CardContent className="flex items-start justify-between p-6">
        <div>
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
          {helper ? <p className="mt-2 text-xs leading-5 text-slate-400">{helper}</p> : null}
        </div>
        {Icon ? (
          <div className={cn("rounded-2xl border p-3", accentClass)}>
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function SectionCard({ title, description, action, children, className }) {
  return (
    <Card className={cn("rounded-3xl border-white/10 bg-white/[0.04]", className)}>
      <CardHeader className="flex flex-col gap-4 border-b border-white/8 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <CardTitle className="text-lg text-white">{title}</CardTitle>
          {description ? <CardDescription className="mt-2 text-slate-400">{description}</CardDescription> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardHeader>
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  );
}

export function EmptyState({ title, description, ctaHref, ctaLabel }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/12 bg-slate-950/50 px-6 py-12 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300">
        <Inbox className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">{description}</p>
      {ctaHref && ctaLabel ? (
        <Button asChild className="mt-6 rounded-full bg-white text-slate-950 hover:bg-emerald-300">
          <Link href={ctaHref}>
            {ctaLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      ) : null}
    </div>
  );
}

export function StatusPill({ children, tone = "neutral" }) {
  const toneClass =
    tone === "success"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
      : tone === "sky"
        ? "border-sky-400/20 bg-sky-400/10 text-sky-100"
        : tone === "warning"
          ? "border-amber-400/20 bg-amber-400/10 text-amber-100"
          : tone === "danger"
            ? "border-rose-400/20 bg-rose-400/10 text-rose-100"
            : "border-white/10 bg-white/[0.05] text-slate-200";

  return (
    <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium", toneClass)}>
      {children}
    </span>
  );
}
