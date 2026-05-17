export default function FormSection({ eyebrow, title, description, children }) {
  return (
    <section className="space-y-4 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="space-y-2">
        {eyebrow ? (
          <div className="inline-flex rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-sky-100/75">
            {eyebrow}
          </div>
        ) : null}
        <div>
          <h2 className="text-lg font-semibold text-white sm:text-xl">{title}</h2>
          {description ? <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}
