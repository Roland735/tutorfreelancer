import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  ChevronRight,
  Inbox,
  MoreHorizontal,
  Search,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

const toneClasses = {
  neutral: "border-white/10 bg-white/[0.05] text-slate-200",
  success: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
  sky: "border-sky-400/20 bg-sky-400/10 text-sky-100",
  warning: "border-amber-400/20 bg-amber-400/10 text-amber-100",
  danger: "border-rose-400/20 bg-rose-400/10 text-rose-100",
  violet: "border-violet-400/20 bg-violet-400/10 text-violet-100",
  emerald: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
};

export function AdminPageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? (
          <div className="mb-3 inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-100">
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

export function AdminSurface({ className, children }) {
  return (
    <Card
      className={cn(
        "rounded-[1.75rem] border-white/10 bg-white/[0.04] shadow-[0_24px_80px_-40px_rgba(2,6,23,0.95)]",
        className
      )}
    >
      {children}
    </Card>
  );
}

export function AdminSectionCard({ title, description, action, className, children }) {
  return (
    <AdminSurface className={className}>
      <CardHeader className="flex flex-col gap-4 border-b border-white/8 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <CardTitle className="text-lg text-white">{title}</CardTitle>
          {description ? (
            <CardDescription className="mt-2 text-slate-400">{description}</CardDescription>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardHeader>
      <CardContent className="p-6">{children}</CardContent>
    </AdminSurface>
  );
}

export function AdminToneBadge({ children, tone = "neutral", className }) {
  return (
    <Badge
      variant="outline"
      className={cn("border px-3 py-1 font-medium", toneClasses[tone] || toneClasses.neutral, className)}
    >
      {children}
    </Badge>
  );
}

export function AdminStatCard({ label, value, helper, tone = "neutral", icon: Icon }) {
  return (
    <AdminSurface className="overflow-hidden">
      <CardContent className="flex items-start justify-between p-6">
        <div>
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
          {helper ? <p className="mt-2 text-xs leading-5 text-slate-400">{helper}</p> : null}
        </div>
        <div className={cn("rounded-2xl border p-3", toneClasses[tone] || toneClasses.neutral)}>
          {Icon ? <Icon className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
        </div>
      </CardContent>
    </AdminSurface>
  );
}

export function AdminStatsGrid({ items, icons = [] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => (
        <AdminStatCard
          key={item.label}
          label={item.label}
          value={item.value}
          helper={item.helper}
          tone={item.tone}
          icon={icons[index]}
        />
      ))}
    </div>
  );
}

export function AdminToolbar({
  searchPlaceholder = "Search...",
  filters = [],
  actions,
  searchValue = "",
  searchName = "q",
}) {
  return (
    <form method="get" className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-1 flex-col gap-3 lg:flex-row">
        <label className="relative flex-1 lg:max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            name={searchName}
            defaultValue={searchValue}
            placeholder={searchPlaceholder}
            className="h-11 rounded-2xl border-white/10 bg-white/[0.03] pl-11 text-white placeholder:text-slate-500"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2 xl:flex">
          {filters.map((filter) => (
            <Select
              key={filter.label}
              name={filter.name}
              defaultValue={filter.value || filter.defaultValue || filter.options?.[0]?.value}
              className="h-11 min-w-[10rem] rounded-2xl border-white/10 bg-white/[0.03] text-white"
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="outline" className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]">
          Apply filters
        </Button>
        {actions}
      </div>
    </form>
  );
}

export function AdminDataTable({ columns, rows, emptyTitle, emptyDescription }) {
  if (!rows.length) {
    return <AdminEmptyState title={emptyTitle} description={emptyDescription} compact />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-[0.18em] text-slate-500">
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-medium first:pl-0 last:pr-0">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/8">
          {rows.map((row, rowIndex) => (
            <tr key={`${row.id || row.key || "row"}-${rowIndex}`} className="text-slate-200">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-4 align-top first:pl-0 last:pr-0">
                  {typeof column.render === "function" ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AdminMiniBars({ data, keys, colors }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        {keys.map((key, index) => (
          <div key={key.label} className="inline-flex items-center gap-2 text-xs text-slate-400">
            <span className={cn("h-2.5 w-2.5 rounded-full", colors[index])} />
            {key.label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-3">
        {data.map((entry) => (
          <div key={entry.label} className="flex min-h-44 flex-col justify-end gap-3">
            <div className="flex h-36 items-end justify-center gap-1 rounded-2xl border border-white/8 bg-slate-950/45 px-2 py-3">
              {keys.map((key, index) => (
                <div
                  key={key.value}
                  className={cn("w-3 rounded-full", colors[index])}
                  style={{ height: `${entry[key.value]}%` }}
                />
              ))}
            </div>
            <p className="text-center text-xs font-medium text-slate-500">{entry.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminSparkBars({ items }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-slate-300">{item.label}</span>
            <span className="font-medium text-white">{item.value}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/[0.06]">
            <div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-cyan-300" style={{ width: `${item.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminTimeline({ items }) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id || item.key || `${item.title}-${item.time}-${index}`} className="flex gap-4">
          <div className="flex flex-col items-center">
            <span className={cn("mt-1 h-2.5 w-2.5 rounded-full", dotToneClass(item.tone))} />
            <span className="mt-2 h-full w-px bg-white/10" />
          </div>
          <div className="pb-4">
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-medium text-white">{item.title}</p>
              <AdminToneBadge tone={item.tone || "neutral"}>{item.time}</AdminToneBadge>
            </div>
            {item.description ? <p className="mt-2 text-sm text-slate-400">{item.description}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminActionList({ items, linkLabel = "Open" }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-4 transition hover:border-emerald-400/20 hover:bg-white/[0.05]"
        >
          <div>
            <p className="font-medium text-white">{item.label}</p>
            <p className="mt-1 text-sm text-slate-400">{item.helper}</p>
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-200">
            {linkLabel}
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      ))}
    </div>
  );
}

export function AdminProfileSummary({ title, subtitle, meta = [], badge, helper }) {
  return (
    <div className="flex flex-col gap-4 rounded-[1.75rem] border border-white/10 bg-slate-950/55 p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-4">
        <Avatar fallback={title?.charAt(0)} className="h-14 w-14 bg-white/[0.08] text-white" />
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            {badge}
          </div>
          <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {meta.map((item) => (
          <AdminToneBadge key={item}>{item}</AdminToneBadge>
        ))}
      </div>
      {helper ? <p className="text-sm text-slate-400">{helper}</p> : null}
    </div>
  );
}

export function AdminKeyValueGrid({ items }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
          <p className="mt-2 text-sm font-medium text-white">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export function AdminListStack({ items, renderItem }) {
  return <div className="space-y-3">{items.map(renderItem)}</div>;
}

export function AdminEmptyState({ title, description, compact = false, ctaHref, ctaLabel }) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] border border-dashed border-white/12 bg-slate-950/55 text-center",
        compact ? "px-5 py-8" : "px-6 py-12"
      )}
    >
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

export function AdminLoadingState({ title = "Loading admin data...", description = "Preparing moderation queues, metrics, and recent activity." }) {
  return (
    <AdminSurface>
      <CardContent className="space-y-5 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-2xl bg-white/10" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40 bg-white/10" />
            <Skeleton className="h-4 w-64 bg-white/6" />
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <Skeleton className="h-28 rounded-3xl bg-white/8" />
          <Skeleton className="h-28 rounded-3xl bg-white/8" />
          <Skeleton className="h-28 rounded-3xl bg-white/8" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>
      </CardContent>
    </AdminSurface>
  );
}

export function AdminErrorState({
  title = "Unable to load this admin module",
  description = "Retry once your data connection or service integration is available.",
}) {
  return (
    <div className="rounded-[1.75rem] border border-rose-400/15 bg-rose-500/[0.08] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-400/10 text-rose-200">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-white">{title}</p>
            <p className="mt-1 text-sm text-rose-100/80">{description}</p>
          </div>
        </div>
        <Button variant="outline" className="rounded-full border-rose-300/15 bg-transparent text-rose-100 hover:bg-rose-400/10">
          Retry
        </Button>
      </div>
    </div>
  );
}

export function AdminConversationCard({ conversation, active = false }) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] border p-4 transition",
        active ? "border-emerald-400/20 bg-emerald-400/10" : "border-white/10 bg-slate-950/55"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium text-white">{conversation.subject}</p>
          <p className="mt-1 text-sm text-slate-400">{conversation.participants}</p>
        </div>
        <AdminToneBadge tone={conversation.status === "Escalated" ? "danger" : "warning"}>
          {conversation.status}
        </AdminToneBadge>
      </div>
      <p className="mt-3 text-sm text-slate-300">{conversation.preview}</p>
      <div className="mt-4 flex items-center justify-between">
        <AdminToneBadge tone="sky">{conversation.reason}</AdminToneBadge>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300"
          aria-label="Open conversation options"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function AdminBreadcrumbCard({ items }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center gap-2">
          {index > 0 ? <ChevronRight className="h-3.5 w-3.5" /> : null}
          {item.href ? (
            <Link href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-300">{item.label}</span>
          )}
        </div>
      ))}
    </div>
  );
}

function dotToneClass(tone) {
  if (tone === "success") {
    return "bg-emerald-300";
  }
  if (tone === "warning") {
    return "bg-amber-300";
  }
  if (tone === "danger") {
    return "bg-rose-300";
  }
  if (tone === "sky") {
    return "bg-sky-300";
  }
  return "bg-slate-400";
}
