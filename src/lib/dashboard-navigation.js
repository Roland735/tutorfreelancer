import {
  Bell,
  BriefcaseBusiness,
  CircleHelp,
  CreditCard,
  FileCheck2,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Star,
  UserRound,
  Wallet,
} from "lucide-react";

export const STUDENT_NAV_SECTIONS = [
  {
    label: "Student Mode",
    items: [
      { label: "Dashboard", href: "/dashboard", matchers: ["/dashboard"], exact: true, icon: LayoutDashboard },
      { label: "Profile", href: "/profile", matchers: ["/profile"], icon: UserRound },
      { label: "Jobs", href: "/jobs", matchers: ["/jobs"], icon: BriefcaseBusiness },
      { label: "Post A Job", href: "/jobs/post", matchers: ["/jobs/post"], icon: GraduationCap },
      { label: "Applications", href: "/applications", matchers: ["/applications"], icon: FileCheck2 },
      { label: "Messages", href: "/messages", matchers: ["/messages"], icon: MessageSquare },
      { label: "Bookings", href: "/bookings", matchers: ["/bookings"], icon: CreditCard },
      { label: "Notifications", href: "/notifications", matchers: ["/notifications"], icon: Bell },
      { label: "Wallet", href: "/wallet", matchers: ["/wallet"], icon: Wallet },
      { label: "Settings", href: "/settings", matchers: ["/settings"], icon: Settings },
      { label: "Help & Support", href: "/help-support", matchers: ["/help-support"], icon: CircleHelp },
    ],
  },
];

export const TUTOR_NAV_SECTIONS = [
  {
    label: "Tutor Mode",
    items: [
      { label: "Dashboard", href: "/dashboard", matchers: ["/dashboard"], exact: true, icon: LayoutDashboard },
      { label: "Profile", href: "/profile", matchers: ["/profile"], icon: UserRound },
      { label: "Jobs", href: "/jobs", matchers: ["/jobs"], icon: BriefcaseBusiness },
      { label: "Applications", href: "/applications", matchers: ["/applications"], icon: FileCheck2 },
      { label: "Messages", href: "/messages", matchers: ["/messages"], icon: MessageSquare },
      { label: "Bookings", href: "/bookings", matchers: ["/bookings"], icon: CreditCard },
      { label: "Earnings", href: "/earnings", matchers: ["/earnings"], icon: Wallet },
      { label: "Reviews", href: "/reviews", matchers: ["/reviews"], icon: Star },
      { label: "Notifications", href: "/notifications", matchers: ["/notifications"], icon: Bell },
      { label: "Wallet", href: "/wallet", matchers: ["/wallet"], icon: Wallet },
      { label: "Settings", href: "/settings", matchers: ["/settings"], icon: Settings },
      { label: "Help & Support", href: "/help-support", matchers: ["/help-support"], icon: CircleHelp },
    ],
  },
];

export const STUDENT_SECONDARY_ITEMS = [
  { label: "Profile Setup", href: "/profile-setup", matchers: ["/profile-setup"], icon: UserRound },
];

export const TUTOR_SECONDARY_ITEMS = [
  { label: "Profile Setup", href: "/profile-setup", matchers: ["/profile-setup"], icon: UserRound },
];

export const PAGE_META = [
  {
    test: (value) => value === "/dashboard",
    title: "Dashboard",
    description: "Track jobs, bookings, conversations, and student marketplace momentum in one view.",
  },
  {
    test: (value) => value.startsWith("/profile"),
    title: "Profile",
    description: "Build a trustworthy public identity for tutoring, studying, and campus credibility.",
  },
  {
    test: (value) => value.startsWith("/jobs/post"),
    title: "Post A Job",
    description: "Create a polished tutoring request with budget, urgency, and session details.",
  },
  {
    test: (value) => value.startsWith("/jobs"),
    title: "Jobs",
    description: "Browse, filter, save, and apply to tutoring requests from across Zimbabwe.",
  },
  {
    test: (value) => value.startsWith("/applications"),
    title: "Applications",
    description: "Track sent proposals and manage applications received for your tutoring requests.",
  },
  {
    test: (value) => value.startsWith("/messages"),
    title: "Messages",
    description: "Stay responsive with a focused inbox, unread indicators, and organized conversations.",
  },
  {
    test: (value) => value.startsWith("/bookings"),
    title: "Bookings",
    description: "Manage upcoming sessions, meeting links, reschedules, and tutoring history.",
  },
  {
    test: (value) => value.startsWith("/earnings"),
    title: "Earnings",
    description: "Monitor revenue, pending balances, and payout performance across recent sessions.",
  },
  {
    test: (value) => value.startsWith("/reviews"),
    title: "Reviews",
    description: "Read tutor feedback, average ratings, and submit session reviews with confidence.",
  },
  {
    test: (value) => value.startsWith("/notifications"),
    title: "Notifications",
    description: "Keep up with application updates, bookings, system alerts, and unread activity.",
  },
  {
    test: (value) => value.startsWith("/settings"),
    title: "Settings",
    description: "Control account security, privacy preferences, and notification behavior.",
  },
  {
    test: (value) => value.startsWith("/help-support"),
    title: "Help & Support",
    description: "Find answers quickly, contact support, and review safe platform guidelines.",
  },
  {
    test: (value) => value.startsWith("/wallet"),
    title: "Wallet",
    description: "Review payout methods, transaction history, and Zimbabwe-friendly payout placeholders.",
  },
];
