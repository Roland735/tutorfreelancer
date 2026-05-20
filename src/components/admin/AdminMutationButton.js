"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function AdminMutationButton({
  entity,
  action,
  id,
  payload,
  children,
  className,
  variant,
  onSuccess,
  confirmText,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (confirmText && !window.confirm(confirmText)) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entity, action, id, payload }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Admin action failed.");
      }

      if (typeof onSuccess === "function") {
        onSuccess(result);
      }

      router.refresh();
    } catch (error) {
      window.alert(error.message || "Admin action failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button type="button" variant={variant} className={className} onClick={handleClick} disabled={loading}>
      {loading ? "Working..." : children}
    </Button>
  );
}
