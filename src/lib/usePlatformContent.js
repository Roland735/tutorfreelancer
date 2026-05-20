"use client";

import { useEffect, useMemo, useState } from "react";

export function usePlatformContent(keys = []) {
  const normalizedKeys = useMemo(
    () => (Array.isArray(keys) ? keys.filter(Boolean) : [keys].filter(Boolean)),
    [keys]
  );
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(normalizedKeys.length > 0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!normalizedKeys.length) {
      setContent({});
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/platform-content?keys=${encodeURIComponent(normalizedKeys.join(","))}`,
          {
            cache: "no-store",
          }
        );
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.message || "Failed to load platform content.");
        }

        if (!cancelled) {
          setContent(payload.content || {});
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load platform content.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [normalizedKeys]);

  return { content, loading, error };
}
