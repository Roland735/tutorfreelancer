"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
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
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mock Data
  const stats = {
    totalEarnings: 1250,
    pendingPayout: 150,
    profileViews: 45,
    successRate: 92,
    repeatStudents: 8
  };

  const recommendedJobs = [
    { id: 1, title: "Advanced Python Tutor", budget: "$40-60/hr", posted: "2 hours ago", match: "98%" },
    { id: 2, title: "Machine Learning Basics", budget: "$50/hr", posted: "5 hours ago", match: "95%" }
  ];

  const sessions = [
    { id: 1, student: "Alex M.", subject: "Python", date: "Today, 5:00 PM", status: "Upcoming", avatar: "https://ui-avatars.com/api/?name=Alex+M&background=random" },
    { id: 2, student: "Sarah J.", subject: "Calculus", date: "Tomorrow, 2:00 PM", status: "Upcoming", avatar: "https://ui-avatars.com/api/?name=Sarah+J&background=random" }
  ];

  const earningsData = [30, 45, 20, 60, 50, 80, 40]; // Weekly earnings data points

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
              <div className="bg-card p-4 rounded-full border-2 border-primary/20 shadow-lg shadow-primary/5">
                <BookOpen className="text-4xl text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-heading mb-2">
                  Welcome back, {session?.user?.name || "Tutor"}
                </h1>
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="secondary" className="gap-1 border-primary/20 text-primary bg-primary/5">
                    <CheckCircle size={14} /> Profile 85% Complete
                  </Badge>
                  <Link href="/profile/edit" className="text-muted-foreground hover:text-foreground underline underline-offset-4 transition">
                    Complete Profile
                  </Link>
                </div>
              </div>
            </div>

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
                  <div className="w-[150px]">
                    <Select>
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                      <option>This Year</option>
                    </Select>
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
            {/* Recommended Jobs */}
            {(activeTab === 'overview' || activeTab === 'jobs') && (
              <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>Recommended Jobs</CardTitle>
                  <Button variant="link" className="text-primary h-auto p-0" asChild>
                    <Link href="/jobs">View All</Link>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recommendedJobs.map(job => (
                    <div key={job.id} className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition cursor-pointer group hover:bg-accent/30">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold group-hover:text-primary transition">{job.title}</h4>
                        <Badge variant="outline" className="text-xs border-primary text-primary bg-primary/5">{job.match}</Badge>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><DollarSign size={14} /> {job.budget}</span>
                        <span className="flex items-center gap-1"><Clock size={14} /> {job.posted}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Upcoming Sessions */}
            {(activeTab === 'overview' || activeTab === 'sessions') && (
              <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>Upcoming Sessions</CardTitle>
                  <Button variant="link" className="text-primary h-auto p-0" onClick={() => setActiveTab('sessions')}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sessions.filter(s => s.status === 'Upcoming').map(session => (
                    <div key={session.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-accent/30 transition group">
                      <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Clock size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold">{session.subject}</h4>
                        <p className="text-sm text-muted-foreground">with {session.student} • {session.date}</p>
                      </div>
                      <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary hover:text-primary-foreground">
                        <ChevronRight size={20} />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
