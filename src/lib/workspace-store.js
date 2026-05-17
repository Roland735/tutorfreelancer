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

const DEFAULT_WALLET = {
  methods: [
    {
      id: "ecocash-primary",
      type: "EcoCash",
      label: "EcoCash",
      details: "077 123 4567",
      status: "Verification pending",
      isPrimary: true,
    },
    {
      id: "bank-fcb",
      type: "Bank",
      label: "First Capital Bank",
      details: "Account ending 4281",
      status: "Verified",
      isPrimary: false,
    },
  ],
  withdrawals: [],
  reviews: [],
  supportTickets: [],
};

function getStore() {
  if (!globalThis.__workspaceStore) {
    globalThis.__workspaceStore = {
      settingsByUser: {},
      walletByUser: {},
    };
  }

  return globalThis.__workspaceStore;
}

export function getWorkspacePreferences(userId) {
  const store = getStore();

  if (!store.settingsByUser[userId]) {
    store.settingsByUser[userId] = structuredClone(DEFAULT_SETTINGS);
  }

  if (!store.walletByUser[userId]) {
    store.walletByUser[userId] = structuredClone(DEFAULT_WALLET);
  }

  return {
    settings: store.settingsByUser[userId],
    wallet: store.walletByUser[userId],
  };
}

export function saveWorkspaceSettings(userId, nextSettings) {
  const store = getStore();
  const { settings } = getWorkspacePreferences(userId);

  store.settingsByUser[userId] = {
    notifications: {
      ...settings.notifications,
      ...(nextSettings.notifications || {}),
    },
    privacy: {
      ...settings.privacy,
      ...(nextSettings.privacy || {}),
    },
  };

  return store.settingsByUser[userId];
}

export function createWithdrawalRequest(userId, amount) {
  const store = getStore();
  const { wallet } = getWorkspacePreferences(userId);

  const request = {
    id: `withdrawal-${Date.now()}`,
    amount: Number(amount),
    status: "Pending review",
    createdAt: new Date().toISOString(),
  };

  wallet.withdrawals.unshift(request);
  store.walletByUser[userId] = wallet;

  return request;
}

export function createSupportTicket(userId, payload) {
  const store = getStore();
  const { wallet } = getWorkspacePreferences(userId);

  const ticket = {
    id: `ticket-${Date.now()}`,
    subject: payload.subject || "Support request",
    category: payload.category || "General",
    message: payload.message || "",
    status: "Open",
    createdAt: new Date().toISOString(),
  };

  wallet.supportTickets.unshift(ticket);
  store.walletByUser[userId] = wallet;

  return ticket;
}

export function saveManualReview(userId, payload) {
  const store = getStore();
  const { wallet } = getWorkspacePreferences(userId);

  const review = {
    id: `manual-review-${Date.now()}`,
    rating: Number(payload.rating || 5),
    comment: payload.comment || "",
    targetName: payload.targetName || "Tutor",
    createdAt: new Date().toISOString(),
  };

  wallet.reviews.unshift(review);
  store.walletByUser[userId] = wallet;

  return review;
}
