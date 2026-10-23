export function PlaceholderPage({ title }: { title: string }) {
  return (
    <section aria-labelledby="placeholder-heading" className="flex flex-col gap-2">
      <h1
        id="placeholder-heading"
        className="font-display text-[32px] font-extrabold leading-tight text-ink"
      >
        {title}
      </h1>
      <p className="text-sm text-ink-muted">This section is not available yet.</p>
    </section>
  );
}
