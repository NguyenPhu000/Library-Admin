import { NavLink } from 'react-router';

import { BooksIcon, DashboardIcon, LoansIcon, MembersIcon } from './NavIcons';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { to: '/books', label: 'Books', Icon: BooksIcon },
  { to: '/members', label: 'Members', Icon: MembersIcon },
  { to: '/loans', label: 'Loans', Icon: LoansIcon },
] as const;

interface SidebarProps {
  id: string;
  isOpen: boolean;
  onNavigate: () => void;
}

export function Sidebar({ id, isOpen, onNavigate }: SidebarProps) {
  const className = isOpen ? 'sidebar sidebar--open' : 'sidebar';

  return (
    <aside id={id} className={className}>
      <div className="sidebar__brand">
        <span className="sidebar__logo">{'{be}'}</span>
        <span className="sidebar__subtitle">Library Admin</span>
      </div>

      <nav aria-label="Main menu">
        <ul className="sidebar__list">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'
                }
              >
                <Icon className="sidebar__icon" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <p className="sidebar__footer">v0.1 · Training project</p>
    </aside>
  );
}
