import { Breadcrumb } from './Breadcrumb';
import { MenuIcon } from './NavIcons';

interface HeaderProps {
  isMenuOpen: boolean;
  menuControlsId: string;
  onMenuToggle: () => void;
}

export function Header({ isMenuOpen, menuControlsId, onMenuToggle }: HeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface px-8 py-4 max-[900px]:px-4 max-[900px]:py-3">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="hidden min-h-[40px] min-w-[40px] cursor-pointer items-center justify-center rounded-control border border-border bg-surface p-0 max-[900px]:inline-flex"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls={menuControlsId}
          onClick={onMenuToggle}
        >
          <MenuIcon />
        </button>
        <Breadcrumb />
      </div>

      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-tint text-xs font-bold leading-none text-brand-600"
          aria-hidden="true"
        >
          AU
        </span>
        <span className="font-medium text-ink max-[480px]:hidden">Admin User</span>
        <button
          type="button"
          className="inline-flex min-h-[40px] cursor-pointer items-center justify-center rounded-control border border-border bg-surface px-3.5 text-sm font-medium text-ink transition-colors hover:bg-surface-row-alt"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
