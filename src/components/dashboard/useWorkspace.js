"use client";

import { useCallback, useEffect, useState } from "react";

export function useWorkspace(query = "") {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/workspace${query ? `?${query}` : ""}`, {
        cache: "no-store",
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Failed to load workspace data.");
      }

      setData(payload);
    } catch (err) {
      setError(err.message || "Failed to load workspace data.");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}

export async function mutateWorkspace(action, payload = {}) {
  const response = await fetch("/api/workspace", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action, payload }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update workspace.");
  }

  return data;
}
