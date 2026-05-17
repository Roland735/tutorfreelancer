"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Search,
  Send,
} from "lucide-react";
import WorkspaceShell from "@/components/layout/WorkspaceShell";
import {
  EmptyState,
  PageIntro,
  SectionCard,
  StatusPill,
} from "@/components/dashboard/WorkspaceUI";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useWorkspace } from "@/components/dashboard/useWorkspace";

const CITY_OPTIONS = ["All", "Harare", "Bulawayo", "Mutare", "Gweru", "Masvingo"];

export default function JobsPage() {
  const { data: workspace } = useWorkspace();
  const [filters, setFilters] = useState({
    keyword: "",
    category: "All",
    level: "Any",
    type: "Any",
    city: "All",
    min: "",
    max: "",
    urgency: "Any",
    sort: "newest",
  });
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");
  const [savedJobs, setSavedJobs] = useState(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const fromStorage = window.localStorage.getItem("saved-jobs");
    return fromStorage ? JSON.parse(fromStorage) : [];
  });

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: "8",
        sort: filters.sort,
      });

      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "All" && value !== "Any" && key !== "sort") {
          params.set(key, value);
        }
      });

      const response = await fetch(`/api/jobs?${params.toString()}`, { cache: "no-store" });
      const data = await response.json();
      setJobs(data.jobs || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
      setLoading(false);
    }

    loadJobs();
  }, [filters, pagination.page]);

  const categories = useMemo(
    () => ["All", ...(workspace?.overview?.recommendedJobs || []).map((job) => job.category).filter(Boolean)],
    [workspace]
  );

  function updateFilters(key, value) {
    setPagination((current) => ({ ...current, page: 1 }));
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function toggleSaved(jobId) {
    const next = savedJobs.includes(jobId)
      ? savedJobs.filter((item) => item !== jobId)
      : [...savedJobs, jobId];

    setSavedJobs(next);
    window.localStorage.setItem("saved-jobs", JSON.stringify(next));
  }

  async function quickApply(job) {
    setActionMessage("");

    const response = await fetch(`/api/jobs/${job._id}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        coverLetter: `Hello, I am interested in supporting this ${job.category} request and can start promptly.`,
        bidAmount: job.budget?.min || 10,
      }),
    });

    const data = await response.json();
    setActionMessage(data.message || "Action completed.");
  }

  return (
    <WorkspaceShell>
      <div className="space-y-6">
        <PageIntro
          eyebrow="Tutoring Requests"
          title="Browse and filter live jobs"
          description="Search tutoring requests by subject, level, budget, city, and session type, then save or apply in a few clicks."
          actions={
            <Button asChild className="rounded-full bg-white text-slate-950 hover:bg-emerald-300">
              <Link href="/jobs/post">Create a request</Link>
            </Button>
          }
        />

        <SectionCard title="Search and filters" description="Refine the marketplace feed to match the kind of sessions you want.">
          <div className="grid gap-4 xl:grid-cols-4">
            <div className="xl:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">Search</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  value={filters.keyword}
                  onChange={(event) => updateFilters("keyword", event.target.value)}
                  placeholder="Calculus, Python, accounting..."
                  className="h-11 rounded-2xl border-white/10 bg-white/[0.04] pl-11 text-white"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Category</label>
              <Select value={filters.category} onChange={(event) => updateFilters("category", event.target.value)} className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white">
                {[...new Set(categories)].map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">City</label>
              <Select value={filters.city} onChange={(event) => updateFilters("city", event.target.value)} className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white">
                {CITY_OPTIONS.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Level</label>
              <Select value={filters.level} onChange={(event) => updateFilters("level", event.target.value)} className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white">
                <option value="Any">Any</option>
                <option value="High School">High School</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Graduate">Graduate</option>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Session type</label>
              <Select value={filters.type} onChange={(event) => updateFilters("type", event.target.value)} className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white">
                <option value="Any">Any</option>
                <option value="Online">Online</option>
                <option value="In-Person">In-Person</option>
                <option value="Both">Both</option>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Urgency</label>
              <Select value={filters.urgency} onChange={(event) => updateFilters("urgency", event.target.value)} className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white">
                <option value="Any">Any</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Immediate">Immediate</option>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Minimum budget</label>
              <Input type="number" value={filters.min} onChange={(event) => updateFilters("min", event.target.value)} className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Maximum budget</label>
              <Input type="number" value={filters.max} onChange={(event) => updateFilters("max", event.target.value)} className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white" />
            </div>
          </div>
        </SectionCard>

        {actionMessage ? <StatusPill tone="success">{actionMessage}</StatusPill> : null}

        <div className="grid gap-4 xl:grid-cols-2">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-64 rounded-3xl border border-white/10 bg-white/[0.04]" />
            ))
          ) : jobs.length ? (
            jobs.map((job) => (
              <div key={job._id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_60px_-38px_rgba(2,6,23,0.95)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <StatusPill tone="sky">{job.category}</StatusPill>
                      <StatusPill tone="neutral">{job.sessionType}</StatusPill>
                      <StatusPill tone="warning">{job.urgency}</StatusPill>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-white">{job.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{job.description?.slice(0, 160)}...</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSaved(job._id)}
                    className="rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-slate-300 transition hover:bg-white/[0.08]"
                  >
                    {savedJobs.includes(job._id) ? <BookmarkCheck className="h-4 w-4 text-emerald-300" /> : <Bookmark className="h-4 w-4" />}
                  </button>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-4 text-sm text-slate-300">
                    Budget
                    <div className="mt-2 font-semibold text-white">${job.budget?.min} - ${job.budget?.max}</div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-4 text-sm text-slate-300">
                    City
                    <div className="mt-2 font-semibold text-white">{job.location?.city || "Zimbabwe"}</div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-4 text-sm text-slate-300">
                    Applicants
                    <div className="mt-2 font-semibold text-white">{job.applicants?.length || 0}</div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]">
                    <Link href={`/jobs/${job._id}`}>View details</Link>
                  </Button>
                  <Button onClick={() => quickApply(job)} className="rounded-full bg-emerald-400 text-slate-950 hover:bg-emerald-300">
                    <Send className="mr-2 h-4 w-4" />
                    Quick apply
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="xl:col-span-2">
              <EmptyState
                title="No jobs match these filters"
                description="Adjust your search, widen the budget range, or switch session type to uncover more tutoring requests."
                ctaHref="/jobs/post"
                ctaLabel="Post your own request"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-sm text-slate-400">
            Showing page {pagination.page} of {pagination.pages} • {pagination.total} total jobs
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              disabled={pagination.page <= 1}
              onClick={() => setPagination((current) => ({ ...current, page: current.page - 1 }))}
              className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Prev
            </Button>
            <Button
              variant="outline"
              disabled={pagination.page >= pagination.pages}
              onClick={() => setPagination((current) => ({ ...current, page: current.page + 1 }))}
              className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </WorkspaceShell>
  );
}
