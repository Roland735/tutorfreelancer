const puzzlePieces = [
  {
    id: "focus",
    label: "F",
    title: "Focus",
    startX: "-108px",
    startY: "84px",
    rotate: "-18deg",
    delay: "0s",
    gradient: "from-emerald-300 via-teal-300 to-cyan-300",
  },
  {
    id: "plan",
    label: "P",
    title: "Plan",
    startX: "124px",
    startY: "-78px",
    rotate: "16deg",
    delay: "0.22s",
    gradient: "from-cyan-300 via-sky-300 to-blue-300",
  },
  {
    id: "coach",
    label: "C",
    title: "Coach",
    startX: "-96px",
    startY: "-112px",
    rotate: "-12deg",
    delay: "0.44s",
    gradient: "from-lime-300 via-emerald-300 to-teal-300",
  },
  {
    id: "match",
    label: "M",
    title: "Match",
    startX: "112px",
    startY: "92px",
    rotate: "12deg",
    delay: "0.66s",
    gradient: "from-amber-200 via-emerald-300 to-teal-300",
  },
  {
    id: "sync",
    label: "S",
    title: "Sync",
    startX: "0px",
    startY: "-132px",
    rotate: "-8deg",
    delay: "0.88s",
    gradient: "from-teal-200 via-cyan-300 to-sky-300",
  },
  {
    id: "learn",
    label: "L",
    title: "Learn",
    startX: "-128px",
    startY: "0px",
    rotate: "18deg",
    delay: "1.1s",
    gradient: "from-fuchsia-200 via-cyan-300 to-emerald-300",
  },
  {
    id: "insight",
    label: "I",
    title: "Insight",
    startX: "136px",
    startY: "0px",
    rotate: "-18deg",
    delay: "1.32s",
    gradient: "from-sky-200 via-cyan-300 to-emerald-300",
  },
  {
    id: "momentum",
    label: "M",
    title: "Momentum",
    startX: "-72px",
    startY: "128px",
    rotate: "-14deg",
    delay: "1.54s",
    gradient: "from-emerald-200 via-teal-300 to-cyan-300",
  },
  {
    id: "win",
    label: "W",
    title: "Win",
    startX: "94px",
    startY: "118px",
    rotate: "14deg",
    delay: "1.76s",
    gradient: "from-cyan-200 via-emerald-300 to-lime-300",
  },
];

const pulseCards = [
  "Matching learners with the best-fit tutor workflow",
  "Loading sessions, jobs, reviews, and recent momentum",
  "Warming up charts, messages, and smart recommendations",
  "Preparing your next high-conversion actions",
];

export default function WorkspaceLoading() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-[0_24px_100px_rgba(15,23,42,0.55)] backdrop-blur">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.18),transparent_30%)]" />
        <div className="relative grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-200">
              Workspace Loading
            </div>
            <div className="space-y-3">
              <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Your dashboard is assembling itself like a smart puzzle.
              </h2>
              <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
                Modules glide into place, connect, and light up so the wait feels intentional instead of static.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                Self-solving tiles
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                Designed motion loop
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                Dashboard preview shimmer
              </span>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="workspace-loader-orbit workspace-loader-orbit-a" />
            <div className="workspace-loader-orbit workspace-loader-orbit-b" />
            <div className="workspace-loader-frame relative grid h-[320px] w-full max-w-[380px] place-items-center rounded-[2rem] border border-white/10 bg-slate-950/65 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="workspace-loader-grid relative grid h-[272px] w-[272px] grid-cols-3 gap-3 rounded-[28px] border border-white/10 bg-slate-900/80 p-3 shadow-[0_20px_80px_rgba(8,47,73,0.35)]">
                {puzzlePieces.map((piece) => (
                  <div
                    key={piece.id}
                    className="workspace-loader-piece-wrapper"
                    style={{
                      "--piece-start-x": piece.startX,
                      "--piece-start-y": piece.startY,
                      "--piece-rotate": piece.rotate,
                      "--piece-delay": piece.delay,
                    }}
                  >
                    <div
                      className={`workspace-loader-piece flex h-full w-full flex-col justify-between rounded-[22px] border border-white/15 bg-gradient-to-br ${piece.gradient} p-3 text-slate-950 shadow-[0_10px_30px_rgba(8,47,73,0.25)]`}
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-900/70">
                        {piece.title}
                      </span>
                      <span className="text-3xl font-black tracking-tight">{piece.label}</span>
                    </div>
                  </div>
                ))}
                <div className="workspace-loader-scanline" />
              </div>
              <div className="mt-5 flex w-full items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-300">
                <div className="workspace-loader-progress-track h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div className="workspace-loader-progress-bar h-full rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-400" />
                </div>
                <span className="min-w-fit font-medium text-emerald-200">Solving interface</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {pulseCards.map((card) => (
          <div
            key={card}
            className="workspace-loader-surface relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-5"
          >
            <div className="workspace-loader-sheen" />
            <div className="relative space-y-4">
              <div className="h-2 w-16 rounded-full bg-emerald-300/70" />
              <div className="space-y-2">
                <div className="h-4 w-3/4 rounded-full bg-white/10" />
                <div className="h-4 w-full rounded-full bg-white/10" />
                <div className="h-4 w-2/3 rounded-full bg-white/10" />
              </div>
              <p className="text-sm leading-6 text-slate-300">{card}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="workspace-loader-surface relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/60 p-6"
          >
            <div className="workspace-loader-sheen" />
            <div className="relative space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-28 rounded-full bg-white/10" />
                  <div className="h-8 w-52 rounded-full bg-white/10" />
                </div>
                <div className="h-10 w-24 rounded-full bg-emerald-300/20" />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((__, blockIndex) => (
                  <div
                    key={blockIndex}
                    className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4"
                  >
                    <div className="space-y-3">
                      <div className="h-3 w-14 rounded-full bg-white/10" />
                      <div className="h-10 w-full rounded-2xl bg-white/10" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-[180px] rounded-[1.75rem] bg-white/[0.04]" />
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .workspace-loader-frame::before {
          content: "";
          position: absolute;
          inset: 18px;
          border-radius: 26px;
          border: 1px solid rgba(148, 163, 184, 0.08);
          pointer-events: none;
        }

        .workspace-loader-grid::before {
          content: "";
          position: absolute;
          inset: 14px;
          border-radius: 22px;
          border: 1px dashed rgba(148, 163, 184, 0.18);
          pointer-events: none;
        }

        .workspace-loader-piece-wrapper {
          position: relative;
          z-index: 1;
        }

        .workspace-loader-piece {
          animation: puzzle-settle 7.2s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
          animation-delay: var(--piece-delay);
          transform-origin: center;
        }

        .workspace-loader-piece::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.32), transparent 45%);
          opacity: 0.45;
          pointer-events: none;
        }

        .workspace-loader-progress-bar {
          animation: solve-progress 2.8s ease-in-out infinite;
          transform-origin: left center;
        }

        .workspace-loader-scanline {
          position: absolute;
          inset: 14px;
          border-radius: 20px;
          background: linear-gradient(180deg, transparent, rgba(110, 231, 183, 0.12), transparent);
          animation: scan-grid 3s ease-in-out infinite;
          pointer-events: none;
        }

        .workspace-loader-orbit {
          position: absolute;
          border-radius: 9999px;
          border: 1px solid rgba(110, 231, 183, 0.18);
          pointer-events: none;
        }

        .workspace-loader-orbit-a {
          width: 320px;
          height: 320px;
          animation: orbit-spin 14s linear infinite;
        }

        .workspace-loader-orbit-b {
          width: 380px;
          height: 240px;
          border-color: rgba(125, 211, 252, 0.16);
          animation: orbit-spin-reverse 18s linear infinite;
        }

        .workspace-loader-surface {
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .workspace-loader-sheen {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            110deg,
            transparent 0%,
            transparent 35%,
            rgba(255, 255, 255, 0.06) 48%,
            transparent 60%,
            transparent 100%
          );
          transform: translateX(-100%);
          animation: loader-sheen 2.8s ease-in-out infinite;
        }

        @keyframes puzzle-settle {
          0%,
          10% {
            opacity: 0;
            transform: translate(var(--piece-start-x), var(--piece-start-y))
              rotate(var(--piece-rotate)) scale(0.42);
            filter: blur(12px) saturate(0.8);
          }
          22%,
          64% {
            opacity: 1;
            transform: translate(0, 0) rotate(0deg) scale(1);
            filter: blur(0) saturate(1);
          }
          72% {
            opacity: 1;
            transform: translate(0, 0) rotate(0deg) scale(1.05);
            box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.14), 0 16px 38px rgba(6, 182, 212, 0.28);
          }
          86%,
          100% {
            opacity: 0;
            transform: translate(var(--piece-start-x), var(--piece-start-y))
              rotate(var(--piece-rotate)) scale(0.64);
            filter: blur(10px) saturate(0.85);
          }
        }

        @keyframes loader-sheen {
          0% {
            transform: translateX(-100%);
          }
          55%,
          100% {
            transform: translateX(130%);
          }
        }

        @keyframes solve-progress {
          0%,
          100% {
            transform: scaleX(0.28);
            opacity: 0.82;
          }
          50% {
            transform: scaleX(1);
            opacity: 1;
          }
        }

        @keyframes scan-grid {
          0%,
          100% {
            transform: translateY(-24%);
            opacity: 0;
          }
          18%,
          72% {
            opacity: 1;
          }
          50% {
            transform: translateY(24%);
            opacity: 0.9;
          }
        }

        @keyframes orbit-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes orbit-spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
}
