import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RoleOptionCard({ option, icon: Icon, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      className={cn(
        "group relative w-full overflow-hidden rounded-[1.75rem] border p-5 text-left transition duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
        selected
          ? "border-primary/40 bg-[linear-gradient(160deg,rgba(59,130,246,0.18),rgba(16,185,129,0.14))] shadow-[0_22px_60px_rgba(2,6,23,0.35)]"
          : "border-white/10 bg-white/[0.04] hover:border-sky-400/35 hover:bg-white/[0.07]"
      )}
      aria-pressed={selected}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.12),_transparent_30%)] opacity-0 transition group-hover:opacity-100" />
      <div className="relative flex items-start gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition",
            selected
              ? "bg-gradient-to-br from-primary via-sky-400 to-emerald-300 text-slate-950"
              : "bg-slate-900/80 text-sky-200"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-white">{option.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-300">{option.description}</p>
            </div>
            <CheckCircle2
              className={cn(
                "h-5 w-5 shrink-0 transition",
                selected ? "text-emerald-300" : "text-slate-600"
              )}
            />
          </div>
          <div className="mt-4 inline-flex rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs font-medium text-sky-100/80">
            {option.badge}
          </div>
        </div>
      </div>
    </button>
  );
}
