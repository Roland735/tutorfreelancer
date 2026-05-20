import { AdminLoadingState } from "@/components/admin/AdminUI";

export default function Loading() {
  return (
    <div className="space-y-6">
      <AdminLoadingState
        title="Loading admin workspace..."
        description="Syncing user health, moderation queues, payments, and platform analytics."
      />
      <AdminLoadingState
        title="Preparing secure operations panels..."
        description="Rendering role-safe navigation, cards, filters, and charts for review."
      />
    </div>
  );
}
