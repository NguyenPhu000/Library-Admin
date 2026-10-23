import { Breadcrumb } from './Breadcrumb';
import { MenuIcon } from './NavIcons';

interface HeaderProps {
  isMenuOpen: boolean;
  menuControlsId: string;
  onMenuToggle: () => void;
}

export function Header({ isMenuOpen, menuControlsId, onMenuToggle }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__start">
        <button
          type="button"
          className="header__menu-button"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls={menuControlsId}
          onClick={onMenuToggle}
        >
          <MenuIcon />
        </button>
        <Breadcrumb />
      </div>

      <div className="header__user">
        <span className="header__avatar" aria-hidden="true">
          AU
        </span>
        <span className="header__user-name">Admin User</span>
        <button type="button" className="header__sign-out">
          Sign out
        </button>
      </div>
    </header>
  );
}
