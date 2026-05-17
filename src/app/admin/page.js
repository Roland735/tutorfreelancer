"use client";
import React, { useState } from "react";
import {
  Users,
  Briefcase,
  GraduationCap,
  DollarSign,
  Search,
  Filter,
  CheckCircle,
  Ban,
  Trash2,
  Settings,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

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
    <div className="space-y-8">
      <section className="rounded-3xl border border-border bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 px-6 py-6 text-white shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-100/90">Platform Operations</p>
            <h2 className="mt-2 text-2xl font-bold font-heading">University Tutor Marketplace Control Center</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-200/85">
              Oversee user activity, marketplace quality, payments, and trust signals across the platform.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2 border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white">
              <Settings className="w-4 h-4" /> Settings
            </Button>
            <Button className="gap-2 bg-white text-slate-900 hover:bg-slate-100">
              <Download className="w-4 h-4" /> Download Report
            </Button>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-3xl border border-border bg-card/70 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            className="rounded-2xl"
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </Button>
          <Button
            variant={activeTab === "users" ? "default" : "ghost"}
            className="rounded-2xl"
            onClick={() => setActiveTab("users")}
          >
            Users
          </Button>
          <Button
            variant={activeTab === "jobs" ? "default" : "ghost"}
            className="rounded-2xl"
            onClick={() => setActiveTab("jobs")}
          >
            Jobs
          </Button>
          <Button
            variant={activeTab === "transactions" ? "default" : "ghost"}
            className="rounded-2xl"
            onClick={() => setActiveTab("transactions")}
          >
            Payments
          </Button>
        </div>

        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
          <div className="relative md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search operations..." className="pl-10" />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="icon" className="rounded-2xl">
              <Filter className="w-4 h-4" />
            </Button>
            <Button className="rounded-2xl">Export Snapshot</Button>
          </div>
        </div>
      </section>

      <section>
        {renderContent()}
      </section>
    </div>
  );
}
