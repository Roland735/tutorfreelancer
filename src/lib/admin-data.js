export const dashboardStats = [
  { label: "Users", value: "18,420", helper: "+9.4% MoM", tone: "sky" },
  { label: "Tutors", value: "2,184", helper: "164 pending review", tone: "emerald" },
  { label: "Jobs", value: "5,672", helper: "412 active this week", tone: "violet" },
  { label: "Reports", value: "87", helper: "14 high severity", tone: "amber" },
  { label: "Revenue", value: "US$42.8k", helper: "+12.6% vs last month", tone: "emerald" },
  { label: "Active Sessions", value: "1,268", helper: "94% completion rate", tone: "sky" },
];

export const dashboardTrends = [
  { label: "Mon", users: 54, jobs: 32, revenue: 28 },
  { label: "Tue", users: 66, jobs: 38, revenue: 36 },
  { label: "Wed", users: 72, jobs: 40, revenue: 43 },
  { label: "Thu", users: 81, jobs: 49, revenue: 48 },
  { label: "Fri", users: 88, jobs: 56, revenue: 58 },
  { label: "Sat", users: 76, jobs: 44, revenue: 46 },
  { label: "Sun", users: 69, jobs: 41, revenue: 39 },
];

export const platformHealth = [
  { label: "Fraud screening", value: "Healthy", tone: "success", helper: "2 suspicious payment attempts quarantined automatically." },
  { label: "Tutor approvals", value: "Backlog", tone: "warning", helper: "12 proof reviews exceed the 24 hour SLA." },
  { label: "Messaging disputes", value: "Stable", tone: "sky", helper: "Only 4 open dispute threads require moderator review." },
  { label: "Payout processing", value: "Attention", tone: "danger", helper: "7 EcoCash payout batches are waiting reconciliation." },
];

export const recentActivity = [
  { title: "Tutor verification approved", description: "Blessing Moyo was verified for Mathematics and Engineering modules.", time: "8 minutes ago", tone: "success" },
  { title: "High-severity abuse report created", description: "Potential fake job flagged from Midlands State University.", time: "19 minutes ago", tone: "danger" },
  { title: "Bulk payout batch queued", description: "27 tutor payouts moved into bank transfer processing.", time: "42 minutes ago", tone: "sky" },
  { title: "Review hidden for impersonation claim", description: "A one-star review was temporarily hidden pending investigation.", time: "1 hour ago", tone: "warning" },
];

export const pendingApprovals = [
  { name: "Tatenda Chari", area: "Tutor verification", university: "University of Zimbabwe", detail: "Transcript and ID uploaded", priority: "High" },
  { name: "Nyasha Sibanda", area: "Tutor verification", university: "NUST", detail: "Awaiting subject proof confirmation", priority: "Medium" },
  { name: "Campus Coding Circle", area: "Announcement publish", university: "MSU", detail: "Homepage banner scheduled for Monday", priority: "Low" },
];

export const moderationLinks = [
  { label: "Open abuse queue", href: "/admin/flags", helper: "7 unresolved high-risk reports" },
  { label: "Review tutor approvals", href: "/admin/tutors", helper: "12 pending verification checks" },
  { label: "Inspect suspicious jobs", href: "/admin/jobs", helper: "5 posts need content moderation" },
  { label: "Track payout exceptions", href: "/admin/payments", helper: "7 payout batches awaiting action" },
];

export const users = [
  {
    id: "u-mufaro-dube",
    name: "Mufaro Dube",
    role: "Student",
    email: "mufaro.dube@studentmail.co.zw",
    status: "Active",
    verification: "Basic",
    university: "University of Zimbabwe",
    city: "Harare",
    joined: "2026-03-08",
    lastSeen: "14 minutes ago",
    reports: 1,
    completedPayments: "US$184",
    activityScore: "Healthy",
  },
  {
    id: "u-tatenda-chari",
    name: "Tatenda Chari",
    role: "Tutor",
    email: "tatenda.chari@learnhub.co.zw",
    status: "Pending",
    verification: "Awaiting review",
    university: "University of Zimbabwe",
    city: "Harare",
    joined: "2026-04-21",
    lastSeen: "1 hour ago",
    reports: 0,
    completedPayments: "US$0",
    activityScore: "Review",
  },
  {
    id: "u-rutendo-mhlanga",
    name: "Rutendo Mhlanga",
    role: "Tutor",
    email: "rutendo.mhlanga@tutorspace.co.zw",
    status: "Verified",
    verification: "Verified",
    university: "NUST",
    city: "Bulawayo",
    joined: "2025-11-13",
    lastSeen: "5 minutes ago",
    reports: 0,
    completedPayments: "US$1,420",
    activityScore: "Top performer",
  },
  {
    id: "u-panashe-moyo",
    name: "Panashe Moyo",
    role: "Student",
    email: "panashe.moyo@campusmail.co.zw",
    status: "Suspended",
    verification: "Basic",
    university: "Midlands State University",
    city: "Gweru",
    joined: "2026-01-17",
    lastSeen: "2 days ago",
    reports: 4,
    completedPayments: "US$96",
    activityScore: "Risky",
  },
  {
    id: "u-ashley-ncube",
    name: "Ashley Ncube",
    role: "Tutor",
    email: "ashley.nc@scholarconnect.co.zw",
    status: "Active",
    verification: "In progress",
    university: "Africa University",
    city: "Mutare",
    joined: "2026-02-09",
    lastSeen: "31 minutes ago",
    reports: 1,
    completedPayments: "US$520",
    activityScore: "Monitor",
  },
];

export const userQuickStats = [
  { label: "All accounts", value: "18,420" },
  { label: "Verified tutors", value: "1,904" },
  { label: "Suspended", value: "73" },
  { label: "Awaiting verification", value: "164" },
];

export const userProfiles = {
  "u-mufaro-dube": {
    userId: "U-28491",
    role: "Student",
    status: "Active",
    verification: "Basic",
    university: "University of Zimbabwe",
    city: "Harare",
    phone: "+263 77 230 1184",
    joined: "8 Mar 2026",
    lastSeen: "14 minutes ago",
    reports: ["Late response dispute", "Resolved within 3 hours"],
    payments: ["US$48 deposit", "US$36 completed session", "US$100 wallet top-up"],
    actions: ["Promote to campus ambassador", "Monitor repeat cancellation rate"],
    auditTrail: [
      { title: "Verified email confirmed", time: "Apr 25, 2026", tone: "success" },
      { title: "Support ticket resolved", time: "Apr 20, 2026", tone: "sky" },
      { title: "Late response report filed", time: "Apr 15, 2026", tone: "warning" },
    ],
  },
  "u-tatenda-chari": {
    userId: "T-10124",
    role: "Tutor",
    status: "Pending",
    verification: "Awaiting review",
    university: "University of Zimbabwe",
    city: "Harare",
    phone: "+263 78 992 4102",
    joined: "21 Apr 2026",
    lastSeen: "1 hour ago",
    reports: ["No active reports", "Pending document review"],
    payments: ["No payouts yet", "Wallet balance US$0"],
    actions: ["Approve documents", "Request clearer transcript upload"],
    auditTrail: [
      { title: "Transcript uploaded", time: "May 15, 2026", tone: "sky" },
      { title: "National ID verified", time: "May 14, 2026", tone: "success" },
      { title: "Profile created", time: "Apr 21, 2026", tone: "neutral" },
    ],
  },
  "u-rutendo-mhlanga": {
    userId: "T-08211",
    role: "Tutor",
    status: "Verified",
    verification: "Verified",
    university: "NUST",
    city: "Bulawayo",
    phone: "+263 71 540 6094",
    joined: "13 Nov 2025",
    lastSeen: "5 minutes ago",
    reports: ["No active reports", "4 resolved low-risk disputes"],
    payments: ["US$420 processed this month", "US$1,420 total tutor earnings"],
    actions: ["Feature as top tutor", "Invite to mentorship campaign"],
    auditTrail: [
      { title: "Trusted tutor badge granted", time: "May 10, 2026", tone: "success" },
      { title: "Payout limit increased", time: "Apr 28, 2026", tone: "sky" },
      { title: "Manual review passed", time: "Nov 20, 2025", tone: "success" },
    ],
  },
  "u-panashe-moyo": {
    userId: "U-26670",
    role: "Student",
    status: "Suspended",
    verification: "Basic",
    university: "Midlands State University",
    city: "Gweru",
    phone: "+263 77 010 9021",
    joined: "17 Jan 2026",
    lastSeen: "2 days ago",
    reports: ["Spam application burst", "Two fake contact attempts", "Temporary suspension active"],
    payments: ["US$96 total charges", "Refund hold pending"],
    actions: ["Investigate linked accounts", "Review device fingerprint"],
    auditTrail: [
      { title: "Account suspended", time: "May 13, 2026", tone: "danger" },
      { title: "Fraud flag raised", time: "May 13, 2026", tone: "warning" },
      { title: "Support appeal received", time: "May 14, 2026", tone: "sky" },
    ],
  },
  "u-ashley-ncube": {
    userId: "T-11193",
    role: "Tutor",
    status: "Active",
    verification: "In progress",
    university: "Africa University",
    city: "Mutare",
    phone: "+263 78 625 1200",
    joined: "9 Feb 2026",
    lastSeen: "31 minutes ago",
    reports: ["Identity mismatch warning", "Manual check recommended"],
    payments: ["US$520 earned", "US$80 pending payout"],
    actions: ["Request selfie re-upload", "Restrict instant payout until reviewed"],
    auditTrail: [
      { title: "Identity mismatch detected", time: "May 11, 2026", tone: "warning" },
      { title: "Additional proof requested", time: "May 12, 2026", tone: "sky" },
      { title: "Tutor account activated", time: "Feb 10, 2026", tone: "success" },
    ],
  },
};

export const jobs = [
  { id: "job-calc-204", title: "Calculus 2 exam revision", subject: "Mathematics", budget: "US$18/hr", status: "Open", university: "NUST", date: "May 16", health: "Healthy", flagged: "No" },
  { id: "job-essay-331", title: "Research methods assignment support", subject: "Statistics", budget: "US$22/hr", status: "Review", university: "University of Zimbabwe", date: "May 15", health: "Suspicious edits", flagged: "Yes" },
  { id: "job-react-411", title: "React dashboard build for final year project", subject: "Computer Science", budget: "US$30/hr", status: "Active", university: "Chinhoyi University of Technology", date: "May 14", health: "Busy", flagged: "No" },
  { id: "job-finance-118", title: "Corporate finance case analysis", subject: "Finance", budget: "US$25/hr", status: "Hidden", university: "Midlands State University", date: "May 13", health: "Abuse report", flagged: "Yes" },
];

export const jobProfiles = {
  "job-calc-204": {
    owner: "Mufaro Dube",
    status: "Open",
    budget: "US$18/hr",
    university: "NUST",
    city: "Bulawayo",
    attachments: ["calc-scope.pdf", "past-paper.zip"],
    applicants: ["Rutendo Mhlanga", "Kudakwashe Zhou", "Yvonne Sithole"],
    messages: ["Student asked for weekend slot", "Tutor requested chapter list"],
    moderationNotes: ["Clean academic request", "No suspicious links", "Healthy response quality"],
    auditTrail: [
      { title: "Job published", time: "May 16, 2026", tone: "success" },
      { title: "3 tutors applied", time: "May 16, 2026", tone: "sky" },
      { title: "No moderation actions", time: "May 17, 2026", tone: "neutral" },
    ],
  },
  "job-essay-331": {
    owner: "Ashley Ncube",
    status: "Review",
    budget: "US$22/hr",
    university: "University of Zimbabwe",
    city: "Harare",
    attachments: ["proposal-doc.docx"],
    applicants: ["Confidence Biri", "Ryan Zhou"],
    messages: ["Copied wording detected", "External payment language flagged"],
    moderationNotes: ["Contains WhatsApp solicitation", "Needs sanitized repost", "High duplicate text score"],
    auditTrail: [
      { title: "Automatic spam rule triggered", time: "May 15, 2026", tone: "warning" },
      { title: "Moderator review opened", time: "May 15, 2026", tone: "sky" },
      { title: "Temporary visibility reduced", time: "May 15, 2026", tone: "danger" },
    ],
  },
  "job-react-411": {
    owner: "Nyasha Sibanda",
    status: "Active",
    budget: "US$30/hr",
    university: "Chinhoyi University of Technology",
    city: "Chinhoyi",
    attachments: ["wireframe.png", "requirements.pdf"],
    applicants: ["Tatenda Chari", "Ashley Ncube", "Rutendo Mhlanga"],
    messages: ["Discussion on milestones", "Portfolio links shared"],
    moderationNotes: ["Healthy engagement", "No abuse indicators", "High conversion potential"],
    auditTrail: [
      { title: "Job approved", time: "May 14, 2026", tone: "success" },
      { title: "Applications peaked", time: "May 15, 2026", tone: "sky" },
    ],
  },
  "job-finance-118": {
    owner: "Panashe Moyo",
    status: "Hidden",
    budget: "US$25/hr",
    university: "Midlands State University",
    city: "Gweru",
    attachments: ["question-sheet.jpg"],
    applicants: ["No active applicants"],
    messages: ["Threatening tone reported", "External Telegram request found"],
    moderationNotes: ["Hidden for fraud review", "Linked to suspended account", "Escalated to trust team"],
    auditTrail: [
      { title: "Job hidden", time: "May 13, 2026", tone: "danger" },
      { title: "Linked account detected", time: "May 13, 2026", tone: "warning" },
      { title: "Fraud escalation sent", time: "May 14, 2026", tone: "sky" },
    ],
  },
};

export const tutorQueue = [
  { name: "Tatenda Chari", subjects: "Calculus, Algebra, Physics", university: "University of Zimbabwe", proof: "Transcript + National ID", rating: "New", risk: "Medium" },
  { name: "Ashley Ncube", subjects: "JavaScript, UI Design", university: "Africa University", proof: "Student ID only", rating: "4.6", risk: "High" },
  { name: "Kuda Mashingaidze", subjects: "Economics, Accounting", university: "CUT", proof: "Transcript + Degree", rating: "4.9", risk: "Low" },
];

export const topTutors = [
  { name: "Rutendo Mhlanga", metric: "US$420 this month", tone: "success" },
  { name: "Tariro Zhou", metric: "98% response rate", tone: "sky" },
  { name: "Tafadzwa Ncube", metric: "4.98 average rating", tone: "success" },
];

export const riskyTutors = [
  { name: "Ashley Ncube", reason: "Identity mismatch", tone: "warning" },
  { name: "Kelvin Mutsa", reason: "Payment disputes", tone: "danger" },
  { name: "Tinotenda M.", reason: "Low completion rate", tone: "warning" },
];

export const applications = [
  { id: "APP-3012", job: "Calculus 2 exam revision", tutor: "Rutendo Mhlanga", student: "Mufaro Dube", status: "Shortlisted", timestamp: "May 16, 10:32", signal: "Healthy" },
  { id: "APP-3013", job: "Research methods assignment support", tutor: "Ashley Ncube", student: "Faith Mupfumi", status: "Flagged", timestamp: "May 15, 15:04", signal: "Duplicate message" },
  { id: "APP-3014", job: "React dashboard build", tutor: "Tatenda Chari", student: "Nyasha Sibanda", status: "Pending", timestamp: "May 15, 16:48", signal: "New tutor" },
  { id: "APP-3015", job: "Corporate finance case analysis", tutor: "Kelvin Mutsa", student: "Panashe Moyo", status: "Rejected", timestamp: "May 14, 09:21", signal: "Risky pair" },
];

export const conversations = [
  {
    id: "CONV-778",
    subject: "Fee dispute over missed lesson",
    participants: "Mufaro Dube and Rutendo Mhlanga",
    status: "Flagged",
    reason: "Payment dispute",
    preview: "Student claims the tutor ended the session after 15 minutes.",
    messages: [
      "Student: I paid for one hour but the lesson ended too early.",
      "Tutor: We lost power briefly and reconnected late.",
      "System: Conversation flagged for moderator access.",
    ],
  },
  {
    id: "CONV-801",
    subject: "External payment solicitation",
    participants: "Faith Mupfumi and Ashley Ncube",
    status: "Escalated",
    reason: "Off-platform request",
    preview: "Tutor asked the student to move payment to WhatsApp.",
    messages: [
      "Tutor: Let us handle payment outside the app for speed.",
      "Student: I prefer to stay on platform.",
      "System: Keyword flag raised automatically.",
    ],
  },
];

export const reviews = [
  { id: "REV-1201", tutor: "Rutendo Mhlanga", student: "Mufaro Dube", rating: "5.0", status: "Approved", signal: "Healthy", excerpt: "Excellent calculus explanations and strong pacing." },
  { id: "REV-1202", tutor: "Ashley Ncube", student: "Faith Mupfumi", rating: "1.0", status: "Review", signal: "Abuse claim", excerpt: "Review includes threats and unverifiable claims." },
  { id: "REV-1203", tutor: "Tariro Zhou", student: "Tendai Biti", rating: "4.0", status: "Approved", signal: "Healthy", excerpt: "Very patient but started a few minutes late." },
  { id: "REV-1204", tutor: "Kelvin Mutsa", student: "Panashe Moyo", rating: "2.0", status: "Hidden", signal: "Fake review risk", excerpt: "Account linkage makes this review look suspicious." },
];

export const reputationTrend = [
  { label: "Jan", value: 68 },
  { label: "Feb", value: 72 },
  { label: "Mar", value: 76 },
  { label: "Apr", value: 81 },
  { label: "May", value: 79 },
];

export const payments = [
  { id: "PAY-9821", tutor: "Rutendo Mhlanga", type: "Payout", amount: "US$180", fee: "US$18", status: "Processed", date: "May 16", method: "Bank transfer" },
  { id: "PAY-9822", tutor: "Ashley Ncube", type: "Payout", amount: "US$80", fee: "US$8", status: "Queued", date: "May 16", method: "EcoCash" },
  { id: "PAY-9823", tutor: "Tatenda Chari", type: "Commission", amount: "US$12", fee: "US$12", status: "Held", date: "May 15", method: "Platform" },
  { id: "PAY-9824", tutor: "Tariro Zhou", type: "Payout", amount: "US$240", fee: "US$24", status: "Review", date: "May 14", method: "Bank transfer" },
];

export const payoutBatches = [
  { label: "Processed today", value: "US$3,280", helper: "19 completed payouts", tone: "success" },
  { label: "Queued", value: "US$740", helper: "7 EcoCash payouts", tone: "warning" },
  { label: "Held for review", value: "US$312", helper: "Linked to trust alerts", tone: "danger" },
];

export const reportCards = [
  { label: "Weekly new users", value: 84 },
  { label: "Jobs created", value: 67 },
  { label: "Gross revenue", value: 56 },
  { label: "Retention", value: 49 },
  { label: "Sessions", value: 61 },
];

export const reportSummary = [
  { label: "Retention", value: "71%", tone: "success", helper: "Strong return rate after first completed session." },
  { label: "Avg. time to approve tutors", value: "19h", tone: "warning", helper: "Slightly above the internal target of 12 hours." },
  { label: "Fraud loss prevented", value: "US$1.4k", tone: "sky", helper: "Rule engine blocked high-risk accounts before payout." },
];

export const abuseFlags = [
  { id: "FLAG-441", subject: "Fake tutor documents", type: "Tutor", severity: "Critical", reason: "Transcript mismatch", createdAt: "May 16, 08:44", status: "Escalated" },
  { id: "FLAG-442", subject: "Spam job listing", type: "Job", severity: "High", reason: "External payment language", createdAt: "May 15, 14:11", status: "Open" },
  { id: "FLAG-443", subject: "Harassment in messages", type: "Conversation", severity: "High", reason: "Abusive language", createdAt: "May 15, 18:09", status: "Review" },
  { id: "FLAG-444", subject: "Fake review ring", type: "Review", severity: "Medium", reason: "Linked accounts", createdAt: "May 14, 09:21", status: "Open" },
];

export const contentItems = [
  { title: "Homepage hero banner", type: "Banner", status: "Published", owner: "Growth team", updatedAt: "May 16" },
  { title: "Exam season tutoring announcement", type: "Announcement", status: "Draft", owner: "Operations", updatedAt: "May 15" },
  { title: "How payouts work in Zimbabwe", type: "Blog post", status: "Scheduled", owner: "Finance", updatedAt: "May 14" },
  { title: "FAQ: tutor verification rules", type: "FAQ", status: "Review", owner: "Trust team", updatedAt: "May 13" },
];

export const settingsGroups = [
  { title: "Roles and permissions", summary: "Prepare future RBAC by mapping actions to admin scopes and review layers.", items: ["Super admin can manage security settings", "Trust leads can action flags and reviews", "Finance admins can manage payouts and commissions"] },
  { title: "Approval rules", summary: "Define evidence thresholds and automated checks for tutor verification.", items: ["Require transcript plus ID", "Flag identity mismatch automatically", "Escalate repeat edits within 24 hours"] },
  { title: "Commissions and payouts", summary: "Control marketplace fee rates and payout schedules.", items: ["Default commission 10%", "EcoCash payout review threshold US$120", "Weekly payout day set to Friday"] },
  { title: "Security and maintenance", summary: "Keep the platform safe and operational without exposing destructive actions yet.", items: ["Two-step admin login planned", "Maintenance mode placeholder active", "Suspicious login alerts enabled"] },
];

export function getUserById(id) {
  return users.find((user) => user.id === id) || null;
}

export function getUserProfile(id) {
  return userProfiles[id] || null;
}

export function getJobById(id) {
  return jobs.find((job) => job.id === id) || null;
}

export function getJobProfile(id) {
  return jobProfiles[id] || null;
}
