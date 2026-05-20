import mongoose from "mongoose";

const WalletMethodSchema = new mongoose.Schema(
  {
    type: { type: String, default: "" },
    label: { type: String, default: "" },
    details: { type: String, default: "" },
    status: { type: String, default: "Pending review" },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: true }
);

const WithdrawalSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, default: 0 },
    status: { type: String, default: "Pending review" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const ManualReviewSchema = new mongoose.Schema(
  {
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    comment: { type: String, default: "" },
    targetName: { type: String, default: "Tutor" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const SupportTicketSchema = new mongoose.Schema(
  {
    subject: { type: String, default: "Support request" },
    category: { type: String, default: "General" },
    message: { type: String, default: "" },
    status: { type: String, default: "Open" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const WorkspaceStateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    settings: {
      notifications: {
        emailMessages: { type: Boolean, default: true },
        pushApplications: { type: Boolean, default: true },
        bookingReminders: { type: Boolean, default: true },
        marketingUpdates: { type: Boolean, default: false },
      },
      privacy: {
        profileVisible: { type: Boolean, default: true },
        showUniversity: { type: Boolean, default: true },
        showLanguages: { type: Boolean, default: true },
      },
    },
    walletMethods: {
      type: [WalletMethodSchema],
      default: [
        {
          type: "EcoCash",
          label: "EcoCash",
          details: "077 123 4567",
          status: "Verification pending",
          isPrimary: true,
        },
        {
          type: "Bank",
          label: "First Capital Bank",
          details: "Account ending 4281",
          status: "Verified",
          isPrimary: false,
        },
      ],
    },
    withdrawals: {
      type: [WithdrawalSchema],
      default: [],
    },
    manualReviews: {
      type: [ManualReviewSchema],
      default: [],
    },
    supportTickets: {
      type: [SupportTicketSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.WorkspaceState ||
  mongoose.model("WorkspaceState", WorkspaceStateSchema);
