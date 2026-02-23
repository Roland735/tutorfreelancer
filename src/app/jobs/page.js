"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import JobCard from "@/components/JobCard";
import Footer from "@/components/Footer";
import { Search, Filter, X, ArrowDownUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

function JobsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initial state from URL params
  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    code: searchParams.get("code") || "",
    category: searchParams.get("category") || "All",
    type: searchParams.get("type") || "Any",
    level: searchParams.get("level") || "Any",
    min: searchParams.get("min") || "",
    max: searchParams.get("max") || "",
    urgency: searchParams.get("urgency") || "Any",
    posted: searchParams.get("posted") || "Any",
    applicants: searchParams.get("applicants") || "Any",
    sort: searchParams.get("sort") || "newest",
  });

  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Categories list (mock - ideally fetched from API)
  const categories = [
    "All", "Mathematics", "Computer Science", "Physics", "Chemistry",
    "Biology", "English", "History", "Foreign Languages", "Engineering", "Business"
  ];

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "All" && value !== "Any") {
          params.append(key, value);
        }
      });
      params.append("page", pagination.page);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1
  };

  const clearFilters = () => {
    setFilters({
      keyword: "",
      code: "",
      category: "All",
      type: "Any",
      level: "Any",
      min: "",
      max: "",
      urgency: "Any",
      posted: "Any",
      applicants: "Any",
      sort: "newest",
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <Navbar />

      {/* Header / Search Section */}
      <div className="bg-muted/30 border-b border-border pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 font-heading">
            Browse Tutoring Jobs
          </h1>
          <div className="relative max-w-3xl">
            <Input
              type="text"
              placeholder="Search by keywords (e.g. 'Calculus', 'Python tutor needed')"
              className="pl-12 py-6 text-lg bg-background shadow-sm"
              value={filters.keyword}
              onChange={(e) => handleFilterChange("keyword", e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Mobile Filter Toggle */}
          <Button
            variant="outline"
            className="lg:hidden flex items-center gap-2 w-full justify-center"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <Filter className="w-4 h-4" /> {showMobileFilters ? "Hide Filters" : "Show Filters"}
          </Button>

          {/* Sidebar Filters */}
          <aside className={cn("lg:w-1/4 space-y-8", showMobileFilters ? "block" : "hidden lg:block")}>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg font-heading">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-primary hover:text-primary/80 h-auto p-0 hover:bg-transparent">
                  Clear All
                </Button>
              </div>

              {/* Subject Code Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Subject Code</label>
                <Input
                  type="text"
                  placeholder="e.g. SIVR, MATH101"
                  value={filters.code}
                  onChange={(e) => handleFilterChange("code", e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Category</label>
                <Select
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Select>
              </div>

              {/* Session Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Session Type</label>
                <div className="space-y-2">
                  {["Any", "Online", "In-Person"].map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="radio"
                          name="type"
                          checked={filters.type === type}
                          onChange={() => handleFilterChange("type", type)}
                          className="peer h-4 w-4 border-muted-foreground text-primary focus:ring-primary/20"
                        />
                      </div>
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Academic Level */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Academic Level</label>
                <div className="space-y-2">
                  {["Any", "Elementary", "Middle School", "High School", "Undergraduate", "Graduate"].map(level => (
                    <label key={level} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="level"
                        checked={filters.level === level}
                        onChange={() => handleFilterChange("level", level)}
                        className="peer h-4 w-4 border-muted-foreground text-primary focus:ring-primary/20"
                      />
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Hourly Budget ($)</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.min}
                    onChange={(e) => handleFilterChange("min", e.target.value)}
                    className="w-1/2"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.max}
                    onChange={(e) => handleFilterChange("max", e.target.value)}
                    className="w-1/2"
                  />
                </div>
              </div>

              {/* Urgency */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Urgency</label>
                <div className="space-y-2">
                  {["Any", "Low", "Medium", "High"].map(level => (
                    <label key={level} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="urgency"
                        checked={filters.urgency === level}
                        onChange={() => handleFilterChange("urgency", level)}
                        className="peer h-4 w-4 border-muted-foreground text-primary focus:ring-primary/20"
                      />
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Posted Date */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Posted Date</label>
                <div className="space-y-2">
                  {[
                    { label: "Any Time", value: "Any" },
                    { label: "Last 24 Hours", value: "last_24h" },
                    { label: "Last 7 Days", value: "last_7d" },
                    { label: "Last 30 Days", value: "last_30d" }
                  ].map(option => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="posted"
                        checked={filters.posted === option.value}
                        onChange={() => handleFilterChange("posted", option.value)}
                        className="peer h-4 w-4 border-muted-foreground text-primary focus:ring-primary/20"
                      />
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Applicant Count */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Applicant Count</label>
                <div className="space-y-2">
                  {[
                    { label: "Any", value: "Any" },
                    { label: "Less than 5", value: "less_than_5" },
                    { label: "5 to 10", value: "5_to_10" },
                    { label: "More than 10", value: "more_than_10" }
                  ].map(option => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="applicants"
                        checked={filters.applicants === option.value}
                        onChange={() => handleFilterChange("applicants", option.value)}
                        className="peer h-4 w-4 border-muted-foreground text-primary focus:ring-primary/20"
                      />
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            <div className="flex items-center justify-between mb-6 bg-card p-4 rounded-xl border border-border shadow-sm">
              <p className="text-muted-foreground">
                Found <span className="text-foreground font-semibold">{pagination.total}</span> jobs
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ArrowDownUp className="w-4 h-4" />
                <Select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                  className="w-40 h-8 text-xs border-none bg-transparent focus:ring-0"
                >
                  <option value="newest">Newest First</option>
                  <option value="budget_high">Budget: High to Low</option>
                  <option value="budget_low">Budget: Low to High</option>
                  <option value="urgency">Urgency</option>
                  <option value="applicants">Most Applicants</option>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full rounded-xl" />
                ))}
              </div>
            ) : jobs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {jobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === 1}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                    </Button>
                    <span className="flex items-center px-4 py-2 text-sm text-muted-foreground">
                      Page {pagination.page} of {pagination.pages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === pagination.pages}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    >
                      Next <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed border-border">
                <h3 className="text-xl font-semibold mb-2 font-heading">No jobs found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search filters</p>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="text-primary hover:text-primary"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground animate-pulse">Loading jobs...</p>
        </div>
      </div>
    }>
      <JobsContent />
    </Suspense>
  );
}