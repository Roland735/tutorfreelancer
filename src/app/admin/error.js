"use client";

import { AdminErrorState } from "@/components/admin/AdminUI";

export default function Error({ reset }) {
  return (
    <div className="space-y-6">
      <AdminErrorState
        title="The admin workspace hit an unexpected error"
        description="This starter UI is ready for backend integration, but a route or service failed while loading."
      />
      <button
        type="button"
        onClick={reset}
        className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.08]"
      >
        Reload admin route
      </button>
    </div>
  );
}
