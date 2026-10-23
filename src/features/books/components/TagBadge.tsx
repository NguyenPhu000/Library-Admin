interface TagBadgeProps {
  tag: string;
}

export function TagBadge({ tag }: TagBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-surface-tint px-2.5 py-0.5 text-xs font-semibold leading-normal text-brand-600">
      {tag}
    </span>
  );
}
