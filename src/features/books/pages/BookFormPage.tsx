interface BookFormPageProps {
  mode: 'create' | 'edit';
}

export function BookFormPage({ mode }: BookFormPageProps) {
  const title = mode === 'create' ? 'Add book' : 'Edit book';

  return (
    <section aria-labelledby="book-form-heading" className="flex flex-col gap-2">
      <h1
        id="book-form-heading"
        className="font-display text-[32px] font-extrabold leading-tight text-ink"
      >
        {title}
      </h1>
    </section>
  );
}
