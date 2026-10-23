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
  return (
    <aside
      id={id}
      className={`fixed inset-y-0 left-0 z-40 flex h-auto w-60 shrink-0 flex-col gap-8 bg-night-900 p-6 text-on-dark transition-transform duration-200 min-[901px]:sticky min-[901px]:top-0 min-[901px]:h-screen min-[901px]:translate-x-0 ${
        isOpen ? 'translate-x-0 visible' : '-translate-x-full invisible min-[901px]:visible'
      }`}
    >
      <div className="flex flex-col gap-1 px-3">
        <span className="font-display text-[30px] font-extrabold leading-none text-on-dark">
          {'{be}'}
        </span>
        <span className="text-xs text-on-dark-muted">Library Admin</span>
      </div>

      <nav aria-label="Main menu">
        <ul className="m-0 flex flex-col gap-1 p-0 list-none">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex min-h-[44px] items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium no-underline transition-colors ${
                    isActive
                      ? 'bg-night-700 font-semibold text-on-dark [&_svg]:stroke-orchid-400'
                      : 'text-on-dark-muted hover:bg-night-700 hover:text-on-dark'
                  }`
                }
              >
                <Icon className="shrink-0" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <p className="mt-auto mb-0 border-t border-night-700 p-3 text-xs text-on-dark-muted">
        v0.1 · Training project
      </p>
    </aside>
  );
}
