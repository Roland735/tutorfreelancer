"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Brain,
  Building2,
  CalendarClock,
  Calculator,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Code2,
  Filter,
  FlaskConical,
  Globe,
  GraduationCap,
  Landmark,
  Layers3,
  LineChart,
  MapPin,
  MonitorSmartphone,
  PenTool,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  WalletCards,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EarlyWarningSystem from "@/components/EarlyWarningSystem";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const heroPlaceholders = [
  "Calculus",
  "Python tutoring",
  "Organic Chemistry",
  "Econometrics",
];

const categoryIconMap = {
  mathematics: Calculator,
  "computer-science": Code2,
  science: FlaskConical,
  languages: PenTool,
  business: LineChart,
  humanities: BookOpen,
  psychology: Brain,
  law: Landmark,
};

const processSteps = [
  {
    number: "01",
    title: "Post what you need",
    description:
      "Share the subject, budget, session format, and deadline in under a minute.",
    icon: Filter,
  },
  {
    number: "02",
    title: "Compare trusted student tutors",
    description:
      "Review verified profiles, university backgrounds, response speed, and ratings.",
    icon: Users,
  },
  {
    number: "03",
    title: "Book and learn confidently",
    description:
      "Choose online or in-person support and keep everything organized in one place.",
    icon: CalendarClock,
  },
  {
    number: "04",
    title: "Grow your results or income",
    description:
      "Students improve faster and tutors build a premium freelance reputation on campus.",
    icon: TrendingUp,
  },
];

const trustItems = [
  {
    title: "Verified student identity",
    description:
      "Tutor profiles can be validated against real university details before they get marketplace trust signals.",
    icon: ShieldCheck,
  },
  {
    title: "Clear quality signals",
    description:
      "Ratings, completed sessions, and subject expertise help students compare with confidence.",
    icon: BadgeCheck,
  },
  {
    title: "Secure coordination",
    description:
      "Keep tutoring discovery, communication, and booking decisions inside one professional workflow.",
    icon: WalletCards,
  },
  {
    title: "Built for academic outcomes",
    description:
      "Every section is structured around fast matching, better fit, and less student friction.",
    icon: Zap,
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$0",
    description: "For students exploring support and tutors building early traction.",
    features: [
      "Browse tutors and active requests",
      "Pay only for booked sessions",
      "Standard support access",
      "Basic profile visibility",
    ],
    cta: "Start Free",
    href: "/signup",
  },
  {
    name: "Pro",
    price: "$9.99",
    description: "Best for frequent learners and serious student freelancers.",
    features: [
      "Priority request placement",
      "Reduced platform fees",
      "Enhanced profile credibility",
      "Priority support response",
    ],
    cta: "Choose Pro",
    href: "/pricing",
    featured: true,
  },
  {
    name: "Campus Plus",
    price: "$19.99",
    description: "For tutors maximizing bookings and premium visibility across campuses.",
    features: [
      "Featured tutor placement",
      "Advanced performance insights",
      "Lower commission structure",
      "Faster payout options",
    ],
    cta: "Unlock Premium",
    href: "/pricing",
  },
];

const fallbackReviews = [
  {
    _id: "review-1",
    rating: 5,
    comment:
      "I found a statistics tutor from another university within one evening, and the session quality felt far more professional than random group chats.",
    reviewer: {
      name: "Amina Yusuf",
      university: "University of Lagos",
      avatar: "",
    },
    session: { job: { subject: "Statistics" } },
  },
  {
    _id: "review-2",
    rating: 5,
    comment:
      "As a tutor, the platform made me feel credible. My profile looked polished and students came in with clear expectations.",
    reviewer: {
      name: "Daniel Otieno",
      university: "University of Nairobi",
      avatar: "",
    },
    session: { job: { subject: "Computer Science" } },
  },
  {
    _id: "review-3",
    rating: 5,
    comment:
      "The request feed is easy to scan, and it genuinely feels like a premium student marketplace instead of a messy listings board.",
    reviewer: {
      name: "Maya Chen",
      university: "Ashesi University",
      avatar: "",
    },
    session: { job: { subject: "Microeconomics" } },
  },
];

const fallbackBlogs = [
  {
    id: "blog-1",
    category: "Study Systems",
    title: "How to turn one great tutoring session into exam-week momentum",
    excerpt:
      "Build a simple follow-up routine that helps students retain concepts, prepare smarter, and reduce last-minute panic.",
    date: "New",
    readTime: "5 min read",
    author: { name: "Mwana Wevhu Connect Team" },
  },
  {
    id: "blog-2",
    category: "Tutor Growth",
    title: "What high-trust student tutor profiles do differently",
    excerpt:
      "Learn how better positioning, proof, and subject framing can increase profile quality without sounding salesy.",
    date: "New",
    readTime: "4 min read",
    author: { name: "Mwana Wevhu Connect Team" },
  },
  {
    id: "blog-3",
    category: "Academic Help",
    title: "A better way to request help when you are stuck on a difficult module",
    excerpt:
      "Use a concise, structured request format so tutors can respond faster with stronger proposals and clearer expectations.",
    date: "New",
    readTime: "6 min read",
    author: { name: "Mwana Wevhu Connect Team" },
  },
];

const filterPillBase =
  "inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition";

const formatCompact = (value) => numberFormatter.format(Number(value || 0));

const getInitials = (name = "Student") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

const getCategoryIcon = (slug) => categoryIconMap[slug] || Layers3;

const getBlogAuthor = (blog) =>
  typeof blog.author === "string"
    ? blog.author
    : blog.author?.name || "Mwana Wevhu Connect Team";

function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-200">
          <Sparkles className="h-3.5 w-3.5" />
          {eyebrow}
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

function JobListingCard({ job }) {
  const budgetLabel =
    job?.budget?.min || job?.budget?.max
      ? `$${job?.budget?.min || 0} - $${job?.budget?.max || job?.budget?.min || 0}`
      : "Budget on request";

  const urgencyStyles = {
    High: "border-rose-400/20 bg-rose-400/10 text-rose-200",
    Immediate: "border-rose-400/20 bg-rose-400/10 text-rose-200",
    Medium: "border-amber-400/20 bg-amber-400/10 text-amber-100",
    Low: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
  };

  return (
    <article className="group flex h-full flex-col rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_60px_-34px_rgba(15,23,42,0.95)] transition duration-300 hover:-translate-y-1.5 hover:border-emerald-300/30 hover:bg-white/[0.06]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-100">
            {job.category || "General"}
          </span>
          {job.subjectCode && (
            <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-100">
              {job.subjectCode}
            </span>
          )}
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-medium ${urgencyStyles[job.urgency] ||
            "border-white/10 bg-white/[0.05] text-slate-200"
            }`}
        >
          {job.urgency || "Open"}
        </span>
      </div>

      <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
        <Clock3 className="h-3.5 w-3.5" />
        {job.createdAt
          ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })
          : "Recently posted"}
      </div>

      <h3 className="text-xl font-semibold leading-snug text-white transition group-hover:text-emerald-100">
        {job.title}
      </h3>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">
        {job.description}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-3">
          <div className="mb-1 flex items-center gap-2 text-slate-400">
            <CircleDollarSign className="h-4 w-4 text-emerald-300" />
            Budget
          </div>
          <div className="font-medium text-white">{budgetLabel}</div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-3">
          <div className="mb-1 flex items-center gap-2 text-slate-400">
            <MonitorSmartphone className="h-4 w-4 text-sky-300" />
            Session
          </div>
          <div className="font-medium text-white">{job.sessionType || "Flexible"}</div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-3">
          <div className="mb-1 flex items-center gap-2 text-slate-400">
            <GraduationCap className="h-4 w-4 text-violet-300" />
            Level
          </div>
          <div className="font-medium text-white">
            {job.academicLevel || "Undergraduate"}
          </div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-3">
          <div className="mb-1 flex items-center gap-2 text-slate-400">
            {job.sessionType === "Online" ? (
              <Globe className="h-4 w-4 text-emerald-300" />
            ) : (
              <MapPin className="h-4 w-4 text-rose-300" />
            )}
            Location
          </div>
          <div className="font-medium text-white">
            {job.sessionType === "Online"
              ? "Online"
              : job.location?.city || "Campus area"}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/8 pt-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-sm font-semibold text-white">
            {getInitials(job.postedBy?.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {job.postedBy?.name || "Anonymous student"}
            </p>
            <p className="text-xs text-slate-400">
              {job.applicants?.length || 0} applicants
            </p>
          </div>
        </div>
        <Button
          asChild
          size="sm"
          className="rounded-full bg-white text-slate-950 hover:bg-emerald-300"
        >
          <Link href={`/jobs/${job._id}`}>View Request</Link>
        </Button>
      </div>
    </article>
  );
}

function TutorSpotlightCard({ tutor }) {
  if (!tutor?.user) return null;

  const primarySubject = tutor.subjects?.[0]?.name || "Academic Support";

  return (
    <article className="min-w-[320px] max-w-[340px] snap-start rounded-[30px] border border-white/10 bg-white/[0.05] p-5 shadow-[0_28px_70px_-36px_rgba(15,23,42,0.95)] transition duration-300 hover:-translate-y-1.5 hover:border-emerald-300/25 hover:bg-white/[0.07]">
      <div className="relative overflow-hidden rounded-[24px] border border-white/8 bg-gradient-to-br from-emerald-400/12 via-slate-950 to-sky-400/10 p-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={
                tutor.user.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  tutor.user.name || "Tutor"
                )}&background=0f172a&color=ffffff`
              }
              alt={tutor.user.name}
              className="h-16 w-16 rounded-2xl border border-white/10 object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-white">{tutor.user.name}</h3>
              <p className="text-sm text-emerald-100">{primarySubject}</p>
            </div>
          </div>
          {tutor.badges?.[0] && (
            <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[11px] font-medium text-amber-100">
              {tutor.badges[0]}
            </span>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 text-sm">
            <span className="flex items-center gap-2 text-slate-300">
              <Building2 className="h-4 w-4 text-sky-300" />
              University
            </span>
            <span className="max-w-[150px] truncate font-medium text-white">
              {tutor.user.university || "University Student"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3">
              <div className="mb-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                Rating
              </div>
              <div className="flex items-center gap-2 font-semibold text-white">
                <Star className="h-4 w-4 fill-current text-amber-300" />
                {tutor.stats?.rating?.toFixed(1) || "5.0"}
              </div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3">
              <div className="mb-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                Sessions
              </div>
              <div className="font-semibold text-white">
                {formatCompact(tutor.stats?.totalSessions || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-4 flex flex-wrap gap-2">
          {(tutor.subjects || []).slice(0, 4).map((subject, index) => (
            <span
              key={`${tutor._id}-subject-${index}`}
              className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-xs font-medium text-slate-200"
            >
              {subject.name}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Starting at
            </p>
            <p className="text-2xl font-semibold text-white">
              ${tutor.hourlyRate || 0}
              <span className="ml-1 text-sm font-normal text-slate-400">/ hour</span>
            </p>
          </div>
          <Button
            asChild
            className="rounded-full bg-emerald-400 text-slate-950 hover:bg-emerald-300"
          >
            <Link href={`/tutors/${tutor.user._id}`}>View Profile</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

function ReviewCard({ review }) {
  const subject = review.session?.job?.subject || review.session?.subject || "Tutoring";

  return (
    <article className="flex h-full flex-col rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_60px_-34px_rgba(15,23,42,0.95)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={
              review.reviewer?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                review.reviewer?.name || "Student"
              )}&background=0f172a&color=ffffff`
            }
            alt={review.reviewer?.name || "Student"}
            className="h-12 w-12 rounded-2xl border border-white/10 object-cover"
          />
          <div>
            <h3 className="font-semibold text-white">
              {review.reviewer?.name || "Student"}
            </h3>
            <p className="text-sm text-slate-400">
              {review.reviewer?.university || "University Student"}
            </p>
          </div>
        </div>
        <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-sm font-medium text-amber-100">
          {review.rating || 5}.0
        </span>
      </div>

      <div className="mb-4 flex gap-1 text-amber-300">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={`star-${index}`}
            className={`h-4 w-4 ${index < (review.rating || 5) ? "fill-current" : ""}`}
          />
        ))}
      </div>

      <p className="flex-1 text-sm leading-7 text-slate-300">
        &quot;{review.comment}&quot;
      </p>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/8 pt-4 text-sm">
        <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-slate-200">
          {subject}
        </span>
        <span className="text-slate-400">Verified student review</span>
      </div>
    </article>
  );
}

function ArticleCard({ blog }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-[0_24px_60px_-34px_rgba(15,23,42,0.95)] transition duration-300 hover:-translate-y-1 hover:border-emerald-300/25">
      <div className="h-44 border-b border-white/8 bg-gradient-to-br from-slate-900 via-emerald-400/10 to-sky-400/10 p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-100">
            {blog.category || "Insights"}
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-medium text-slate-200">
            {blog.readTime || "5 min read"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
          <BookOpen className="h-3.5 w-3.5" />
          Student Editorial
        </div>
        <h3 className="text-xl font-semibold leading-snug text-white">{blog.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-7 text-slate-300">{blog.excerpt}</p>
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/8 pt-4 text-sm">
          <span className="text-slate-200">{getBlogAuthor(blog)}</span>
          <span className="text-slate-400">{blog.date || "Latest"}</span>
        </div>
      </div>
    </article>
  );
}

function PricingPlanCard({ plan }) {
  return (
    <article
      className={`relative flex h-full flex-col rounded-[30px] border p-6 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.95)] ${plan.featured
        ? "border-emerald-300/30 bg-gradient-to-b from-emerald-400/12 via-white/[0.06] to-white/[0.04]"
        : "border-white/10 bg-white/[0.04]"
        }`}
    >
      {plan.featured && (
        <div className="absolute right-5 top-5 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
          Best Value
        </div>
      )}
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.26em] text-slate-400">{plan.name}</p>
        <div className="mt-4 flex items-end gap-2">
          <h3 className="text-5xl font-semibold text-white">{plan.price}</h3>
          <span className="pb-2 text-slate-400">/ month</span>
        </div>
        <p className="mt-4 text-sm leading-7 text-slate-300">{plan.description}</p>
      </div>

      <div className="flex-1 space-y-4 border-t border-white/8 pt-6">
        {plan.features.map((feature) => (
          <div key={feature} className="flex items-start gap-3 text-sm text-slate-200">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-300" />
            <span className="leading-6">{feature}</span>
          </div>
        ))}
      </div>

      <Button
        asChild
        className={`mt-8 rounded-full ${plan.featured
          ? "bg-white text-slate-950 hover:bg-emerald-300"
          : "bg-transparent text-white border border-white/12 hover:bg-white/[0.06]"
          }`}
      >
        <Link href={plan.href}>{plan.cta}</Link>
      </Button>
    </article>
  );
}

export default function Home() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const [jobFilters, setJobFilters] = useState({
    category: "All",
    budget: "All",
    type: "Any",
    urgency: "Any",
    level: "Any",
  });

  const tutorsScrollRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((current) => (current + 1) % heroPlaceholders.length);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const fetchJobs = useCallback(async () => {
    setJobsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        limit: "8",
        ...jobFilters,
      });

      if (jobFilters.budget === "50") {
        queryParams.set("max", "50");
      } else if (jobFilters.budget === "100") {
        queryParams.set("min", "50");
        queryParams.set("max", "100");
      } else if (jobFilters.budget === "200") {
        queryParams.set("min", "100");
      }

      queryParams.delete("budget");
      if (queryParams.get("category") === "All") queryParams.delete("category");
      if (queryParams.get("type") === "Any") queryParams.delete("type");
      if (queryParams.get("urgency") === "Any") queryParams.delete("urgency");
      if (queryParams.get("level") === "Any") queryParams.delete("level");

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
  }, [jobFilters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, tutorsRes, catsRes, reviewsRes, blogsRes] = await Promise.all(
          [
            fetch("/api/stats"),
            fetch("/api/tutors?featured=true&limit=8"),
            fetch("/api/categories"),
            fetch("/api/reviews"),
            fetch("/api/blogs?limit=4"),
          ]
        );

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

  const handleHeroSearch = (event) => {
    event.preventDefault();

    const value = searchTerm.trim();
    if (!value) return;

    const isCode =
      /^[A-Za-z]{3,5}\d{0,4}$/.test(value) && value.length <= 8;

    router.push(
      `/jobs?${isCode ? `code=${encodeURIComponent(value)}` : `keyword=${encodeURIComponent(value)}`}`
    );
  };

  const updateFilter = (key, value) => {
    setJobFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const displayReviews = (reviews.length ? reviews : fallbackReviews).slice(0, 3);
  const displayBlogs = (blogs.length ? blogs : fallbackBlogs).slice(0, 3);
  const topCategories = categories.slice(0, 8);
  const heroTutor = tutors[0];
  const heroRequest = jobs[0];

  const headlineMetrics = [
    {
      label: "Verified tutors",
      value: `${formatCompact(stats?.tutors || 0)}+`,
      icon: Users,
    },
    {
      label: "Sessions completed",
      value: `${formatCompact(stats?.sessions || 0)}+`,
      icon: CalendarClock,
    },
    {
      label: "Subjects covered",
      value: `${formatCompact(stats?.subjects || 0)}+`,
      icon: BookOpen,
    },
    {
      label: "Average rating",
      value: stats?.avgRating ? stats.avgRating.toFixed(1) : "4.9",
      icon: Star,
    },
  ];

  const momentumStats = [
    {
      title: "Student community",
      value: `${formatCompact(stats?.users || 0)}+`,
      description: "Students and tutors already building academic momentum together.",
      icon: Users,
    },
    {
      title: "Session volume",
      value: `${formatCompact(stats?.sessions || 0)}+`,
      description: "A steady stream of completed sessions across multiple universities.",
      icon: CalendarClock,
    },
    {
      title: "Market confidence",
      value: `${stats?.avgRating ? stats.avgRating.toFixed(1) : "4.9"} / 5`,
      description: "High-quality outcomes supported by student reviews and repeat demand.",
      icon: ShieldCheck,
    },
    {
      title: "Academic coverage",
      value: `${formatCompact(stats?.subjects || 0)}+`,
      description: "From STEM to essay-heavy disciplines and applied business support.",
      icon: Layers3,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-50 selection:bg-emerald-400/30">
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-white/6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.2),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_30%),linear-gradient(180deg,_rgba(15,23,42,0.35),_rgba(2,6,23,0.96))]" />
          <div className="absolute left-0 top-24 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl" />
          <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pb-28 lg:pt-16">
            <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-200 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.95)]">
                  <BadgeCheck className="h-4 w-4 text-emerald-300" />
                  Trusted by university students
                </div>

                <h1 className="mt-8 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
                  Find a great tutor or become one.
                </h1>

                <p className="mt-5 max-w-xl text-lg leading-7 text-slate-300 sm:text-xl">
                  A premium student marketplace for academic help across
                  universities.
                </p>

                <form
                  onSubmit={handleHeroSearch}
                  className="mt-8 max-w-2xl rounded-[28px] border border-white/10 bg-white/[0.06] p-3 shadow-[0_32px_80px_-42px_rgba(15,23,42,0.95)] backdrop-blur-xl"
                >
                  <label htmlFor="hero-search" className="sr-only">
                    Search tutoring requests
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/8 bg-slate-950/70 px-4 py-3">
                      <Search className="h-5 w-5 text-slate-400" />
                      <input
                        id="hero-search"
                        type="text"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder={`Search "${heroPlaceholders[placeholderIndex]}"`}
                        className="w-full bg-transparent text-base text-white outline-none placeholder:text-slate-500"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="h-12 rounded-2xl bg-emerald-400 px-6 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
                    >
                      Explore Requests
                    </Button>
                  </div>
                </form>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button
                    asChild
                    className="h-12 rounded-full bg-white px-6 text-slate-950 hover:bg-emerald-300"
                  >
                    <Link href="/tutors">
                      Find a Tutor
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="h-12 rounded-full border border-white/12 bg-white/[0.04] px-6 text-white hover:bg-white/[0.08]"
                  >
                    <Link href="/post-job">Post a Request</Link>
                  </Button>
                  <Button
                    asChild
                    className="h-12 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-6 text-white hover:bg-emerald-400/20"
                  >
                    <Link href="#early-warning">Early Warning Detector</Link>
                  </Button>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {headlineMetrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.95)]"
                    >
                      <div className="mb-3 inline-flex rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-2 text-emerald-200">
                        <metric.icon className="h-4 w-4" />
                      </div>
                      <div className="text-2xl font-semibold text-white">
                        {metric.value}
                      </div>
                      <div className="mt-1 text-sm text-slate-400">{metric.label}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                  <span>Popular across:</span>
                  {[
                    "University of Lagos",
                    "University of Nairobi",
                    "Ashesi University",
                  ].map((institution) => (
                    <span
                      key={institution}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-slate-200"
                    >
                      {institution}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-x-10 top-10 h-64 rounded-full bg-emerald-400/12 blur-3xl" />
                <div className="relative rounded-[34px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_36px_100px_-48px_rgba(16,185,129,0.55)] backdrop-blur-xl sm:p-6">
                  <div className="rounded-[28px] border border-white/8 bg-slate-950/80 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm uppercase tracking-[0.26em] text-slate-400">
                          Live Snapshot
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold text-white">
                          A smarter student marketplace.
                        </h2>
                      </div>
                      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-emerald-200">
                        <Sparkles className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="mt-8 grid grid-cols-3 gap-3">
                      <div className="rounded-[22px] border border-white/8 bg-white/[0.04] px-4 py-4">
                        <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          Tutors
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-white">
                          {formatCompact(stats?.tutors || 0)}+
                        </div>
                      </div>
                      <div className="rounded-[22px] border border-white/8 bg-white/[0.04] px-4 py-4">
                        <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          Rating
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-2xl font-semibold text-white">
                          {stats?.avgRating ? stats.avgRating.toFixed(1) : "4.9"}
                          <Star className="h-4 w-4 fill-current text-amber-300" />
                        </div>
                      </div>
                      <div className="rounded-[22px] border border-white/8 bg-white/[0.04] px-4 py-4">
                        <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          Subjects
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-white">
                          {formatCompact(stats?.subjects || 0)}+
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
                      <div className="rounded-[28px] border border-white/8 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6">
                        <div className="mb-5 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm text-slate-400">Current demand</p>
                            <h3 className="text-lg font-semibold text-white">
                              Students are posting now
                            </h3>
                          </div>
                          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-100">
                            Active now
                          </span>
                        </div>
                        <div className="rounded-[22px] border border-white/8 bg-slate-950/80 p-5">
                          <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                            <CircleDollarSign className="h-4 w-4 text-emerald-300" />
                            Featured request
                          </div>
                          <h4 className="text-base font-semibold text-white">
                            {heroRequest?.title || "Need help with advanced statistics review"}
                          </h4>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-300">
                            {heroRequest?.description ||
                              "Well-structured tutoring requests attract stronger responses and faster matches."}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-200">
                              {heroRequest?.sessionType || "Online"}
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-200">
                              {heroRequest?.academicLevel || "Undergraduate"}
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-200">
                              {heroRequest?.budget?.min || 40} - {heroRequest?.budget?.max || 90} USD
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[28px] border border-white/8 bg-gradient-to-br from-emerald-400/10 via-transparent to-sky-400/10 p-6">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-emerald-200">
                            <Users className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Tutor quality</p>
                            <h3 className="text-lg font-semibold text-white">
                              Profiles students trust
                            </h3>
                          </div>
                        </div>
                        <div className="rounded-[22px] border border-white/8 bg-slate-950/80 p-5">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                heroTutor?.user?.avatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  heroTutor?.user?.name || "Tutor"
                                )}&background=0f172a&color=ffffff`
                              }
                              alt={heroTutor?.user?.name || "Tutor"}
                              className="h-14 w-14 rounded-2xl border border-white/10 object-cover"
                            />
                            <div>
                              <p className="font-semibold text-white">
                                {heroTutor?.user?.name || "Top-performing student tutor"}
                              </p>
                              <p className="text-sm text-slate-400">
                                {heroTutor?.user?.university || "University profile"}
                              </p>
                            </div>
                          </div>
                          <div className="mt-5 flex flex-wrap gap-2">
                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-200">
                              {heroTutor?.subjects?.[0]?.name || "STEM tutoring"}
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-200">
                              ${heroTutor?.hourlyRate || 25}/hr
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-200">
                              {heroTutor?.stats?.rating?.toFixed(1) || "5.0"} rating
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="early-warning" className="border-b border-white/6 bg-slate-950/95 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <EarlyWarningSystem
              title="Spot learning risk before you fall behind"
              description="Enter the module you are taking, add previous assessment marks, answer a short AI-generated quiz, and get a prediction, study advice, and tutor recommendations."
            />
          </div>
        </section>

        <section className="border-b border-white/6 bg-slate-950/90 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {momentumStats.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6"
                >
                  <div className="mb-4 inline-flex rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-emerald-200">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="text-3xl font-semibold text-white">{item.value}</div>
                  <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="marketplace" className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Latest Tutoring Requests"
              title="A cleaner, faster marketplace feed for real academic demand"
              description="Students can scan current requests in seconds, while tutors can focus on fit, urgency, and earning potential without sorting through clutter."
              action={
                <Button
                  asChild
                  className="h-11 rounded-full bg-white text-slate-950 hover:bg-emerald-300"
                >
                  <Link href="/jobs">
                    View All Requests
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              }
            />

            <div className="mt-10 rounded-[30px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_28px_70px_-42px_rgba(15,23,42,0.95)] sm:p-6">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-2 text-emerald-200">
                      <Filter className="h-4 w-4" />
                    </div>
                    Filter by subject, budget, urgency, and study level
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      setJobFilters({
                        category: "All",
                        budget: "All",
                        type: "Any",
                        urgency: "Any",
                        level: "Any",
                      })
                    }
                    className="h-10 rounded-full border border-white/10 bg-white/[0.04] px-4 text-slate-200 hover:bg-white/[0.08]"
                  >
                    Reset Filters
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <div>
                    <label
                      htmlFor="category-filter"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Subject area
                    </label>
                    <Select
                      id="category-filter"
                      value={jobFilters.category}
                      onChange={(event) => updateFilter("category", event.target.value)}
                      className="h-12 rounded-2xl border-white/10 bg-slate-950/70 text-white"
                    >
                      <option value="All">All categories</option>
                      {categories.map((category) => (
                        <option key={category.name} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label
                      htmlFor="budget-filter"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Budget
                    </label>
                    <Select
                      id="budget-filter"
                      value={jobFilters.budget}
                      onChange={(event) => updateFilter("budget", event.target.value)}
                      className="h-12 rounded-2xl border-white/10 bg-slate-950/70 text-white"
                    >
                      <option value="All">Any budget</option>
                      <option value="50">Under $50</option>
                      <option value="100">$50 - $100</option>
                      <option value="200">$100+</option>
                    </Select>
                  </div>
                  <div>
                    <label
                      htmlFor="level-filter"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Academic level
                    </label>
                    <Select
                      id="level-filter"
                      value={jobFilters.level}
                      onChange={(event) => updateFilter("level", event.target.value)}
                      className="h-12 rounded-2xl border-white/10 bg-slate-950/70 text-white"
                    >
                      <option value="Any">Any level</option>
                      <option value="High School">High School</option>
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Graduate">Graduate</option>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                  <div>
                    <p className="mb-3 text-sm font-medium text-slate-300">
                      Session type
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Any", "Online", "In-Person"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateFilter("type", option)}
                          className={`${filterPillBase} ${jobFilters.type === option
                            ? "border-emerald-300/30 bg-emerald-400/15 text-emerald-100"
                            : "border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"
                            }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-3 text-sm font-medium text-slate-300">
                      Urgency
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Any", "Low", "Medium", "High"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateFilter("urgency", option)}
                          className={`${filterPillBase} ${jobFilters.urgency === option
                            ? "border-emerald-300/30 bg-emerald-400/15 text-emerald-100"
                            : "border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"
                            }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between gap-4">
              <p className="text-sm text-slate-400">
                {jobsLoading
                  ? "Refreshing live tutoring demand..."
                  : `${jobs.length} curated requests shown for your current filters`}
              </p>
              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 sm:flex">
                <BadgeCheck className="h-4 w-4 text-emerald-300" />
                Refined for faster scanning
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {jobsLoading
                ? Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton
                    key={`job-skeleton-${index}`}
                    className="h-[380px] rounded-[28px] bg-white/[0.04]"
                  />
                ))
                : jobs.map((job) => <JobListingCard key={job._id} job={job} />)}
            </div>

            {!jobsLoading && jobs.length === 0 && (
              <div className="mt-8 rounded-[28px] border border-dashed border-white/12 bg-white/[0.03] px-6 py-12 text-center">
                <h3 className="text-xl font-semibold text-white">
                  No requests match these filters yet
                </h3>
                <p className="mt-3 text-slate-400">
                  Try widening the budget or urgency settings to reveal more opportunities.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="border-y border-white/6 bg-white/[0.03] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <SectionHeader
                eyebrow="Featured Tutors"
                title="High-value tutor profiles that feel credible at a glance"
                description="From university name to subject depth, reviews, and pricing, each profile is designed to make students comfortable booking quickly."
              />
              <div className="flex items-center justify-start gap-3 lg:justify-end">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scrollTutors("left")}
                  className="h-11 w-11 rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                  aria-label="Scroll tutors left"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scrollTutors("right")}
                  className="h-11 w-11 rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                  aria-label="Scroll tutors right"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
                <Button
                  asChild
                  className="h-11 rounded-full bg-white text-slate-950 hover:bg-emerald-300"
                >
                  <Link href="/tutors">Browse All Tutors</Link>
                </Button>
              </div>
            </div>

            <div
              ref={tutorsScrollRef}
              className="mt-10 flex snap-x gap-5 overflow-x-auto pb-4 scrollbar-hide"
            >
              {loading
                ? Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton
                    key={`tutor-skeleton-${index}`}
                    className="h-[400px] min-w-[320px] rounded-[30px] bg-white/[0.04]"
                  />
                ))
                : tutors.map((tutor) => (
                  <TutorSpotlightCard key={tutor._id} tutor={tutor} />
                ))}
            </div>
          </div>
        </section>

        <section id="categories" className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Subject Categories"
              title="Curated academic navigation for the subjects students actually search"
              description="A polished category system makes the marketplace easier to understand instantly and easier to explore on every screen size."
            />

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {loading && !categories.length
                ? Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton
                    key={`category-skeleton-${index}`}
                    className="h-36 rounded-[28px] bg-white/[0.04]"
                  />
                ))
                : topCategories.map((category) => {
                  const Icon = getCategoryIcon(category.slug);

                  return (
                    <Link
                      key={category._id}
                      href={`/jobs?category=${encodeURIComponent(category.name)}`}
                      className="group rounded-[28px] border border-white/10 bg-white/[0.04] p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-300/25 hover:bg-white/[0.06]"
                    >
                      <div className="flex h-full items-start justify-between gap-4">
                        <div>
                          <div className="mb-4 inline-flex rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-emerald-200 transition group-hover:border-emerald-300/20 group-hover:bg-emerald-400/10">
                            <Icon className="h-5 w-5" />
                          </div>
                          <h3 className="text-lg font-semibold text-white">
                            {category.name}
                          </h3>
                          <p className="mt-2 text-sm text-slate-400">
                            {category.activeJobs || 0} active requests
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-slate-500 transition group-hover:text-emerald-200" />
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-y border-white/6 bg-white/[0.03] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="How It Works"
              title="A clear student journey from request to results"
              description="The workflow is intentionally simple, fast to understand, and structured enough to feel like a serious product rather than an informal noticeboard."
            />

            <div className="mt-10 grid gap-5 lg:grid-cols-4">
              {processSteps.map((step) => (
                <article
                  key={step.number}
                  className="relative rounded-[28px] border border-white/10 bg-slate-950/80 p-6"
                >
                  <div className="mb-6 flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                      {step.number}
                    </span>
                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-emerald-200">
                      <step.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Testimonials"
              title="Warm, credible proof from real students"
              description="Emotional trust matters just as much as functionality. These stories reinforce that the platform helps students feel supported and tutors feel proud of their work."
            />

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {displayReviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/6 bg-white/[0.03] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Blog And Tips"
              title="A smart content hub for study habits, tutor growth, and academic wins"
              description="Editorial-style cards keep the page useful and intelligent, giving students more reasons to trust the product beyond the core marketplace."
            />

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {displayBlogs.map((blog) => (
                <ArticleCard key={blog.id} blog={blog} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Trust And Safety"
              title="Confidence-building details that reduce hesitation"
              description="This section reassures students and tutors without over-explaining. The tone stays calm, professional, and aligned with a premium education product."
            />

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {trustItems.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6"
                >
                  <div className="mb-4 inline-flex rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-emerald-200">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="border-y border-white/6 bg-white/[0.03] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Pricing"
              title="Transparent plans designed for clarity, not pressure"
              description="The comparison is intentionally easy to scan. One plan stands out by composition and refinement rather than by shouting for attention."
            />

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {pricingPlans.map((plan) => (
                <PricingPlanCard key={plan.name} plan={plan} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-slate-900 via-emerald-400/15 to-sky-400/10 px-6 py-14 shadow-[0_40px_100px_-56px_rgba(16,185,129,0.65)] sm:px-10 lg:px-14">
              <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-emerald-400/15 blur-3xl" />
              <div className="absolute -right-10 bottom-0 h-52 w-52 rounded-full bg-sky-400/15 blur-3xl" />
              <div className="relative max-w-3xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-emerald-100">
                  <Sparkles className="h-4 w-4" />
                  Premium student community
                </div>
                <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                  Join the university network where students learn faster and
                  talented tutors earn with credibility.
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
                  Whether you need academic support this week or want to turn your
                  expertise into a respected freelance profile, the platform is
                  ready for both sides of the marketplace.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    asChild
                    className="h-12 rounded-full bg-white px-6 text-slate-950 hover:bg-emerald-300"
                  >
                    <Link href="/post-job">Post a Request for Free</Link>
                  </Button>
                  <Button
                    asChild
                    className="h-12 rounded-full border border-white/12 bg-white/[0.05] px-6 text-white hover:bg-white/[0.09]"
                  >
                    <Link href="/signup">Create Tutor Profile</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
