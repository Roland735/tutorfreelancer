import { format, formatDistanceToNow, isAfter, startOfDay, subDays, subMonths } from "date-fns";
import AdminAuditLog from "@/models/AdminAuditLog";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import Job from "@/models/Job";
import Message from "@/models/Message";
import Notification from "@/models/Notification";
import PlatformSetting from "@/models/PlatformSetting";
import Review from "@/models/Review";
import Session from "@/models/Session";
import Transaction from "@/models/Transaction";
import TutorProfile from "@/models/TutorProfile";
import User from "@/models/User";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const riskKeywordPattern =
  /(whatsapp|telegram|pay outside|outside the app|cashapp|ecocash|wire transfer|scam|fraud|urgent payment|contact me)/i;

function normalize(data) {
  return JSON.parse(JSON.stringify(data));
}

function formatCurrency(value = 0) {
  return currencyFormatter.format(value || 0);
}

function formatDateLabel(value, pattern = "MMM d") {
  if (!value) {
    return "Not available";
  }

  return format(new Date(value), pattern);
}

function formatRelative(value) {
  if (!value) {
    return "No recent activity";
  }

  return formatDistanceToNow(new Date(value), { addSuffix: true });
}

function clampPercent(value) {
  return Math.max(8, Math.min(100, Math.round(value || 0)));
}

function getUserVerification(user, tutorProfile) {
  if (user.role === "admin") {
    return "Platform admin";
  }

  if (tutorProfile?.verificationStatus === "verified") {
    return "Verified";
  }

  if (tutorProfile?.verificationStatus === "pending") {
    return "Pending review";
  }

  return user.isVerified ? "Verified email" : "Basic";
}

function getUserStatus(user, tutorProfile) {
  if (user.accountStatus === "deleted") {
    return "Deleted";
  }

  if (user.accountStatus === "suspended") {
    return "Suspended";
  }

  if (user.role === "admin") {
    return "Admin";
  }

  if (tutorProfile?.verificationStatus === "pending") {
    return "Pending";
  }

  if (tutorProfile?.verificationStatus === "verified") {
    return "Verified";
  }

  if (user.isOnline) {
    return "Active";
  }

  return user.isVerified ? "Active" : "Dormant";
}

function getJobHealth(job) {
  const applicantCount = job.applicants?.length || 0;
  const combinedText = `${job.title} ${job.description} ${job.tags?.join(" ") || ""}`;

  if (riskKeywordPattern.test(combinedText)) {
    return "Keyword risk";
  }

  if (job.moderationStatus === "hidden") {
    return "Hidden";
  }

  if (job.moderationStatus === "under_review") {
    return "Under review";
  }

  if (job.status === "Cancelled") {
    return "Cancelled";
  }

  if (job.deadline && isAfter(new Date(), new Date(job.deadline)) && job.status === "Open") {
    return "Expired";
  }

  if (applicantCount >= 5) {
    return "Busy";
  }

  if (job.urgency === "Immediate" || job.urgency === "High") {
    return "Priority";
  }

  if (!applicantCount) {
    return "No applicants";
  }

  return "Healthy";
}

function getJobFlagged(job) {
  return (
    job.moderationStatus === "under_review" ||
    riskKeywordPattern.test(`${job.title} ${job.description} ${job.tags?.join(" ") || ""}`)
  );
}

function getReviewSignal(review) {
  if (review.moderationStatus === "hidden") {
    return "Hidden";
  }

  if (review.moderationStatus === "flagged") {
    return "Flagged";
  }

  if (riskKeywordPattern.test(review.comment || "")) {
    return "Abuse claim";
  }

  if (review.rating <= 2) {
    return "Low rating";
  }

  return "Healthy";
}

function getMessageSignalScore(content) {
  if (!content) {
    return 0;
  }

  const matches = content.match(new RegExp(riskKeywordPattern.source, "gi"));
  return matches?.length || 0;
}

function includesTerm(value, term) {
  return String(value || "").toLowerCase().includes(String(term || "").toLowerCase());
}

function buildTrendSeries(items, getter, startDate, steps, labelPattern) {
  return Array.from({ length: steps }).map((_, index) => {
    const bucketDate =
      labelPattern === "MMM"
        ? subMonths(startDate, steps - index - 1)
        : subDays(startDate, steps - index - 1);
    const bucketStart =
      labelPattern === "MMM"
        ? new Date(bucketDate.getFullYear(), bucketDate.getMonth(), 1)
        : startOfDay(bucketDate);
    const bucketEnd =
      labelPattern === "MMM"
        ? new Date(bucketDate.getFullYear(), bucketDate.getMonth() + 1, 1)
        : new Date(bucketStart.getTime() + 24 * 60 * 60 * 1000);

    const inBucket = items.filter((item) => {
      const value = new Date(getter(item));
      return value >= bucketStart && value < bucketEnd;
    });

    return {
      label: format(bucketDate, labelPattern),
      count: inBucket.length,
      items: inBucket,
    };
  });
}

async function getDerivedFlags(limit = 25) {
  await dbConnect();

  const [messages, reviews, sessions, transactions] = await Promise.all([
    Message.find({})
      .populate("sender", "name role")
      .populate("receiver", "name role")
      .sort({ createdAt: -1 })
      .limit(250)
      .lean(),
    Review.find({})
      .populate("reviewee", "name")
      .populate("reviewer", "name")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean(),
    Session.find({ status: "Disputed" })
      .populate("student", "name")
      .populate("tutor", "name")
      .sort({ updatedAt: -1 })
      .limit(25)
      .lean(),
    Transaction.find({ status: { $in: ["Failed", "Refunded"] } })
      .populate("payer", "name")
      .populate("receiver", "name")
      .sort({ updatedAt: -1 })
      .limit(25)
      .lean(),
  ]);

  const normalizedMessages = normalize(messages);
  const conversationMap = new Map();

  normalizedMessages.forEach((message) => {
    const score = getMessageSignalScore(message.content);
    if (!score) {
      return;
    }

    const existing = conversationMap.get(message.conversationId);
    if (!existing) {
      conversationMap.set(message.conversationId, {
        id: `msg-${message.conversationId}`,
        subject: `${message.sender?.name || "User"} / ${message.receiver?.name || "User"}`,
        type: "Conversation",
        severity: score > 1 ? "High" : "Medium",
        reason: "Risk keywords in chat",
        createdAt: message.createdAt,
        status: message.read ? "Review" : "Open",
      });
    }
  });

  const reviewFlags = normalize(reviews)
    .filter((review) => getReviewSignal(review) !== "Healthy")
    .map((review) => ({
      id: `rev-${review._id}`,
      subject: `${review.reviewee?.name || "Tutor"} review`,
      type: "Review",
      severity: review.rating <= 2 ? "High" : "Medium",
      reason: getReviewSignal(review),
      createdAt: review.createdAt,
      status: "Open",
    }));

  const sessionFlags = normalize(sessions).map((session) => ({
    id: `ses-${session._id}`,
    subject: `${session.student?.name || "Student"} vs ${session.tutor?.name || "Tutor"}`,
    type: "Session",
    severity: "High",
    reason: "Disputed session",
    createdAt: session.updatedAt || session.createdAt,
    status: "Escalated",
  }));

  const paymentFlags = normalize(transactions).map((transaction) => ({
    id: `pay-${transaction._id}`,
    subject: `${transaction.receiver?.name || "Tutor"} settlement`,
    type: "Payment",
    severity: transaction.status === "Failed" ? "High" : "Medium",
    reason: transaction.status,
    createdAt: transaction.updatedAt || transaction.createdAt,
    status: transaction.status === "Failed" ? "Open" : "Review",
  }));

  return [...conversationMap.values(), ...reviewFlags, ...sessionFlags, ...paymentFlags]
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, limit);
}

export async function getAdminDashboardData() {
  await dbConnect();

  const [
    usersCount,
    tutorsCount,
    jobsCount,
    reviewsCount,
    activeSessionsCount,
    revenueAggregate,
    recentUsers,
    recentJobs,
    recentReviews,
    recentTransactions,
    pendingTutorProfiles,
    notificationsUnread,
  ] = await Promise.all([
    User.countDocuments(),
    TutorProfile.countDocuments(),
    Job.countDocuments(),
    Review.countDocuments(),
    Session.countDocuments({ status: { $in: ["Scheduled", "Completed"] } }),
    Transaction.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
    User.find({}).sort({ createdAt: -1 }).limit(5).lean(),
    Job.find({}).populate("postedBy", "name").sort({ createdAt: -1 }).limit(5).lean(),
    Review.find({}).populate("reviewee", "name").sort({ createdAt: -1 }).limit(5).lean(),
    Transaction.find({})
      .populate("receiver", "name")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    TutorProfile.find({ verificationStatus: "pending" })
      .populate("user", "name university")
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean(),
    Notification.countDocuments({ read: false }),
  ]);

  const flags = await getDerivedFlags(50);
  const totalRevenue = revenueAggregate[0]?.total || 0;
  const totalPendingApprovals = pendingTutorProfiles.length;

  const stats = [
    { label: "Users", value: String(usersCount), helper: "All registered marketplace accounts", tone: "sky" },
    { label: "Tutors", value: String(tutorsCount), helper: `${totalPendingApprovals} pending verification`, tone: "emerald" },
    { label: "Jobs", value: String(jobsCount), helper: "All tutoring requests in the database", tone: "violet" },
    { label: "Reports", value: String(flags.length), helper: "Derived trust and safety alerts", tone: "amber" },
    { label: "Revenue", value: formatCurrency(totalRevenue), helper: "Captured from transaction history", tone: "emerald" },
    { label: "Active Sessions", value: String(activeSessionsCount), helper: "Scheduled and completed sessions", tone: "sky" },
  ];

  const recentActivity = [
    ...normalize(recentUsers).map((user) => ({
      title: `${user.name} joined the platform`,
      description: `${user.role} account created${user.university ? ` at ${user.university}` : ""}.`,
      time: formatRelative(user.createdAt),
      sortDate: user.createdAt,
      tone: "sky",
    })),
    ...normalize(recentJobs).map((job) => ({
      title: `${job.title} was posted`,
      description: `Created by ${job.postedBy?.name || "a student"} in ${job.category}.`,
      time: formatRelative(job.createdAt),
      sortDate: job.createdAt,
      tone: getJobFlagged(job) ? "warning" : "success",
    })),
    ...normalize(recentReviews).map((review) => ({
      title: `New ${review.rating}-star review submitted`,
      description: `Review created for ${review.reviewee?.name || "a tutor"}.`,
      time: formatRelative(review.createdAt),
      sortDate: review.createdAt,
      tone: getReviewSignal(review) === "Healthy" ? "success" : "warning",
    })),
    ...normalize(recentTransactions).map((transaction) => ({
      title: `${formatCurrency(transaction.amount)} transaction recorded`,
      description: `Settlement for ${transaction.receiver?.name || "a tutor"} is ${transaction.status}.`,
      time: formatRelative(transaction.createdAt),
      sortDate: transaction.createdAt,
      tone: transaction.status === "Completed" ? "success" : "warning",
    })),
  ]
    .sort((left, right) => new Date(right.sortDate) - new Date(left.sortDate))
    .slice(0, 8);

  const pendingApprovals = normalize(pendingTutorProfiles).map((profile) => ({
    name: profile.user?.name || "Tutor applicant",
    area: "Tutor verification",
    university: profile.user?.university || "Unknown university",
    detail: profile.verificationDocumentName || "Awaiting verification document review",
    priority: formatRelative(profile.updatedAt).includes("day") ? "High" : "Medium",
  }));

  const platformHealth = [
    {
      label: "Trust alerts",
      value: flags.length ? "Attention" : "Healthy",
      tone: flags.length ? "warning" : "success",
      helper: `${flags.length} derived alerts across messages, reviews, disputes, and payments.`,
    },
    {
      label: "Tutor approvals",
      value: totalPendingApprovals ? "Backlog" : "Clear",
      tone: totalPendingApprovals ? "warning" : "success",
      helper: `${totalPendingApprovals} tutor profiles are pending verification.`,
    },
    {
      label: "Unread notifications",
      value: notificationsUnread ? "Active" : "Quiet",
      tone: notificationsUnread ? "sky" : "success",
      helper: `${notificationsUnread} unread notifications are still open on the platform.`,
    },
    {
      label: "Payments",
      value: totalRevenue ? "Live" : "Quiet",
      tone: totalRevenue ? "success" : "neutral",
      helper: `${formatCurrency(totalRevenue)} total transaction volume is available for admin review.`,
    },
  ];

  const moderationLinks = [
    { label: "Open abuse queue", href: "/admin/flags", helper: `${flags.length} live derived alerts` },
    { label: "Review tutor approvals", href: "/admin/tutors", helper: `${totalPendingApprovals} pending verification profiles` },
    { label: "Inspect recent jobs", href: "/admin/jobs", helper: `${jobsCount} jobs available for moderation` },
    { label: "Track payouts", href: "/admin/payments", helper: `${formatCurrency(totalRevenue)} in recorded volume` },
  ];

  const now = new Date();
  const start = subDays(now, 6);

  const [usersForTrend, jobsForTrend, transactionsForTrend] = await Promise.all([
    User.find({ createdAt: { $gte: start } }).select("createdAt").lean(),
    Job.find({ createdAt: { $gte: start } }).select("createdAt").lean(),
    Transaction.find({ createdAt: { $gte: start } }).select("createdAt amount").lean(),
  ]);

  const userTrend = buildTrendSeries(normalize(usersForTrend), (item) => item.createdAt, now, 7, "EEE");
  const jobTrend = buildTrendSeries(normalize(jobsForTrend), (item) => item.createdAt, now, 7, "EEE");
  const revenueTrend = Array.from({ length: 7 }).map((_, index) => {
    const bucketDate = subDays(now, 6 - index);
    const bucketStart = startOfDay(bucketDate);
    const bucketEnd = new Date(bucketStart.getTime() + 24 * 60 * 60 * 1000);
    const total = normalize(transactionsForTrend)
      .filter((transaction) => new Date(transaction.createdAt) >= bucketStart && new Date(transaction.createdAt) < bucketEnd)
      .reduce((sum, transaction) => sum + (transaction.amount || 0), 0);

    return {
      label: format(bucketDate, "EEE"),
      total,
    };
  });

  const maxUsers = Math.max(...userTrend.map((item) => item.count), 1);
  const maxJobs = Math.max(...jobTrend.map((item) => item.count), 1);
  const maxRevenue = Math.max(...revenueTrend.map((item) => item.total), 1);

  const dashboardTrends = userTrend.map((item, index) => ({
    label: item.label,
    users: clampPercent((item.count / maxUsers) * 100),
    jobs: clampPercent((jobTrend[index]?.count / maxJobs) * 100),
    revenue: clampPercent((revenueTrend[index]?.total / maxRevenue) * 100),
  }));

  return {
    stats,
    recentActivity,
    pendingApprovals,
    platformHealth,
    moderationLinks,
    dashboardTrends,
  };
}

export async function getAdminUsersData(filters = {}) {
  await dbConnect();

  const [users, tutorProfiles, totalUsers, verifiedUsers, adminUsers] = await Promise.all([
    User.find({}).sort({ createdAt: -1 }).limit(200).lean(),
    TutorProfile.find({}).select("user verificationStatus stats").lean(),
    User.countDocuments(),
    User.countDocuments({ isVerified: true }),
    User.countDocuments({ role: "admin" }),
  ]);

  const tutorProfileMap = new Map(normalize(tutorProfiles).map((profile) => [profile.user, profile]));
  const normalizedUsers = normalize(users);

  const filteredUsers = normalizedUsers.filter((user) => {
    const tutorProfile = tutorProfileMap.get(user._id);
    const status = getUserStatus(user, tutorProfile);
    const roleFilter = filters.role && filters.role !== "all" ? filters.role : "";
    const statusFilter = filters.status && filters.status !== "all" ? filters.status : "";
    const universityFilter = filters.university && filters.university !== "all" ? filters.university : "";
    const query = String(filters.q || "").trim().toLowerCase();

    const roleMatches =
      !roleFilter ||
      (roleFilter === "students"
        ? user.role === "student"
        : roleFilter === "tutors"
          ? user.role === "tutor" || user.role === "both"
          : user.role === roleFilter);
    const statusMatches =
      !statusFilter ||
      (statusFilter === "active"
        ? ["Active", "Verified", "Admin"].includes(status)
        : statusFilter === "review"
          ? status === "Pending"
          : status.toLowerCase() === statusFilter);
    const universityMatches = !universityFilter || includesTerm(user.university, universityFilter);
    const queryMatches =
      !query ||
      includesTerm(user.name, query) ||
      includesTerm(user.email, query) ||
      includesTerm(user.university, query) ||
      includesTerm(user.location?.city, query);

    return roleMatches && statusMatches && universityMatches && queryMatches;
  });

  const rows = filteredUsers.map((user) => {
    const tutorProfile = tutorProfileMap.get(user._id);
    return {
      id: user._id,
      name: user.name,
      role: user.role,
      email: user.email,
      status: getUserStatus(user, tutorProfile),
      verification: getUserVerification(user, tutorProfile),
      university: user.university || "Not set",
      city: user.location?.city || "Not set",
      joined: formatDateLabel(user.createdAt, "MMM d, yyyy"),
      lastSeen: formatRelative(user.lastLogin || user.updatedAt || user.createdAt),
    };
  });

  const tutorCount = rows.filter((row) => row.role === "tutor" || row.role === "both").length;
  const pendingCount = normalize(tutorProfiles).filter((profile) => profile.verificationStatus === "pending").length;

  const quickStats = [
    { label: "All accounts", value: String(totalUsers) },
    { label: "Tutor-linked accounts", value: String(tutorCount) },
    { label: "Verified users", value: String(verifiedUsers) },
    { label: "Pending tutor checks", value: String(pendingCount) },
    { label: "Admin accounts", value: String(adminUsers) },
  ];

  return { rows, quickStats };
}

export async function getAdminUserDetailData(id) {
  await dbConnect();

  const [user, tutorProfile, jobsPosted, studentSessions, tutorSessions, reviewsAbout, reviewsBy, paymentsOut, paymentsIn, auditLogs] =
    await Promise.all([
      User.findById(id).lean(),
      TutorProfile.findOne({ user: id }).lean(),
      Job.find({ postedBy: id }).sort({ createdAt: -1 }).limit(5).lean(),
      Session.find({ student: id }).sort({ createdAt: -1 }).limit(5).lean(),
      Session.find({ tutor: id }).sort({ createdAt: -1 }).limit(5).lean(),
      Review.find({ reviewee: id }).sort({ createdAt: -1 }).limit(5).lean(),
      Review.find({ reviewer: id }).sort({ createdAt: -1 }).limit(5).lean(),
      Transaction.find({ payer: id }).sort({ createdAt: -1 }).limit(5).lean(),
      Transaction.find({ receiver: id }).sort({ createdAt: -1 }).limit(5).lean(),
      AdminAuditLog.find({ entityType: "user", entityId: String(id) }).sort({ createdAt: -1 }).limit(10).lean(),
    ]);

  const normalizedUser = normalize(user);
  if (!normalizedUser) {
    return null;
  }

  const normalizedTutorProfile = normalize(tutorProfile);
  const jobs = normalize(jobsPosted);
  const sessionsAsStudent = normalize(studentSessions);
  const sessionsAsTutor = normalize(tutorSessions);
  const receivedReviews = normalize(reviewsAbout);
  const writtenReviews = normalize(reviewsBy);
  const outgoingPayments = normalize(paymentsOut);
  const incomingPayments = normalize(paymentsIn);

  const sessionCount = sessionsAsStudent.length + sessionsAsTutor.length;
  const totalIncoming = incomingPayments.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalOutgoing = outgoingPayments.reduce((sum, item) => sum + (item.amount || 0), 0);

  const accountSignals = [
    `${jobs.length} jobs posted`,
    `${sessionCount} recent sessions`,
    `${receivedReviews.length} reviews received`,
    `${writtenReviews.length} reviews written`,
  ];

  const paymentSignals = [
    `Outgoing volume ${formatCurrency(totalOutgoing)}`,
    `Incoming volume ${formatCurrency(totalIncoming)}`,
  ];

  const auditTrail = [
    {
      title: "Account created",
      time: formatDateLabel(normalizedUser.createdAt, "MMM d, yyyy"),
      tone: "sky",
      sortDate: normalizedUser.createdAt,
    },
    {
      title: normalizedUser.isVerified ? "User identity verified" : "User pending verification",
      time: formatRelative(normalizedUser.updatedAt || normalizedUser.createdAt),
      tone: normalizedUser.isVerified ? "success" : "warning",
      sortDate: normalizedUser.updatedAt || normalizedUser.createdAt,
    },
    ...jobs.map((job) => ({
      title: `Posted job: ${job.title}`,
      time: formatDateLabel(job.createdAt, "MMM d, yyyy"),
      tone: "sky",
      sortDate: job.createdAt,
    })),
    ...sessionsAsTutor.concat(sessionsAsStudent).map((session) => ({
      title: `Session ${session.status.toLowerCase()}`,
      time: formatDateLabel(session.createdAt, "MMM d, yyyy"),
      tone: session.status === "Completed" ? "success" : session.status === "Disputed" ? "danger" : "neutral",
      sortDate: session.createdAt,
    })),
    ...normalize(auditLogs).map((entry) => ({
      title: `Admin ${entry.action}`,
      time: formatDateLabel(entry.createdAt, "MMM d, yyyy"),
      tone: "warning",
      sortDate: entry.createdAt,
      description: entry.details || "Recorded admin action",
    })),
  ]
    .sort((left, right) => new Date(right.sortDate) - new Date(left.sortDate))
    .slice(0, 8)
    .map(({ sortDate, ...item }) => item);

  return {
    user: {
      id: normalizedUser._id,
      name: normalizedUser.name,
      email: normalizedUser.email,
      role: normalizedUser.role,
      status: getUserStatus(normalizedUser, normalizedTutorProfile),
      verification: getUserVerification(normalizedUser, normalizedTutorProfile),
      university: normalizedUser.university || "Not set",
      city: normalizedUser.location?.city || "Not set",
      phone: normalizedUser.phoneNumber || "Not set",
      joined: formatDateLabel(normalizedUser.createdAt, "MMM d, yyyy"),
      lastSeen: formatRelative(normalizedUser.lastLogin || normalizedUser.updatedAt || normalizedUser.createdAt),
    },
    accountDetails: [
      { label: "User ID", value: normalizedUser._id },
      { label: "Role", value: normalizedUser.role },
      { label: "Status", value: getUserStatus(normalizedUser, normalizedTutorProfile) },
      { label: "Verification", value: getUserVerification(normalizedUser, normalizedTutorProfile) },
      { label: "University", value: normalizedUser.university || "Not set" },
      { label: "Major", value: normalizedUser.major || "Not set" },
      { label: "City", value: normalizedUser.location?.city || "Not set" },
      { label: "Country", value: normalizedUser.location?.country || "Not set" },
      { label: "Last login", value: formatDateLabel(normalizedUser.lastLogin, "MMM d, yyyy") },
    ],
    actions: normalizedTutorProfile
      ? [
        normalizedTutorProfile.verificationStatus === "pending"
          ? "Approve or request updated verification documents"
          : "Review tutor quality and response metrics",
        "Reset login access if account recovery is requested",
        "Audit recent transactions before changing account permissions",
      ]
      : [
        "Promote or restrict account access after manual review",
        "Reset login access if account recovery is requested",
        "Review recent jobs and session history before actioning changes",
      ],
    reports: accountSignals,
    payments: paymentSignals,
    auditTrail,
  };
}

export async function getAdminJobsData(filters = {}) {
  await dbConnect();

  const jobs = normalize(
    await Job.find({})
      .populate("postedBy", "name university")
      .sort({ createdAt: -1 })
      .limit(200)
      .lean()
  );

  return jobs
    .map((job) => ({
      id: job._id,
      title: job.title,
      subject: job.subject,
      budget: `${formatCurrency(job.budget?.min)}${job.budget?.max ? ` - ${formatCurrency(job.budget.max)}` : ""}`,
      status: job.moderationStatus === "hidden" ? "Hidden" : job.moderationStatus === "under_review" ? "Under review" : job.status,
      university: job.postedBy?.university || "Not set",
      date: formatDateLabel(job.createdAt, "MMM d"),
      health: getJobHealth(job),
      flagged: getJobFlagged(job),
    }))
    .filter((job) => {
      const query = String(filters.q || "").trim().toLowerCase();
      const subjectMatches = !filters.subject || filters.subject === "all" || includesTerm(job.subject, filters.subject);
      const statusMatches = !filters.status || filters.status === "all" || includesTerm(job.status, filters.status.replace("_", " "));
      const universityMatches = !filters.university || filters.university === "all" || includesTerm(job.university, filters.university);
      const queryMatches =
        !query ||
        includesTerm(job.title, query) ||
        includesTerm(job.subject, query) ||
        includesTerm(job.university, query);

      return subjectMatches && statusMatches && universityMatches && queryMatches;
    });
}

export async function getAdminJobDetailData(id) {
  await dbConnect();

  const [job, sessions, auditLogs] = await Promise.all([
    Job.findById(id)
      .populate("postedBy", "name university location")
      .populate("applicants.user", "name email role")
      .lean(),
    Session.find({ job: id })
      .populate("student", "name")
      .populate("tutor", "name")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
    AdminAuditLog.find({ entityType: "job", entityId: String(id) }).sort({ createdAt: -1 }).limit(10).lean(),
  ]);

  const normalizedJob = normalize(job);
  if (!normalizedJob) {
    return null;
  }

  const applicantIds = (normalizedJob.applicants || [])
    .map((item) => item.user?._id)
    .filter(Boolean);

  const recentMessages = applicantIds.length
    ? normalize(
      await Message.find({
        $or: applicantIds.flatMap((applicantId) => [
          { sender: normalizedJob.postedBy?._id, receiver: applicantId },
          { sender: applicantId, receiver: normalizedJob.postedBy?._id },
        ]),
      })
        .sort({ createdAt: -1 })
        .limit(6)
        .lean()
    )
    : [];

  const normalizedSessions = normalize(sessions);
  const moderationNotes = [...(normalizedJob.moderationNotes || [])];

  if (normalizedJob.urgency === "High" || normalizedJob.urgency === "Immediate") {
    moderationNotes.push("High urgency listing that may need faster review.");
  }
  if (getJobFlagged(normalizedJob)) {
    moderationNotes.push("Text contains keywords that may indicate off-platform coordination.");
  }
  if (!normalizedJob.applicants?.length) {
    moderationNotes.push("No applications have arrived yet.");
  }
  if (normalizedSessions.length) {
    moderationNotes.push(`${normalizedSessions.length} sessions already reference this job.`);
  }

  const auditTrail = [
    {
      title: "Job created",
      time: formatDateLabel(normalizedJob.createdAt, "MMM d, yyyy"),
      tone: "sky",
      sortDate: normalizedJob.createdAt,
    },
    ...(normalizedJob.applicants || []).map((applicant) => ({
      title: `${applicant.user?.name || "Tutor"} applied`,
      time: formatDateLabel(applicant.appliedAt, "MMM d, yyyy"),
      tone: "success",
      sortDate: applicant.appliedAt,
    })),
    ...normalizedSessions.map((session) => ({
      title: `Session ${session.status.toLowerCase()}`,
      time: formatDateLabel(session.createdAt, "MMM d, yyyy"),
      tone: session.status === "Completed" ? "success" : session.status === "Disputed" ? "danger" : "neutral",
      sortDate: session.createdAt,
    })),
  ]
    .sort((left, right) => new Date(right.sortDate) - new Date(left.sortDate))
    .map(({ sortDate, ...item }) => item);

  return {
    job: {
      id: normalizedJob._id,
      title: normalizedJob.title,
      status: normalizedJob.status,
      flagged: getJobFlagged(normalizedJob),
      health: getJobHealth(normalizedJob),
    },
    details: [
      { label: "Owner", value: normalizedJob.postedBy?.name || "Unknown" },
      { label: "Budget", value: `${formatCurrency(normalizedJob.budget?.min)}${normalizedJob.budget?.max ? ` - ${formatCurrency(normalizedJob.budget.max)}` : ""}` },
      { label: "University", value: normalizedJob.postedBy?.university || "Not set" },
      { label: "City", value: normalizedJob.location?.city || "Not set" },
      { label: "Subject", value: normalizedJob.subject },
      { label: "Session type", value: normalizedJob.sessionType },
      { label: "Urgency", value: normalizedJob.urgency },
      { label: "Deadline", value: formatDateLabel(normalizedJob.deadline, "MMM d, yyyy") },
      { label: "Applicants", value: String(normalizedJob.applicants?.length || 0) },
    ],
    moderationNotes,
    attachments: (normalizedJob.attachments || []).map((item) => item.filename || item.url || "Attachment"),
    applicants: (normalizedJob.applicants || []).map((applicant) => applicant.user?.name || "Unknown tutor"),
    messages: recentMessages.map((message) => message.content),
    auditTrail,
  };
}

export async function getAdminTutorsData() {
  await dbConnect();

  const profiles = normalize(
    await TutorProfile.find({})
      .populate("user", "name university")
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean()
  );

  const queue = profiles.map((profile) => ({
    id: profile._id,
    name: profile.user?.name || "Tutor",
    subjects: (profile.subjects || []).slice(0, 3).map((subject) => subject.name).join(", ") || "No subjects yet",
    university: profile.user?.university || "Not set",
    proof: profile.verificationDocumentName || "No verification document uploaded",
    rating: profile.stats?.rating ? profile.stats.rating.toFixed(1) : "New",
    risk:
      profile.riskLevel || (profile.verificationStatus === "pending"
        ? "Medium"
        : (profile.stats?.completionRate || 100) < 85
          ? "High"
          : "Low"),
    moderationStatus: profile.moderationStatus,
  }));

  const topTutors = profiles
    .filter((profile) => profile.stats?.rating)
    .sort((left, right) => (right.stats?.rating || 0) - (left.stats?.rating || 0))
    .slice(0, 3)
    .map((profile) => ({
      name: profile.user?.name || "Tutor",
      metric: `${profile.stats?.rating?.toFixed(1) || "0.0"} rating`,
      tone: "success",
    }));

  const riskyTutors = profiles
    .filter(
      (profile) =>
        profile.verificationStatus === "pending" ||
        (profile.stats?.completionRate || 100) < 85 ||
        (profile.stats?.rating || 5) < 3.5
    )
    .slice(0, 3)
    .map((profile) => ({
      name: profile.user?.name || "Tutor",
      reason:
        profile.verificationStatus === "pending"
          ? "Verification still pending"
          : (profile.stats?.completionRate || 100) < 85
            ? "Low completion rate"
            : "Low rating trend",
      tone: profile.verificationStatus === "pending" ? "warning" : "danger",
    }));

  return { queue, topTutors, riskyTutors };
}

export async function getAdminApplicationsData() {
  await dbConnect();

  const jobs = normalize(
    await Job.find({ "applicants.0": { $exists: true } })
      .populate("postedBy", "name")
      .populate("applicants.user", "name")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()
  );

  return jobs
    .flatMap((job) =>
      (job.applicants || []).map((applicant) => ({
        id: `${job._id}-${applicant.user?._id || applicant.appliedAt}`,
        job: job.title,
        tutor: applicant.user?.name || "Tutor",
        student: job.postedBy?.name || "Student",
        status:
          applicant.status === "accepted"
            ? "Accepted"
            : applicant.status === "rejected"
              ? "Rejected"
              : "Pending",
        timestamp: formatDateLabel(applicant.appliedAt, "MMM d, HH:mm"),
        signal: riskKeywordPattern.test(applicant.coverLetter || "")
          ? "Keyword hit"
          : applicant.bidAmount && job.budget?.min && applicant.bidAmount < job.budget.min * 0.7
            ? "Low bid"
            : "Healthy",
        sortDate: applicant.appliedAt,
      }))
    )
    .sort((left, right) => new Date(right.sortDate) - new Date(left.sortDate))
    .slice(0, 100)
    .map(({ sortDate, ...item }) => item);
}

export async function getAdminMessagesData() {
  await dbConnect();

  const messages = normalize(
    await Message.find({})
      .populate("sender", "name")
      .populate("receiver", "name")
      .sort({ createdAt: -1 })
      .limit(300)
      .lean()
  );

  const conversationMap = new Map();

  messages.forEach((message) => {
    const existing = conversationMap.get(message.conversationId);
    const score = getMessageSignalScore(message.content);

    if (!existing) {
      conversationMap.set(message.conversationId, {
        id: message.conversationId,
        subject: `Conversation between ${message.sender?.name || "User"} and ${message.receiver?.name || "User"}`,
        participants: `${message.sender?.name || "User"} and ${message.receiver?.name || "User"}`,
        status: score > 1 ? "Escalated" : score > 0 ? "Flagged" : "Monitored",
        reason: score > 0 ? "Risk keywords in chat" : "Recent activity",
        preview: message.content,
        latestAt: message.createdAt,
        riskScore: score,
        messages: [],
      });
    }

    conversationMap.get(message.conversationId).messages.unshift(message.content);
  });

  const conversations = [...conversationMap.values()]
    .sort((left, right) => {
      if (right.riskScore !== left.riskScore) {
        return right.riskScore - left.riskScore;
      }

      return new Date(right.latestAt) - new Date(left.latestAt);
    })
    .slice(0, 12)
    .map(({ riskScore, latestAt, ...conversation }) => ({
      ...conversation,
      messages: conversation.messages.slice(-10),
    }));

  return { conversations };
}

export async function getAdminReviewsData() {
  await dbConnect();

  const reviews = normalize(
    await Review.find({})
      .populate("reviewee", "name")
      .populate("reviewer", "name")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()
  );

  const rows = reviews.map((review) => ({
    id: review._id,
    tutor: review.reviewee?.name || "Tutor",
    student: review.reviewer?.name || "Student",
    rating: review.rating.toFixed(1),
    status:
      review.moderationStatus === "hidden"
        ? "Hidden"
        : review.moderationStatus === "flagged"
          ? "Review"
          : "Approved",
    signal: getReviewSignal(review),
    excerpt: review.comment,
  }));

  const now = new Date();
  const monthSeries = buildTrendSeries(reviews, (item) => item.createdAt, now, 5, "MMM");

  const reputationTrend = monthSeries.map((bucket) => {
    const avgRating =
      bucket.items.reduce((sum, item) => sum + (item.rating || 0), 0) /
      Math.max(bucket.items.length, 1);

    return {
      label: bucket.label,
      value: clampPercent((avgRating / 5) * 100),
    };
  });

  return { rows, reputationTrend };
}

export async function getAdminPaymentsData() {
  await dbConnect();

  const transactions = normalize(
    await Transaction.find({})
      .populate("payer", "name")
      .populate("receiver", "name")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()
  );

  const rows = transactions.map((transaction) => ({
    id: transaction._id,
    tutor: transaction.receiver?.name || "Tutor",
    type: transaction.status === "Refunded" ? "Refund" : "Tutoring payment",
    amount: formatCurrency(transaction.amount),
    fee: formatCurrency(transaction.platformFee),
    status:
      transaction.payoutStatus === "processed"
        ? "Processed"
        : transaction.payoutStatus === "review"
          ? "Review"
          : transaction.status === "Pending"
            ? "Queued"
            : transaction.status,
    date: formatDateLabel(transaction.createdAt, "MMM d"),
    method: transaction.method,
  }));

  const completedTotal = transactions
    .filter((transaction) => transaction.status === "Completed")
    .reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
  const pendingTotal = transactions
    .filter((transaction) => transaction.status === "Pending")
    .reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
  const reviewTotal = transactions
    .filter((transaction) => transaction.status === "Failed" || transaction.status === "Refunded")
    .reduce((sum, transaction) => sum + (transaction.amount || 0), 0);

  const payoutBatches = [
    { label: "Completed volume", value: formatCurrency(completedTotal), helper: "Successful tutor payment records", tone: "success" },
    { label: "Pending settlement", value: formatCurrency(pendingTotal), helper: "Transactions still awaiting completion", tone: "warning" },
    { label: "Refunded or failed", value: formatCurrency(reviewTotal), helper: "Items requiring closer financial review", tone: "danger" },
  ];

  return { rows, payoutBatches };
}

export async function getAdminReportsData() {
  await dbConnect();

  const now = new Date();
  const dailyStart = subDays(now, 6);
  const monthlyStart = subMonths(now, 4);

  const [users, jobs, sessions, transactions, tutorProfiles] = await Promise.all([
    User.find({ createdAt: { $gte: monthlyStart } }).select("createdAt").lean(),
    Job.find({ createdAt: { $gte: monthlyStart } }).select("createdAt").lean(),
    Session.find({ createdAt: { $gte: monthlyStart } }).select("createdAt status").lean(),
    Transaction.find({ createdAt: { $gte: monthlyStart } }).select("createdAt amount status").lean(),
    TutorProfile.find({}).select("verificationStatus stats").lean(),
  ]);

  const normalizedUsers = normalize(users);
  const normalizedJobs = normalize(jobs);
  const normalizedSessions = normalize(sessions);
  const normalizedTransactions = normalize(transactions);
  const normalizedTutorProfiles = normalize(tutorProfiles);

  const userTrend = buildTrendSeries(
    normalizedUsers.filter((item) => new Date(item.createdAt) >= dailyStart),
    (item) => item.createdAt,
    now,
    7,
    "EEE"
  );
  const jobTrend = buildTrendSeries(
    normalizedJobs.filter((item) => new Date(item.createdAt) >= dailyStart),
    (item) => item.createdAt,
    now,
    7,
    "EEE"
  );

  const revenueTrend = Array.from({ length: 7 }).map((_, index) => {
    const day = subDays(now, 6 - index);
    const bucketStart = startOfDay(day);
    const bucketEnd = new Date(bucketStart.getTime() + 24 * 60 * 60 * 1000);
    const amount = normalizedTransactions
      .filter((transaction) => new Date(transaction.createdAt) >= bucketStart && new Date(transaction.createdAt) < bucketEnd)
      .reduce((sum, transaction) => sum + (transaction.amount || 0), 0);

    return {
      label: format(day, "EEE"),
      total: amount,
    };
  });

  const maxUsers = Math.max(...userTrend.map((item) => item.count), 1);
  const maxJobs = Math.max(...jobTrend.map((item) => item.count), 1);
  const maxRevenue = Math.max(...revenueTrend.map((item) => item.total), 1);

  const dashboardTrends = userTrend.map((bucket, index) => ({
    label: bucket.label,
    users: clampPercent((bucket.count / maxUsers) * 100),
    jobs: clampPercent((jobTrend[index]?.count / maxJobs) * 100),
    revenue: clampPercent((revenueTrend[index]?.total / maxRevenue) * 100),
  }));

  const weeklyUsers = normalizedUsers.filter((item) => new Date(item.createdAt) >= dailyStart).length;
  const weeklyJobs = normalizedJobs.filter((item) => new Date(item.createdAt) >= dailyStart).length;
  const weeklyRevenue = normalizedTransactions
    .filter((item) => new Date(item.createdAt) >= dailyStart)
    .reduce((sum, item) => sum + (item.amount || 0), 0);
  const completedSessions = normalizedSessions.filter((item) => item.status === "Completed").length;
  const completionRate = completedSessions / Math.max(normalizedSessions.length, 1);
  const verifiedTutors = normalizedTutorProfiles.filter((item) => item.verificationStatus === "verified").length;
  const verificationRate = verifiedTutors / Math.max(normalizedTutorProfiles.length, 1);

  const comparativeMetrics = [
    { label: "Weekly new users", raw: weeklyUsers },
    { label: "Jobs created", raw: weeklyJobs },
    { label: "Gross revenue", raw: weeklyRevenue },
    { label: "Retention proxy", raw: completionRate * 100 },
    { label: "Verified tutors", raw: verificationRate * 100 },
  ];
  const comparativeMax = Math.max(...comparativeMetrics.map((item) => item.raw), 1);
  const reportCards = comparativeMetrics.map((item) => ({
    label: item.label,
    value: clampPercent((item.raw / comparativeMax) * 100),
  }));

  const reportSummary = [
    {
      label: "Weekly revenue",
      value: formatCurrency(weeklyRevenue),
      tone: weeklyRevenue ? "success" : "neutral",
      helper: "Real transaction volume across the last 7 days.",
    },
    {
      label: "Completed session rate",
      value: `${Math.round(completionRate * 100)}%`,
      tone: completionRate >= 0.6 ? "success" : "warning",
      helper: "Derived from session status distribution.",
    },
    {
      label: "Verified tutor share",
      value: `${Math.round(verificationRate * 100)}%`,
      tone: verificationRate >= 0.5 ? "sky" : "warning",
      helper: "Useful as a trust and supply quality benchmark.",
    },
  ];

  return { dashboardTrends, reportCards, reportSummary };
}

export async function getAdminFlagsData() {
  const rows = await getDerivedFlags(50);
  return rows.map((row) => ({
    ...row,
    createdAt: formatDateLabel(row.createdAt, "MMM d, HH:mm"),
  }));
}

export async function getAdminContentData() {
  await dbConnect();

  const [blogs, systemNotifications] = await Promise.all([
    Blog.find({}).sort({ updatedAt: -1 }).limit(20).lean(),
    Notification.find({ type: "System" }).sort({ createdAt: -1 }).limit(20).lean(),
  ]);

  const blogRows = normalize(blogs).map((blog) => ({
    id: blog._id,
    title: blog.title,
    type: "Blog post",
    owner: blog.author?.name || "Editorial team",
    status: blog.status === "draft" ? "Draft" : "Published",
    updatedAt: formatDateLabel(blog.updatedAt || blog.publishedAt, "MMM d"),
  }));

  const announcementRows = normalize(systemNotifications).map((notification) => ({
    id: notification._id,
    title: notification.content,
    type: "Announcement",
    owner: "System",
    status: notification.read ? "Read" : "Unread",
    updatedAt: formatDateLabel(notification.createdAt, "MMM d"),
  }));

  return { blogRows, announcementRows };
}

export async function getAdminSettingsData() {
  await dbConnect();

  const [roleDistribution, verificationDistribution, transactions, adminUsers, unreadNotifications, settings] = await Promise.all([
    User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
    TutorProfile.aggregate([{ $group: { _id: "$verificationStatus", count: { $sum: 1 } } }]),
    Transaction.find({}).select("amount platformFee status").lean(),
    User.countDocuments({ role: "admin" }),
    Notification.countDocuments({ read: false }),
    PlatformSetting.find({}).lean(),
  ]);

  const normalizedTransactions = normalize(transactions);
  const totalVolume = normalizedTransactions.reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
  const totalFees = normalizedTransactions.reduce((sum, transaction) => sum + (transaction.platformFee || 0), 0);
  const feeRate = totalVolume ? Math.round((totalFees / totalVolume) * 100) : 0;

  return {
    roleDistribution: normalize(roleDistribution).map((item) => ({
      title: item._id || "unknown",
      summary: `${item.count} users in this role`,
      items: [`Current count: ${item.count}`, "Backed by the live user collection"],
    })),
    verificationDistribution: normalize(verificationDistribution).map((item) => ({
      title: item._id || "not_submitted",
      summary: `${item.count} tutor profiles in this state`,
      items: [`Current count: ${item.count}`, "Backed by tutor profile verification data"],
    })),
    financeSnapshot: [
      `Total volume: ${formatCurrency(totalVolume)}`,
      `Platform fees: ${formatCurrency(totalFees)}`,
      `Effective fee rate: ${feeRate}%`,
    ],
    securitySnapshot: [
      `Admin accounts: ${adminUsers}`,
      `Unread notifications: ${unreadNotifications}`,
      `${normalize(settings).length} platform setting records available`,
    ],
  };
}
