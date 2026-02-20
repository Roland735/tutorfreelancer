"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Briefcase,
  GraduationCap,
  DollarSign,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  Ban,
  Trash2,
  AlertTriangle,
  LayoutDashboard,
  LogOut,
  Settings,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock Data
  const stats = [
    { label: "Total Users", value: "12,450", change: "+12%", icon: <Users className="w-6 h-6" />, color: "bg-blue-500/20 text-blue-500" },
    { label: "Total Jobs", value: "3,280", change: "+8%", icon: <Briefcase className="w-6 h-6" />, color: "bg-purple-500/20 text-purple-500" },
    { label: "Sessions", value: "8,900", change: "+24%", icon: <GraduationCap className="w-6 h-6" />, color: "bg-emerald-500/20 text-emerald-500" },
    { label: "Revenue", value: "$45,200", change: "+15%", icon: <DollarSign className="w-6 h-6" />, color: "bg-yellow-500/20 text-yellow-500" },
  ];

  const users = [
    { id: 1, name: "Alice Freeman", role: "Student", email: "alice@example.com", status: "Active", joined: "Oct 12, 2023" },
    { id: 2, name: "Dr. John Smith", role: "Tutor", email: "john@example.com", status: "Verified", joined: "Sep 05, 2023" },
    { id: 3, name: "Michael Brown", role: "Student", email: "michael@example.com", status: "Suspended", joined: "Nov 01, 2023" },
    { id: 4, name: "Sarah Lee", role: "Tutor", email: "sarah@example.com", status: "Pending", joined: "Dec 10, 2023" },
  ];

  const jobs = [
    { id: 101, title: "Calculus I Help Needed", postedBy: "Alice Freeman", budget: "$30/hr", status: "Open", date: "2 days ago" },
    { id: 102, title: "Learn React Basics", postedBy: "Tom Wilson", budget: "$40/hr", status: "In Progress", date: "1 week ago" },
    { id: 103, title: "French Conversation", postedBy: "Emma Davis", budget: "$25/hr", status: "Completed", date: "3 days ago" },
  ];

  const transactions = [
    { id: "TXN-1234", user: "Alice Freeman", amount: "$60.00", type: "Payment", status: "Completed", date: "Oct 24, 2023" },
    { id: "TXN-1235", user: "Dr. John Smith", amount: "$54.00", type: "Payout", status: "Processing", date: "Oct 25, 2023" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:translate-y-[-4px] transition-transform duration-300">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm uppercase font-medium tracking-wider">{stat.label}</p>
                      <h3 className="text-3xl font-bold mt-1 font-heading">{stat.value}</h3>
                      <span className="text-emerald-500 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded mt-2 inline-block">
                        {stat.change} last month
                      </span>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.color}`}>
                      {stat.icon}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border">
                  <CardTitle className="text-xl font-bold">Recent Users</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("users")} className="text-primary hover:text-primary/80">
                    View All
                  </Button>
                </CardHeader>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-muted-foreground">
                    <thead className="bg-muted/50 text-foreground uppercase font-medium">
                      <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {users.slice(0, 3).map((user) => (
                        <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-foreground">{user.name}</td>
                          <td className="px-6 py-4">
                            <Badge variant={user.role === 'Tutor' ? 'secondary' : 'default'}>
                              {user.role}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={
                              user.status === 'Active' || user.status === 'Verified' ? 'success' :
                                user.status === 'Suspended' ? 'destructive' : 'warning'
                            }>
                              {user.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border">
                  <CardTitle className="text-xl font-bold">Recent Jobs</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("jobs")} className="text-primary hover:text-primary/80">
                    View All
                  </Button>
                </CardHeader>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-muted-foreground">
                    <thead className="bg-muted/50 text-foreground uppercase font-medium">
                      <tr>
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Budget</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {jobs.map((job) => (
                        <tr key={job.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-foreground">{job.title}</td>
                          <td className="px-6 py-4">{job.budget}</td>
                          <td className="px-6 py-4">
                            <Badge variant={
                              job.status === 'Open' ? 'secondary' :
                                job.status === 'Completed' ? 'success' : 'warning'
                            }>
                              {job.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        );

      case "users":
        return (
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="flex flex-col md:flex-row gap-4 justify-between items-center border-b border-border">
              <CardTitle className="text-xl font-bold">User Management</CardTitle>
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Search users..." className="pl-10" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-muted-foreground">
                <thead className="bg-muted/50 text-foreground uppercase font-medium">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{user.name}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={user.role === 'Tutor' ? 'secondary' : 'default'}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={
                          user.status === 'Active' || user.status === 'Verified' ? 'success' :
                            user.status === 'Suspended' ? 'destructive' : 'warning'
                        }>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">{user.joined}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10" title="Verify">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-yellow-500 hover:text-yellow-600 hover:bg-yellow-500/10" title="Suspend">
                            <Ban className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        );

      case "transactions":
        return (
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-xl font-bold">Financial Transactions</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-muted-foreground">
                <thead className="bg-muted/50 text-foreground uppercase font-medium">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{txn.id}</td>
                      <td className="px-6 py-4 text-foreground font-medium">{txn.user}</td>
                      <td className="px-6 py-4">{txn.type}</td>
                      <td className="px-6 py-4 text-foreground font-bold">{txn.amount}</td>
                      <td className="px-6 py-4">
                        <Badge variant={txn.status === 'Completed' ? 'success' : 'warning'}>
                          {txn.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">{txn.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        );

      default:
        return <div className="text-muted-foreground text-center py-10">Select a tab to view content</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border hidden md:block fixed h-full bg-card z-10">
        <div className="p-6 border-b border-border">
          <div className="text-2xl font-bold text-primary tracking-tighter font-heading">
            TF<span className="text-foreground">Admin</span>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            className={cn("w-full justify-start gap-3", activeTab === "overview" ? "" : "text-muted-foreground")}
            onClick={() => setActiveTab("overview")}
          >
            <LayoutDashboard className="w-4 h-4" /> Overview
          </Button>
          <Button
            variant={activeTab === "users" ? "default" : "ghost"}
            className={cn("w-full justify-start gap-3", activeTab === "users" ? "" : "text-muted-foreground")}
            onClick={() => setActiveTab("users")}
          >
            <Users className="w-4 h-4" /> Users
          </Button>
          <Button
            variant={activeTab === "jobs" ? "default" : "ghost"}
            className={cn("w-full justify-start gap-3", activeTab === "jobs" ? "" : "text-muted-foreground")}
            onClick={() => setActiveTab("jobs")}
          >
            <Briefcase className="w-4 h-4" /> Jobs
          </Button>
          <Button
            variant={activeTab === "transactions" ? "default" : "ghost"}
            className={cn("w-full justify-start gap-3", activeTab === "transactions" ? "" : "text-muted-foreground")}
            onClick={() => setActiveTab("transactions")}
          >
            <DollarSign className="w-4 h-4" /> Transactions
          </Button>
          <div className="pt-4 mt-4 border-t border-border">
            <Link href="/dashboard" className="w-full">
              <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
                <LogOut className="w-4 h-4" /> Back to App
              </Button>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-heading">Dashboard Overview</h1>
            <p className="text-muted-foreground">Welcome back, Admin</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="gap-2">
              <Settings className="w-4 h-4" /> Settings
            </Button>
            <Button className="gap-2 shadow-lg shadow-primary/20">
              <Download className="w-4 h-4" /> Download Report
            </Button>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
}
