interface BookFormPageProps {
  mode: 'create' | 'edit';
}

export function BookFormPage({ mode }: BookFormPageProps) {
  const title = mode === 'create' ? 'Add book' : 'Edit book';

  return (
    <section aria-labelledby="book-form-heading">
      <h1 id="book-form-heading">{title}</h1>
    </section>
  );
}
