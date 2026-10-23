import { NavLink, Outlet } from 'react-router';

export function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-layout__sidebar">
        <nav aria-label="Main">
          <ul className="admin-layout__nav-list">
            <li>
              <NavLink to="/books">Books</NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="admin-layout__content">
        <header className="admin-layout__header">
          <h1>Library Admin</h1>
        </header>
        <main className="admin-layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}