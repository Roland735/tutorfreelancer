"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  Wallet, Briefcase, Calendar, Star, TrendingUp,
  User, CheckCircle, Clock, BookOpen, ChevronRight, DollarSign, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export default function TutorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [sessionsData, setSessionsData] = useState([]);
  const [applications, setApplications] = useState([]);
  const [tutorReviews, setTutorReviews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status !== "authenticated") return;

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [profileRes, jobsRes, sessionsRes, appsRes, reviewsRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/jobs?limit=4&sort=newest"),
          fetch("/api/tutor/sessions"),
          fetch("/api/jobs/applied"),
          fetch(`/api/tutors/${session?.user?.id}`),
        ]);

        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfile(data);
        }

        if (jobsRes.ok) {
          const data = await jobsRes.json();
          setRecommendedJobs(data.jobs || []);
        }

        if (sessionsRes.ok) {
          const data = await sessionsRes.json();
          setSessionsData(data || []);
        }

        if (appsRes.ok) {
          const data = await appsRes.json();
          setApplications(data || []);
        }

        if (reviewsRes.ok) {
          const data = await reviewsRes.json();
          setTutorReviews(data.reviews || []);
        }
      } catch (e) {
        setError("Failed to load tutor dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [status, router, session]);

  const stats = {
    totalEarnings: profile?.tutorProfile?.stats?.totalEarnings || 0,
    pendingPayout: 0,
    profileViews: profile?.tutorProfile?.stats?.profileViews || 0,
    successRate: profile?.tutorProfile?.stats?.completionRate || 0,
    repeatStudents: profile?.tutorProfile?.stats?.repeatStudents || 0,
  };

  const earningsData = [10, 30, 20, 40, 25, 60, 35];

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans">
        <Navbar />
        <div className="bg-muted/30 border-b border-border py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <Skeleton className="h-24 w-64 rounded-xl" />
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card><CardContent className="p-4"><Skeleton className="h-64 w-full" /></CardContent></Card>
            <Card><CardContent className="p-4"><Skeleton className="h-48 w-full" /></CardContent></Card>
          </div>
          <div className="lg:col-span-3 space-y-8">
            <Card><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
              <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: <TrendingUp size={18} /> },
    { id: "jobs", label: "Recommended Jobs", icon: <Briefcase size={18} /> },
    { id: "applications", label: "My Applications", icon: <Clock size={18} /> },
    { id: "sessions", label: "Upcoming Sessions", icon: <Calendar size={18} /> },
    { id: "earnings", label: "Earnings & Payouts", icon: <Wallet size={18} /> },
    { id: "reviews", label: "Reviews", icon: <Star size={18} /> },
    { id: "profile", label: "Profile & Settings", icon: <User size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary/10 to-purple-900/10 border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-6">
              <Avatar
                src={profile?.avatar}
                alt={profile?.name || session?.user?.name}
                fallback={(profile?.name || session?.user?.name || "T").charAt(0)}
                className="h-16 w-16 border-2 border-primary/30"
              />
              <div>
                <h1 className="text-3xl font-bold font-heading mb-1">
                  Welcome back, {session?.user?.name || "Tutor"}
                </h1>
                <p className="text-sm text-muted-foreground mb-2">
                  {profile?.tutorProfile?.subjects?.length
                    ? profile.tutorProfile.subjects.slice(0, 2).map(s => s.name).join(" • ")
                    : "Keep your profile up to date to attract more students."}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <Badge variant="secondary" className="gap-1 border-primary/20 text-primary bg-primary/5">
                    <CheckCircle size={14} /> {profile?.isProfileComplete ? "Profile Complete" : "Complete your profile"}
                  </Badge>
                  <Link href="/profile/edit" className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition">
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-stretch md:items-end gap-3">
              {session?.user?.role === "both" && (
                <div className="inline-flex rounded-full border border-border bg-card p-1 text-xs md:text-sm">
                  <button
                    className="px-3 py-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition"
                    type="button"
                    onClick={() => router.push("/dashboard/student")}
                  >
                    Student view
                  </button>
                  <button
                    className="px-3 py-1 rounded-full bg-primary text-primary-foreground"
                    type="button"
                  >
                    Tutor view
                  </button>
                </div>
              )}
              <div className="flex gap-8 bg-card/80 p-6 rounded-xl border border-border backdrop-blur-sm shadow-sm">
                <div className="text-right">
                  <p className="text-muted-foreground text-sm font-medium">Total Earnings</p>
                  <p className="text-3xl font-bold text-primary">${stats.totalEarnings}</p>
                </div>
                <div className="w-px bg-border"></div>
                <div className="text-right">
                  <p className="text-muted-foreground text-sm font-medium">Pending Payout</p>
                  <p className="text-2xl font-bold">${stats.pendingPayout}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="sticky top-24 shadow-sm">
            <CardContent className="p-4">
              <nav className="flex flex-col gap-1">
                {menuItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className={cn(
                      "justify-start gap-3 w-full font-medium transition-all duration-200",
                      activeTab === item.id ? "shadow-md translate-x-1" : "hover:bg-accent hover:translate-x-1"
                    )}
                    onClick={() => setActiveTab(item.id)}
                  >
                    {item.icon} {item.label}
                  </Button>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Performance Analytics Widget */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Profile Views</span>
                  <span className="font-bold">{stats.profileViews}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Application Success</span>
                  <span className="font-bold">{stats.successRate}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-2 rounded-full transition-all duration-1000 delay-100" style={{ width: `${stats.successRate}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Repeat Students</span>
                  <span className="font-bold">{stats.repeatStudents}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div className="bg-purple-500 h-2 rounded-full transition-all duration-1000 delay-200" style={{ width: '60%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">

          {/* Earnings Graph Section (Overview) */}
          {activeTab === 'overview' && (
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold font-heading">Earnings Overview</h3>
                  <div className="w-[150px] text-sm text-muted-foreground">
                    Based on recent sessions
                  </div>
                </div>

                <div className="h-64 flex items-end justify-between gap-2 px-4 border-b border-border pb-4">
                  {earningsData.map((amount, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 w-full group">
                      <div className="relative w-full flex justify-center h-full items-end">
                        <div
                          className="w-full max-w-[40px] bg-primary/60 group-hover:bg-primary transition-all rounded-t-md duration-300"
                          style={{ height: `${amount * 2}px` }}
                        ></div>
                        <div className="absolute -top-10 bg-popover text-popover-foreground text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition shadow-lg border border-border pointer-events-none z-10">
                          ${amount}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">Day {i + 1}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(activeTab === 'overview' || activeTab === 'jobs') && (
              <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>Recommended Jobs</CardTitle>
                  <Button variant="link" className="text-primary h-auto p-0" asChild>
                    <Link href="/jobs">View All</Link>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recommendedJobs.length === 0 && (
                    <p className="text-sm text-muted-foreground">No recommended jobs found yet. Check back soon.</p>
                  )}
                  {recommendedJobs.map(job => (
                    <div key={job._id} className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition cursor-pointer group hover:bg-accent/30">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold group-hover:text-primary transition">{job.title}</h4>
                        <Badge variant="outline" className="text-xs border-primary text-primary bg-primary/5">
                          {job.category}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <DollarSign size={14} />{" "}
                          {job.budget?.min && job.budget?.max
                            ? `$${job.budget.min} - $${job.budget.max}/hr`
                            : job.budget?.min
                              ? `$${job.budget.min}/hr`
                              : "N/A"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeTab === 'applications' && (
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>My Applications</CardTitle>
                  <Button variant="link" className="text-primary h-auto p-0" asChild>
                    <Link href="/jobs">Browse More Jobs</Link>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {applications.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      You haven&apos;t applied to any jobs yet.
                    </p>
                  )}
                  {applications.map(job => (
                    <div key={job._id} className="p-4 rounded-xl border border-border bg-card hover:bg-accent/30 transition group">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold group-hover:text-primary transition">{job.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {job.category}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {job.description}
                      </p>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          Budget:{" "}
                          {job.budget?.min && job.budget?.max
                            ? `$${job.budget.min} - $${job.budget.max}`
                            : job.budget?.min
                              ? `$${job.budget.min}`
                              : "N/A"}
                        </span>
                        <span>
                          Posted by {job.postedBy?.name || "Client"}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {(activeTab === 'overview' || activeTab === 'sessions') && (
              <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>Upcoming Sessions</CardTitle>
                  <Button variant="link" className="text-primary h-auto p-0" onClick={() => setActiveTab('sessions')}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sessionsData.length === 0 && (
                    <p className="text-sm text-muted-foreground">No upcoming sessions scheduled.</p>
                  )}
                  {sessionsData.map(session => (
                    <div key={session._id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-accent/30 transition group">
                      <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Clock size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold">{session.job?.title || "Session"}</h4>
                        <p className="text-sm text-muted-foreground">
                          with {session.student?.name || "Student"} •{" "}
                          {new Date(session.date).toLocaleString()}
                        </p>
                      </div>
                      <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary hover:text-primary-foreground">
                        <ChevronRight size={20} />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeTab === 'earnings' && (
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Earnings & Payouts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-border bg-card">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Earnings</p>
                      <p className="text-2xl font-bold text-primary mt-2">${stats.totalEarnings.toFixed(2)}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-card">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Completed Sessions</p>
                      <p className="text-2xl font-bold mt-2">
                        {sessionsData.filter(s => s.status === "Completed").length}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-card">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Average Rating</p>
                      <p className="text-2xl font-bold mt-2 flex items-center gap-1">
                        {profile?.tutorProfile?.stats?.rating
                          ? profile.tutorProfile.stats.rating.toFixed(1)
                          : "No rating"}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Detailed payouts and transaction history can be added here once payment integration is connected.
                  </p>
                </CardContent>
              </Card>
            )}

            {activeTab === 'reviews' && (
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tutorReviews.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      You haven&apos;t received any reviews yet.
                    </p>
                  )}
                  {tutorReviews.map((review) => (
                    <div key={review._id} className="p-4 rounded-xl border border-border bg-card space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Avatar src={review.reviewer?.avatar} alt={review.reviewer?.name} />
                          <div>
                            <p className="font-semibold text-sm">{review.reviewer?.name || "Student"}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500 text-sm font-semibold">
                          <Star className="w-4 h-4 fill-current" /> {review.rating.toFixed(1)}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeTab === 'profile' && (
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Profile & Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Name</p>
                      <p className="font-semibold">{profile?.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{profile?.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Role</p>
                      <p className="font-semibold">
                        {profile?.role === "both"
                          ? "Student & Tutor"
                          : profile?.role
                          ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
                          : "Not set"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">University</p>
                      <p className="font-semibold">{profile?.university || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Country</p>
                      <p className="font-semibold">{profile?.location?.country || "Not set"}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild variant="outline">
                      <Link href="/profile/edit">Edit Profile</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href={`/tutors/${session?.user?.id}`}>View Public Tutor Profile</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
