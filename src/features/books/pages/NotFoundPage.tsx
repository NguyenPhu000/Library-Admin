import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <section aria-labelledby="not-found-heading" className="flex flex-col gap-2">
      <h1
        id="not-found-heading"
        className="font-display text-[32px] font-extrabold leading-tight text-ink"
      >
        Page not found
      </h1>
      <p className="text-sm text-ink-muted">The page you are looking for does not exist.</p>
      <p>
        <Link
          to="/books"
          className="font-semibold text-brand-600 no-underline hover:text-night-700 hover:underline"
        >
          Back to books
        </Link>
      </p>
    </section>
  );
}
