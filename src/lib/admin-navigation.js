import {
  AlertTriangle,
  Banknote,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  FileBarChart2,
  FileCheck2,
  LayoutDashboard,
  LifeBuoy,
  MessageSquareWarning,
  Settings,
  ShieldAlert,
  Users,
  UserRoundCheck,
} from "lucide-react";

const ADMIN_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    matchers: ["/admin/dashboard"],
    exact: true,
    icon: LayoutDashboard,
    section: "Overview",
    permission: "admin.dashboard.read",
  },
  {
    label: "Users",
    href: "/admin/users",
    matchers: ["/admin/users"],
    icon: Users,
    section: "Users",
    permission: "admin.users.read",
  },
  {
    label: "Tutors",
    href: "/admin/tutors",
    matchers: ["/admin/tutors"],
    icon: UserRoundCheck,
    section: "Users",
    permission: "admin.tutors.read",
    badge: "12",
  },
  {
    label: "Jobs",
    href: "/admin/jobs",
    matchers: ["/admin/jobs"],
    icon: BriefcaseBusiness,
    section: "Jobs",
    permission: "admin.jobs.read",
  },
  {
    label: "Applications",
    href: "/admin/applications",
    matchers: ["/admin/applications"],
    icon: FileCheck2,
    section: "Jobs",
    permission: "admin.applications.read",
  },
  {
    label: "Messages",
    href: "/admin/messages",
    matchers: ["/admin/messages"],
    icon: MessageSquareWarning,
    section: "Trust & Safety",
    permission: "admin.messages.read",
  },
  {
    label: "Reviews",
    href: "/admin/reviews",
    matchers: ["/admin/reviews"],
    icon: Bell,
    section: "Trust & Safety",
    permission: "admin.reviews.read",
  },
  {
    label: "Flags",
    href: "/admin/flags",
    matchers: ["/admin/flags"],
    icon: ShieldAlert,
    section: "Trust & Safety",
    permission: "admin.flags.read",
    badge: "7",
  },
  {
    label: "Payments",
    href: "/admin/payments",
    matchers: ["/admin/payments"],
    icon: Banknote,
    section: "Payments",
    permission: "admin.payments.read",
  },
  {
    label: "Reports",
    href: "/admin/reports",
    matchers: ["/admin/reports"],
    icon: FileBarChart2,
    section: "Payments",
    permission: "admin.reports.read",
  },
  {
    label: "Content",
    href: "/admin/content",
    matchers: ["/admin/content"],
    icon: BookOpen,
    section: "Content",
    permission: "admin.content.read",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    matchers: ["/admin/settings"],
    icon: Settings,
    section: "Settings",
    permission: "admin.settings.read",
  },
];

export const ADMIN_SECTION_ORDER = [
  "Overview",
  "Users",
  "Jobs",
  "Trust & Safety",
  "Payments",
  "Content",
  "Settings",
];

export const ADMIN_PAGE_META = [
  {
    test: (value) => value === "/admin" || value === "/admin/dashboard",
    title: "Admin Dashboard",
    description:
      "Monitor user growth, approvals, payments, moderation queues, and platform health in one command view.",
  },
  {
    test: (value) => value === "/admin/users",
    title: "User Management",
    description:
      "Search, segment, and moderate students and tutors across Zimbabwean universities with role-safe controls.",
  },
  {
    test: (value) => /^\/admin\/users\/[^/]+$/.test(value),
    title: "User Profile",
    description:
      "Review account history, trust signals, university context, payments, and audit activity before actioning changes.",
  },
  {
    test: (value) => value === "/admin/jobs",
    title: "Job Moderation",
    description:
      "Review marketplace listings, identify risky posts, and keep tutoring demand clean, credible, and actionable.",
  },
  {
    test: (value) => /^\/admin\/jobs\/[^/]+$/.test(value),
    title: "Job Details",
    description:
      "Inspect the full job record, moderation notes, attachments, applicants, and dispute context before intervening.",
  },
  {
    test: (value) => value === "/admin/tutors",
    title: "Tutor Verification",
    description:
      "Process tutor approvals, proof checks, subject expertise, and risk indicators with a clear decision workflow.",
  },
  {
    test: (value) => value === "/admin/applications",
    title: "Application Activity",
    description:
      "Track marketplace application flow, detect spam patterns, and monitor tutor response quality over time.",
  },
  {
    test: (value) => value === "/admin/messages",
    title: "Message Moderation",
    description:
      "Review dispute-driven message history, flagged conversations, and inbox-style moderation signals without clutter.",
  },
  {
    test: (value) => value === "/admin/reviews",
    title: "Review Moderation",
    description:
      "Protect platform reputation by reviewing testimonials, abuse signals, low ratings, and suspicious review patterns.",
  },
  {
    test: (value) => value === "/admin/payments",
    title: "Payments & Payouts",
    description:
      "Track commissions, payouts, settlement status, and transaction detail views with operational clarity.",
  },
  {
    test: (value) => value === "/admin/reports",
    title: "Analytics Reports",
    description:
      "Read performance trends across users, jobs, retention, revenue, and sessions with export-ready structure.",
  },
  {
    test: (value) => value === "/admin/flags",
    title: "Abuse Reports",
    description:
      "Prioritize fraud, spam, fake tutors, and severe abuse cases with fast triage and escalation actions.",
  },
  {
    test: (value) => value === "/admin/content",
    title: "Content Control",
    description:
      "Manage blog posts, banners, FAQs, homepage sections, and announcements with a steady draft-to-publish workflow.",
  },
  {
    test: (value) => value === "/admin/settings",
    title: "Platform Settings",
    description:
      "Tune roles, rules, commissions, notifications, branding, and security preferences with future RBAC in mind.",
  },
];

const ADMIN_SECONDARY_ITEMS = [
  {
    label: "Settings",
    href: "/admin/settings",
    matchers: ["/admin/settings"],
    icon: Settings,
    permission: "admin.settings.read",
  },
  {
    label: "Help",
    href: "/about",
    matchers: ["/about"],
    icon: LifeBuoy,
  },
];

export function hasAdminAccess(item, permissions = []) {
  if (!item.permission) {
    return true;
  }

  if (!permissions?.length) {
    return true;
  }

  return permissions.includes(item.permission);
}

export function getAdminSections(permissions = []) {
  return ADMIN_SECTION_ORDER.map((section) => ({
    label: section,
    items: ADMIN_ITEMS.filter(
      (item) => item.section === section && hasAdminAccess(item, permissions)
    ),
  })).filter((section) => section.items.length > 0);
}

export function getAdminSecondaryItems(permissions = []) {
  return ADMIN_SECONDARY_ITEMS.filter((item) => hasAdminAccess(item, permissions));
}

export function getAdminPageMeta(pathname) {
  return ADMIN_PAGE_META.find((item) => item.test(pathname)) || null;
}
