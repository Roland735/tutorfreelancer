"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Filter, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsBanner from "@/components/StatsBanner";
import HowItWorks from "@/components/HowItWorks";
import Categories from "@/components/Categories";
import TrustSection from "@/components/TrustSection";
import JobCard from "@/components/JobCard";
import TutorCard from "@/components/TutorCard";
import TestimonialCard from "@/components/TestimonialCard";
import BlogCard from "@/components/BlogCard";
import PricingCard from "@/components/PricingCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Home() {
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);

  // Job Filters State
  const [jobFilters, setJobFilters] = useState({
    category: "All",
    budget: "All",
    type: "Any",
    urgency: "Any",
    level: "Any"
  });

  // Tutors Carousel Ref
  const tutorsScrollRef = useRef(null);

  const fetchJobs = async () => {
    setJobsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        limit: 12,
        ...jobFilters
      });

      // Handle Budget Filter
      if (jobFilters.budget === "50") {
        queryParams.set("max", "50");
      } else if (jobFilters.budget === "100") {
        queryParams.set("min", "50");
        queryParams.set("max", "100");
      } else if (jobFilters.budget === "200") {
        queryParams.set("min", "100");
      }

      // Clean up "All"/"Any" values and the raw budget param
      queryParams.delete('budget');
      if (queryParams.get('category') === 'All') queryParams.delete('category');
      if (queryParams.get('type') === 'Any') queryParams.delete('type');
      if (queryParams.get('urgency') === 'Any') queryParams.delete('urgency');
      if (queryParams.get('level') === 'Any') queryParams.delete('level');

      const res = await fetch(`/api/jobs?${queryParams}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [jobFilters]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, tutorsRes, catsRes, reviewsRes, blogsRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/tutors?featured=true&limit=8"),
          fetch("/api/categories"),
          fetch("/api/reviews"),
          fetch("/api/blogs?limit=4"),
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (tutorsRes.ok) {
          const data = await tutorsRes.json();
          setTutors(data.tutors || []);
        }
        if (catsRes.ok) setCategories(await catsRes.json());
        if (reviewsRes.ok) setReviews(await reviewsRes.json());
        if (blogsRes.ok) setBlogs(await blogsRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const scrollTutors = (direction) => {
    if (tutorsScrollRef.current) {
      const { current } = tutorsScrollRef;
      const scrollAmount = direction === "left" ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/30">
      <Navbar />

      {/* Hero Section */}
      <Hero stats={stats} />

      {/* Live Job Listings */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-heading">
              Latest Tutoring Requests
            </h2>
            <p className="text-muted-foreground">
              Browse {stats?.jobs || "hundreds of"} active jobs posted by students.
            </p>
          </div>
          <Button asChild variant="link" className="hidden md:flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition p-0">
            <Link href="/jobs">View All Jobs <ArrowRight size={16} /></Link>
          </Button>
        </div>

        {/* Job Filters */}
        <div className="bg-card p-4 rounded-xl border border-border mb-8 overflow-x-auto shadow-sm">
          <div className="flex flex-wrap gap-4 min-w-max items-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-foreground font-medium">
              <Filter className="text-primary" size={16} /> Filters:
            </div>

            <div className="w-48">
              <Select
                value={jobFilters.category}
                onChange={(e) => setJobFilters({ ...jobFilters, category: e.target.value })}
              >
                <option value="All">All Categories</option>
                {categories.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
              </Select>
            </div>

            <div className="w-40">
              <Select
                value={jobFilters.budget}
                onChange={(e) => setJobFilters({ ...jobFilters, budget: e.target.value })}
              >
                <option value="All">Any Budget</option>
                <option value="50">Under $50</option>
                <option value="100">$50 - $100</option>
                <option value="200">$100+</option>
              </Select>
            </div>

            <div className="w-40">
              <Select
                value={jobFilters.type}
                onChange={(e) => setJobFilters({ ...jobFilters, type: e.target.value })}
              >
                <option value="Any">Any Session Type</option>
                <option value="Online">Online</option>
                <option value="In-Person">In-Person</option>
              </Select>
            </div>

            <div className="w-40">
              <Select
                value={jobFilters.urgency}
                onChange={(e) => setJobFilters({ ...jobFilters, urgency: e.target.value })}
              >
                <option value="Any">Any Urgency</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Select>
            </div>

            <div className="w-40">
              <Select
                value={jobFilters.level}
                onChange={(e) => setJobFilters({ ...jobFilters, level: e.target.value })}
              >
                <option value="Any">Any Level</option>
                <option value="High School">High School</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Graduate">Graduate</option>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {jobsLoading
            ? [...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))
            : jobs.map((job) => <JobCard key={job._id} job={job} />)}
        </div>

        {jobs.length === 0 && !jobsLoading && (
          <div className="text-center py-12 text-muted-foreground">
            No jobs found matching your filters.
          </div>
        )}

        <div className="mt-12 text-center md:hidden">
          <Button asChild variant="link" className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition">
            <Link href="/jobs">View All Jobs <ArrowRight size={16} /></Link>
          </Button>
        </div>
      </section>

      {/* Featured Tutors Carousel */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-heading">
                Top Rated Student Tutors
              </h2>
              <p className="text-muted-foreground">
                Learn from the best minds at top universities.
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollTutors('left')}
                className="hidden md:flex rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition"
              >
                <ChevronLeft size={20} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollTutors('right')}
                className="hidden md:flex rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition"
              >
                <ChevronRight size={20} />
              </Button>
            </div>
          </div>

          <div
            ref={tutorsScrollRef}
            className="flex overflow-x-auto gap-6 pb-8 snap-x scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
            style={{ scrollBehavior: 'smooth' }}
          >
            {loading
              ? [...Array(4)].map((_, i) => (
                <Skeleton key={i} className="min-w-[300px] md:min-w-[350px] h-96 rounded-xl snap-center" />
              ))
              : tutors.map((tutor) => (
                <div key={tutor._id} className="min-w-[300px] md:min-w-[350px] snap-center">
                  <TutorCard tutor={tutor} />
                </div>
              ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="link" className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition">
              <Link href="/tutors">View All Tutors <ArrowRight size={16} /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <StatsBanner stats={stats} />

      {/* Subject Categories */}
      <Categories categories={categories} />

      {/* How It Works */}
      <HowItWorks />

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground font-heading">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.slice(0, 6).map((review) => (
              <TestimonialCard key={review._id} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* Blog / Tips Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-heading">
                Student Life & Learning Tips
              </h2>
              <p className="text-muted-foreground">
                Guides to help you succeed in your studies and tutoring journey.
              </p>
            </div>
            <Button asChild variant="link" className="hidden md:flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition">
              <Link href="/blog">Read More <ArrowRight size={16} /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <TrustSection />

      {/* Pricing Preview */}
      <section id="pricing" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-heading">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground text-lg">
              No hidden fees. Choose the plan that works for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              plan={{
                name: "Free",
                price: "0",
                description: "Perfect for occasional help.",
                features: ["Free job posting", "Access to all tutors", "Pay per session", "Basic support"],
                cta: "Get Started Free"
              }}
            />
            <PricingCard
              isPopular
              plan={{
                name: "Pro",
                price: "9.99",
                description: "For serious learners.",
                features: ["Priority job listing", "0% service fee", "Session recordings", "Premium support"],
                cta: "Start Free Trial"
              }}
            />
            <PricingCard
              plan={{
                name: "Elite",
                price: "19.99",
                description: "Maximize your earnings.",
                features: ["Featured profile", "Lower commission", "Advanced analytics", "Instant payouts"],
                cta: "Upgrade Now"
              }}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-primary/90 to-emerald-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 font-heading">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-emerald-100 mb-12 max-w-2xl mx-auto">
            Join 10,000+ students already learning and earning on TutorFreelance.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="xl" className="bg-background text-foreground hover:bg-muted font-bold py-4 px-10 rounded-full shadow-xl border-none h-auto">
              <Link href="/jobs/post">Post a Job for Free</Link>
            </Button>
            <Button asChild size="xl" className="bg-primary text-primary-foreground font-bold py-4 px-10 rounded-full hover:bg-primary/90 transition shadow-xl border border-primary-foreground/20 h-auto">
              <Link href="/register">Create Your Tutor Profile</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
