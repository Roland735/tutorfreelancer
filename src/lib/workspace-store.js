import WorkspaceState from "@/models/WorkspaceState";

const DEFAULT_SETTINGS = {
  notifications: {
    emailMessages: true,
    pushApplications: true,
    bookingReminders: true,
    marketingUpdates: false,
  },
  privacy: {
    profileVisible: true,
    showUniversity: true,
    showLanguages: true,
  },
};

async function getOrCreateWorkspaceState(userId) {
  return WorkspaceState.findOneAndUpdate(
    { user: userId },
    {},
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );
}

export async function getWorkspacePreferences(userId) {
  const state = await getOrCreateWorkspaceState(userId);

  return {
    settings: state.settings || DEFAULT_SETTINGS,
    wallet: {
      methods: state.walletMethods || [],
      withdrawals: state.withdrawals || [],
      reviews: state.manualReviews || [],
      supportTickets: state.supportTickets || [],
    },
  };
}

export async function saveWorkspaceSettings(userId, nextSettings) {
  const state = await getOrCreateWorkspaceState(userId);

  state.settings = {
    notifications: {
      ...(state.settings?.notifications || DEFAULT_SETTINGS.notifications),
      ...(nextSettings.notifications || {}),
    },
    privacy: {
      ...(state.settings?.privacy || DEFAULT_SETTINGS.privacy),
      ...(nextSettings.privacy || {}),
    },
  };

  await state.save();
  return state.settings;
}

export async function createWithdrawalRequest(userId, amount) {
  const state = await getOrCreateWorkspaceState(userId);

  const request = {
    amount: Number(amount || 0),
    status: "Pending review",
    createdAt: new Date(),
  };

  state.withdrawals.unshift(request);
  await state.save();

  return state.withdrawals[0];
}

export async function createSupportTicket(userId, payload) {
  const state = await getOrCreateWorkspaceState(userId);

  const ticket = {
    subject: payload.subject || "Support request",
    category: payload.category || "General",
    message: payload.message || "",
    status: "Open",
    createdAt: new Date(),
  };

  state.supportTickets.unshift(ticket);
  await state.save();

  return state.supportTickets[0];
}

export async function saveManualReview(userId, payload) {
  const state = await getOrCreateWorkspaceState(userId);

  const review = {
    rating: Number(payload.rating || 5),
    comment: payload.comment || "",
    targetName: payload.targetName || "Tutor",
    createdAt: new Date(),
  };

  state.manualReviews.unshift(review);
  await state.save();

  return state.manualReviews[0];
}
