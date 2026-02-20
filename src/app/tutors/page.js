"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import TutorCard from "@/components/TutorCard";
import Footer from "@/components/Footer";
import { Search, Filter, Star, ArrowDownUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

function TutorsContent() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    subject: searchParams.get("subject") || "All",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    rating: searchParams.get("rating") || "Any",
    type: searchParams.get("type") || "Any",
    language: searchParams.get("language") || "All",
    badge: searchParams.get("badge") || "Any",
    sort: searchParams.get("sort") || "rating",
  });

  const [tutors, setTutors] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Subjects (mock)
  const subjects = [
    "All", "Mathematics", "Calculus", "Algebra", "Computer Science",
    "Python", "JavaScript", "Physics", "Chemistry", "Biology",
    "English", "Spanish", "French", "History", "Economics"
  ];

  const fetchTutors = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "All" && value !== "Any") {
          params.append(key, value);
        }
      });
      params.append("page", pagination.page);

      const res = await fetch(`/api/tutors?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTutors(data.tutors);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching tutors:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page]);

  useEffect(() => {
    fetchTutors();
  }, [fetchTutors]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      keyword: "",
      subject: "All",
      minPrice: "",
      maxPrice: "",
      rating: "Any",
      type: "Any",
      language: "All",
      badge: "Any",
      sort: "rating",
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
            Find the Perfect Tutor
          </h1>
          <div className="relative max-w-3xl">
            <Input
              type="text"
              placeholder="Search by name, subject, or university..."
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

              {/* Subject Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Subject</label>
                <Select
                  value={filters.subject}
                  onChange={(e) => handleFilterChange("subject", e.target.value)}
                >
                  {subjects.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </Select>
              </div>

              {/* Hourly Rate */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Hourly Rate ($)</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                    className="w-1/2"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                    className="w-1/2"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Minimum Rating</label>
                <div className="space-y-2">
                  {["Any", "4.5", "4.0", "3.5"].map(rate => (
                    <label key={rate} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.rating === rate}
                        onChange={() => handleFilterChange("rating", rate)}
                        className="peer h-4 w-4 border-muted-foreground text-primary focus:ring-primary/20"
                      />
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                        {rate === "Any" ? "Any Rating" : <>{rate}+ <Star className="text-yellow-500 fill-current w-3 h-3" /></>}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Session Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Session Type</label>
                <div className="space-y-2">
                  {["Any", "Online", "In-Person", "Both"].map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="type"
                        checked={filters.type === type}
                        onChange={() => handleFilterChange("type", type)}
                        className="peer h-4 w-4 border-muted-foreground text-primary focus:ring-primary/20"
                      />
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Language</label>
                <Select
                  value={filters.language}
                  onChange={(e) => handleFilterChange("language", e.target.value)}
                >
                  {["All", "English", "Spanish", "French", "Mandarin", "German", "Arabic"].map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </Select>
              </div>

              {/* Badges */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Badge</label>
                <div className="space-y-2">
                  {["Any", "Top Rated", "Rising Talent", "Expert", "Verified"].map(badge => (
                    <label key={badge} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="badge"
                        checked={filters.badge === badge}
                        onChange={() => handleFilterChange("badge", badge)}
                        className="peer h-4 w-4 border-muted-foreground text-primary focus:ring-primary/20"
                      />
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors">{badge}</span>
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
                Found <span className="text-foreground font-semibold">{pagination.total}</span> tutors
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ArrowDownUp className="w-4 h-4" />
                <Select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                  className="w-40 h-8 text-xs border-none bg-transparent focus:ring-0"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="sessions">Most Sessions</option>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-80 w-full rounded-xl" />
                ))}
              </div>
            ) : tutors.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {tutors.map((tutor) => (
                    <TutorCard key={tutor._id} tutor={tutor} />
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
                <h3 className="text-xl font-semibold mb-2 font-heading">No tutors found</h3>
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

export default function TutorsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground animate-pulse">Loading tutors...</p>
        </div>
      </div>
    }>
      <TutorsContent />
    </Suspense>
  );
}