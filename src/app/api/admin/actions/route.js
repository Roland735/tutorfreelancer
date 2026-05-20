import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-auth";
import AdminAuditLog from "@/models/AdminAuditLog";
import Blog from "@/models/Blog";
import Job from "@/models/Job";
import Message from "@/models/Message";
import Notification from "@/models/Notification";
import PlatformSetting from "@/models/PlatformSetting";
import Review from "@/models/Review";
import Transaction from "@/models/Transaction";
import TutorProfile from "@/models/TutorProfile";
import User from "@/models/User";

function jsonMessage(message, status = 200, extra = {}) {
  return NextResponse.json({ message, ...extra }, { status });
}

async function writeAudit(actor, entityType, entityId, action, details = "") {
  await AdminAuditLog.create({
    actor,
    entityType,
    entityId: String(entityId),
    action,
    details,
  });
}

export async function POST(request) {
  const session = await requireAdminSession();
  if (!session) {
    return jsonMessage("Unauthorized", 401);
  }

  try {
    await dbConnect();

    const { entity, action, id, payload = {} } = await request.json();
    if (!entity || !action || !id) {
      return jsonMessage("Entity, action, and id are required.", 400);
    }

    if (entity === "user") {
      const user = await User.findById(id);
      if (!user) {
        return jsonMessage("User not found.", 404);
      }

      if (action === "setRole") {
        user.role = payload.role || user.role;
      } else if (action === "setStatus") {
        const nextStatus = payload.status || "active";
        user.accountStatus = nextStatus;
        user.suspendedReason = nextStatus === "suspended" ? payload.reason || "" : "";
        user.suspendedAt = nextStatus === "suspended" ? new Date() : null;
      } else if (action === "setVerification") {
        user.isVerified = Boolean(payload.isVerified);
      } else if (action === "resetAccess") {
        user.lastLogin = new Date(0);
      } else if (action === "delete") {
        user.accountStatus = "deleted";
      } else {
        return jsonMessage("Unsupported user action.", 400);
      }

      await user.save();
      await writeAudit(session.user.id, entity, id, action, JSON.stringify(payload));
      return jsonMessage("User updated.");
    }

    if (entity === "tutor") {
      const tutor = await TutorProfile.findById(id);
      if (!tutor) {
        return jsonMessage("Tutor profile not found.", 404);
      }

      if (action === "approve") {
        tutor.verificationStatus = "verified";
        tutor.moderationStatus = "clear";
      } else if (action === "requestChanges") {
        tutor.moderationStatus = "changes_requested";
      } else if (action === "reject") {
        tutor.moderationStatus = "rejected";
        tutor.verificationStatus = "not_submitted";
      } else if (action === "setFeatured") {
        tutor.isFeatured = Boolean(payload.isFeatured);
      } else {
        return jsonMessage("Unsupported tutor action.", 400);
      }

      if (payload.note) {
        tutor.moderationNotes = [...(tutor.moderationNotes || []), payload.note];
      }
      if (payload.riskLevel) {
        tutor.riskLevel = payload.riskLevel;
      }

      await tutor.save();
      await writeAudit(session.user.id, entity, id, action, JSON.stringify(payload));
      return jsonMessage("Tutor profile updated.");
    }

    if (entity === "job") {
      const job = await Job.findById(id);
      if (!job) {
        return jsonMessage("Job not found.", 404);
      }

      if (action === "approve") {
        job.moderationStatus = "visible";
      } else if (action === "hide") {
        job.moderationStatus = "hidden";
      } else if (action === "flag") {
        job.moderationStatus = "under_review";
      } else if (action === "remove") {
        job.moderationStatus = "removed";
        job.status = "Cancelled";
      } else if (action === "edit") {
        job.title = payload.title || job.title;
        job.description = payload.description || job.description;
      } else {
        return jsonMessage("Unsupported job action.", 400);
      }

      if (payload.note) {
        job.moderationNotes = [...(job.moderationNotes || []), payload.note];
      }

      await job.save();
      await writeAudit(session.user.id, entity, id, action, JSON.stringify(payload));
      return jsonMessage("Job updated.");
    }

    if (entity === "review") {
      const review = await Review.findById(id);
      if (!review) {
        return jsonMessage("Review not found.", 404);
      }

      if (action === "approve") {
        review.moderationStatus = "approved";
        review.moderationReason = "";
      } else if (action === "hide") {
        review.moderationStatus = "hidden";
        review.moderationReason = payload.reason || "Hidden by admin";
      } else if (action === "flag") {
        review.moderationStatus = "flagged";
        review.moderationReason = payload.reason || "Flagged for review";
      } else {
        return jsonMessage("Unsupported review action.", 400);
      }

      await review.save();
      await writeAudit(session.user.id, entity, id, action, JSON.stringify(payload));
      return jsonMessage("Review updated.");
    }

    if (entity === "payment") {
      const payment = await Transaction.findById(id);
      if (!payment) {
        return jsonMessage("Payment not found.", 404);
      }

      if (action === "markProcessed") {
        payment.payoutStatus = "processed";
        if (payment.status === "Pending") {
          payment.status = "Completed";
        }
      } else if (action === "markReview") {
        payment.payoutStatus = "review";
      } else {
        return jsonMessage("Unsupported payment action.", 400);
      }

      await payment.save();
      await writeAudit(session.user.id, entity, id, action, JSON.stringify(payload));
      return jsonMessage("Payment updated.");
    }

    if (entity === "message") {
      const message = await Message.findById(id);
      if (!message) {
        return jsonMessage("Message not found.", 404);
      }

      if (action === "flag") {
        message.moderationStatus = "flagged";
      } else if (action === "escalate") {
        message.moderationStatus = "escalated";
      } else if (action === "clear") {
        message.moderationStatus = "clean";
      } else {
        return jsonMessage("Unsupported message action.", 400);
      }

      await message.save();
      await writeAudit(session.user.id, entity, id, action, JSON.stringify(payload));
      return jsonMessage("Message updated.");
    }

    if (entity === "content") {
      const blog = await Blog.findById(id);
      if (blog) {
        if (action === "publish") {
          blog.status = "published";
        } else if (action === "draft") {
          blog.status = "draft";
        } else {
          return jsonMessage("Unsupported content action.", 400);
        }

        await blog.save();
        await writeAudit(session.user.id, entity, id, action, JSON.stringify(payload));
        return jsonMessage("Content updated.");
      }

      const notification = await Notification.findById(id);
      if (!notification) {
        return jsonMessage("Content item not found.", 404);
      }

      if (action === "markRead") {
        notification.read = true;
      } else if (action === "markUnread") {
        notification.read = false;
      } else {
        return jsonMessage("Unsupported announcement action.", 400);
      }

      await notification.save();
      await writeAudit(session.user.id, entity, id, action, JSON.stringify(payload));
      return jsonMessage("Announcement updated.");
    }

    if (entity === "platformSetting") {
      const key = String(id);
      const setting = await PlatformSetting.findOneAndUpdate(
        { key },
        { $set: { value: payload.value || {} } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      await writeAudit(session.user.id, entity, key, action, JSON.stringify(payload));
      return jsonMessage("Settings updated.", 200, { setting });
    }

    return jsonMessage("Unsupported entity.", 400);
  } catch (error) {
    console.error("Admin action error:", error);
    return jsonMessage("Failed to process admin action.", 500);
  }
}
