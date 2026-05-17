"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase, Calendar, MessageSquare, CreditCard,
  CheckCircle, Star, Clock, GraduationCap, Users, Plus, Settings, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mock Data
  const stats = {
    jobsPosted: 5,
    sessionsCompleted: 12,
    amountSpent: 450,
    avgRatingGiven: 4.8
  };

  const activeJobs = [
    { id: 1, title: "Calculus II Tutor Needed", status: "Open", applicants: 3, budget: "$30-50/hr", posted: "2 days ago" },
    { id: 2, title: "React.js Help for Final Project", status: "In Progress", applicants: 5, budget: "$40/hr", posted: "1 week ago" }
  ];

  const sessions = [
    { id: 1, tutor: "Sarah Jenkins", subject: "Calculus II", date: "Today, 4:00 PM", status: "Upcoming", avatar: "https://ui-avatars.com/api/?name=Sarah+J&background=10b981&color=fff" },
    { id: 2, tutor: "David Chen", subject: "React.js", date: "Yesterday, 2:00 PM", status: "Completed", avatar: "https://ui-avatars.com/api/?name=David+C&background=0ea5e9&color=fff" }
  ];

  const applications = [
    { id: 1, job: "Calculus II Tutor Needed", tutor: "Emily Wong", rate: "$35/hr", match: "95%", avatar: "https://ui-avatars.com/api/?name=Emily+W&background=8b5cf6&color=fff" },
    { id: 2, job: "Calculus II Tutor Needed", tutor: "James Wilson", rate: "$45/hr", match: "88%", avatar: "https://ui-avatars.com/api/?name=James+W&background=f59e0b&color=fff" }
  ];

  if (status === "loading" || isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <Skeleton className="h-10 w-full md:w-1/2" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-6 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="h-[300px]"><CardContent className="p-6"><Skeleton className="h-full w-full" /></CardContent></Card>
          <Card className="h-[300px]"><CardContent className="p-6"><Skeleton className="h-full w-full" /></CardContent></Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-3xl font-bold font-heading">Welcome back, {session?.user?.name || "Student"}!</h1>
          <p className="text-muted-foreground">Manage your studies and find the perfect tutor.</p>
        </div>
        <div className="flex flex-col items-stretch md:items-end gap-3">
          {session?.user?.role === "both" && (
            <div className="inline-flex rounded-full border border-border bg-card p-1 text-xs md:text-sm">
              <button
                className="px-3 py-1 rounded-full bg-primary text-primary-foreground"
                type="button"
              >
                Student view
              </button>
              <button
                className="px-3 py-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition"
                type="button"
                onClick={() => router.push("/dashboard/tutor")}
              >
                Tutor view
              </button>
            </div>
          )}
          <Button asChild className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
            <Link href="/dashboard/post-job">
              <Plus size={16} /> Post a New Job
            </Link>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">My Jobs</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="text-muted-foreground text-sm mb-1 font-medium">Jobs Posted</div>
                <div className="text-3xl font-bold">{stats.jobsPosted}</div>
              </CardContent>
            </Card>
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="text-muted-foreground text-sm mb-1 font-medium">Sessions Done</div>
                <div className="text-3xl font-bold">{stats.sessionsCompleted}</div>
              </CardContent>
            </Card>
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="text-muted-foreground text-sm mb-1 font-medium">Total Spent</div>
                <div className="text-3xl font-bold text-primary">${stats.amountSpent}</div>
              </CardContent>
            </Card>
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="text-muted-foreground text-sm mb-1 font-medium">Avg Rating Given</div>
                <div className="text-3xl font-bold text-yellow-500 flex items-center gap-2">
                  {stats.avgRatingGiven} <Star size={24} className="fill-current" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upcoming Sessions */}
            <Card className="h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Upcoming Sessions</CardTitle>
                <Button variant="link" onClick={() => setActiveTab('sessions')} className="text-primary">View All</Button>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow">
                {sessions.filter(s => s.status === 'Upcoming').map(session => (
                  <div key={session.id} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card/50 hover:bg-accent/50 transition group">
                    <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Clock size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold">{session.subject}</h4>
                      <p className="text-sm text-muted-foreground">with {session.tutor} • {session.date}</p>
                    </div>
                    <Button size="sm">Join</Button>
                  </div>
                ))}
                {sessions.filter(s => s.status === 'Upcoming').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="mx-auto h-12 w-12 opacity-20 mb-2" />
                    <p>No upcoming sessions.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card className="h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Applications</CardTitle>
                <Button variant="link" onClick={() => setActiveTab('applications')} className="text-primary">View All</Button>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow">
                {applications.slice(0, 2).map(app => (
                  <div key={app.id} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card/50 hover:bg-accent/50 transition">
                    <Avatar src={app.avatar} alt={app.tutor} />
                    <div className="flex-1">
                      <h4 className="font-bold">{app.tutor}</h4>
                      <p className="text-sm text-muted-foreground">Applied for <span className="text-primary font-medium">{app.job}</span></p>
                    </div>
                    <Badge variant="outline" className="border-primary text-primary whitespace-nowrap">{app.match} Match</Badge>
                  </div>
                ))}
                {applications.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="mx-auto h-12 w-12 opacity-20 mb-2" />
                    <p>No new applications.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold font-heading">My Active Jobs</h2>
          </div>
          {activeJobs.map(job => (
            <Card key={job.id} className="hover:border-primary/50 transition group">
              <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h4 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{job.title}</h4>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock size={14} /> Posted {job.posted}</span>
                    <span className="flex items-center gap-1"><CreditCard size={14} /> Budget: {job.budget}</span>
                    <span className="text-primary flex items-center gap-1"><Users size={14} /> {job.applicants} Applicants</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <Badge variant={job.status === 'Open' ? 'secondary' : 'default'}>
                    {job.status}
                  </Badge>
                  <Button variant="outline">Manage</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <h2 className="text-2xl font-bold font-heading mb-4">My Sessions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sessions.map(session => (
              <Card key={session.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className={`h-1 w-full ${session.status === 'Upcoming' ? 'bg-primary' : 'bg-muted'}`} />
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={session.avatar} alt={session.tutor} />
                      <div>
                        <h4 className="font-bold">{session.tutor}</h4>
                        <p className="text-xs text-muted-foreground">{session.subject}</p>
                      </div>
                    </div>
                    <Badge variant={session.status === 'Upcoming' ? 'default' : 'secondary'}>
                      {session.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                    <Calendar size={16} className="text-primary" />
                    <span>{session.date}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" variant={session.status === 'Upcoming' ? 'default' : 'secondary'}>
                      {session.status === 'Upcoming' ? 'Join Meeting' : 'View Details'}
                    </Button>
                    {session.status === 'Completed' && (
                      <Button variant="outline" className="flex-1" asChild>
                        <Link href={`/sessions/${session.id}/review`}>Review</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <h2 className="text-2xl font-bold font-heading mb-4">Applications Received</h2>
          {applications.map(app => (
            <Card key={app.id} className="hover:border-primary/50 transition">
              <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <Avatar src={app.avatar} alt={app.tutor} className="h-12 w-12 border-2 border-primary/20" />
                  <div>
                    <h4 className="font-bold text-lg">{app.tutor}</h4>
                    <p className="text-muted-foreground text-sm">Applied for: <span className="text-primary font-medium">{app.job}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <div className="font-bold text-lg">{app.rate}</div>
                    <div className="text-xs text-primary font-medium">{app.match} Match</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Profile</Button>
                    <Button size="sm">Accept</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
