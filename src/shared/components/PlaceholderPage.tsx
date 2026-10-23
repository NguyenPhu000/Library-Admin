export function PlaceholderPage({ title }: { title: string }) {
  return (
    <section aria-labelledby="placeholder-heading">
      <h1 id="placeholder-heading">{title}</h1>
      <p>This section is not available yet.</p>
    </section>
  );
}
