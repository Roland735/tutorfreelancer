"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminActionDialog({
  buttonLabel = "Review action",
  title,
  description,
  confirmLabel = "Confirm",
  tone = "neutral",
}) {
  const [open, setOpen] = useState(false);

  const toneClass =
    tone === "danger"
      ? "border-rose-400/15 bg-rose-500/[0.08] text-rose-100"
      : tone === "warning"
        ? "border-amber-400/15 bg-amber-500/[0.08] text-amber-100"
        : "border-white/10 bg-white/[0.04] text-slate-100";

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
        onClick={() => setOpen(true)}
      >
        {buttonLabel}
      </Button>

      {open ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Close dialog overlay"
          />
          <div className="relative w-full max-w-lg rounded-[2rem] border border-white/10 bg-slate-950 p-6 shadow-[0_30px_100px_rgba(2,6,23,0.8)]">
            <div className="flex items-start justify-between gap-4">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${toneClass}`}>
                <AlertTriangle className="h-5 w-5" />
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5">
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.03] p-4 text-sm text-slate-400">
              Backend hooks can connect this modal to confirmation flows, moderation notes, and audited admin actions.
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                className="rounded-full text-slate-300 hover:bg-white/[0.04] hover:text-white"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="rounded-full bg-white text-slate-950 hover:bg-emerald-300"
                onClick={() => setOpen(false)}
              >
                {confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
