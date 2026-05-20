import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Job from "@/models/Job";
import Message from "@/models/Message";
import Notification from "@/models/Notification";
import Review from "@/models/Review";
import Session from "@/models/Session";
import Transaction from "@/models/Transaction";
import TutorProfile from "@/models/TutorProfile";
import {
  createSupportTicket,
  createWithdrawalRequest,
  getWorkspacePreferences,
  saveManualReview,
  saveWorkspaceSettings,
} from "@/lib/workspace-store";
import { getPlatformContent } from "@/lib/platform-content";

function conversationPreviewMap(messages, currentUserId) {
  const conversations = new Map();

  messages.forEach((message) => {
    const otherUser =
      String(message.sender?._id) === currentUserId ? message.receiver : message.sender;

    if (!otherUser?._id) {
      return;
    }

    const existing = conversations.get(message.conversationId);
    if (existing) {
      return;
    }

    conversations.set(message.conversationId, {
      id: message.conversationId,
      participant: {
        id: String(otherUser._id),
        name: otherUser.name,
        avatar: otherUser.avatar || "",
        university: otherUser.university || "",
      },
      lastMessage: message.content,
      timestamp: message.createdAt,
      unreadCount: 0,
    });
  });

  return conversations;
}

function buildActivity({ postedJobs, sentApplications, notifications, sessions }) {
  const items = [];

  postedJobs.slice(0, 2).forEach((job) => {
    items.push({
      id: `job-${job._id}`,
      type: "job",
      title: "Tutoring request posted",
      description: job.title,
      createdAt: job.createdAt,
    });
  });

  sentApplications.slice(0, 2).forEach((application) => {
    items.push({
      id: `application-${application.jobId}`,
      type: "application",
      title: `Application ${application.status}`,
      description: application.jobTitle,
      createdAt: application.appliedAt,
    });
  });

  notifications.slice(0, 2).forEach((notification) => {
    items.push({
      id: `notification-${notification._id}`,
      type: "notification",
      title: notification.type,
      description: notification.content,
      createdAt: notification.createdAt,
    });
  });

  sessions.slice(0, 2).forEach((session) => {
    items.push({
      id: `session-${session._id}`,
      type: "session",
      title: session.status === "Scheduled" ? "Upcoming session" : "Session updated",
      description: session.job?.title || "Tutoring session",
      createdAt: session.date,
    });
  });

  return items
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const userId = session.user.id;
    const url = new URL(request.url);
    const activeConversationId = url.searchParams.get("conversationId");

    const [
      user,
      tutorProfile,
      postedJobs,
      openJobs,
      appliedJobs,
      rawMessages,
      notifications,
      rawSessions,
      receivedTransactions,
      paidTransactions,
      receivedReviews,
      featuredTutors,
    ] = await Promise.all([
      User.findById(userId).lean(),
      TutorProfile.findOne({ user: userId }).populate("user", "name avatar university").lean(),
      Job.find({ postedBy: userId }).sort({ createdAt: -1 }).limit(8).lean(),
      Job.find({ status: "Open", postedBy: { $ne: userId } })
        .populate("postedBy", "name avatar university")
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
      Job.find({ "applicants.user": userId })
        .populate("postedBy", "name avatar university")
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
      Message.find({
        $or: [{ sender: userId }, { receiver: userId }],
      })
        .populate("sender", "name avatar university")
        .populate("receiver", "name avatar university")
        .sort({ createdAt: -1 })
        .limit(80)
        .lean(),
      Notification.find({ recipient: userId }).sort({ createdAt: -1 }).limit(20).lean(),
      Session.find({
        $or: [{ student: userId }, { tutor: userId }],
      })
        .populate("job", "title category sessionType")
        .populate("student", "name avatar university")
        .populate("tutor", "name avatar university")
        .sort({ date: 1 })
        .limit(20)
        .lean(),
      Transaction.find({ receiver: userId }).sort({ createdAt: -1 }).limit(12).lean(),
      Transaction.find({ payer: userId }).sort({ createdAt: -1 }).limit(12).lean(),
      Review.find({ reviewee: userId })
        .populate("reviewer", "name avatar university")
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
      TutorProfile.find({ user: { $ne: userId } })
        .populate("user", "name avatar university major location")
        .sort({ isFeatured: -1, "stats.rating": -1 })
        .limit(4)
        .lean(),
    ]);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const [{ settings, wallet }, helpContent] = await Promise.all([
      getWorkspacePreferences(userId),
      getPlatformContent("page.help-support"),
    ]);
    const currentUserId = String(userId);

    const conversationMap = conversationPreviewMap(rawMessages, currentUserId);
    rawMessages.forEach((message) => {
      if (String(message.receiver?._id || message.receiver) === currentUserId && !message.read) {
        const preview = conversationMap.get(message.conversationId);
        if (preview) {
          preview.unreadCount += 1;
        }
      }
    });

    const conversations = Array.from(conversationMap.values()).sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    const selectedConversationId = activeConversationId || conversations[0]?.id || null;
    const thread = selectedConversationId
      ? rawMessages
        .filter((message) => message.conversationId === selectedConversationId)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map((message) => ({
          id: String(message._id),
          senderId: String(message.sender?._id || message.sender),
          senderName: message.sender?.name || "User",
          content: message.content,
          createdAt: message.createdAt,
          read: message.read,
        }))
      : [];

    const unreadMessages = rawMessages.filter(
      (message) => String(message.receiver?._id || message.receiver) === currentUserId && !message.read
    ).length;

    const sentApplications = appliedJobs.map((job) => {
      const application = job.applicants.find((item) => String(item.user) === currentUserId);

      return {
        jobId: String(job._id),
        jobTitle: job.title,
        status: application?.status || "pending",
        bidAmount: application?.bidAmount || job.budget?.min || 0,
        appliedAt: application?.appliedAt || job.createdAt,
        requesterName: job.postedBy?.name || "Student",
        sessionType: job.sessionType,
        city: job.location?.city || "",
      };
    });

    const receivedApplications = postedJobs.flatMap((job) =>
      (job.applicants || []).map((application) => ({
        id: `${job._id}-${application._id}`,
        jobId: String(job._id),
        jobTitle: job.title,
        applicantId: String(application.user),
        status: application.status || "pending",
        bidAmount: application.bidAmount || job.budget?.min || 0,
        appliedAt: application.appliedAt,
      }))
    );

    const upcomingSessions = rawSessions.filter((item) => item.status === "Scheduled");
    const historySessions = rawSessions.filter((item) => item.status !== "Scheduled");

    const totalEarnings = receivedTransactions.reduce(
      (sum, transaction) => sum + Number(transaction.netPayout || 0),
      0
    );
    const pendingBalance = receivedTransactions
      .filter((transaction) => transaction.status === "Pending")
      .reduce((sum, transaction) => sum + Number(transaction.netPayout || 0), 0);

    const averageRating = receivedReviews.length
      ? receivedReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
      receivedReviews.length
      : 0;

    const overview = {
      stats: {
        jobs: openJobs.length,
        earnings: totalEarnings,
        bookings: upcomingSessions.length,
        unreadMessages,
      },
      quickActions: [
        { label: "Post a tutoring request", href: "/jobs/post" },
        { label: "Update profile", href: "/profile" },
        { label: "Reply to messages", href: "/messages" },
        { label: "Review notifications", href: "/notifications" },
      ],
      recentActivity: buildActivity({
        postedJobs,
        sentApplications,
        notifications,
        sessions: rawSessions,
      }),
      upcomingSessions: upcomingSessions.slice(0, 4),
      recommendedJobs: openJobs.slice(0, 4),
      recommendedTutors: featuredTutors,
      student: {
        stats: {
          jobsPosted: postedJobs.length,
          applicationsReceived: receivedApplications.length,
          upcomingBookings: upcomingSessions.filter((item) => String(item.student?._id) === currentUserId).length,
          unreadMessages,
        },
        activeRequests: postedJobs.slice(0, 4),
        incomingApplications: receivedApplications.slice(0, 4),
      },
      tutor: {
        stats: {
          jobsApplied: sentApplications.length,
          upcomingSessions: upcomingSessions.filter((item) => String(item.tutor?._id) === currentUserId).length,
          totalEarnings,
          averageRating,
        },
        recentApplications: sentApplications.slice(0, 4),
        payoutPreview: receivedTransactions.slice(0, 4),
      },
    };

    return NextResponse.json({
      profileSummary: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        university: user.university || "",
        major: user.major || "",
        city: user.location?.city || "",
        languages: user.languages || [],
      },
      overview,
      applications: {
        sent: sentApplications,
        received: receivedApplications,
      },
      messages: {
        conversations,
        activeConversationId: selectedConversationId,
        thread,
      },
      notifications: {
        unreadCount: notifications.filter((item) => !item.read).length,
        items: notifications,
      },
      bookings: {
        upcoming: upcomingSessions,
        history: historySessions,
      },
      earnings: {
        totalEarnings,
        pendingBalance,
        paidOut: receivedTransactions
          .filter((transaction) => transaction.status === "Completed")
          .reduce((sum, transaction) => sum + Number(transaction.netPayout || 0), 0),
        transactions: receivedTransactions,
        paymentsMade: paidTransactions,
      },
      reviews: {
        averageRating,
        total: receivedReviews.length,
        items: receivedReviews,
        manual: (wallet.reviews || []).map((review) => ({
          id: String(review._id),
          rating: review.rating,
          comment: review.comment,
          targetName: review.targetName,
          createdAt: review.createdAt,
        })),
      },
      wallet: {
        availableBalance: Math.max(totalEarnings - pendingBalance, 0),
        pendingBalance,
        verificationStatus: wallet.methods?.some((method) => method.status === "Verified")
          ? "Verified payout method ready"
          : "Verification pending",
        methods: (wallet.methods || []).map((method) => ({
          id: String(method._id),
          type: method.type,
          label: method.label,
          details: method.details,
          status: method.status,
          isPrimary: method.isPrimary,
        })),
        withdrawals: (wallet.withdrawals || []).map((withdrawal) => ({
          id: String(withdrawal._id),
          amount: withdrawal.amount,
          status: withdrawal.status,
          createdAt: withdrawal.createdAt,
        })),
        transactions: receivedTransactions.slice(0, 6),
      },
      settings,
      help: {
        categories: helpContent?.categories || [],
        faqs: helpContent?.faqs || [],
        guidelines: helpContent?.guidelines || [],
        tickets: (wallet.supportTickets || []).map((ticket) => ({
          id: String(ticket._id),
          subject: ticket.subject,
          category: ticket.category,
          message: ticket.message,
          status: ticket.status,
          createdAt: ticket.createdAt,
        })),
      },
      tutorProfile,
    });
  } catch (error) {
    console.error("Error fetching workspace:", error);
    return NextResponse.json({ message: "Failed to load workspace data." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { action, payload = {} } = body;
    const userId = session.user.id;

    if (action === "sendMessage") {
      if (!payload.receiverId || !payload.content?.trim()) {
        return NextResponse.json({ message: "Receiver and message content are required." }, { status: 400 });
      }

      const conversationId =
        payload.conversationId ||
        [String(userId), String(payload.receiverId)].sort().join("_");

      const message = await Message.create({
        conversationId,
        sender: userId,
        receiver: payload.receiverId,
        content: payload.content.trim(),
      });

      return NextResponse.json({ message: "Message sent.", id: String(message._id) });
    }

    if (action === "markNotificationRead") {
      if (payload.notificationId === "all") {
        await Notification.updateMany({ recipient: userId, read: false }, { read: true });
      } else if (payload.notificationId) {
        await Notification.updateOne(
          { _id: payload.notificationId, recipient: userId },
          { read: true }
        );
      }

      return NextResponse.json({ message: "Notifications updated." });
    }

    if (action === "saveSettings") {
      const settings = await saveWorkspaceSettings(userId, payload);
      return NextResponse.json({ message: "Settings saved.", settings });
    }

    if (action === "submitSupport") {
      const ticket = await createSupportTicket(userId, payload);
      return NextResponse.json({ message: "Support request submitted.", ticket });
    }

    if (action === "withdrawFunds") {
      const requestItem = await createWithdrawalRequest(userId, payload.amount || 0);
      return NextResponse.json({ message: "Withdrawal request created.", request: requestItem });
    }

    if (action === "saveReview") {
      const manualReview = await saveManualReview(userId, payload);
      return NextResponse.json({ message: "Review submitted.", review: manualReview });
    }

    if (action === "manageApplication") {
      const { jobId, applicantId, decision } = payload;

      if (!jobId || !applicantId || !decision) {
        return NextResponse.json({ message: "Job, applicant, and decision are required." }, { status: 400 });
      }

      const job = await Job.findOne({ _id: jobId, postedBy: userId });
      if (!job) {
        return NextResponse.json({ message: "Job not found." }, { status: 404 });
      }

      const application = job.applicants.find((item) => String(item.user) === String(applicantId));
      if (!application) {
        return NextResponse.json({ message: "Application not found." }, { status: 404 });
      }

      application.status = decision;
      await job.save();

      return NextResponse.json({ message: "Application updated." });
    }

    return NextResponse.json({ message: "Unsupported action." }, { status: 400 });
  } catch (error) {
    console.error("Error mutating workspace:", error);
    return NextResponse.json({ message: "Failed to update workspace." }, { status: 500 });
  }
}
